require("dotenv").config();
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000; //3000 is the hardcoded PORT

app.get("/", (req, res) => {
	res.status(200).json({ message: "Backend server is ready!" });
});

app.listen(PORT, () => {
	console.log(`App listening at http://localhost:${PORT}`);
});
