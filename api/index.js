const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const cors = require("cors");
const multer = require("multer");
const path = require("path");


dotenv.config();

mongoose.connect(process.env.MONGO_URL, () => {
  console.log("Connected to MONGODB");
});

// middleware
app.use(express.json());
app.use(morgan("common"));
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

const storage = multer.diskStorage(
  {
    destination: (req, file, cb) => { 
      cb(null, "public/images/posts")
    },

    filename: (req, file, cb) => { 
      const ext = file.mimetype.split("/")[1];
      const filename = `image-${Date.now()}.${ext}`;
      req.filename = filename
      cb(null, filename);
    }
  }
);

const upload = multer({ storage });

app.post("/api/upload", upload.single("file"), (req, res)=>{
try {
  return res.status(200).json(req.filename);
} catch (error) {
  console.log(error);
}
})
 
app.use("/images", express.static(path.join(__dirname, "public/images")));

app.listen(8000, () => {
  console.log("Backend server is running");
});


