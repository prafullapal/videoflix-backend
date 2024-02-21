require("dotenv").config();
const connectDB = require("./src/db");
const app = require("./src/express");

const PORT = process.env.PORT || 3000; //3000 is the hardcoded PORT

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App listening on PORT: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
