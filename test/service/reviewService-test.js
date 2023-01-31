const expect = require('chai').expect;
const mongoose = require('mongoose');
const reviewService = require('../../service/reviewService');
const Review = require('../../models/review');
var ObjectId = require('mongodb').ObjectId;
const User = require('../../models/user');

//data for test:user1(admin), user2(user), user3(user)
//user1 has 0 reviews , user2 has 2 review, user3 has 1 reviews
describe('Review Service', function () {
    let user1;
    let user2;
    let user3;
    let review1;
    let review2;
    let review3;
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
            tenant: '63ce48580bf7f5918b957bef',
            reviews: []
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
            tenant: '63ce48580bf7f5918b957bef',
            reviews: [review1, review2]
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
            tenant: '63ce48580bf7f5918b957bef',
            reviews: [review3]
        });
        user3 = await user3.save();

        review1 = new Review({
            rank: 1,
            description: 'Rev1/user2',
            user: user2,
            tenant: '63ce48580bf7f5918b957bef'
        });
        review1 = await review1.save();

        review2 = new Review({
            rank: 1,
            description: 'Rev2/user2',
            user: user2,
            tenant: '63ce48580bf7f5918b957bef'
        });
        review2 = await review2.save();

        review3 = new Review({
            rank: 2,
            description: 'Rev1/user3',
            user: user3,
            tenant: '63ce48580bf7f5918b957bef'
        });
        review3 = await review3.save();
    });

    afterEach(async function () {
        await User.deleteMany();
        await Review.deleteMany();
    });
    after(async function () {
        await mongoose.disconnect();
    });

    it('When getReview by ID Should fetch the good one', async function () {
        //Given
        const reviewData = {
            revId: review1._id
        }
        //When
        const fetchedReview = await reviewService.getReview(reviewData);
        //Then
        expect(fetchedReview._id).to.eql(reviewData.revId);
    });

    it('When review created Should be associated to a user', async function () {
        console.log("Starting test: creates a review successfully");
        // Given
        const reviewData = {
            loggedInUser: user2._id,
            rank: 5,
            active: false,
            description: 'This is a test',
            tenant: '63ce48580bf7f5918b957bef'
        }
        // When
        const savedReview = await reviewService.createReview(reviewData);
        // Then
        const dbReview = await Review.findById(savedReview._id);
        expect(savedReview._id.toString()).not.to.be.equal(null);
        expect(dbReview.rank).equals(reviewData.rank);
        expect(dbReview.description).equals(reviewData.description);
        expect(dbReview.active).equals(reviewData.active);
        expect(dbReview.user).eql(reviewData.loggedInUser);
        expect(dbReview.tenant.toString()).to.be.eql(reviewData.tenant);
        // assert contains 3 reviews.
        // Assert last one is the one we inserted
        const user = await User.findById(reviewData.loggedInUser);
        expect(user.reviews.length).equals(3);
        expect(user.reviews[2]._id).to.be.eql(savedReview._id);
    });

    it('When getReviews byUserID Should return reviews associated to the user', async function () {
        // Given
        const reviewData = {
            userId: user2._id,
            rank: null,
            description: null,
            tenant: null
        }
        //When
        const result = await reviewService.getReviews(reviewData);
        //Then
        console.log("result", result);
        expect(result.length).to.be.equals(2);
    });

    it('When getReviews byDescription Should return the good one', async function () {
        //Given
        const reviewData = {
            userId: null,
            rank: null,
            description: review1.description,   // 'Rev1/user2'
            tenant: null
        }
        //When
        const result = await reviewService.getReviews(reviewData);
        //Then
        console.log("result", result);
        expect(result.length).to.be.equal(1);
    });

    it('When getReviews byRank Should return the list', async function () {
        //Given
        const userData = {
            userId: null,
            rank: review1.rank, //2
            description: null,
            tenant: null
        }
        //When
        const result = await reviewService.getReviews(userData);
        //Then
        expect(result.length).to.be.equal(2);
    });

    it('When getReviews with NULLs Should return full list', async function () {
        //Given
        const reviewData = {
            userId: null,
            rank: null,
            description: null,
            tenant: null
        }
        //When
        const result = await reviewService.getReviews(reviewData);
        //Then
        expect(result.length).to.be.equal(3);
    });

    it('When getReviews with full Match Should return 1 element', async function () {
        //Given
        const userData = {
            userId: user2._id,
            rank: review1.rank,
            description: review1.description,
            tenant: '63ce48580bf7f5918b957bef'
        }
        //When
        const result = await reviewService.getReviews(userData);
        //Then
        expect(result.length).to.be.equal(1);
    });

    it('When updateReviewById Should update the review correctly', async function () {
        console.log("Starting test: update the review correctly");
        //Given
        const reviewData = {
            loggedInUser: user2._id,
            revId: review2._id,
            rank: 5,
            active: review2.active,
            description: review2.description,
            tenant: '63ce48580bf7f5918b957bef'
        }
        //When
        const updatedReview = await reviewService.updateReviewById(reviewData);
        //Then
        const dbReview = await Review.findById(updatedReview._id);
        expect(dbReview.rank).to.be.equal(reviewData.rank);
        expect(dbReview.active).to.be.equal(reviewData.active);
        expect(dbReview.description).to.be.equal(reviewData.description);
        expect(dbReview.tenant.toString()).to.be.equal(reviewData.tenant);
    });
});