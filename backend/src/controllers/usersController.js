import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  console.log("name:", name);

  try {
    const existingUser = await User.findOne({ email });
    console.log("existingUser:", existingUser);

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 15);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    return res
      .status(201)
      .json({ message: "User created successfully", user: { name, email } });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

  
    return res.status(200).json({
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};