import { Router } from "express";

const { post, get } = require("../controllers/statsController");

const router = Router();
router.post("/stats", post);
router.get("/stats", get);
module.exports = { routes: router };
