const express = require('express');

const router = express.Router();

const reviewController = require('../controllers/reviewController');
const isAuth = require('../middleware/is-auth');

router.get('/reviews', reviewController.getReviews);

router.get('/reviews/:revId', isAuth, reviewController.getReview);

router.post('/review', isAuth , reviewController.createReview);

router.put('/review/:revId', isAuth, reviewController.updateReviewById);

module.exports = router;