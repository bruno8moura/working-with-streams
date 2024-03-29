const chai = require('chai')
const spies = require('chai-spies')

chai.use(spies)

const sut = require('../FlushContent')
describe('FlushContent', function(){
    it('should return an error when "fn" parameter is undefined', () => {
        chai.expect(sut).to.throw('fn is not a function')
    }) 

    it('should return an error when "flush" parameter is undefined', () => {
        const fn = flush => flush()
        const flushData = sut(fn)

        chai.expect(flushData).to.throw("'flush' param cannot be undefined")
    })

    it('should ensure "fn" is being called', () => {
        const fn = chai.spy( x => x() )
        const flushData = sut(fn)

        flushData( () => ({a:1}) )

        chai.expect(fn).to.have.been.called()
    })


    it('should ensure "fn" is being called with correct param', () => {
        const fn = chai.spy( x => x() )
        const flushData = sut(fn)

        const flush = () => ({a:1})
        flushData( flush )

        chai.expect(fn).to.have.been.called.once.with.exactly(flush)
    })
})
