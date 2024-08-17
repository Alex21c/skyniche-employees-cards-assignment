import e from "express";
import UserController from "../Controllers/UserController.mjs";

const UserRoute = e.Router();
UserRoute.post("/registerNewUser", UserController.registerNewUser);
UserRoute.post("/login", UserController.loginUser);
export default UserRoute;
