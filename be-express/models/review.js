const mongoose = require('mongoose');
const User = require('../models/user');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  rank: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: false
  },
  tenant: {
    type: Schema.Types.ObjectId,
    ref: 'Tenant',
    require: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
},
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);