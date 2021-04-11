require('dotenv').config({path: `${__dirname}/../../.env`})
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: "malachcloud",
    api_key: "376635682223394",
    api_secret: "utIx4ojEGy1cEjxfS8uEoEjbyyA",
});

module.exports = { cloudinary }
