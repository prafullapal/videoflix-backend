const express = require("express");
const router = express.Router();
const healthcheckController = require("../controllers/healthcheck.controller");

router.route("/").get(healthcheckController.healthcheck);

module.exports = router;
