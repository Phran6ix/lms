import { Router } from "express";
import AuthController from "../controller/auth.controller";
import ApplicationRouter, { Methods } from "../../common/DeclareRoute";

const route = new ApplicationRouter()

route.callRoute(Methods.GET, [], "/auth/register", AuthController, "HTTPRegisterUser")
// const router = Router()
//
// export default router
