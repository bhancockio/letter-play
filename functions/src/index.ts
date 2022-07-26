import { Express } from "express";

const functions = require("firebase-functions");
const express = require("express");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const cors = require("cors");

// App - Reference: https://github.com/Musawirkhann/node-express-firebase
const app: Express = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
admin.initializeApp();

/* ----------- CLOUD TRIGGERS ----------- */
const { statsCreated } = require("./triggers/stats.trigger");
exports.statsCreated = statsCreated;

/* ----------- HTTP FUNCTIONS ----------- */
const userRoutes = require("./routes/userRoutes");
const wordRoutes = require("./routes/wordRoutes");
const statsRoutes = require("./routes/statsRoutes");

app.use("/api", userRoutes.routes);
app.use("/api", wordRoutes.routes);
app.use("/api", statsRoutes.routes);

exports.app = functions.https.onRequest(app);
