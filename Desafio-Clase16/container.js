class Container {
    constructor(knex, table) {
        this.knex = knex
        this.table = table
    }

    //------------> Guarda un producto

    async save(object) {
        try {
            await this.knex(this.table).insert(object);
            return {message: 'Producto agregado'};
        } catch (error) {
            console.log (`Error al guardar el producto ${error}`);
        }
    }

    //------------> Busca un producto pot id

    async getById(id) {
        try {
            let product = await this.knex.from(this.table).select('*');
            return product[0];
        } catch (error) {
            console.log (`Error al buscar el producto ${error}`);
        }
    }

    //------------> Devuelve todos los productos

    async getAll () {
        try {
            let products = await this.knex.from(this.table).select('*');
            return products;
        } catch (error) {
            console.log (`Error al buscar los productos ${error}`);
        }
    }

    //------------> Actualiza un producto

    async upDateById(id, product) {
        try {
            await this.knex.from(this.table)
                            .where({id: id})
                            .update({...product});
            return {message: 'Producto actualizado'};
        } catch (error) {
            console.log(`Error al actualizar el producto: ${error}`)
        }
    }

    //------------> Elimina un producto

    async deleteById(id) {
        try {
            await this.knex.from(this.table).where({id: id}).del();
            return {message: 'producto eliminado'}
        } catch (error) {
            console.log(`Error al eliminar el producto: ${error}`)
        }
    }

    //------------> Elimina todos los productos

    async deleteAll() {
        try {
            await this.knex.from(this.table).del();
            return {message: 'Todos los productos eliminados'};
        } catch (error) {
            console.log(`Error al eliminar el producto: ${error}`)
        }
    }
}


module.exports = {Container};