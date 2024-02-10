import { Router } from "express";
import AuthController from "../controller/auth.controller";
import ApplicationRouter, { Methods } from "../../common/DeclareRoute";
import AppMiddleware from "../../middleware/auth.middleware";
import { UserRepository } from "../repository/user.repository";
import userModel from "../database/userModel";
//
const route = new ApplicationRouter()
const middleware = new AppMiddleware(new UserRepository(userModel))

// route.callRoute(Methods.POST, [], "/auth/register", AuthController, "HTTPRegisterUser")
// route.callRoute(Methods.PATCH, [middleware.AuthorizedRoute], "/auth/change_password", AuthController, "HTTPChangePassword")
// export default route.getRoute()
// const router = Router()
//
// export default router

const router = Router()

router.post("/auth/register", (...x) => new AuthController(...x).HTTPRegisterUser())
route.callRoute(Methods.POST, [], "/auth/login", AuthController, "HTTPUserSign")
export default router
