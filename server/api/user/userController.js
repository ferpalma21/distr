const express = require('express');
const passport = require('passport');
const path = require('path');
const bcrypt = require('bcrypt');
// Our user model
const User = require('./UserModel');
const authRoutes = express.Router();
const bcryptSalt = 10;


exports.listUser = (req, res, next) => {
  User.find()
    .then(userList => {
      res.json(userList);
    })
    .reject(err => {
      res.status(500).json(err);
    });
};

exports.signUp = (req, res, next) => {
  let name = req.body.name;
  let lastName = req.body.lastName;
  let gender = req.body.geder;
  let birthday = req.body.birthday;
  let nationality = req.body.nationality;
  let password = req.body.password;
  let address = req.body.address;
  let email = req.body.email;
  let phone = req.body.phone;

  if (!name || !lastName || !password || !gender || !birthday ||
    !nationality || !address) {
    res.status(400).json({
      message: 'Provide all the information'
    });
    return;
  }

  User.findOne({
    username
  }, '_id', (err, foundUser) => {
    if (foundUser) {
      res.status(400).json({
        message: 'The username already exists'
      });
      return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);
    console.log('imprimiendo interests ====>>>>>>' + interests);
    interests = interests.split(",");
    const theUser = new User({
      name,
      lastName,
      gender,
      birthday,
      nationality,
      password: hashPass,
      address,
      email,
      phone,
    });
    console.log(theUser);
    theUser.save((err) => {
      if (err) {
        res.status(400).json({
          message: 'Something went wrong'
        });
        return;
      }

      req.login(theUser, (err) => {
        if (err) {
          res.status(500).json({
            message: 'Something went wrong'
          });
          return;
        }
        res.status(200).json(req.user);
      });

    });
  });
};

exports.logIn = (req, res, next) =>{
  console.log('hellooooo im tryignt to login');
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);

    if (!user)
      return res.status(401).json(info);

    req.login(user, function(err) {
      if (err) {
        return res.status(500).json({
          message: 'something went wrong :('
        });
      }
      return res.status(200).json(req.user);
    });
  })(req, res, next);
};

exports.editUser = (req, res, next) => {
  const updates = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    lastName: req.body.lastName,
    gender: req.body.gender,
    birthday: req.body.birthday,
    country: req.body.country,
    address: req.body.address,
    phone: req.body.phone,
    imageUrl :req.body.imageUrl


  };
  console.log("8============================D", req.params.id);
  User.findByIdAndUpdate(req.params.id, updates, (err) => {
    if (err) {
      console.log('error');
      return res.status(400).json({
        message: "Unable to update User",
        err
      });
    } else {
      res.json({
        message: 'User updated successfully'
      });
    }
  });
};

exports.logOut = (req, res, next) => {
  console.log("he llegado a logout");
  req.logout();
  res.status(200).json({
    message: 'Success'
  });
};

exports.logStill = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
    return;
  }

  res.status(403).json({
    message: 'Unauthorized'
  });
};


exports.private = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.json({
      message: 'This is a private message'
    });
    return;
  }

  res.status(403).json({
    message: 'Unauthorized'
  });
};

exports.removeUser = (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((list) => res.status(202).json({
      message: 'user removed successfully'
    }))
    .catch(err => res.status(500).json({
      message: 'impossible to remove the user',
      error: err
    }));

};
