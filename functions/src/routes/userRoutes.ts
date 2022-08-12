import { Router } from "express";

const { get } = require("../controllers/userController");
const firebaseAuthenticated = require("../middlewares/firebaseAuthenticated");

const router = Router();
router.get("/users", firebaseAuthenticated, get);
module.exports = { routes: router };
