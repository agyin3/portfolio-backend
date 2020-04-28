
exports.up = function(knex) {
  return knex.schema.createTable('emails', emails => {
      emails.increments()
      emails
        .string('name')
      emails
        .string('sender')
        .notNullable()
      emails
        .string('subject')
        .notNullable()
      emails
        .string('message')
        .notNullable()
      emails
        .datetime('date')
        .notNullable()
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('emails')
};
