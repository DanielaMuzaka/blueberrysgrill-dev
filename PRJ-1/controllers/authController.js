const User = require('../models/user');
const userService = require('../service/userService');
const ValidationError = require('../error/ValidationError');
const UserAlredyExistsError = require('../error/UserAlredyExistsError');
const CouldNotFindUserError = require('../error/CouldNotFindUserError');
const WrongPasswordError = require('../error/WrongPasswordError');
const NotAuthorizedError = require('../error/NotAuthorizedError');
var ObjectId = require('mongodb').ObjectId;

exports.signIn = async (req, res, next) => {
  try {
    const data = {
      name: req.body.name,
      surname: req.body.surname,
      phone: req.body.phone,
      email: req.body.email,
      password: req.body.password,
      active: req.body.active,
      role: req.body.role,
      tenant: req.body.tenant
    }

    // query validation should be done here
    const user = await userService.signIn(data)
    res.status(200).json(user);
  } catch (err) {
    console.error("Error occurred in signin method", err);
    if (err instanceof UserAlredyExistsError) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Generic error in signIn method" });
    }
    next(err);
  }
};

exports.logIn = async (req, res, next) => {
  const data = {
    email: req.body.email,
    password: req.body.password
  }
  try {
    const result = await userService.logIn(data);
    res.status(200).json(result);

  } catch (err) {
    if (err instanceof CouldNotFindUserError) {
      res.status(400).json({ message: err.message });
    } else if (err instanceof WrongPasswordError) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Generic error in logIn method " });
    }
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const data = {
      userId: req.params.userId
    }
    const user = await userService.getUserById(data)
    res.status(200).json(user);
  } catch (err) {
    // console.error("Error occured in getUserById method", err);
    if (err instanceof CouldNotFindUserError) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Generic error in getUserById" });
    }
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const data = {
      name: req.query.name,
      surname: req.query.surname,
      phone: req.query.phone,
      email: req.query.email,
      role: req.query.role,
      active: req.query.active,
      tenant: req.query.tenant

    }
    const users = await userService.getUsers(data);
    const totalUsers = users.length
    res.status(200).json({ totalUsers: totalUsers, users: users })
  } catch (err) {
    if (err instanceof CouldNotFindUserError) {
      res.status(400).json({ message: err.message});
    } else {
      res.status(500).json({ message: "Generic error in getUsers" });
    }
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  const data = {
    loggedInUserId: ObjectId(req.userId), // logged in user
    userId: req.params.userId,  // user to be updated
    name: req.body.name,
    surname: req.body.surname,
    phone: req.body.phone,
    email: req.body.email,
    password: req.body.password,
    active: req.body.active,
    role: req.body.role,
    tenant: req.body.tenant
  }

  try {
    const user = await userService.updateUser(data);
    res.status(200).json(user);

  } catch (err) {
    if (err instanceof CouldNotFindUserError) {
      res.status(400).json({ message: err.message });
    } else if (err instanceof NotAuthorizedError) {
      res.status(400).json({ message: err.message});
    } else {
      res.status(500).json({ message: "Generic error in updateUsers" });
    }
    next(err);
  };
};





