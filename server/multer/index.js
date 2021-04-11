const path = require('path')
const multer = require('multer')

// const storage = multer.MemoryStorage({
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
//     }
// })
const upload = multer({
    // storage,
    limits: { fileSize: 1000000 },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb)
    }
})


const checkFileType = (file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/
    const extname = fileTypes.test(path.extname(file.originalname.toLowerCase()))
    const mimeTypes = fileTypes.test(file.mimetype)
    if(extname && mimeTypes) return cb(null, true)
    return cb('Error: Images only')
}


module.exports = upload