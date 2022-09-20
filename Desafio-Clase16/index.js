const express = require('express');
const app = express();
const handlebars = require("express-handlebars");

const {options: optionsMariaDB} = require('./options/mariaDB')
const {options: optionsSQLite} = require ('./options/sqlite3');

const knexMariaDB = require('knex')(optionsMariaDB)
const knexSQLite = require ('knex')(optionsSQLite)


const {Server : HttpServer} = require('http');
const {Server : IOServer} = require ('socket.io');
const httpServer = new HttpServer(app);
const io = new IOServer (httpServer);

const {Container} = require('./container');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))
const PORT = 8080 || process.env.PORT;

const containerMensajes = new Container(knexSQLite, 'messages')
const containerProducts = new Container(knexMariaDB, 'products');

app.set("view engine", "hbs");
app.set("views", "./views/layouts");


app.engine(
	"hbs",
	handlebars.engine({
		extname: ".hbs",
		defaultLayout: "index.hbs",
		layoutsDir: __dirname + "/views/layouts",
		partialsDir: __dirname + "/views/partials"
	})
);

app.get("/", async (req, res) => {
	const producto = await containerProducts.getAll();
	res.render("products", {
		list: producto,
		listExist: true,
		producto: true
	});
});

app.get("/productos", async (req, res) => {
	const producto = await containerProducts.getAll();
	res.render("products", {
		titulo: "todos los productos",
		list: producto,
		listExist: true,
		producto: true
	});
});

app.post("/productos", async (req, res) => {
	const producto = req.body;
	containerProducts.save(producto);
	const listExist = true;
	res.redirect("/productos");
});

//------ web sockets ------


io.on('connection', async socket => {
	let chat = await containerMensajes.getAll();
	console.log('a user connected');
	const mensaje = {
		mensaje: 'ok',
		chat
	};

	socket.emit('mensaje-server', mensaje);

	socket.on('mensaje-nuevo', async (mens) => {
		if (mens.email !== '') {
			chat.push(mens)
			const mensaje = {
				mensaje: "nuevo mensaje",
				chat
			}
			io.sockets.emit('mensaje-server', mensaje);
			await containerMensajes.save(mens)
		} else {
			console.log('email vacio')
		}
	})
});

httpServer.listen(8080, err => {
    if(err) throw new Error (`Error on server: ${err}`);
    console.log(`Server is running on port: ${PORT}`);
})
