import express from 'express'
import bodyParser from "body-parser"

// Fake data base
const notes = {
    passwords: {
        updates: 0,
        items: [],
    },
    birthdays: {
        updates: 0,
        items: [],
    },
    "account-numbers": {
        updates: 0,
        items: [],
    },
}

const app = express()

app.use(bodyParser.json())

app.post("/notes/:title/update", (req, res) => {
    const { title } = req.params
    notes[title].updates += 1

    res.status(200).send(
        `${title} note is been updated ${
            notes[title].updates === 1
                ? `${notes[title].updates} time.`
                : `${notes[title].updates} time(s).`
        }`
    )
})

app.post("/notes/:id/add-item", (req, res) => {
    const id = req.params.id
    const { item } = req.body
    notes[id].items.push(item)

    res.status(200).send(notes[id])
})

const port = 8000
app.listen(port, () => {console.log(`Listening on port ${port}`)})
