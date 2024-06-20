const otpTemplate = (otp) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        body {
            background-color: #ffffff;
            font-family: Arial, sans-serif;
            font-size: 16px;
            line-height: 1.4;
            color: #333333;
            margin: 0;
            padding: 0;
        }

        .container{
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
        }

        .logo {
            max-width: 200px;
            margin-bottom: 20px;
        }

        .message {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 20px;
        }

        .body {
            font-size: 16px;
            margin-bottom: 20px;
        }

        .cta {
            display: inline-block;
            padding: 10px 20px;
            background-color: #ffd60a;
            color: #000000;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
            font-weight: bold;
            margin-top: 20px;
        }

        .support {
            font-size: 14px;
            color: #999999;
            margin-top: 20px;
        }

        .highlight {
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <a href="https://codexity.vercel.app">
            <img class="logo" src="assets/logo" alt="codexity logo">
        </a>
        <div class="message">Password Update Confirmation</div>
        <div class="body">
            <p>Dear User, </p>
            <p>Thank you for registrating with Codexity. To complete your registration, please use the following OTP to verify you account: </p>
            <h2 class="hhighlight> ${otp} </h2>
            <p>This OTP is valid for 5 minutes. If you did not request this verification, please disregard this mail.
            Once your account is verified, you will have access to our platform and it's features</p>
            <a href="mailto:ayushuttarwar086@gmail.com" >secure account</a>
        </div>
        <div class="support">If you have any questions or neet assitance, please feel free to reach out to <a href="mailto:ayushuttarwar086@gmail.com">support@codexity.com</a>. We are happy to help you!</div>
    </div>
</body>
</html>`;
};

module.exports = otpTemplate;
