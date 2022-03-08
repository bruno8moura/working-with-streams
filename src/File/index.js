const { rm } = require('fs/promises')
const fs = require('fs')

const { promisify } = require('util')
const { Readable, pipeline } = require('stream')
const pipelineAsync = promisify(pipeline)
const NUMBER = require('../constants/NUMBER')
const { BINARY } = require('./fileType')
class File {
    constructor( { folder, name, extension=BINARY } ) {
        this.name = name
        this.folder = folder
        this.size = NUMBER.ZERO_BIGINT
        this.filePath = `${this.folder}/${this.name}`
        this.extension = extension
    }

    async create(streamContent) {
        await this.#write(streamContent)  
    }

    async #write( streamContent ){
        const fileExtension = this.extension
        const readableStream = Readable({
            read(){
                const flush = (data) => { 
                    const content = fileExtension === BINARY ? data : JSON.stringify(data)
                    const encoding = fileExtension === BINARY ? undefined : 'utf-8'
                    this.push(content, encoding)
                }

                if(streamContent){
                    streamContent(flush)                    
                }
                
                const finished = null
                this.push(finished)
            }
        })

        await pipelineAsync(
            readableStream,
            fs.createWriteStream(this.filePath)
        )
    }

    async length() {
        try {
            const {size} = fs.statSync(this.filePath)
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
}

module.exports=File