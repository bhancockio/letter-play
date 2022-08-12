import { Router } from "express";

const { generateNewWordForDay, get } = require("../controllers/wordController");

const router = Router();
router.post("/generateNewWordForDay", generateNewWordForDay);
router.get("/word", get);
module.exports = { routes: router };
