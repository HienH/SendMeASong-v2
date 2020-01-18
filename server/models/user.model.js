const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const SALT_I = 10;
const jwt = require('jsonwebtoken')
require('dotenv').config();

const userSchema = mongoose.Schema({
  email: {
    type: String,
    require: true,
    trim: true,
    unique: 1
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  username: {
    type: String,
    require: true,
    maxlength: 20
  },
  songs: [{
    type: Schema.Types.ObjectId,
    ref: 'Song'
  }],
  token: {
    type: String
  }
});


userSchema.pre('save', async function (next) {
  if (!this.isModified("password")) {
    next()
  } else {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(this.password, salt);
      this.password = hash
      next()

    } catch (err) {
      next(err)
    }
  }
});

userSchema.methods.comparePassword = function (enteredPassword, cb) {
  bcrypt.compare(enteredPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch)
  })
};



userSchema.methods.generateToken = function (cb) {
  let user = this;
  let token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: 8640
  });
  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  })

}

userSchema.statics.findByToken = function (token, cb) {
  let user = this;
  jwt.verify(token, process.env.JWT_SECRET, function (err, decode) {
    user.findOne({ "_id": decode._id }, function (err, user) {
      if (err) return cb(err)
      cb(null, user);

    })

  })
}
const User = mongoose.model('User', userSchema);

module.exports = { User }