const express=require('express');
const router=express.Router();
const auth=require('../middlewares/authMiddleware');
const {userList}=require('../controllers/userListController');

router.get('/users',auth,userList);
module.exports=router;