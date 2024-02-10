export type TEmailPayload = {
    email: string,
    subject: string,
    message: string,
    html?: string,
    name: string
}

export interface IEmailService {
    sendEmail(payload: TEmailPayload): Promise<void>
}

abstract class BaseEmailService implements IEmailService{
    async sendEmail(payload: TEmailPayload) : Promise<void> {}
}

export default BaseEmailService
