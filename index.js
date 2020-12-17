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
	const correctSigns = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces', 'all']
	const correctSign = correctSigns.includes(req.query.sign)
	if (correctSign === false) {
		return res.status(400).json({ errorCode: 400, error: 'Invalid astrological sign.' })
	}

	// Default number is 1 and max is 100.
	let number = req.query.number === undefined ? 1 : req.query.number
	number = req.query.number > 100 ? 100 : number

	// Handle request with 'all' sign possibility
	let data = []
	try {
		const signs = req.query.sign === 'all' ? ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'] : [req.query.sign]
		for (const _sign of signs) {
			const response = await knex.raw(`SELECT uuid, horoscope, sign FROM horoscopes  WHERE sign = '${_sign}' ORDER BY random() LIMIT ${number}`)
			for (const _row of response.rows) {
				data.push(_row)
			}
		}
		for (let i = 0; i < signs.length; i++) {}
	} catch (err) {
		return res.status(400).json(err)
	}
	return res.status(200).json(data)
})

app.get('/today', async function (req, res) {
	// Handle wrong sign name
	const correctSigns = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces', 'all']
	const correctSign = correctSigns.includes(req.query.sign)
	if (correctSign === false) {
		return res.status(400).json({ errorCode: 400, error: 'Invalid astrological sign.' })
	}

	const date = new Date()

	// Handle request with 'all' sign possibility
	const signs = req.query.sign === 'all' ? ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'] : [req.query.sign]

	let data = []
	try {
		for (const _sign of signs) {
			// Count numberOfLines for specific sign
			const numberOfLines = (await knex.raw(`SELECT COUNT(*) FROM horoscopes WHERE sign = '${_sign}'`)).rows[0].count

			// Create key for specific sign according to a seed which is the date
			const seed = `${date.getDate()}${date.getMonth() + 1}${date.getFullYear()}${_sign}`
			rand.seed(seed)
			const key = rand(numberOfLines)

			// Select one line from all lines of a sign according to the seed
			results = await knex.raw(`SELECT uuid, horoscope, sign FROM horoscopes WHERE sign = '${_sign}'`)
			data.push(results.rows[key])
		}
	} catch (err) {
		return res.status(400).json(err)
	}
	return res.status(200).json(data)
})

app.listen(port, () => {
	console.log(`App running on port ${port}.`)
})
