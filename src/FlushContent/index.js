const flushContent = fn => {
    if(!fn) throw new Error("fn is not a function")

    return flush => fn(flush)    
}

module.exports=flushContent
