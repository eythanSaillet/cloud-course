const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
	res.send('Hello World!')
})

app.get('/test', (req, res) => {
	// res.send('Hello World!')
	return res.status(200).json({
		hello: 'world',
	})
})

app.listen(port, () => {
	console.log(`App listening at http://localhost:${port}`)
})
