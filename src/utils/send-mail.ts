import nodemailer from 'nodemailer'

interface IMailOption {
    to:string;
    subject:string;
    text?:string;
    html?:string
}

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_HOST as string),
    secure:parseInt(process.env.SMTP_HOST as string) === 465 ? true : false, 
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });


  export const sendMail = async(options:IMailOption) =>{
    await transporter.sendMail({
        from: `"Expense Tracker" <${process.env.SMTP_USER}>`, 
        to: options.to, 
        subject: options.subject, 
        text: options.text, 
        html:options.html, 
        attachments:[{
            path:'',
            filename:''
        }]
    });
    
  }