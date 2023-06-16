import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.NEXT_PUBLIC_NODEMAILER_EMAIL,
        pass: process.env.NEXT_PUBLIC_NODEMAILER_APP_PASSWORD,
    },
});

const sendMail = async (receiver: string, subject: string, message: string, cb: (e?: any) => void) => {
    const options = {
        from: process.env.NEXT_PUBLIC_NODEMAILER_EMAIL,
        to: receiver,
        subject: subject,
        text: message,
    };
    transporter.sendMail(options, (error, info) => {
        if (error) {
            cb(error);
        } else {
            return cb();
        }
    });
};

export default sendMail;
