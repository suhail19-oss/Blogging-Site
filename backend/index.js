const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const User = require("./models/User");
const Post = require("./models/Post");
const uploadMiddleware = multer({ dest: 'uploads/' });
const app = express();
const secret = "asdfghjkl1234@23455789";

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/mern-blog", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Register Route
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await User.create({
      username: username.toLowerCase(),
      password: hashedPassword,
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: "Username already exists." });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username: username.toLowerCase() });

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(400).json({ error: "Invalid username or password." });
  }

  const token = jwt.sign({ id: user._id, username: user.username }, secret);
  res
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
    })
    .json({
      id: user._id,
      username: user.username,
    });
});

// Profile Route
app.get("/profile", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, secret, (err, userInfo) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    res.json(userInfo);
  });
});

// Logout Route
app.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Logged out successfully" });
});

// Upload and Create Post Route
app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
  try {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newpath = path + '.' + ext;
    fs.renameSync(path, newpath);

    const token = req.cookies.token;
    jwt.verify(token, secret, async (err, userInfo) => {
      if (err) return res.status(401).json({ error: "Invalid token" });

      const { title, summary, content } = req.body;
      
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: newpath,
        author: userInfo.id,
      });

      res.json(postDoc);
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// Get All Posts Route
app.get('/post', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', ['username']).sort({ createdAt: -1 }).limit(10);
    console.log("Fetched posts:", posts);
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts." });
  }
});

app.get('/post/:id',async(req,res)=>{
  const {id}=req.params;
  const postDoc=await Post.findById(id).populate("author",["username"]);
  res.json(postDoc);
})

// Start Server
const PORT = 4000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
