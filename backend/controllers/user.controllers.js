const jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");

const loginUser = async (req, res) => {
    console.log("login called");
    try {
        console.log(req.body);
        const { email, name } = req.body;
        if (!email || !name)
            return res.status(400).json({ message: "Incorrect Details" });

        let role;
        if (email == "rafiqshaik097@gmail.com") {
            role = "admin";
        }

        let user = await User.findOne({ email: email });
        if (!user) {
            user = new User({ email, name, role: role });
            await user.save();
            console.log(user);
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, name: user.name, tasks: user.tasks, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(200).json({
            message: "Logged In Successfully",
            token,
            user: {
                id: user._id, email: user.email, name: user.name, tasks: user.tasks, role: user.role
            }
        });
    }

    catch (err) {
        console.log(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).send({ users: users });
    }
    catch (err) {
        console.log(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const addRole = async (req, res) => {
    console.log(req.params);
    try {
        // const email = req.params.email;
        const id = req.params.id;
        const role = req.body.role;
        if (!id) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        let tempUser = await User.findById(id);
        if (!tempUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = await User.findByIdAndUpdate(id, { role: role }, { new: true, runValidators: true });
        console.log(user);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'User updated successfully',
            user,
        });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'An error occurred while updating the user' });
    }
};

const toggleStatus = async (req, res) => {
    console.log(req);
    try {
        // const email = req.params.email;
        const id = req.user.userId;
        if (!id) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // const user = await User.findByIdAndUpdate(id, { isActive: !user.isActive }, { new: true, runValidators: true });
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isActive = !user.isActive;
        await user.save();

        console.log(user);

        res.status(200).json({
            message: 'User status toggled successfully',
            user,
        });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'An error occurred while toggling the user active' });
    }
};

const addUser = async (req, res) => {
    try {
        const { name, email, role } = req.body;

        if (!name || !email || !role) {
            return res.status(400).json({ message: "Name, email, and role are required." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists." });
        }

        const newUser = new User({
            name,
            email,
            role,
        });

        await newUser.save();

        res.status(201).json({ message: "User added successfully!", user: newUser, userExists: existingUser });
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ message: "Failed to add user. Please try again." });
    }
};

const deleteUser = async (req, res) => {
    try {
      const userId = req.params.id;
  
      if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
      }
  
      const deletedUser = await User.findByIdAndDelete(userId);
  
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found." });
      }
  
      return res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
      console.error("Error deleting user:", error.message);
      return res.status(500).json({ message: "Internal server error." });
    }
  };
  

module.exports = { loginUser, getAllUsers, addRole, toggleStatus, addUser, deleteUser };