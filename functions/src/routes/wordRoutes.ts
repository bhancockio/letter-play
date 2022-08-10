import { Router } from "express";
const { generateNewWordForDay, getWord } = require("../controllers/wordController");

const router = Router();
router.post("/generateNewWordForDay", generateNewWordForDay);
router.get("/word", getWord);
module.exports = { routes: router };
