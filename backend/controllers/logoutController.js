const logout = (req, res) => {
    try {
        // Clear the token cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (err) {
        console.error('Logout error:', err);
        res.status(500).json({
            success: false,
            message: 'Internal server error during logout'
        });
    }
};

module.exports = { logout };