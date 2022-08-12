import { Router } from "express";

const { post } = require("../controllers/statsController");
const extractFirebaseUserInformation = require("../middlewares/extractFirebaseUserInformation");

const router = Router();
router.post("/stats", extractFirebaseUserInformation, post);
module.exports = { routes: router };
