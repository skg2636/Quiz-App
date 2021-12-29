import os
import tkinter as tk
from tkinter import ttk, messagebox

import pymysql as sql

global root, email_entry, password_entry, progress_bar


def previous_menu():
    global root, nameF_entry, nameL_entry, email_entry, password_entry, progressbar
    root.destroy()
    from Welcome_page import run as r
    r()


def run():
    global root, email_entry, password_entry, progress_bar
    root = tk.Tk()

    FONT = ('Times New Roman', 16, 'bold')
    root.config(bg='lightblue', )
    root.geometry('720x480')
    root.resizable(0, 0)
    root.title("Quiz Application")
    progress_bar = ttk.Progressbar(root, orient='horizontal', mode='indeterminate', length=200)

    w_label = tk.Label(root, text="LOGIN", font=('Helvetica', 20, 'bold'), fg='coral')
    w_label.place(relx=0.5, rely=0.3, anchor='center')

    emailID = tk.Label(root, text="Email ID:".ljust(22), font=FONT)
    emailID.place(relx=0.2, rely=0.4)

    password1 = tk.Label(root, text="Password:".ljust(21), font=FONT)
    password1.place(relx=0.2, rely=0.5)

    email_entry = tk.Entry(root, font=FONT)
    email_entry.place(relx=0.5, rely=0.4)

    password_entry = tk.Entry(root, font=FONT, show="*")
    password_entry.place(relx=0.5, rely=0.5)

    submit = tk.Button(root, font=('Helvetica', 16, 'bold'), fg='coral',
                       command=lambda: start_login(email_entry.get(), password_entry.get()), text="Login")
    submit.place(rely=0.7, relx=0.5, anchor='center')

    ret_button = tk.Button(root, font=('Helvetica', 16, 'bold'), fg='coral', command=previous_menu, text="Back")
    ret_button.place(rely=0.8, relx=0.5, anchor='center')

    root.mainloop()


def start_login(email, password):
    global progress_bar, root
    progress_bar.start()
    cnn = sql.connect(host='localhost', user='root', password='db_password', database='db_name')
    cursor = cnn.cursor()
    cmd = f"select * from quiz_user where email = '{email}';"
    cursor.execute(cmd)
    data = cursor.fetchone()
    if data:
        if data[3] == password:
            root.withdraw()
            # wn = Selection_Window(data[1]+" "+data[2],email)
            name = data[1] + " " + data[2]
            print("Name-->", name)
            print("Email ----> ", email)
            os.system(f"python selectionWindow.py {name} {email}")
        else:
            messagebox.showerror("Error", "Wrong Password ! Try Again")
    else:
        messagebox.showerror("Error", "User Does Exist Please Register to continue")


if __name__ == '__main__':
    run()
