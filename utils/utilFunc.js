const nodemailer = require('nodemailer');
const {randomBytes} = require('crypto');


module.exports = {
    sendEmail: async (receiverAddresses, subject, html) => { 

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
                let info = await transporter.sendMail(mailOptions)
                console.log("Message sent! Message ID: ", info.messageId);
                resolve(info)
            }
            catch (err) {
                console.log(err);
                reject(err)
            }
        });
    }
    ,
    generateRandomBytes:  ( length = 20  )=>{

        return  randomBytes(length/2).toString("hex")
 
    }
    
}