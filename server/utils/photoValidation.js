const path = require('path')

const  isPhotoValid = (fileName) => {
    const fileTypes = /jpeg|jpg|png|gif|jfif/
    const extname = fileTypes.test(path.extname(fileName.toLowerCase()))
    if(!extname) return false
    else return true
}

const isStoryValid = (fileName) => {
    const fileTypes = /jpeg|jpg|png|gif|jfif|mp/
    const extname = fileTypes.test(path.extname(fileName.toLowerCase()))
    if(!extname) return false
    else return true
}


module.exports = {
    isPhotoValid,
    isStoryValid
}


