const mongoose = require("mongoose");
require("dotenv").config();
mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/zerotoone").then(() => {
  return mongoose.connection.db.collection("products").deleteMany({});
}).then((res) => {
  console.log("Deleted", res.deletedCount, "products");
  process.exit(0);
}).catch(console.error);
