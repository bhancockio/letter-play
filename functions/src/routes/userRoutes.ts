import { Router } from "express";
const { getUser } = require("../controllers/userController");
const firebaseAuthMiddleware = require("../middlewares/auth");

const router = Router();
router.get("/users", firebaseAuthMiddleware, getUser);
module.exports = { routes: router };
