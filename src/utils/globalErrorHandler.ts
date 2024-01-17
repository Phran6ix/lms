import {Request, Response} from 'express'
import config from './config'
import Constant from './constant'
import HTTPException from './exception'

export default function (error:  HTTPException,req:Request,  res: Response) {
    console.log(error)
    return res.status(error.statusCode || 500).json({
        status: error.statusCode.toString().startsWith("4") ? "Error" : "Fail",
        message: error.message || "An Error Occured",
        stack: config.NODE_ENV == Constant.NODE_ENV.DEVELOPMENT ? error.stack : null
    
    })
}

