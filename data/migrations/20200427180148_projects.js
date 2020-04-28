
exports.up = function(knex) {
  return knex.schema.createTable('projects', projects => {
        projects.increments()
        projects
            .string('name')
            .notNullable()
        projects
            .string('url')
        projects
            .string('github')
            .notNullable()
        projects
            .boolean('favorite')
            .defaultTo(false)
        projects
            .string('image')
    
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('projects')
};
