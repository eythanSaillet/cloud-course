const express = require('express')
const app = express()
const port = 3000

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

app.get('/', async function (req, res) {
	res.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/users', async function (req, res) {
	return knex
		.select('*')
		.from('users')
		.then((rows) => {
			// console.log(rows)
			return res.status(200).json(req)
		})
		.catch((err) => {
			// console.log(err)
			return res.status(400).json(err)
		})
})

app.listen(port, () => {
	console.log(`App running on port ${port}.`)
})
