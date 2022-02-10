const router = require("express").Router();
const { send } = require("express/lib/response");
const res = require("express/lib/response");
const Post = require("../models/Post");
const User = require("../models/User");

// create a post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    res.status(500).json("Couldn't save post, " + error);
  }
});

// update a post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("The post has been updated");
    } else {
      res.status(403).json("You can update only your post");
    }
  } catch (error) {
    res.status(404).json("Post not found");
  }
});

// delete a post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("The post has been deleted");
    } else {
      res.status(403).json("You can delete only your post");
    }
  } catch (error) {
    res.status(404).json("Post not found");
  }
});

// like a post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });

      try {
        res.status(200).json("The post has been liked");
      } catch (error) {
        res.send(error);
      }
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (error) {
    res.status(404).json("Post not found");
  }
});

// get a post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json("post not found");
  }
});

// get timeline posts of following
router.get("/timeline/:id", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.id);

    const userPosts = await Post.find({ userId: currentUser._id });

    const friendPosts = await Promise.all(
      // doubt about friendId value|0 or the value of the key
      currentUser.following.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );

    // console.log(friendPosts);

    res.json(userPosts.concat(...friendPosts));
  } catch (error) {
    res.status(500).json("Couldn't get timeline post, " + error);
  }
});

// get user's all posts
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json("Couldn't get user's post, " + error);
  }
});

module.exports = router;
