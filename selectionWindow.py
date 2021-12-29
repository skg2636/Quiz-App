import sys
import tkinter as tk
from tkinter import messagebox as mb

import requests

from QuestionFrame import run as rn


class Selection_Window:
    def __init__(self, name, email):
        self.name = name
        self.email = email
        self.root = tk.Tk()
        self.FONT = ('Times New Roman', 16, 'bold')
        self.root.config(bg='lightblue', )
        self.root.geometry('720x480')
        self.root.resizable(0, 0)
        self.root.title("Quiz Application")

        self.f1 = tk.Frame(self.root, bg='lightblue')
        self.f1.place(relx=0.2, rely=0.3)

        self.question_count_label = tk.Label(self.f1, text="Number of Questions:".ljust(20), font=self.FONT)
        self.question_count_label.grid(row=0, column=0)

        self.count_option = ['5',
                             '10',
                             '15',
                             '20',
                             '25']

        self.question_count_string = tk.StringVar()
        self.question_count_string.set('5')

        self.question_count_option = tk.OptionMenu(self.f1, self.question_count_string, *self.count_option)
        self.question_count_option.grid(row=0, column=1, padx=100)

        self.f2 = tk.Frame(self.root, bg='lightblue')
        self.f2.place(relx=0.2, rely=0.4)

        self.category_label = tk.Label(self.f2, text='Select the Category:'.ljust(20), font=self.FONT)
        self.category_label.grid(row=0, column=0)

        self.category_option = ['Any Category',
                                'General Knowledge',
                                'Entertainment: Books',
                                'Entertainment: Film',
                                'Entertainment: Music',
                                'Entertainment: Musicals & Theatres',
                                'Entertainment: Television',
                                'Entertainment: Video Games',
                                'Entertainment: Board Games',
                                'Science & Nature',
                                'Science: Computers',
                                'Science: Mathematics',
                                'Mythology',
                                'Sports',
                                'Geography',
                                'History',
                                'Politics',
                                'Art',
                                'Celebrities',
                                'Animals',
                                'Vehicles',
                                'Entertainment: Comics',
                                'Science: Gadgets',
                                'Entertainment: Cartoon & Animations']

        self.category_option_string = tk.StringVar()
        self.category_option_string.set(self.category_option[0])

        self.category_option_menu = tk.OptionMenu(self.f2, self.category_option_string, *self.category_option)
        self.category_option_menu.grid(row=0, column=1, padx=100)

        self.f3 = tk.Frame(self.root, bg='lightblue')
        self.f3.place(relx=0.2, rely=0.5)

        self.difficulty_label = tk.Label(self.f3, text='Select the Difficulty:'.ljust(20), font=self.FONT)
        self.difficulty_label.grid(row=0, column=0)

        self.difficulty_option = ['Any Difficulty',
                                  'Easy',
                                  'Medium',
                                  'Hard']

        self.difficulty_option_string = tk.StringVar()
        self.difficulty_option_string.set(self.difficulty_option[0])

        self.difficulty_menu = tk.OptionMenu(self.f3, self.difficulty_option_string, *self.difficulty_option)
        self.difficulty_menu.grid(row=0, column=1, padx=100)

        self.f4 = tk.Frame(self.root, bg='lightblue')
        self.f4.place(relx=0.3, rely=0.65)

        self.checkbox_check = tk.IntVar()
        self.checkbox_check.set(0)

        self.checkbox = tk.Checkbutton(self.f4, text="I agree the terms and conditions for the Quiz", font=('bold'),
                                       fg='black',
                                       variable=self.checkbox_check)
        self.checkbox.grid(row=0, column=0)
        self.button = tk.Button(self.f4, text="Start Quiz", font=self.FONT, fg='red', bg='lightblue',
                                command=self.start_quiz)
        self.button.grid(row=1, column=0, pady=10)
        self.back_btn = tk.Button(self.f4, text="Back", font=self.FONT, command=self.previous_menu)
        self.back_btn.grid(row=2, column=0, pady=10)

        self.root.mainloop()

    def previous_menu(self):
        self.root.withdraw()
        from Login import run as r
        r()

    def start_quiz(self):
        if self.checkbox_check.get() == 0:
            mb.showwarning("Error", "Please Agree with terms and Conditions!")
            return
        API = "https://opentdb.com/api.php?amount="
        AMOUNT = self.question_count_string.get()
        API += AMOUNT
        DIFFICULTY = self.difficulty_option_string.get()
        CATEGORY = self.category_option_string.get()
        if CATEGORY == "Any Category" and DIFFICULTY == "Any Difficulty":
            CATEGORY = ""
            DIFFICULTY = ""
        elif CATEGORY != "Any Category" and DIFFICULTY == "Any Difficulty":
            DIFFICULTY = ""
            cat = self.category_option.index(CATEGORY) + 8
            API = f"https://opentdb.com/api.php?amount={AMOUNT}&category={cat}"
        elif CATEGORY == "Any Category" and DIFFICULTY != "Any Difficulty":
            CATEGORY = ""
            API = f"https://opentdb.com/api.php?amount={AMOUNT}&difficulty={DIFFICULTY.lower()}"
        else:
            cat = self.category_option.index(CATEGORY) + 8
            API = f"https://opentdb.com/api.php?amount={AMOUNT}&category={cat}&difficulty={DIFFICULTY.lower()}"
        try:
            res = requests.get(API + "&type=multiple")
        except Exception as cn:
            mb.showerror("Error", "Connection Failed. Please try again.")
        data = res.json()
        if data['response_code'] == 0:
            self.root.destroy()
            rn(data['results'], self.name, self.email)
        else:
            mb.showerror("Error", "Oop! \n Error Encountered Try Again")


if __name__ == '__main__':
    argv = sys.argv
    l = len(argv)
    email = argv[l - 1]
    name = argv[1:l - 1]
    name = " ".join(name)
    main = Selection_Window(name, email)
