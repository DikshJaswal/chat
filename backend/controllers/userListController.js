const User = require("../schema/User");

exports.userList = async (req, res) => {
  try {
    const { currentUserId } = req.query; // pass from frontend
    const me = currentUserId ? await User.findById(currentUserId) : null;

    const users = await User.find().select("username details followers following");

    const formatted = users.map((u) => ({
      username: u.username,
      bio: u.details?.bio || "",
      gender: u.details?.gender || "N/A",
      followers: u.followers.length,
      following: u.following.length,
      isFollowing: me ? me.following.includes(u._id) : false,
    }));

    res.json({ success: true, users: formatted });
  } catch (err) {
    console.error("Error in userList:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
