exports.up = function(knex) {
  return knex.schema.table('projects', projects => {
      projects.string('description')
      projects.string('languages')
  })
};

exports.down = function(knex) {
  return knex.schema.table('projects', projects => {
      projects.dropColumn('description')
      projects.dropColumn('languages')
  })
};
