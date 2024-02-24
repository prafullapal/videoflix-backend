const express = require("express");
const router = express.Router();

// Import individual route modules
const userRoutes = require("./user.routes");

router.use("/users", userRoutes);

module.exports = router;
