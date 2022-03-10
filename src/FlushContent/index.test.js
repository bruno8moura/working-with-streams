const chai = require('chai')

const sut = require('../FlushContent')
describe('FlushContent', function(){
    this.timeout(Infinity)
    it('should return an error when "fn" parameter is undefined', () => {
        chai.expect(sut).to.throw('fn is not a function')
    }) 

    it('should return an error when "flush" parameter is undefined', () => {
        const fn = flush => flush
        const flushData = sut(fn)

        chai.expect(flushData).to.throw("'flush' param cannot be undefined")
    })
})