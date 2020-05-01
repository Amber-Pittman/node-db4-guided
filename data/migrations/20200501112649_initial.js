
exports.up = async function(knex) {
    await knex.schema.createTable("zoos", (table) => {
        table.increments("id")
        table.text("name").notNull()
        table.text("address").notNull().unique()
    })

    await knex.schema.createTable("animals", (table) => {
        table.increments("id")
        table.text("name").notNull().unique()
        table.integer("species_id").references("id").inTable("species").notNull().unique()
    })
}

exports.down = async function(knex) {
    await knex.schema.dropTableIfExists("animals")
    await knex.schema.dropTableIfExists("zoos")
}