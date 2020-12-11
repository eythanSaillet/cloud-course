const express = require('express')
const app = express()
const port = 3000
app.use(express.json())

// Connect to the database
const knex = require('knex')({
	client: 'pg',
	connection: {
		host: 'localhost',
		port: 5432,
		user: 'test',
		password: 'test',
		database: 'postgres',
		// ssl: { rejectUnauthorized: false },
	},
})

// Setup routes

app.get('/', async function (req, res) {
	res.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/users', async function (req, res) {
	return knex
		.select(['name', 'age'])
		.from('users')
		.then((users) => {
			return res.status(200).json(users)
		})
		.catch((err) => {
			return res.status(400).json(err)
		})
})

app.get('/users/:user_id', async function (req, res) {
	return knex
		.select(['name', 'age'])
		.from('users')
		.where('id', req.params.user_id)
		.then((user) => {
			return res.status(200).json(user)
		})
		.catch((err) => {
			return res.status(400).json(err)
		})
})

app.post('/users', async function (req, res) {
	console.log(req.body)

	return knex
		.insert({
			name: req.body.name,
			age: req.body.age,
		})
		.into('users')
		.then((user) => {
			return res.status(201).json(user)
		})
		.catch((err) => {
			return res.status(400).json(err)
		})
})

app.listen(port, () => {
	console.log(`App running on port ${port}.`)
})
