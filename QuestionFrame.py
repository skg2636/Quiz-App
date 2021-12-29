import random
import tkinter as tk

from ResponseWindow import showResponses


count = 0
Questions = []
Current = 0
Number_of_Questions = 0

def divideString(string):
    arr = string.split(" ")
    l = len(arr) // 3
    l = l * 2
    st = " ".join(arr[:l])
    st += "\n" + " ".join((arr[l:]))
    return st




class QFrame:
    def __init__(self, question, correct_ans, incorrect_option, c_points, n_points, root):
        self.point = 0
        self.root = root
        self.question = question
        self.correct_ans = correct_ans
        self.incorrect_answers = incorrect_option
        for i in range(len(self.incorrect_answers)):
            self.incorrect_answers[i]  = self.incorrect_answers[i].replace("&quot;", "\"")
            self.incorrect_answers[i] = self.incorrect_answers[i].replace("&#039;", "\'")
        self.correct_ans = self.correct_ans.replace("&quot;", "\"")
        self.correct_ans = self.correct_ans.replace("&#039;", "\'")
        self.C_p = c_points
        self.W_p = n_points
        self.frame = tk.Frame(self.root, bg="pink")
        self.Qlabel = tk.Label(self.frame, text=self.question, font=('Times New Roman', 18, 'bold'))
        self.Qlabel.pack(padx=10, pady=10)
        self.choices = []
        for i in self.incorrect_answers:
            self.choices.append(i)
        self.choices.append(correct_ans)
        random.shuffle(self.choices)
        self.option = tk.IntVar()
        self.option.set(-1)
        self.option0 = tk.Radiobutton(self.frame, text=self.choices[0], value=0, variable=self.option,
                                      font=('Times New Roman', 16, 'bold'))
        self.option1 = tk.Radiobutton(self.frame, text=self.choices[1], value=1, variable=self.option,
                                      font=('Times New Roman', 16, 'bold'))
        self.option2 = tk.Radiobutton(self.frame, text=self.choices[2], value=2, variable=self.option,
                                      font=('Times New Roman', 16, 'bold'))
        self.option3 = tk.Radiobutton(self.frame, text=self.choices[3], value=3, variable=self.option,
                                      font=('Times New Roman', 16, 'bold'))
        self.option0.pack(pady=10)
        self.option1.pack(pady=10)
        self.option2.pack(pady=10)
        self.option3.pack(pady=10)

    def hide(self):
        self.frame.place_forget()

    def show(self):
        self.frame.place(relx=0.5, rely=0.5, anchor='center')

    def record_ans(self):
        index_of_correct_ans = self.choices.index(self.correct_ans)
        if self.option.get() != -1:
            if self.option.get() == index_of_correct_ans:
                self.point = 1
            else:
                self.point = -0.25
        else:
            self.point = 0


def run(Qdata, name, email):
    QuestionData = Qdata
    root = tk.Tk()
    FONT = ('Times New Roman', 16, 'bold')
    root.resizable(0, 0)
    root.config(bg='lightblue', width=root.winfo_screenwidth() - 50, height=root.winfo_screenheight() - 80)
    root.title("Quiz Application")

    def Finish_Quiz(QuestionsData):

        p = 0
        for _ in Questions:
            p += _.point
        print(p)
        time_taken = timer_text.cget("text")
        root.withdraw()
        showResponses(QuestionsData, time_taken=time_taken, total_score=Number_of_Questions, score_obtained=p,
                      name=name, email=email)

    def next_Question():
        global Questions
        global Current
        global Number_of_Questions
        Questions[Current].record_ans()
        Questions[Current].hide()
        Current += 1
        Current = Current % Number_of_Questions
        Questions[Current].show()

    def prev_Question():
        global Questions
        global Current
        global Number_of_Questions
        if Current == 0:
            return
        Questions[Current].record_ans()
        Questions[Current].hide()
        Current -= 1
        Current = Current % Number_of_Questions
        Questions[Current].show()

    global Questions
    global Current
    global Score_array
    for Q in QuestionData:
        Ques = str(Q['question'])
        Ques = Ques.replace("&quot;", "\"")
        Ques = Ques.replace("&#039;", "\'")
        Ques = Ques.replace("&ldquo;", "\"")
        Ques = Ques.replace("&ldquo;", "\"")
        Ques = divideString(Ques) if len(Ques) > 70 else Ques
        qf = QFrame(Ques, Q['correct_answer'], Q['incorrect_answers'], 1, -0.25, root)
        Questions.append(qf)
        qf.hide()

    global Number_of_Questions
    Number_of_Questions = len(Questions)

    extra_frame = tk.Frame(root).place(relx=0.1, rely=0.2, x=2, y=3, anchor='n')

    name = tk.Label(extra_frame, text=f"Name: {name}", font=FONT)
    name.place(relx=0.1, rely=0.1)

    userId = tk.Label(extra_frame, text=f"USER ID: {email}", font=FONT)
    userId.place(relx=0.1, rely=0.2)
    timer_text = tk.Label(extra_frame, text="00:00:00".center(10), font=FONT)
    timer_text.place(relx=0.8, rely=0.1)

    submit = tk.Button(extra_frame, text="Submit and Finish", fg='red', font=FONT,
                       command=lambda: Finish_Quiz(Questions))
    submit.place(relx=0.8, rely=0.2)

    next = tk.Button(root, text="Save and Next", font=FONT, command=lambda: next_Question())
    next.place(relx=0.8, rely=0.85, anchor='se')

    prev = tk.Button(root, text="Previous Question", font=FONT, command=lambda: prev_Question())
    prev.place(relx=0.2, rely=0.85, anchor='sw')

    Questions[Current].show()

    def timer():
        global count
        count += 1
        c = count
        hour = c // 3600
        mins = (c // 60) % 60
        sec = c % 60
        timer_text['text'] = f"{str(hour).rjust(2, '0')}:{str(mins).rjust(2, '0')}:{str(sec).rjust(2, '0')}"
        timer_text.after(1000, timer)

    timer()

    root.mainloop()


if __name__ == '__main__':
    pass
    