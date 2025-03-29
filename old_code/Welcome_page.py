import tkinter as tk

root = tk.Tk()

FONT = ('Times New Roman', 16, 'bold')
root.config(bg='lightblue', )
root.geometry('720x480')
root.resizable(0, 0)
root.title("Quiz Application")


def login_F():
    root.withdraw()
    from Login import run as r
    r()


def register_F():
    root.withdraw()
    from Register import run as r
    r()


def run():
    w_label = tk.Label(root, text="WELCOME TO QUIZATHON", font=('Helvetica', 20, 'bold'), fg='coral')
    w_label.place(relx=0.5, rely=0.4, anchor='center')

    login = tk.Button(root, text="Login", font=FONT, height=1, width=8, command=login_F)
    login.place(relx=0.39, rely=0.6, anchor='se')

    register = tk.Button(root, text="Register", font=FONT, height=1, width=8, command=register_F)
    register.place(relx=0.61, rely=0.6, anchor='sw')
    root.mainloop()


if __name__ == '__main__':
    run()
