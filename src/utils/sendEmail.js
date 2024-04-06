import nodemailer from 'nodemailer'

export const sendEmail=async({to,subject,html,attachments=[]})=>{
    const transporter=nodemailer.createTransport({
        host:"localHost",
        port:465,
        service:process.env.SERVICE,
        secure:true,
        auth:{
            user:process.env.EMAIL,
            pass:process.env.PASS,
        }
    })
    let info
    if(html){
         info=await transporter.sendMail({
            from:`"Ecommerce Application" <${process.env.EMAIL}>`,
            to,
            subject,
            html,
            attachments
        })
    }else{
         info=await transporter.sendMail({
            from:`"Ecommerce Application" <${process.env.EMAIL}>`,
            to,
            subject,
            attachments
        })
    }
    

    if (info.accepted.length > 0)return true
    return false
}