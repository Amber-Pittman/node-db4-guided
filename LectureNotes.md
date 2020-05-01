# Data Modeling

### Notes

1. Data Normalization
    We organize data in a database a little bit different than we do than how we do in a JavaScript object. This takes a little bit more thought and a little bit more planning.

    * Think about how we organize data in a JS object. In JS, it makes sense to nest those animals right in the object. It makes it easier to access that way. We can just iterate over the animals. You can just call `farm.animals` and you'll have that data. But this is non-persistent data. It's not saved anywhere. It's just sitting in our memory. 

        ```
        const farm = {
            id: 1,
            name: "Lon Lon Ranch",
            animals: { "horses", "cows", "chickens"}
        }
        ```
        
    * Relational Databases are a little bit different. If we formatted SQL this way in SQLite, we'd have some serious problems. For example: duplicated data, possible data anomalies (bugs resulting from unexpected data), etc. This is why we have to create our database schemas with _normalization_ in mind. 

    * **Normalization** - the process of designing our schema in a way that prevents redundancies. The JavaScript object above is considered _denormalized_ data at the moment since the list of animals is embedded right into the farm object. If we wanted to define another farm and also give it the same animals, we'd have to duplicate those string values. 

        ```
        const farm = {
            id: 1,
            name: "Lon Lon Ranch",
            animals: { "horses", "cows", "chickens"}
        }
        
        const farm2 = {
            id: 1,
            name: "Morton Ranch",
            animals: {"cows", "chickens"} // denormalized
        }
        ```

    * Guidelines for Data Normalization

        * No field value should be repeated

        * No redundant records - no 2 rows should be exactly the same

        * Each record has a unique primary key

        * All fields in a table should relate to the primary key (to the table itself)

            * You shouldn't have columns in a table that is not specific to that one resource

            * For example, animals don't exist _only_ in the context of a farm. They can also exist outside in the wild. That being the case, it doesn't make sense for our farms table to store information about animals (because animals don't directly relate to a farm).

    * Let's look at this from the viewpoint of the database. How would we organize those farm objects in SQLite?

        * The table below is just kind of mimicking the JavaScript object. This table is considered denormalized (at the moment). Since we're storing this list of animals directly in the farms table.

        ```
        // Table: farms

        id      name            animals
        ----------------------------------------------------

        1       Lon Lon Ranch   horses, chickens, cows
        ```

        * How would we normalize this data? Move the animals into its own table. Then we would use foreign keys to point back to the farms table.

        ```
        // Table: farms

        id      name            animals
        ----------------------------------------------------

        1       Lon Lon Ranch   horses, chickens, cows


        // Table: animals

        id      name        farm_id
        ------------------------------

        1       horses      1
        2       chickens    1
        3       cows        1
        ```

        * We're getting there in terms of normalizing our data. But, there's still a problem. Both the animal name and the farm_id are repeating. If you think about the data, you can have the same type of animals on several different farms.  For example, Morton Farm also has chickens and cows. Those two animals are redundant.
        
        ```
        // Table: farms

        id      name            animals
        ----------------------------------------------------

        1       Lon Lon Ranch   horses, chickens, cows
        2       Morton Farm     chickens, cows


        // Table: animals

        id      name        farm_id
        ------------------------------

        1       horses      1
        2       chickens    1
        3       cows        1
        4       chickens    2       // redundant
        5       cows        2       // redundant
        6       pigs        2
        ```

        * What if you needed to rename the string value of chickens to hens later down the line? We could write a SQL query that updates all the rows in the animals table with a WHERE statement. What if that query got cut short and only updated some of the rows but not others? It would create out of sync data (data anomalies).
        
        ```
        // Table: animals

        id      name        farm_id
        ------------------------------

        1       horses      1
        2       chickens    1       // not updated --- data anomaly
        3       cows        1
        4       hens        2       // updated
        5       cows        2       // redundant --- data anomaly
        6       pigs        2
        ```

        * How would we go a step further to prevent this data anomaly from happening? We would create a _third table_. 

            * This new, third table is going to act like a go between, between the farms table and the animals table. 

            * This way, we don't need the farms id in the animal table anymore. 

            * We can also remove the animals from the farms table. 

            * In order to associate an animal with a farm, we create a new entry in the third table, this go-between. We put in the farm_id and the animal_id. It associates that animal with that farm. 

            * This is an example of a **_Many-to-Many Relationship_**.

        ```
        // Table: farms

        id      name   
        ------------------------

        1       Lon Lon Ranch  
        2       Morton Farm     


        // Table: animals

        id      name   
        ------------------------

        1       horses 
        2       chickens 
        3       cows     
        4       hens 
        5       cows     
        6       pigs     


        // Table: farms_animals

        farm_id     animal_id
        ------------------------

        1           1   // LLR has horses
        1           2   // LLR has chickens
        1           3   // LLR has cows
        2           1   // MF has horses
        2           4   // MF has hens
        2           6   // MF has pigs
        ```

 
2. 3 Different Relationship Types
    Since we're working with relational DBMS, obviously tables can have relationships to other tables.      

    * **One-to-One Relationships** - Table A can only link to a single row in Table B and vice versa. It's usually only useful for splitting up tables that have a ton of columns. 
        
        * Example: Let's say our farms table also has a column called revenue for tracking the revenue of that farm. We split that revenue value out into another table. The new revenue table would link back to the farm table with the farm_id column, creating a one-to-one relationship.
        
        ```
        // Table: farms

        id      name            revenue  
        ----------------------------------------

        1       Lon Lon Ranch   56000
        2       Morton Farm     142600

        // Table: revenue

        id      revenue     farm_id
        ----------------------------------------

        1       56000       1
        2       142600      2
        ```


    * **One-to-Many Relationships** - Our 3-table example above is a bit more complicated because a farm can have many different animal types and the animal types can be found on many different farms. It's no longer that uni-directional relationship.

    * **Many-to-Many Relationships** -


3. Schema Design

4. Implement Schema 