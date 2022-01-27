
const bodyParser = require("body-parser");
const {graphqlHTTP} = require("express-graphql");
// const graphqlSchema = require("../schema");
const express = require('express')

module.exports = function (app) {

    // require('./mongoDb')
    // require('./corsHandle')(app)
    // require('./errorHandle')(app)

    // app.use(express.static(process.env.CHAT_FILES_UPLOAD_PATH))

    app.use(bodyParser.json())

    // app.use('/graphql'/*, graphqlRoute*/, graphqlHTTP({
    //     schema: graphqlSchema,
    //     graphiql: true//process.env.NODE_ENV === 'development'
    // }))

}

