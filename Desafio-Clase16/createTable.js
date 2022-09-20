const {options: optionsMariaDB} = require ('./options/mariaDB');
const {options: optionsSQLite} = require ('./options/sqlite3');

const knexMariaDB = require ('knex')(optionsMariaDB);
const knexSQLite = require ('knex')(optionsSQLite);
const products = [{
    "title": "Juice - Ocean Spray Kiwi",
    "price": 24.69,
    "image": "https://www.lechepuleva.es/documents/13930/203222/kiwi_g.jpg",
}]

const tableProducts = 'products';

const createMariaDB = async ()=> {
    try {
        console.log('------ Borrando datos existentes ------')
        await knexMariaDB.schema.dropTableIfExists(tableProducts);

        console.log('------ Creando tabla de productos ------')
        await knexMariaDB.schema.createTable(tableProducts, table => {
            table.increments('id');
            table.string('title');
            table.float('price');
            table.string('image');
        })

        console.log('------ Insertando productos ------');
        await knexMariaDB(tableProducts).insert(products);
    } catch (error) {
        console.log(`------ Error al crear la tabla ------`)
    } finally {
        knexMariaDB.destroy();
    }
}

const messages = [
  {
    "email": "minimalposadas@gmail.com",
    "hora": "23:43:36",
    "msg": "hola"
  }
]

const tableMessages = 'messages'

const createSQLite = async () => {
    try {
        console.log('------ Borrando datos existentes ------')
        await knexSQLite.schema.dropTableIfExists(tableMessages);
    
        console.log('------ Creando tabla de mensajes ------')
        await knexSQLite.schema.createTable(tableMessages, table => {
            table.increments('id');
            table.string('email');
            table.string('hora');
            table.string('msg');
        })
    
        console.log('------ Insertando mensajes ------')
        await knexSQLite(tableMessages).insert(messages);
    } catch (error) {
        console.log(error);
    } finally {
        knexSQLite.destroy();
    }

}

createMariaDB();
createSQLite();