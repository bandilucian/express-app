const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);

  console.log('Sa vedem daca merge auth');

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //1) Check if email and password exists
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  //2) Check is user exists %% pasword is corect
  const user = await User.findOne({ email: email }).select('+password'); // sau doar{email} +password ca sa includem fieldul password

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorect email or password', 401));
  }

  //3# If everything ok,send token to client

  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});
