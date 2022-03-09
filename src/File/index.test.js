const chai = require('chai')
const File = require('../File')
const contentType = require('./contentType')
const flushContent = require('./flushContent')
const crypto = require('crypto')

const folder = 'temp'
describe('File', function () {
    this.timeout(Infinity)

    it('should create empty file', async () => {
        const fileName = `emptyfile-${Date.now()}`
        const expected = {
            file: {
                created: true
            }
        }

        const file = new File({ folder, name: fileName })
        await file.create()

        chai.assert((await file.exists()) === expected.file.created)
    })

    it('should create a file with content', async () => {
        const fileName = `filewithcontent-${Date.now()}`
        const expected = {
            file: {
                created: true
            }
        }

        const streamContent = flushContent(
            flush => {
                for (let index = 0; index < 1e5; index++) {
                    const person = { id: Date.now() + index, name: `Bruno-${index}` }
                    flush(person)
                }
            }
        )

        const file = new File({ folder, name: fileName, contentType: contentType.JSON })
        await file.create(streamContent)

        chai.assert((await file.exists()) === expected.file.created)
    })

    it('should delete file', async () => {
        const fileName = `must-be-deleted-${Date.now()}`
        const expected = {
            fileCreated: true,
            fileDeleted: true
        }

        const file = new File({ folder, name: fileName })

        await file.create()
        chai.assert((await file.exists()) === expected.fileCreated)

        await file.delete()
        chai.assert((!await file.exists()) === expected.fileDeleted)
    })

    it("should return undefined when there isn't a file", async () => {
        const fileName = `file-not-exists-${Date.now()}`

        const file = new File({ folder, name: fileName })

        chai.expect((await file.length())).to.be.deep.equal(undefined)

    })

    it("should return 'false' when file not exists", async () => {
        const fileName = `file-not-exists-${Date.now()}`
        const expected = false
        const file = new File({ folder, name: fileName },)

        chai.expect((await file.exists())).to.be.deep.equal(expected)

    })

    it("should return file size when there is a very large file", async () => {
        const fileName = `big-file-${Date.now()}`

        const streamContent = flushContent(
            flush => {
                for (let index = 0; index < 3; index++) {
                    const _1gb_data = crypto.randomBytes(1e9)
                    flush(_1gb_data)
                }
            }
        )

        const file = new File({ folder, name: fileName })
        await file.create(streamContent)

        chai.expect((await file.length())).to.be.deep.equal(3000000000)
    })

    it("should append data into an existing file", async () => {
        const fileName = `append-data-${Date.now()}`
        const expected = {
            fileCreated: true,
            firstContent: {
                name: 'Bruno'
            },
            secondContent: {
                name: 'Daniela'
            }
        }

        const streamContent1 = flushContent(
            flush => {
                const data = expected.firstContent
                flush(data)
            }
        )

        const sut = new File({ folder, name: fileName, contentType: contentType.JSON})
        await sut.create(streamContent1)

        const lenghtBeforeCustom = await sut.length()
        chai.expect((await sut.exists())).to.be.deep.equal(expected.fileCreated)

        const streamContent2 = flushContent(
            flush => {
                const data = expected.secondContent
                flush(data)
            }
        )
        await sut.append(streamContent2)
        chai.expect((await sut.exists())).to.be.deep.equal(expected.fileCreated)

        const lenghtAfterCustom = await sut.length()
        chai.expect(lenghtAfterCustom).to.be.greaterThan(lenghtBeforeCustom)
    })
})