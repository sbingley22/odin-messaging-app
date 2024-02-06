var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const User = require('../models/user');
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require('express-validator');

// Token authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) {
    console.log("No Token")
    next()
    return
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err)
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

router.get('/', authenticateToken, function(req, res, next) {
  if (req.user != null) {
    res.send(`Welcome, ${req.user.username}!`)
  } else {
    res.send('Please login')
  }
});

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body

  try {
    const user = await User.findOne({username: username}).exec()
    if (user) {
      const match = await bcrypt.compare(password, user.password)
      if (!match) {
        return res.status(400).json({ error: "Password incorrect" })
      }
      const accessToken = jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET)
      res.json({ accessToken: accessToken })
    } else {
      return res.status(400).json({ error: "User incorrect" })
    }
  } catch (err) {
    console.log("Error finding user in database or comparing password", err)
    res.sendStatus(403)
  }
})

router.post('/sign-up', [
  body("username", "username is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password", "Password is required")
    .trim()
    .isLength({ min: 1 }),
  body("confirmpassword", "Confirm Password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    })
    .escape(),
  body("firstname", "First name is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("lastname", "Last name is required")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req)

    const userInfo = {
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    }

    if (!errors.isEmpty()) {
      res.json({
        errors: errors.array()
      })
      return
    }

    const userExists = await User.findOne({ username: req.body.username }).exec()
    if (userExists) {
      res.send({ msg: "Username already in use!"})
      return
    }

    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      const user = new User({
        username: req.body.username,
        password: hashedPassword,
        firstname: req.body.firstname,
        lastname: req.body.lastname
      })
      const result = await user.save()
      res.redirect('/users/login')
      console.log("Successfully created new user")
    } catch(err) {
      return next(err)
    }
  })
])

module.exports = router;
