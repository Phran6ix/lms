import {Request, Response} from 'express'
import config from './config'
import Constant from './constant'
import HTTPException from './exception'

export default function (error:  HTTPException,req:Request,  res: Response) {
    console.log(error)
    if(error.code == 11000) {return res.status(403).json({
        status: "Error",
        message: "User with email already exist"
    })}
    return res.status(error.code || 500).json({
        status: error.code.toString().startsWith("4") ? "Error" : "Fail",
        message: error.message || "An Error Occured",
        stack: config.NODE_ENV == Constant.NODE_ENV.DEVELOPMENT ? error.stack : null
    
    })
}

