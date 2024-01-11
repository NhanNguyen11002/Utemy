import { transporter } from "../configs/nodemailer.config";
import { MailOption } from "../types/sendmail";
export const sendMail = (mailOptions: MailOption) => {
    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            console.log(error);
            return false;
        }
        return true;
    });
    return true;
};
