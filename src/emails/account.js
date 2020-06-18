const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const sendWelcomeEmail = (email, name) => {
     
sgMail.send({
    to: email,
    from: 'charlesorafu40@gmail.com',
    subject: 'This is my first creation!',
    text: `Welcome to Node JS, ${name}. Let me know how you get along with node.`
}) 
 }

 module.exports = { 
     sendWelcomeEmail
 }