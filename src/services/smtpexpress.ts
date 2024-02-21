import { createClient } from 'smtpexpress'
import BaseEmailService, { IEmailService, TEmailPayload } from "../common/BaseEmailInterfae";
import config from '../utils/config';
import Constant from '../utils/constant';
import { SendMailOptions } from 'smtpexpress/dist/src/helpers/types';

class SMTPExpress extends BaseEmailService implements IEmailService {

   private readonly mailclient = createClient({ projectId: config.SMTP_EXPRESS_KEY, projectSecret: config.SMTP_EXPRESS_SECRET })
   constructor() {
      super()

   }
   public async sendEmail(payload: TEmailPayload): Promise<void> {
      console.log("payload", payload)
      console.log("sender deets", Constant.SENDER_NAME, Constant.SENDER_EMAIL)
      try {
         const mailOptions: SendMailOptions = {
            subject: payload.subject,
            message: payload.message,
            sender: {
               name: Constant.SENDER_NAME,
               email: Constant.SENDER_EMAIL
            },
            recipients: {
               name: payload.name,
               email: payload.email
            }
         }

         this.mailclient.sendApi.sendMail(mailOptions)
         return
      } catch (error) {
         throw error
      }
   }

}

export default SMTPExpress
