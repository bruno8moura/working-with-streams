const { rm } = require('fs/promises')
const fs = require('fs')

const { promisify } = require('util')
const { Readable, pipeline } = require('stream')
const pipelineAsync = promisify(pipeline)
const NUMBER = require('../constants/NUMBER')
const { BINARY } = require('./contentType')
class File {
    constructor({ folder, name, contentType = BINARY }) {
        this.name = name
        this.folder = folder
        this.size = NUMBER.ZERO_BIGINT
        this.filePath = `${this.folder}/${this.name}`
        this.contentType = contentType
    }

    async create(streamContent) {
        await this.#write(streamContent)
    }

    async #write(streamContent, append=false) {
        const flags = append ? 'a' : 'w'
        const fileContent = this.contentType
        const readableStream = Readable({
            read() {
                if (streamContent) {
                    const flush = (data) => {
                        const content = fileContent === BINARY ? data : JSON.stringify(data)
                        const encoding = fileContent === BINARY ? undefined : 'utf-8'
                        this.push(content, encoding)
                    }

                    streamContent(flush)
                }

                const finished = null
                this.push(finished)
            }
        })

        await pipelineAsync(
            readableStream,
            fs.createWriteStream(this.filePath, { flags })
        )
    }

    async length() {
        try {
            const { size } = fs.statSync(this.filePath)
            return size
        } catch (error) {
            // implement logs
        }

        const fileNotExists = undefined
        return fileNotExists
    }

    async exists() {
        return fs.existsSync(this.filePath)
    }

    async delete() {
        await rm(this.filePath)
    }

    async append(streamContent) {
        const append = await this.exists() ? true : false
        await this.#write(streamContent, append)
    }
}

module.exports = File