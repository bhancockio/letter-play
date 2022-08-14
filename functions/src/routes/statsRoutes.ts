import { Router } from "express";

const { post } = require("../controllers/statsController");

const router = Router();
router.post("/stats", post);
module.exports = { routes: router };
