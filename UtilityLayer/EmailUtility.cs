using System.Net.Mail;
using System.Net;
using System.Net.Sockets;


namespace UtilityLayer
{
    public static class EmailUtility
    {
        public static string EmailOtp(string otp)
        {
            return $@"
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {{
                            font-family: Arial, sans-serif;
                            background-color: #f4f6f8;
                            padding: 20px;
                        }}
                        .container {{
                            max-width: 480px;
                            background: #ffffff;
                            margin: auto;
                            padding: 20px;
                            border-radius: 6px;
                            box-shadow: 0 0 10px rgba(0,0,0,0.1);
                        }}
                        .otp {{
                            font-size: 28px;
                            font-weight: bold;
                            color: #2c3e50;
                            letter-spacing: 5px;
                            text-align: center;
                            margin: 20px 0;
                        }}
                        .footer {{
                            font-size: 12px;
                            color: #888;
                            text-align: center;
                            margin-top: 20px;
                        }}
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <h2>Login Verification</h2>
                        <p>Use the OTP below to continue your login:</p>

                        <div class='otp'>{otp}</div>

                        <p>This OTP is valid for <b>5 minutes</b>.</p>
                        <p>If you didn’t request this, please ignore this email.</p>

                        <div class='footer'>
                            © MyApp Security Team
                        </div>
                    </div>
                </body>
                </html>";
        }

        public static async Task<(bool result, string errorMessage)> SendAsync(
            string toEmail, string subject, string htmlBody, string fromEmail,string appPassword, int? smtpPort, string smtpServer)
        {
            try
            {
                var smtp = new SmtpClient
                {
                    Host = smtpServer,
                    Port = smtpPort ?? 465,
                    EnableSsl = true,
                    Credentials = new NetworkCredential(
                           fromEmail,
                           appPassword
                           
                       )
                };

                var mail = new MailMessage
                {
                    From = new MailAddress(fromEmail),
                    Subject = subject,
                    Body = htmlBody,
                    IsBodyHtml = true
                };

                mail.To.Add(toEmail);

                await smtp.SendMailAsync(mail);
                return (true, "Email Sent SuccessFully");
            }
            catch (Exception ex)
            {
                return (false, "OTP saved but email sending failed. Please try again.");

            }
        }
    }
}
