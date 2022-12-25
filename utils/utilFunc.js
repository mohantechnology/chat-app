const nodemailer = require('nodemailer');
const {randomBytes} = require('crypto');

module.exports = {
  sendEmail: async (receiverAddresses, subject, html) => { 

    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {

      try {

        // Create the SMTP transport.
        let transporter = nodemailer.createTransport({
          service: process.env.SERVICE || 'gmail',
          host: process.env.HOST || 'smtp.gmail.com',
          port: process.env.EMAIL_PORT || 465,
          secure: true,
          auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS
          }
        });

        // Specify the fields in the email.
        let mailOptions = {
          from: process.env.EMAIL,
          to: receiverAddresses,
          subject: subject,
          html: html,

        };

        // Send the email.
        let info = await transporter.sendMail(mailOptions);
        
        resolve(info);
      }
      catch (err) {
        console.error(err);
        reject(err);
      }
    });
  }
  ,
  generateRandomBytes:  ( length = 20  )=>{

    return  randomBytes(length/2).toString("hex");
 
  },
  sleep  : (milliseconds) =>  {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }
    
};