const chai = require('chai')

const sut = require('../FlushContent')
describe('FlushContent', function(){
    this.timeout(Infinity)
    it('should return an error when "fn" parameter is undefined', () => {
        chai.expect(sut).to.throw('fn is not a function')
    }) 

})