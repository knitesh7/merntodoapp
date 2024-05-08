const express = require("express");
const userRouter = express.Router();
const userModel = require("../models/usermodel");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const isLoggedIn = (req, res, next) => {
  console.log(req.cookies)
  console.log("hi from isLoggedIn");
  if (req.headers["authorization"] && req.headers["authorization"] !== "") {
    try {
      const payload = jwt.verify(req.headers["authorization"], "secret");
      req.user = { email: payload.email };
      // console.log(user);
      next();
      return
    } catch (error) {
      console.error(error)
      return res.json({ loggedIn: false });
    }
  }
  return res.json({ loggedIn: false });
};
userRouter.get("/fetch", isLoggedIn, async (req, res) => {
  console.log("hi");
  const user = await userModel.findOne({ email: req.user.email });
  if(user){
    const { _id, email, image, todos } = user;
    return res.json({
      validUser: true,
      user: { _id, email, image, todos,loggedIn: true }
    });
  }
  return res.json({message:"Invalid User",loggedIn:false})
  
});

userRouter.post(`/register`, async (req, res) => {
  if (req.body.password !== req.body.confirmpass) {
    return res.json({ message: `Password confirmation is wrong, try again` });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);
  try {
    const user = await userModel.create({
      ...req.body,
      password: hashedPass,
      todos: [],
    });
    const { _id, email, image, todos } = user;
    const token = jwt.sign({ email: req.body.email }, "secret");

    return res
      .status(200)
      .json({
        message: "User created successfully",
        user: { _id, email, image, todos,loggedIn: true },
        token
      });
  } catch (err) {
    return res.json({ message: err.message });
  }
});
userRouter.post(`/login`, async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (user) {
    if (await bcrypt.compare(password, user.password)) {
      const { _id, email, image, todos } = user;
      const token = jwt.sign({ email: req.body.email }, "secret");
      return res.status(200).json({
        validUser: true,
        user: { _id, email, image, todos ,loggedIn: true},
        token
      });
    }
    return res
      .status(401)
      .json({ validUser: false, message: `Invalid Password` });
  }
  return res.status(401).json({ validUser: false, message: `Invalid Email` });
});

userRouter.post("/update", async (req, res) => {
  const data = req.body;
  console.log(data)
  if(typeof data !== 'object'){
    data = JSON.parse(data);
  }
  const { userid, todos } = data;
  try {
    await userModel.findOneAndUpdate(
      { _id: userid },
      { todos: todos.map((x) => ({ val: x.val, done: x.done })) }
    );
    return res.status(200);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = userRouter;
