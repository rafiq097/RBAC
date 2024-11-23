const express = require("express");
const router = express.Router();
const { loginUser, getAllUsers, addRole, toggleStatus } = require("../controllers/user.controllers.js");
const verifyToken = require("../middlewares/auth.js");

router.post('/login', loginUser);
router.get('/getusers', getAllUsers);
router.put('/updateRole/:id', addRole);
router.put('/toggle-status', verifyToken, toggleStatus);

module.exports = router;