import nodemailer, { Transporter } from 'nodemailer'
import BaseEmailService, { TEmailPayload } from '../common/BaseEmailInterfae';
import Constant from '../utils/constant';

class NodemailerEmailService extends BaseEmailService {
   private transporter: Transporter

   constructor() {
      super()
      this.transporter = nodemailer.createTransport({
         host: "sandbox.smtp.mailtrap.io",
         port: 2525,
         auth: {
            user: Constant.SMTP_USER,
            pass: Constant.SMTP_PASS
         }
      });
   }

   async sendEmail(payload: TEmailPayload): Promise<void> {
 const options = {
         from: "my_lms@email.com",
         to: payload.email,
         subject: payload.subject,
         message: payload.message,
         html: payload.html
      }     
      await this.transporter.sendMail(options)
   }
}

export default NodemailerEmailService
