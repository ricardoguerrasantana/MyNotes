import express from 'express'

const app = express()

app.get("/hello", (req, res) => res.send("Hello!"))
app.post("/hello", (req, res) => res.send("Hello!"))

const port = 8000
app.listen(port, () => {console.log(`Listening on port ${port}`)})
