require('dotenv').config()

const express = require('express')
const app = express()
const port = process.env.PORT || 3000
app.use(express.json())

// Connect to the DB
const knex = require('knex')({
	client: 'pg',
	connection: {
		connectionString: process.env.DATABASE_URL,
	},
})

// Random seed lib
let rand = require('random-seed').create()

// Setup routes

app.get('/', function (req, res) {
	res.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/horoscopes/:sign', function (req, res) {
	knex.raw(`SELECT uuid, horoscope, sign FROM horoscopes  WHERE sign = '${req.params.sign}' ORDER BY random() LIMIT 1`)
		.then((data) => {
			console.log(data)
			return res.status(200).json(data.rows)
		})
		.catch((err) => {
			console.log(err)
			return res.status(400).json(err)
		})
})

app.get('/horoscopes/:sign/:number', function (req, res) {
	knex.raw(`SELECT uuid, horoscope, sign FROM horoscopes  WHERE sign = '${req.params.sign}' ORDER BY random() LIMIT ${req.params.number}`)
		.then((data) => {
			console.log(data)
			return res.status(200).json(data.rows)
		})
		.catch((err) => {
			console.log(err)
			return res.status(400).json(err)
		})
})

app.get('/today', async function (req, res) {
	let data
	try {
		data = await knex.raw(`SELECT COUNT(*) FROM horoscopes`)
	} catch (err) {
		return res.status(400).json(err)
	}

	let numberOfLines = data.rows[0].count
	let date = new Date()
	let seed = `${date.getDate()}${date.getMonth() + 1}${date.getFullYear()}`
	rand.seed(seed)
	let key = rand(numberOfLines)

	let results
	try {
		results = await knex.raw(`SELECT uuid, horoscope, sign FROM horoscopes WHERE id = ${key}`)
	} catch (err) {
		console.log(err)
		return res.status(400).json(err)
	}
	return res.status(200).json(results.rows)
})

app.listen(port, () => {
	console.log(`App running on port ${port}.`)
})
