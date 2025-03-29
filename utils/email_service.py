import dns.resolver
import random
import math
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

def check_mx_record(email):
    domain = email.split('@')[-1]
    try:
        mx_records = dns.resolver.resolve(domain, 'MX')
        return len(mx_records) > 0
    except dns.resolver.NXDOMAIN:
        return False
    except dns.resolver.NoAnswer:
        return False
    except dns.exception.Timeout:
        return False
    
def generate_otp():
    digits = "0123456789"
    OTP = ""
    for i in range(6):
        OTP += digits[math.floor(random.random() * 10)]
    return OTP

def sendOTP(to_email, otp, name):
    try:
        msg = MIMEMultipart()
        password = os.environ.get("EMAIL_PASSWORD") 
        from_email = os.environ.get("EMAIL_ID")

        if not password or not from_email:
            return False, "Email credentials not set"

        msg['To'] = to_email
        msg['From'] = from_email
        msg['Subject'] = 'AI-QUIZ - Password Reset Request'

        plain = f"Dear {name},\n\nWe received a request to reset your AI-QUIZ password.\n\nYour One Time Password (OTP) for password reset is: {otp}\n\nPlease enter this code to reset your password. For security reasons, do not share this OTP with anyone.\n\nIf you did not request this password reset, please ignore this email and ensure your account is secure.\n\nBest Regards,\nTeam AI-QUIZ"
        html = """\
                <html>
                <head>
                    <style>
                        body {font-family: Arial, sans-serif;}
                        .container {padding: 20px;}
                        .header {color: #2C3E50; font-size: 24px;}
                        .content {color: #34495E; font-size: 16px; line-height: 1.6;}
                        .otp {font-size: 24px; color: #E74C3C; font-weight: bold;}
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1 class="header">AI-QUIZ Password Reset</h1>
                        <div class="content">
                            <p>We received a request to reset your AI-QUIZ password.</p>
                            <p>To ensure the security of your account, please verify using the OTP below.</p>
                            <p>Please use the following OTP to reset your password:</p>
                            <p class="otp">{otp}</p>
                            <p><em>Note: This OTP is confidential. Please do not share it with anyone. If you did not request this reset, please secure your account.</em></p>
                        </div>
                    </div>
                </body>
                </html>
                """

        p1 = MIMEText(plain, 'plain')
        p2 = MIMEText(html, 'html')
        msg.attach(p2)
        msg.attach(p1)
        host = 'smtp.gmail.com'
        port = 465

        try:
            with smtplib.SMTP_SSL(host, port, context=ssl.create_default_context()) as server:
                server.login(msg['From'], password)
                server.sendmail(msg['From'], msg['To'], msg.as_string())
                return True, "OTP Sent Successfully"
        except smtplib.SMTPException as smtp_err:
            return False, f"SMTP Error: {smtp_err}"
        except Exception as err:
            return False, f"Error sending email: {err}"
            
    except Exception as e:
        return False, f"Error preparing email: {e}"