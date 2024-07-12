import express from 'express'

const app = express()
const port = 3000

app.use(express.json())

app.post('/webhook', (req, res) => {
	const payload = req.body

	console.log('Received webhook:', payload)

	res.status(200).send('Webhook received')
})

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`)
})
