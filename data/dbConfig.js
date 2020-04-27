require('dotenv').config()

const knex = require('knex')
const env = process.env.DB_ENV || "development"
const knexConfig = require("../knexfile")[env]

module.exports = knex(knexConfig)