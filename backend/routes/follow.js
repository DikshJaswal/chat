const express = require("express");
const router = express.Router();
const User = require("../schema/User");

// ---------------- FOLLOW ----------------
router.post("/follow", async (req, res) => {
  try {
    const { targetUsername, currentUserId } = req.body;

    if (!targetUsername || !currentUserId) {
      return res.status(400).json({ success: false, message: "Missing data" });
    }

    const targetUser = await User.findOne({ username: targetUsername });
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (targetUser._id.equals(currentUser._id)) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself",
      });
    }

    if (currentUser.following.includes(targetUser._id)) {
      return res.status(400).json({
        success: false,
        message: `Already following @${targetUsername}`,
      });
    }

    currentUser.following.push(targetUser._id);
    targetUser.followers.push(currentUser._id);

    await currentUser.save();
    await targetUser.save();

    return res.json({
      success: true,
      message: `You are now following @${targetUsername}`,
    });
  } catch (err) {
    console.error("Follow error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ---------------- UNFOLLOW ----------------
router.post("/unfollow", async (req, res) => {
  try {
    const { targetUsername, currentUserId } = req.body;

    if (!targetUsername || !currentUserId) {
      return res.status(400).json({ success: false, message: "Missing data" });
    }

    const targetUser = await User.findOne({ username: targetUsername });
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!currentUser.following.includes(targetUser._id)) {
      return res.status(400).json({
        success: false,
        message: `You are not following @${targetUsername}`,
      });
    }

    currentUser.following = currentUser.following.filter(
      (id) => !id.equals(targetUser._id)
    );
    targetUser.followers = targetUser.followers.filter(
      (id) => !id.equals(currentUser._id)
    );

    await currentUser.save();
    await targetUser.save();

    return res.json({
      success: true,
      message: `You unfollowed @${targetUsername}`,
    });
  } catch (err) {
    console.error("Unfollow error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
