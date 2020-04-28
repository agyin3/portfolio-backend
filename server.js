const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const server = express()
const Router = require('./components/routers.js')

server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.use(cors())
server.use(helmet())
server.use('/', Router)

server.get('/', (req, res) => {
    res.send("IT IS ALIVE!")
})

module.exports = server
