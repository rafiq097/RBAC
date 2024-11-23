const express = require("express");
const router = express.Router();
const { loginUser, getAllUsers, addRole, toggleStatus, addUser, deleteUser } = require("../controllers/user.controllers.js");
const verifyToken = require("../middlewares/auth.js");

router.post('/login', loginUser);
router.get('/getusers', getAllUsers);
router.put('/updateRole/:id', addRole);
router.put('/toggle-status', verifyToken, toggleStatus);
router.post('/add-user', addUser);
router.delete('/delete-user/:id', deleteUser);

module.exports = router;