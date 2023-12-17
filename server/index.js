import "dotenv/config";
import connectDB from "./src/db/index.js";
import app from "./src/app.js";
const port = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is listening at ${port}`);
    });
  })
  .catch((error) => {
    console.log("error", error);
  });
