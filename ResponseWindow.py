import random
import sys
import tkinter as tk
from tkinter import ttk

import pymysql as sql


class Response_QFrame:
    def __init__(self, question, correct_ans, incorrect_option, c_points, n_points, root, point_scored):
        self.point_scored = point_scored
        self.root = root
        self.point = 0
        self.question = question
        self.correct_ans = correct_ans
        self.incorrect_answers = incorrect_option
        self.C_p = c_points
        self.W_p = n_points
        self.frame = tk.Frame(self.root)
        self.Qlabel = tk.Label(self.frame, text=self.question, font=('Times New Roman', 18, 'bold'))
        self.Qlabel.pack(padx=10, pady=10)
        self.choices = []
        for i in self.incorrect_answers:
            self.choices.append(i)
        self.choices.append(correct_ans)
        random.shuffle(self.choices)
        self.option = tk.IntVar()
        self.option.set(-1)
        self.index_of_correct_ans = self.choices.index(self.correct_ans)
        self.option0 = tk.Label(self.frame, text=self.choices[0],
                                font=('Times New Roman', 16, 'bold'))
        self.option1 = tk.Label(self.frame, text=self.choices[1],
                                font=('Times New Roman', 16, 'bold'))
        self.option2 = tk.Label(self.frame, text=self.choices[2],
                                font=('Times New Roman', 16, 'bold'))
        self.option3 = tk.Label(self.frame, text=self.choices[3],
                                font=('Times New Roman', 16, 'bold'))
        eval("self.option" + f"{self.index_of_correct_ans}.config(bg=\"green\")")
        self.option0.pack(pady=10)
        self.option1.pack(pady=10)
        self.option2.pack(pady=10)
        self.option3.pack(pady=10)
        self.index_of_correct_ans = self.choices.index(self.correct_ans)
        self.bg = "lightblue"
        if self.point_scored == -0.25:
            self.remark = f"incorrect answer point: {self.point_scored}".upper()
            self.bg = "red"
        elif self.point_scored == 1:
            self.remark = f"correct answer point: {self.point_scored}".upper()
            self.bg = "green"
        else:
            self.remark = f"not attempted point: {self.point_scored}".upper()
        self.remark_label = tk.Label(self.frame, text=self.remark, font=('Times New Roman', 16, 'bold'), bg=self.bg)
        self.remark_label.pack(pady=10)
        self.question_separator = ttk.Separator(self.frame, orient='horizontal')
        self.question_separator.pack(fill='x', expand=True, pady=5)

    def show(self):
        self.frame.pack()


class Response_Window:
    def __init__(self, QData, time_taken, total_score, score_obtained):
        self.Qdata = QData
        self.time_taken = time_taken
        self.root = tk.Tk()
        self.FONT = ('Times New Roman', 16, 'bold')
        self.root.config(bg='pink')
        self.root.geometry('840x640')
        self.root.resizable(0, 0)
        self.root.title("Quiz Application")
        self.container = ttk.Frame(self.root)
        self.canvas = tk.Canvas(self.container)
        self.scrollbar = ttk.Scrollbar(self.container, orient="vertical", command=self.canvas.yview)
        self.scrollable_frame = ttk.Frame(self.canvas)
        self.canvas.create_window((0, 0), window=self.scrollable_frame, anchor='nw')
        self.canvas.config(yscrollcommand=self.scrollbar.set)

        self.extra_frame = tk.Frame(self.scrollable_frame)

        self.name = tk.Label(self.extra_frame, text=f"NAME: SK GUPTA", font=self.FONT)
        self.name.pack()

        self.userId = tk.Label(self.extra_frame, text=f"USER ID: dummy@gmail.com", font=self.FONT)
        self.userId.pack()
        self.time_taken_label = tk.Label(self.extra_frame, text=f"TIME TAKEN: {self.time_taken}", font=self.FONT)
        self.time_taken_label.pack()

        self.score_label = tk.Label(self.extra_frame, text=f"SCORE: {score_obtained} OUT OF {total_score}",
                                    font=self.FONT)
        self.score_label.pack()

        self.extra_frame.pack(pady=5)

        self.seperator = ttk.Separator(self.scrollable_frame, orient='horizontal')
        self.seperator.pack(fill='x', expand=True, pady=5)

        for Q in self.Qdata:
            Ques = Q.question
            corr_ans = Q.correct_ans
            incorrect_option = Q.incorrect_answers
            c_points = Q.C_p
            n_points = Q.W_p
            point_scored = Q.point
            RQF = Response_QFrame(Ques, corr_ans, incorrect_option, c_points, n_points, self.scrollable_frame,
                                  point_scored)
            RQF.show()
        self.scrollable_frame.bind(
            "<Configure>",
            lambda e: self.canvas.configure(
                scrollregion=self.canvas.bbox("all")
            )
        )

        self.container.pack(fill="both", expand=True, ipadx=10)
        self.canvas.pack(side="left", fill="both", expand=True, padx=10)
        self.scrollbar.pack(side="right", fill="y")
        self.exit_btn = tk.Button(self.scrollable_frame,text = "EXIT",font=self.FONT,bg='lightblue',command = sys.exit)
        self.exit_btn.pack(pady = 10)
        self.root.mainloop()


def showResponses(Qdata, time_taken, total_score, score_obtained, name, email):
    try:
        print(time_taken)
        updatedatabase(email, time_taken, total_score, score_obtained)
        res = Response_Window(Qdata, time_taken, total_score, score_obtained)
    except Exception as e:
        print(e)
    exit()


def updatedatabase(email, time_taken, total_score, score_obtained):
    cnn = sql.connect(host='localhost', user='root', password='db_password', database='db_name')
    cursor = cnn.cursor()
    query = f"insert into  quiz_responses(email,time_taken,total_score,scored_obtained) values('{email}','{time_taken}',{total_score},{score_obtained});"
    query2 = "commit;"
    cursor.execute(query)
    cursor.execute(query2)


if __name__ == "__main__":
    pass
