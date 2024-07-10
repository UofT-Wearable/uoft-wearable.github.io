const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;

    // Create a transporter object using SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'Gmail', // you can use any email service
        auth: {
            user: 'uoftwearable@gmail.com', 
            pass: 'uoftwearable2024', 
        },
    });

    // Set up email data
    let mailOptions = {
        from: email,
        to: 'uoftwearable@gmail.com', // your email address
        subject: `Contact form submission from ${name}`,
        text: `You have a new contact form submission from:
        Name: ${name}
        Email: ${email}
        Message: ${message}`,
    };

    // Send mail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        res.send('Email has been sent successfully.');
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
