
exports.up = async function(knex) {
    await knex.schema.createTable("zoos", (table) => {
        table.increments("id")
        table.text("name").notNull()
        table.text("address").notNull().unique()
    })

    await knex.schema.createTable("species", (table) => {
        table.increments("id")
        table.text("name").notNull().unique()
    })

    await knex.schema.createTable("animals", (table) => {
        table.increments("id")
        table.text("name").notNull().unique()
        table.integer("species_id")
            .references("id")
            .inTable("species")
            .onDelete("SET NULL")
    })

    await knex.schema.createTable("zoos_animals", (table) => {
        table.integer("zoo_id")
            .references("id")
            .inTable("zoos")
            .onDelete("CASCADE)
        table.integer("animal_id")
            .references("id")
            .inTable("animals")
            .onDelete("CASCADE)
        table.date("from_date").defaultTo(knex.raw("current_timestamp"))
        table.date("to_date")
        table.primary(["zoo_id", "animal_id"])
    })
}

exports.down = async function(knex) {
    await knex.schema.dropTableIfExists("zoos_animals")
    await knex.schema.dropTableIfExists("animals")
    await knex.schema.dropTableIfExists("species")
    await knex.schema.dropTableIfExists("zoos")
}