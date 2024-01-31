export type TEmailPayload = {
    email: string,
    subject: string,
    message: string,
    html?: string,
    name: string
}

export interface IEmailService {
    sendEmail(payload: TEmailPayload): void
}

abstract class BaseEmailService implements IEmailService{
    sendEmail(payload: TEmailPayload) : void {}
}

export default BaseEmailService
