const ValidationError = require('../error/ValidationError');
const User = require('../models/user');
const Review = require('../models/review')
var ObjectId = require('mongodb').ObjectId;
var CouldNotFindReviewError = require('../error/CouldNotFindReviewError');
var NotAuthorizedError = require('../error/NotAuthorizedError');


exports.getReviews = async (data) => {
    let rank = data.rank;
    const description = data.description;
    let userId = data.userId;
    let tenant = data.tenant;
    const active = data.active;
    console.log("Trying to get reviews with data => rank:", rank, ", description:", description, ", userId:", userId, ", tenant:", tenant, ", active:", active);
    let filter = {};
    if (rank || description || userId || tenant || active) {
        filter.$and = []
    }
    if (rank) {
        rank = parseInt(rank)
        filter.$and.push({ rank: rank })
    }
    if (description) {
        filter.$and.push({ description: description })
    }
    if (userId) {
        userId = ObjectId(userId)
        filter.$and.push({ user: userId })
    }
    if (tenant) {
        tenant = ObjectId(tenant);
        filter.$and.push({ tenant: tenant })
    }
    if (active) {
        filter.$and.push({ active: active })
    }
    console.log("Filtering reviews by: ", filter)
    const reviews = await Review.find(filter);
    console.log("Reviews fetched successfully:", reviews);
    return reviews;
};

exports.getReview = async (data) => {
    const revId = data.revId;
    console.log("Trying to fetch review with id:", revId);
    const review = await Review.findById(revId);
    if (!review) {
        console.error("Could not find the review with id:", revId);
        throw new CouldNotFindReviewError('Could not find the requested review');
    }
    // res.status(200).json({ review: review });
    console.log("Review with id:", revId, "fetched successfully : ", review);
    return review;
};

exports.createReview = async (data) => {
    let loggedInUser = data.loggedInUser;
    const rank = data.rank;
    const description = data.description;
    let tenant = data.tenant;
    console.log("Trying to create a review with the data => rank:", rank, ", description:", description, "and tenant:", tenant, "by the user with id:", loggedInUser);
    const review = new Review({
        rank: rank,
        description: description,
        user: loggedInUser,
        tenant: tenant
    });
    await review.save();
    const user = await User.findById(loggedInUser);
    //console.log("user nga db:", user);
    user.reviews.push(review);
    await user.save();
    console.log("The user with id:", user._id, "created successfully the review:", review);
    return review;
};

exports.updateReviewById = async (data) => {
    const loggedInUser = data.loggedInUser; //logged in user
    const revId = data.revId;
    const rank = data.rank;
    const description = data.description;
    const active = data.active;
    const tenant = data.tenant;
    console.log("User with id:", loggedInUser, "is trying to update the review with id:", revId, ", with the data => rank:", rank, ", description:", description, "and active:", active, "and tenant:", tenant);
    const review = await Review.findById(revId).populate('user');
    if (!review) {
        console.error("Could not find the review with the id:", revId);
        throw new CouldNotFindReviewError('Could not find the review');
    }
    const u = await User.findById(loggedInUser);
    if ((review.user._id.toString() === u._id.toString()) || (u.role === "admin")) {
        review.rank = rank;
        review.description = description;
        review.active = active;
        review.tenant = tenant;
        const updatedReview = await review.save();
        console.log("Review updated successfully:", updatedReview);
        return updatedReview;
    }
    if ((review.user._id.toString() !== loggedInUser)) {
        console.error("The user with id:", loggedInUser, "is not authorized to update this review with id:", revId);
        throw new NotAuthorizedError('Not authorized! Can not change the data of another user review !')
    }
};



