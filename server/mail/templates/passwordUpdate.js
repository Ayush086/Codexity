exports.passwordUpdated = (email, name) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Password Update Confirmation </title>
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
            <p>Dear ${name}, </p>
            <p>Your password has been updated successfully for the email <span class="highlight">"${email}"</span> </p>
            <p>If you did not requrest this password change, please contact us immediately to secure your account</p>
            <a href="mailto:ayushuttarwar086@gmail.com" >secure account</a>
        </div>
        <div class="support">If you have any questions or neet assitance, please feel free to reach out to <a href="mailto:ayushuttarwar086@gmail.com">support@codexity.com</a>. We are happy to help you!</div>
    </div>
</body>
</html>`;
};
