const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const User = require('../schema/User');
const { userList } = require('../controllers/userListController');

// List all users
router.get('/users', auth, userList);

// Follow
router.post('/follow/:username', auth, async (req, res) => {
  try {
    const me = await User.findById(req.user.id);
    const target = await User.findOne({ username: req.params.username });

    if (!target) return res.status(404).json({ success: false, message: "User not found" });
    if (me.following.includes(target._id)) {
      return res.json({ success: false, message: "Already following" });
    }

    me.following.push(target._id);
    target.followers.push(me._id);

    await me.save();
    await target.save();

    res.json({ success: true, message: `Followed ${target.username}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Unfollow
router.post('/unfollow/:username', auth, async (req, res) => {
  try {
    const me = await User.findById(req.user.id);
    const target = await User.findOne({ username: req.params.username });

    if (!target) return res.status(404).json({ success: false, message: "User not found" });

    me.following = me.following.filter(u => u.toString() !== target._id.toString());
    target.followers = target.followers.filter(u => u.toString() !== me._id.toString());

    await me.save();
    await target.save();

    res.json({ success: true, message: `Unfollowed ${target.username}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
