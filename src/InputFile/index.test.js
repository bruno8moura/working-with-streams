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

    it('should create a file with content', async () => {
        const fileName = `filewithcontent-${Date.now()}`
        const expected = {
            file: {
                created: true                
            }
        }

        const createContent = (flush) => () => {
            for (let index = 0; index < 1e5; index++) {
                const person = { id: Date.now() + index, name: `Bruno-${index}`}
                const data = JSON.stringify(person)
                flush(data)
            }
        }

        const inputFile = new InputFile({folder, name: fileName})
        await inputFile.create(createContent)

        chai.assert((await inputFile.exists()) === expected.file.created)
    })

    it('should delete file', async () => {
        const fileName = `must-be-deleted-${Date.now()}`
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