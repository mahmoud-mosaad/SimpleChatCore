
const fs = require('fs')
const app = require('express')()

require('dotenv').config()
require('./config')(app)
require('./routes')(app)

const server = app.listen(3000, function() {
    console.log('server running on port 3000')
})

require('./socket')(server)
