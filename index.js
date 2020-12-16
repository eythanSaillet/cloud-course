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

// Setup routes

app.get('/', async function (req, res) {
	res.json({ info: 'Node.js, Express, and Postgres API' })
})

// app.get('/:sign', async function (req, res) {
// 	knex.raw(`SELECT horoscope FROM horoscopes WHERE sign = ${req.params.sign} LIMIT 10`)
// 		.then((sign) => {
// 			return res.status(200).json(sign)
// 		})
// 		.catch((err) => {
// 			return res.status(400).json(err)
// 		})
// })

app.get('/:sign', async function (req, res) {
	return (
		knex
			// // .raw(
			// // 	`
			// // 	SELECT setseed(0.6);
			// // 	SELECT uuid, horoscope, sign FROM horoscopes WHERE sign ='${req.params.sign}' ORDER BY random() LIMIT 1`
			// // )
			// .raw(
			// 	`SELECT setseed(0.6);
			// 	SELECT random()`
			// )
			.raw(`SELECT * FROM horoscopes`)
			.then((data) => {
				console.log(req)
				return res.status(200).json(data)
			})
			.catch((err) => {
				console.log(err)
				return res.status(400).json(err)
			})
	)
})

// 	return knex
// 		.insert({
// 			name: req.body.name,
// 			age: req.body.age,
// 		})
// 		.into('users')
// 		.then((user) => {
// 			return res.status(201).json(user)
// 		})
// 		.catch((err) => {
// 			return res.status(400).json(err)
// 		})
// })

app.listen(port, () => {
	console.log(`App running on port ${port}.`)
})
