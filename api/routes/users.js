const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

// update user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.IsAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);

        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        return res.status(500).json(error);
      }
    }

    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been updated");
    } catch (error) {
      return res.json(error);
    }
  } else {
    return res.status(403).json("Your can update only your account");
  }
});

// delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.IsAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account has been deleted successfully");
    } catch (error) {
      return res.json(error);
    }
  } else {
    return res.status(403).json("Your can delete only your account");
  }
});

// get a user
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({username:username});
    const { password, createdAt, updatedAt, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// follow a users
router.put("/:id/follow", async (req, res) => {
   if (req.body.userId !== req.params.id) {
       try {
           const user = await User.findById(req.params.id);
           const currentUser = await User.findById(req.body.userId);

           if (!user.followers.includes(req.body.userId)) {
               await user.updateOne({$push: {followers: req.body.userId}});
               await currentUser.updateOne({$push: {following: req.params.id}});
               res.status(200).json("User has been followed");
           } else {
               res.status(403).json("You already follow this user");
           }
       } catch (error) {
        return res.status(500).json(error);
       }
   } else {
       res.status(401).json("You can't follow yourself")
   }
  });

// unfollow a users
router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
 
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({$pull: {followers: req.body.userId}});

                await currentUser.updateOne({$pull: {following: req.params.id}});
                res.status(200).json("User has been unfollowed");
            } else {
                res.status(403).json("You don't follow this user");
            }
        } catch (error) {
         return res.status(500).json(error);
        }
    } else {
        res.status(401).json("You can't unfollow yourself")
    }
   });

module.exports = router;
