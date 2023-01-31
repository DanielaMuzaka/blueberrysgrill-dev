const User = require('../models/user');
const jwt = require('jsonwebtoken');
const ValidationError = require('../error/ValidationError');
const UserAlredyExistsError = require('../error/UserAlredyExistsError');
const bcrypt = require('bcryptjs');
const CouldNotFindUserError = require('../error/CouldNotFindUserError');
const WrongPasswordError = require('../error/WrongPasswordError');
const NotAuthorizedError = require('../error/NotAuthorizedError')
var ObjectId = require('mongodb').ObjectId;

exports.signIn = async (data) => {
  const name = data.name;
  const surname = data.surname;
  const phone = data.phone;
  const email = data.email;
  const password = data.password;
  const active = data.active;
  const role = data.role;
  const tenant = ObjectId(data.tenant);
  console.log("Creating user with data => name:", name, ", surname:", surname, ", phone:", phone, ", email:", email, ", password:", password, ", active:", active, ", role:", role, ", tenant:", tenant);
  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    throw new UserAlredyExistsError('E-Mail address already exists! Please pick another one!');
  }
  const hashPass = await bcrypt.hash(password, 12);
  let user = new User({
    name: name,
    surname: surname,
    phone: phone,
    email: email,
    password: hashPass,
    active: active,
    role: role,
    tenant: tenant
  })

  user = await user.save();
  console.log("User created with success: ", user);
  return user;
}

exports.getUserById = async (data) => {
  const userId = data.userId;
  console.log("Trying to fetch user with id:", userId);
  const user = await User.findById(userId)
    //  .populate('reviews')
    ;
  if (!user) {
    console.log('Could not find user' + ' ' + userId)
    throw new CouldNotFindUserError("Could not find user");
  }
  console.log("User fetched successfully:", user);
  return user;
}

exports.logIn = async (data) => {
  const email = data.email;
  const password = data.password;

  console.log("Trying to login user with email:", email, "and password:", password);
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new CouldNotFindUserError('A user with this email can not be found!');
  }
  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) {
    throw new WrongPasswordError('Wrong password!');
  }
  // console.log("user:", user);
  // console.log("user.email:", user.email);
  // console.log("user.id:", user._id);
  const token =  jwt.sign(
   {
      email: user.email,
      userId: user._id.toString()
    },
    'somesupersecret',
    { expiresIn: '1h' }
  );
  // console.log("token:", JSON.stringify(token))
  // console.log("email in token:", token.email)
  // console.log("userId in token:", token.userId)
  console.log("User with email:", email, "correctly logged in.Token:", token);
  return { token: token, userId: user._id };
}

exports.getUsers = async (data) => {
  const name = data.name;
  const surname = data.surname;
  let phone = data.phone;
  const email = data.email;
  const password = data.password;
  const active = data.active;
  const role = data.role;
  let tenant = data.tenant;
  console.log("Trying to fetch all users");
  let filter = {};
  if (name || surname || phone || email || password || role || active || tenant) {
    filter.$and = []
  }
  if (name) {
    filter.$and.push({ name: name })
  }
  if (surname) {
    filter.$and.push({ surname: surname })
  }
  if (phone) {
    phone = parseInt(phone)
    filter.$and.push({ phone: phone })
  }
  if (email) {
    filter.$and.push({ email: email })
  }
  if (role) {
    filter.$and.push({ role: role })
  }
  if (active) {
    filter.$and.push({ active: active })
  }
  if (tenant) {
    tenant = ObjectId(tenant);
    filter.$and.push({ tenant: tenant })
  }
  console.log("Filering users by:", filter)
  const users = await User.find(filter)
  if (!users) {
    throw new CouldNotFindUserError("Could not find users");
  }
  console.log("Users fetched successfully:", users);
  return users;
}

exports.updateUser = async (data) => {
  const loggedInUserId = data.loggedInUserId; //loggedIn user
  const userId = data.userId;  //user to be updated
  const name = data.name;
  const surname = data.surname;
  const phone = data.phone;
  const email = data.email;
  const password = data.password;
  const active = data.active;
  const role = data.role;
  const tenant = data.tenant;
  console.log("Updating loggedInUser ", loggedInUserId, ", user:", userId, ", name:", name, ", surname:", surname, ", phone:", phone, ", email:", email, ", password:", password, ", active", active, ", role", role, ", tenant", tenant);
  const userUpdate = await User.findById(userId);
  if (!userUpdate) {
    throw new CouldNotFindUserError('Could not find the user');
  }
  const u = await User.findById(loggedInUserId);
  if ((u.role === "admin") || (userUpdate._id.toString() === u._id.toString())) {
    const hashPass = await bcrypt.hash(password, 12);
    userUpdate.name = name;
    userUpdate.surname = surname;
    userUpdate.phone = phone;
    userUpdate.email = email;
    userUpdate.password = hashPass;
    userUpdate.active = active;
    userUpdate.role = role;
    userUpdate.tenant = tenant;
    const result = await userUpdate.save();
    console.log("Updated user with succes:", result);
    return userUpdate;
  }
  if ((userUpdate._id.toString()) !== loggedInUserId) {
    console.log("The user:", loggedInUserId, "can not change data of another user ", userId);
    throw new NotAuthorizedError('Not authorized! User can not change data of another user !');
  }
}