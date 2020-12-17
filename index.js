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
	res.json({ info: 'The horoscope API reference for your apps and website.' })
})

app.get('/random', async function (req, res) {
	// Handle wrong sign name
	let correctSigns = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces', 'all']
	let correctSign = correctSigns.includes(req.query.sign)
	if (correctSign === false) {
		return res.status(400).json({ errorCode: 400, error: 'Invalid astrological sign.' })
	}

	// Default number is 1 and max is 100.
	let number = req.query.number === undefined ? 1 : req.query.number
	number = req.query.number > 100 ? 100 : number

	// Handle request with 'all' sign possibility
	let data = []
	try {
		let signs = req.query.sign === 'all' ? ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'] : [req.query.sign]
		for (const _sign of signs) {
			let response = await knex.raw(`SELECT uuid, horoscope, sign FROM horoscopes  WHERE sign = '${_sign}' ORDER BY random() LIMIT ${number}`)
			data.push(response.rows[0])
		}
		for (let i = 0; i < signs.length; i++) {}
	} catch (err) {
		return res.status(400).json(err)
	}
	return res.status(200).json(data)
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
