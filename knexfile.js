// Update with your config settings.

module.exports = {

  development: {
    client: "pg",
    connection: {
      host: "127.0.0.1",
      user: 'postgres',
      password: process.env.PGPASSWORD,
      database: 'portfolio',
    },
    migrations: {directory: "./data/migrations"}
  },

  staging: {
    client: "pg",
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {directory: "./data/migrations"}
  },

  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {directory: "./data/migrations"}
  }

};
