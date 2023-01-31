const Review = require('../models/review');
const User = require('../models/user');
const Tenant = require('../models/tenant');
const reviewService = require('../service/reviewService');
const ValidationError = require('../error/ValidationError');
var CouldNotFindReviewError = require('../error/CouldNotFindReviewError');
const NotAuthorizedError = require('../error/NotAuthorizedError');

exports.getReviews = async (req, res, next) => {
  try {
    const data = {
      rank: req.query.rank,
      description: req.query.description,
      userId: req.query.userId,
      tenant: req.body.tenant,
      active: req.query.active
    }
    const reviews = await reviewService.getReviews(data);
    const totalReviews = reviews.length;
    res.status(200).json({ totalReviews: totalReviews, reviews });
  } catch (err) {
    // console.error("Error occured in getReviews method", err);
    if (err instanceof ValidationError) {
      res.status(400).json({ message: "Could not find reviews" });
    } else {
      res.status(500).json({ message: "Generic error in getUsers method" });
    }
    next(err);
  }
};

exports.getReview = async (req, res, next) => {
  const data = {
    revId: req.params.revId
  }
  try {
    const review = await reviewService.getReview(data);
    res.status(200).json(review);
  } catch (err) {
    // console.error("Error occured in getReview method", err);
    if (err instanceof CouldNotFindReviewError) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Generic error in getReview method" });
    }
    next(err);
  }
};


exports.createReview = async (req, res, next) => {
  const data = {
    loggedInUser: req.userId,
    rank: req.body.rank,
    description: req.body.description,
    tenant: req.body.tenant
  }
  try {
    const review = await reviewService.createReview(data);
    res.status(200).json(review);
  } catch (err) {
    res.status(500).json({ message: "Generic error in createReview method" });
    next(err);
  }
};

exports.updateReviewById = async (req, res, next) => {
  const data = {
    loggedInUser: req.userId,   // logged in user
    revId: req.params.revId,
    rank: req.body.rank,
    description: req.body.description,
    active: req.body.active,
    tenant: req.body.tenant
  }
  try {
    const updatedReview = await reviewService.updateReviewById(data);
    res.status(200).json(updatedReview);
  } catch (err) {
    if (err instanceof CouldNotFindReviewError) {
      res.status(400).json({ message: err.message });
    } else if (err instanceof NotAuthorizedError) {
      res.status(400).json({ message: err.message });
    }
    else {
      res.status(500).json({ message: "Generic error in updateReviewById method" });
    }
    next(err);
  }
};

