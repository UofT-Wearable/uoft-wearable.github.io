require('dotenv').config();

const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Email = require('./models/email'); // Adjust the path if necessary

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to the database');
}).catch((err) => {
    console.error('Database connection error:', err);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/send-email', async (req, res) => {
    const { name, email, message } = req.body;

    try {
        // Save email to the database
        const newEmail = new Email({ email });
        await newEmail.save();

        // Create a transporter object using SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Set up email data
        let mailOptions = {
            from: email,
            to: process.env.RECEIVER_EMAIL,
            subject: `Contact form submission from ${name}`,
            text: `You have a new contact form submission from:
            Name: ${name}
            Email: ${email}
            Message: ${message}`,
        };

        // Send mail
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).send('Internal Server Error');
            }
            console.log('Message sent: %s', info.messageId);
            res.send('Email has been sent successfully.');
        });
    } catch (err) {
        console.error('Error saving email to database:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Route to retrieve all stored email addresses
app.get('/emails', async (req, res) => {
    try {
        const emails = await Email.find({});
        res.json(emails);
    } catch (err) {
        console.error('Error retrieving emails from database:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
