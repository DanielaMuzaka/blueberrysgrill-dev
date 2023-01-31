const expect = require('chai').expect;
const mongoose = require('mongoose');
const userService = require('../../service/userService');
const User = require('../../models/user');
var ObjectId = require('mongodb').ObjectId;
const Review = require('../../models/review');
const bcrypt = require('bcryptjs');


describe('User Service', function () {
  let user1;
  let user2;
  let user3;
  before(async function () {
    console.log("Before : Connecting to db");
    await mongoose.connect('mongodb+srv://daniela:EidU7TBHtDLtCS8C@cluster0.mnwzswz.mongodb.net/test-blueberrys-grill');
    console.log("Connected to db");
    await User.deleteMany();
    await Review.deleteMany();
  });
  beforeEach(async function () {
    user1 = new User({
      name: 'ermal',
      surname: 'aliraj',
      phone: 98,
      email: 'ermal@test.com',
      password: 'ermal',
      active: false,
      role: 'admin',
      tenant: '63ce48580bf7f5918b957bef'
    });
    user1 = await user1.save();
    user2 = new User({
      name: 'daniela',
      surname: 'muzaka',
      phone: 98,
      email: 'daniela@test.com',
      password: 'daniela',
      active: false,
      role: 'user',
      tenant: '63ce48580bf7f5918b957bef'
    });
    user2 = await user2.save();

    user3 = new User({
      name: 'mary',
      surname: 'jones',
      phone: 98,
      email: 'mary@test.com',
      password: 'mary',
      active: false,
      role: 'user',
      tenant: '63ce48580bf7f5918b957bef'
    });
    user3 = await user3.save();
  });

  afterEach(async function () {
    await User.deleteMany();
    await Review.deleteMany();
  });
  after(async function () {
    await mongoose.disconnect();
  });

  it('signIn', async function () {
    console.log("Starting test:'Create User'");
    //Given
    const userData = {
      name: 'tester1',
      surname: 'test',
      phone: 12,
      email: 'tester1@test.com',
      password: 'test',
      active: 'false',
      role: 'user',
      tenant: '63ce48580bf7f5918b957bef'
    } 
    //When
    const savedUser = await userService.signIn(userData);
    //Then
    const dbUser = await User.findById(savedUser._id);
    expect(savedUser._id.toString()).not.to.be.equal(null);
    expect(dbUser.name).to.be.equal(userData.name);
    expect(dbUser.surname).to.be.equal(userData.surname);
    expect(dbUser.phone).to.be.equal(userData.phone);
    expect(dbUser.email).to.be.equal(userData.email);
    expect(dbUser.password).to.be.equal(savedUser.password);
    expect(dbUser.active.toString()).to.be.equal(userData.active);
    expect(dbUser.role).to.be.equal(userData.role);
    expect(dbUser.tenant.toString()).to.be.equal(userData.tenant);
  });

  it('update user', async function () { 
    console.log("Starting test :'update user'");
    //Given
    const userData = {
      loggedInUserId: user2._id,
      userId: user2._id,
      name: user2.name,
      surname: "TT",
      phone: 12,
      email: user2.email,
      password: user2.password,
      active: user2.active,
      role: user2.role,
      tenant: '63ce48580bf7f5918b957bef'
    }
    //When
    const updatedUser = await userService.updateUser(userData);
    //Then
    const dbUser = await User.findById(updatedUser._id);
    expect(dbUser.name).to.be.equal(userData.name);
    expect(dbUser.surname).to.be.equal(userData.surname);
    expect(dbUser.phone).to.be.equal(userData.phone);
    expect(dbUser.email).to.be.equal(userData.email);
    expect(dbUser.password).to.be.equal(updatedUser.password);
    expect(dbUser.active).to.be.equal(userData.active);
    expect(dbUser.role).to.be.equal(userData.role);
    expect(dbUser.tenant.toString()).to.be.equal(userData.tenant);
  });

  it('filter users by role', async function () { 
    console.log("Starting test: filter by role");
    //Given
    userData = {
      name: null,
      surname: null,
      phone: null,
      email: null,
      password: null,
      active: null,
      role: user2.role, //'user'
      tenant: null
    }
    //When
    const result = await userService.getUsers(userData);
    //Then
    expect(result.length).to.be.equal(2);
  });

  it('filter users by name', async function () { 
    console.log("Starting test: filter by name");
    //Given
    userData = {
      name: user2.name, //daniela
      surname: null,
      phone: null,
      email: null,
      password: null,
      active: null,
      role: null,
      tenant: null
    }
    //When
    const result = await userService.getUsers(userData);
    //Then
    expect(result.length).to.be.equal(1);
  });

  it('filter all null', async function () { 
    console.log("Starting test: filter all null");
    //Given
    userData = {
      name: null,
      surname: null,
      phone: null,
      email: null,
      password: null,
      active: null,
      role: null,
      tenant: null
    }
    //When
    const result = await userService.getUsers(userData);
    //Then
    expect(result.length).to.be.equal(3);
  });

  it('filter full match', async function () {
    console.log("Starting test : filter full match");
    //Given
    const userData = {
      name: user1.name,
      surname: user1.surname,
      phone: user1.phone,
      email: user1.email,
      password: user1.password,
      active: user1.active,
      role: user1.role,
      tenant: '63ce48580bf7f5918b957bef'
    }
    //When
    const result = await userService.getUsers(userData);
    //Then
    expect(result.length).to.be.equal(1);
  });

  it('filter users by active', async function () { 
    console.log("Starting test: filter all null");
    //Given
    userData = {
      name: null,
      surname: null,
      phone: null,
      email: null,
      password: null,
      active: user2.active, //false
      role: null,
      tenant: null
    }
    //When
    const result = await userService.getUsers(userData);
    //Then
    expect(result.length).to.be.equal(3);
  });

  it('filter users by email', async function () { 
    console.log("Starting test: filter all null");
    //Given
    userData = {
      name: null,
      surname: null,
      phone: null,
      email: user1.email,
      password: null,
      active: null,
      role: null,
      tenant: null
    }
    //When
    const result = await userService.getUsers(userData);
    //Then
    expect(result.length).to.be.equal(1);
  });

  it('should retrieve the right user by id', async function () {
    console.log("Starting test :should retrieve the right user by id");
    //Given
    const userData = {
      userId: user2._id
    }
    //When
    const retrivedUser = await userService.getUserById(userData);
    //Then
    expect(retrivedUser._id).to.eql(userData.userId);
  });

});

