import math
import random


def generateOTP(n):
    digits = "0123456789"
    OTP = ""
    for i in range(n):
        OTP += digits[math.floor(random.random() * 10)]
    return OTP


import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def sendOTP(to_email, otp, name):
    msg = MIMEMultipart()
    msg['To'] = to_email
    msg['From'] = 'email_id'
    msg['Subject'] = 'OTP Verification'

    plain = f"Dear {name},\nOne Time Password for your Quizathon verification is {otp}. Please don't share this OTP with anyone.\n\nThank You\nTeam Quizathon"
    html = """\
            <html>
            <head></head>
            <body>
            <h1> QUIZATHON <h1>
             <p>Quizathon Welcomes You to Our Quizzing Platform 
             <br>
            </p>
            </body>
            </html>
            """

    p1 = MIMEText(plain, 'plain')
    p2 = MIMEText(html, 'html')
    msg.attach(p2)
    msg.attach(p1)
    host = 'smtp.gmail.com'
    port = 465

    password = "email_password"
    try:
        with smtplib.SMTP_SSL(host, port, context=ssl.create_default_context()) as server:
            server.login(msg['From'], password)
            server.sendmail(msg['From'], msg['To'], msg.as_string())
            return True, "OTP Sent Successfully"
    except Exception as err:
        return False, err
