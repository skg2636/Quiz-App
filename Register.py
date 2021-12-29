import tkinter as tk
from tkinter import messagebox
from tkinter import ttk

import pymysql as sql

import Validate_User as VU


root = tk.Tk()
global nameF_entry, nameL_entry, email_entry, password_entry, progressbar

def validate_password(p):
    uc, lc, d, s = 0, 0, 0, 0
    if len(p) >= 6:
        for ch in p:
            if ch.islower():
                lc += 1
            if ch.isupper():
                uc += 1
            if ch.isdigit():
                d += 1
            if ch in ['!', '@', '#', '$', '^', '&', '*', '(', ')', '_', '-']:
                s += 1

        if uc >= 1 and lc >= 1 and d >= 1 and s >= 1:
            print(uc, lc, d, s)
            return True
        else:
            print("In valid")
            return False
    else:
        print("Too short")
        return False

def run():
    global root, nameF_entry, nameL_entry, email_entry, password_entry, progressbar
    FONT = ('Times New Roman', 16, 'bold')
    root.config(bg='lightblue', )
    root.geometry('720x480')
    root.resizable(0, 0)
    root.title("Quiz Application")
    progressbar = ttk.Progressbar(root, orient='horizontal', mode='indeterminate', length=200)

    w_label = tk.Label(root, text="REGISTER", font=('Helvetica', 20, 'bold'), fg='coral')
    w_label.place(relx=0.5, rely=0.2, anchor='center')

    nameF = tk.Label(root, text="First Name:".ljust(20), font=FONT)
    nameF.place(relx=0.2, rely=0.3)

    nameL = tk.Label(root, text="Last Name:".ljust(19), font=FONT)
    nameL.place(relx=0.2, rely=0.4)

    emailID = tk.Label(root, text="Email ID:".ljust(22), font=FONT)
    emailID.place(relx=0.2, rely=0.5)

    password1 = tk.Label(root, text="Password:".ljust(21), font=FONT)
    password1.place(relx=0.2, rely=0.6)

    nameF_entry = tk.Entry(root, font=FONT)
    nameF_entry.place(relx=0.5, rely=0.3)

    nameL_entry = tk.Entry(root, font=FONT)
    nameL_entry.place(relx=0.5, rely=0.4)

    email_entry = tk.Entry(root, font=FONT)
    email_entry.place(relx=0.5, rely=0.5)

    password_entry = tk.Entry(root, font=FONT, show="*")
    password_entry.place(relx=0.5, rely=0.6)

    submit = tk.Button(root, font=('Helvetica', 16, 'bold'), fg='coral', command=start_reg, text="Submit")
    submit.place(rely=0.8, relx=0.5, anchor='center')

    ret_button = tk.Button(root, font=('Helvetica', 16, 'bold'), fg='coral', command=previous_menu, text="Back")
    ret_button.place(rely=0.9, relx=0.5, anchor='center')
    root.mainloop()


def previous_menu():
    global root, nameF_entry, nameL_entry, email_entry, password_entry, progressbar
    root.withdraw()
    from Welcome_page import run as r
    r()


def check_user_in_DB(email):
    global root, nameF_entry, nameL_entry, email_entry, password_entry, progressbar
    cnn = sql.connect(host='localhost', user='root', password='db_password', database='db_name')
    cursor = cnn.cursor()
    cmd = f"select * from quiz_user where email = '{email}';"
    cursor.execute(cmd)
    data = cursor.fetchone()
    if data:
        return False
    else:
        return True


def check_OTP(a, b, popup, userData):
    global root, nameF_entry, nameL_entry, email_entry, password_entry, progressbar
    if str(a) == str(b):
        popup.destroy()
        cnn = sql.connect(host='localhost', user='root', password='db_password', database='db_name')
        cursor = cnn.cursor()
        cmd = f"insert into quiz_user(email,f_name,l_name,password,reg_time) values('{userData['email']}','{userData['fname']}','{userData['lname']}','{userData['password']}',current_timestamp);"
        cursor.execute(cmd)
        cmd = "commit; "
        cursor.execute(cmd)
        progressbar.place_forget()
        messagebox.showinfo("Registration Done", "Kindly Login to continue")
    else:
        popup.destroy()
        messagebox.showerror("Failed", "OTP Verification Failed")


def start_reg():
    global root, nameF_entry, nameL_entry, email_entry, password_entry, progressbar
    if nameF_entry.get() == "":
        messagebox.showerror("Field Empty", "Name Field Cannot be Empty")
    elif email_entry.get() == "":
        messagebox.showerror("Field Empty", "Email Cannot be Empty")
    elif not validate_password(password_entry.get()):
        print(password_entry.get())
        messagebox.showerror("Error!", "Invalid Password")
    else:
        progressbar.place(rely=0.95, relx=0.5, anchor='center')
        progressbar.start()
        if check_user_in_DB(email=email_entry.get()):
            OTP = VU.generateOTP(6)
            result = VU.sendOTP(email_entry.get(), OTP, nameF_entry.get() + " " + nameL_entry.get())
            if result[0]:
                popup = tk.Toplevel(root)
                popup.title("OTP Verification")
                popup.geometry('200x100')
                popup.resizable(0, 0)
                l1 = tk.Label(popup, text="Enter the OTP:")
                l1.pack()
                otp_entry = tk.Entry(popup, width=25, font=('Times New Roman', 14, 'bold'))
                otp_entry.pack(padx=5, pady=5)
                userData = {
                    'fname': nameF_entry.get(),
                    'lname': nameL_entry.get(),
                    'email': email_entry.get(),
                    'password': password_entry.get()
                }
                validate_btn = tk.Button(popup, width=25, text="Validate", fg='black',
                                         command=lambda: check_OTP(otp_entry.get(), OTP, popup=popup,
                                                                   userData=userData))
                validate_btn.pack(padx=5, pady=5)
            else:
                messagebox.showerror('Error', result[1])
                progressbar.place_forget()
        else:
            messagebox.showerror('Error', 'Email Already Registered,Login to Proceed')
            progressbar.place_forget()


if __name__ == '__main__':
    run()
