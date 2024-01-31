import { Request, Response, NextFunction, Router } from 'express'
import BaseController from './BaseController'

export enum Methods {
    POST = 'post',
    GET = 'get',
    PATCH = "patch",
    PUT = "put",
    DELETE = "delete"
}

type ControllerConstructor<T> = new (req: Request, res: Response, next: NextFunction) => T;
type MethodOf<T> = {
    [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never
}[keyof T]
export default class ApplicationRouter {
    private readonly _router: Router

    constructor() {
        this._router = Router()
    }

    callRoute<T extends BaseController>(method: Methods, middleware: Array<any>, path: string, controller: ControllerConstructor<T>, controller_method: MethodOf<T>): Router {
        console.log(path)
        return this._router[method](path, ...middleware, function (...x)  {
            const instance = new controller(...x);
             (instance[controller_method] as (...a: any[]) => any).call(instance)
        })
    }

    getRoute() {
        return this._router
    }
}
