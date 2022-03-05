const chai = require('chai')
const InputFile = require('../InputFile')

const fileName = 'big.file'
describe('InputFile', function() {
    this.timeout(Infinity)
    
    it('should create file', async () => {
        const expected = true
        const inputFile = new InputFile(fileName)
        await inputFile.create()

        chai.assert((await inputFile.exists()) === expected)
    })
})