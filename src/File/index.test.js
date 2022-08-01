const chai = require('chai')
const File = require('../File')
const contentType = require('../ContentType')
const flushContent = require('../FlushContent')
const crypto = require('crypto')
const { rm } = require('fs/promises')
const { readdirSync } = require('fs')

const folder = 'temp'

const deleteGeneratedFiles = async () => {
    const allFiles = readdirSync(folder)
        const filesPaths = allFiles
            .filter(fileName => fileName !== '.gitkeep')
            .map(fileName => folder.concat('/').concat(fileName))

        for (const path of filesPaths) {
            try {
                await rm(`${path}`)
            } catch (e) {
                console.log('File not deleted: ', path);
                console.error('Error: ', e);
            }
        }
}

describe('File', function () {

    this.afterAll(async () => {
        await deleteGeneratedFiles()
    })

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

        const sut = new File({ folder, name: fileName, contentType: contentType.JSON })
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

    it("should not append data when file not exists", async () => {
        const fileName = `append-data-${Date.now()}`
        const expected = {
            fileCreated: false,
            appendContent: {
                name: 'Daniela'
            },
            result: { error: new Error('File not exists!') }
        }

        const sut = new File({ folder, name: fileName, contentType: contentType.JSON })

        const streamContent = flushContent(
            flush => {
                const data = expected.appendContent
                flush(data)
            }
        )

        const result = await sut.append(streamContent)

        chai.expect(result).to.have.all.keys(expected.result)
        chai.expect(JSON.stringify(result)).to.deep.equal(JSON.stringify(expected.result))
    })
})
