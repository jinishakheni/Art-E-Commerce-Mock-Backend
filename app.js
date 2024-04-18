require('dotenv').config();
const db = require("./db.json");
const jsonServer = require('json-server');
const morgan = require('morgan');

const server = jsonServer.create();

const router = jsonServer.router('db.json');

const middlewares = jsonServer.defaults();
const PORT = process.env.PORT;

server.use(middlewares);
server.use(morgan('dev'));
server.use((req, res, next) => {
	// Middleware to disable CORS
	res.header('Access-Control-Allow-Origin', '*');
	next();
});

server.use(jsonServer.bodyParser);
server.get('/arts/:id', (req, res) => {
	const { id } = req.params;
	const art = db.arts.find(art => art.id === parseInt(id));
	if (!art) {
		return res.status(404).json({ message: 'Art not found' });
	}
	const user = db.users.find(user => user.id === art.userId);
	const result = { ...art, artist: user.name, photo: user.photo, gender: user.gender };
	res.json(result);
});

server.use(router);

server.listen(PORT, () => {
	console.log(`JSON Server is running on http://localhost:${PORT}`);
});

