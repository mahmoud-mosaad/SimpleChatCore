
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_DSN || 'mongodb://localhost', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var mongoDb = mongoose.connection;

mongoDb.on('error', console.error.bind(console, 'connection error:'));

mongoDb.once('open', function callback () {
    console.log("MongoDB Connected...");
});

module.exports = mongoDb
