const expect = require('chai').expect
const jwt = require('jsonwebtoken')
const sinon = require('sinon')

const authMiddleware = require('../../middleware/is-auth')

describe('Auth Middleware', function () {

    it('Should throw an error if no authorization is present', function () {
        const req = {
            get: function (headerName) {
                return null
            }
        }
        expect(authMiddleware.bind(this, req, {}, () => { })).to.throw('Not authenticated.')
        // bind--when the middleware gets called , we are not calling by ourselves ,
        //we are just preparing  it to be called .
    })

    it('Should throw an error if the authorization header is only one string', function () {
        const req = {
            get: function (headerName) {
                return 'xyz'
            }
        }
        expect(authMiddleware.bind(this, req, {}, () => { })).to.throw()
    })

    it('Should throw an error if the token can not be verified', function () {
        const req = {
            get: function (headerName) {
                return 'Bearer xyz';
            }
        }
        expect(authMiddleware.bind(this, req, {}, () => { })).to.throw()
    })

    it('Should yield a userId after decoding the token', function () {
        const req = {
            get: function (headerName) {
                return 'Bearer djfkalsdjfaslfjdlas';
            }
        }
        sinon.stub(jwt, 'verify')
        jwt.verify.returns({ userId: 'abc' })
        authMiddleware(req, {}, () => { })
        expect(req).to.have.property('userId')
        expect(req).to.have.property('userId', 'abc')
        expect(jwt.verify.called).to.be.true
        jwt.verify.restore()
    })
})