export default class HTTPException extends Error {
    code : number
    message: string
    isOperational: boolean
    status: string

    constructor(message: string, code: number) {
        super(message)
        this.message = message
        this.code = code
        this.status = code.toString().startsWith("4") ? "Fail" : "Error"
        this.isOperational = true
        Error.captureStackTrace(this, this.constructor)
    }
}

export const DuplicateError = (message: string) => new HTTPException(message, 400)
