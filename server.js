const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const leadsRoutes = require("./routes/leads");
require("./corn/processOrdersCorn");

dotenv.config();

const app = express();

app.use(express.json());
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => console.error("MongoDB connection error:", error));

app.use("/api", leadsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
