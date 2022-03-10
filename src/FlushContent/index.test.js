const chai = require('chai')

const sut = require('../FlushContent')
describe('FlushContent', function(){
    it('should return an error when "fn" parameter is undefined', () => {
        const flushData = sut()

        chai.expect(flushData).to.throw('fn is not a function')
    })
})