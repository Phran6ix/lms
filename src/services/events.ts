import { EventEmitter } from "stream";
import { TEmailPayload } from "../common/BaseEmailInterfae";
import SMTPExpress from "./smtpexpress";

const events = new EventEmitter()

events.on("sendEmail", (payload: TEmailPayload) => {
   console.log("Events is here")
   const express = new SMTPExpress()

   express.sendEmail(payload)
   return
})

export default events
