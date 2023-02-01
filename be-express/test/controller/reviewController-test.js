const expect = require('chai').expect;
const mongoose = require('mongoose');
let User = require('../../models/user');
const reviewController = require('../../controllers/reviewController');


describe('Review controller', function () {
    before(async function (done) {
        console.log("Entering in db");
        // await mongoose.connect(process.env.MONGO_URI);
     await mongoose.connect( 'mongodb+srv://daniela:EidU7TBHtDLtCS8C@cluster0.mnwzswz.mongodb.net/blueberrys-grill')
        console.log("Connected to db");
        //done();
        //  return;
        // .then(result => {
            const user = new User({
                email: 'test@test.com',
                password: 'tester',
                name: 'Test',
                surname: 'Test',
                phone: '6789654',
                tenant: '63cad6d93a030b12787ce843',
                reviews: []
                //_id: '63ce843a3413b93c98739b06'
            })
         const newUser =   await user.save();
         console.log("newUser:" , newUser);
          // const review = await Review.findById(revId);
        // })
        // .then(() => {
        //     console.log("user created in before");
        //     done();
        // });
    });

    it('Should add a created review to the reviews of the user', function (done) {

        req = {
            userId: '63ce843a3413b93c98739b06',
            body: {
                rank: 1,
                description: 'this is a test'
            },
            query: {
                tenantId: '63cad6d93a030b12787ce843'
            }
        };
        console.log('req:', req);
        res = {
            status: function () {
                return this;
            },
            json: function () {

            }
        };
        console.log('res:', res);

        reviewController.createReview(req, res, () => { }).then(savedUser => {
            console.log("savedUser:" , savedUser);
            expect(savedUser).to.have.property('reviews');
            expect(savedUser.reviews).to.have.length(1);
            done();
        });

    });

    // it('should throw an error with statusCode 401 if the requested review does not exist', function (done) {
    //     const req = {
    //         params: {
    //             revId: '63cea77f620ad3414009ce69'
    //         }
    //     };
    //     reviewController.getReview(req, {}, () => { }).then(result => {
    //         expect(result).to.be.an('error');
    //         expect(result).to.have.property('statusCode', 401);
    //         done();
    //     });

    // });


    // it('Should send a response with a statusCode 200 and a valid review , when succesfuly feched a review', function (done) {
    //     const req = {
    //         params: {
    //             revId: '63cea77f620ad3414009ce69'
    //         }
    //     };
    //     const res = {
    //         status: function () {
    //             return this;
    //         },
    //         json: function () {
    //             this.review = review;
    //         }
    //     };

    //     reviewController.getReview(req, res, () => { }).then(() => {
    //         expect(res.status).to.be.equal(200);
    //        // expect(res).to.have.property('review');
    //         done();
    //     });
    // });

    //  it('Should send a response with a 200 status code and reviews', function(){});
    //  it('Should throw an error when a user in not authorized to update another users reviews', function(){});
    //  it('Should send a response with a 200 status code when succesfuly updated',function(){});


    after(function (done) {
    //     User.deleteMany({})
    //         .then(() => {
            return mongoose.disconnect();
    //         })
    //         .then(() => {
    //             console.log("user deleted in after");
    //             done();
    //         });
     });
});


