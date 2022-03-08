const crypto = require('crypto')
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

    async create(createContent) {
        // const buff = Buffer.from( content, 'utf-8')
        await this.#write(createContent)  
    }

    async #write( createContent ){
        const fileExtension = this.extension
        const readableStream = Readable({
            read(){
                // when is not a buffer
                //const flush = (data) => this.push(JSON.stringify(data), 'utf-8')
                
                // when is a buffer                
                const flush = (data) => { 
                    const content = fileExtension === BINARY ? data : JSON.stringify(data)
                    const encoding = fileExtension === BINARY ? undefined : 'utf-8'
                    this.push(content, encoding)
                }

                if(createContent){
                    createContent(flush)                    
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