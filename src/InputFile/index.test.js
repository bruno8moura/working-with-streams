const chai = require('chai')
const InputFile = require('../InputFile')

const folder = 'temp'
describe('InputFile', function() {
    this.timeout(Infinity)
        
    it('should create empty file', async () => {
        const fileName = `emptyfile-${Date.now()}`
        const expected = {
            file: {
                created: true
            }
        }

        const inputFile = new InputFile({folder, name: fileName})
        await inputFile.create()

        chai.assert((await inputFile.exists()) === expected.file.created)
    })

    it('should delete file', async () => {
        const fileName = `big.file-${Date.now()}`
        const expected = {
            fileCreated: true,
            fileDeleted: true
        }
        
        const inputFile = new InputFile( { folder, name: fileName } )
        
        await inputFile.create()        
        chai.assert((await inputFile.exists()) === expected.fileCreated)
        
        await inputFile.delete()
        chai.assert((!await inputFile.exists()) === expected.fileDeleted)
    })
})