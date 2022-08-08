import { Router } from "express";
const { generateNewWordForDay } = require("../controllers/wordController");

const router = Router();
router.post("/generateNewWordForDay", generateNewWordForDay);
module.exports = { routes: router };
