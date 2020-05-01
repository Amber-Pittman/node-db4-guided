
exports.up = async function(knex) {
    await knex.schema.createTable("zoos", (table) => {
        table.increments("id")
        table.text("name").notNull()
        table.text("address").notNull().unique()
    })
}

exports.down = async function(knex) {
    await knex.schema.dropTableIfExists("zoos")
}