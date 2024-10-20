const mongoose = require("mongoose")

async function connectToMongoDb(url) {
    return mongoose.connect(url)
    .then(() => {
        console.log("connected to database");
    })
    .catch((err) => {
        console.log("error in database", err);
    });
}

module.exports = {
    connectToMongoDb,
}