const mongoose = require('mongoose');
const review = require('../models/review');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  active: {
    type: Boolean,
    default: false
  },
  tenant: {
    type: Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
},
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);