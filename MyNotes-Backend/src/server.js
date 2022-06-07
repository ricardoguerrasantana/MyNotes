import express from "express"
import bodyParser from "body-parser"
import { MongoClient } from "mongodb"

const app = express()

app.use(bodyParser.json())

// Set up the database and pass down a callback to perform operations on it.
const withDatabase = async (operations, res) => {
    try {
        // Connection URI
        const uri = "mongodb://localhost:27017"
        const db = "my-notes"
        // Create a new MongoClient
        const client = new MongoClient(uri)
        // Connect the client to the server
        await client.connect()
        // Retrieve specified database from client
        const database = client.db(db)
        // Callback that contains all the operations to perform on the database
        await operations(database)

        client.close()
    } catch (error) {
        res.status(500).json({ message: "Error connecting to db", error })
    }
}

// Setup a collection and pass down a callback to perform operations on it.
const withCollection = async (operations, res, collectionName) => {
    // Callback that retrieve an specified collection from the given database,
    // and pass down a callback to perform operations on this collection.
    const collectionOperation = async (database) => {
        // Retrieve specified collection from database
        const collection = database.collection(collectionName)
        // Callback that contains operations to perform on retrieved collection
        await operations(collection)
    }
    // Insert operations to perform on the database
    await withDatabase(collectionOperation, res)
}

// Setup notes collection and pass down a callback to perform operations on it.
const withNotesCollection = async (operations, res) => {
    // Provided operations are now redefined as notes collection specific operations.
    const notesCollectionOperations = operations
    // Specify collection to work with and insert operations to perform on it.
    await withCollection(notesCollectionOperations, res, "notes")
}

// GET request - Retrieve a note by title
app.get("/api/notes/:title", async (req, res) => {
    const { title } = req.params
    // Callback to define all the operations to perform on notes collection
    const notesCollectionOperations = async (collection) => {
        const note = await collection.findOne({ title })

        res.status(200).json(note)
    }
    // Perform operations on notes collection
    await withNotesCollection(notesCollectionOperations, res)
})

// Retrieve all notes
app.get("/api/notes", async (req, res) => {
    withNotesCollection(async (collection) => {
        const notes = await collection.find({})

        res.status(200).json(notes)
    }, res)
})
// POST request - Update lines note by title
app.post("/api/notes/:title", async (req, res) => {
    const { title } = req.params
    const { historyLines } = req.body

    withNotesCollection(async (collection) => {
        const note = await collection.findOne({ title })

        if (historyLines) {
            await collection.updateOne(
                { title },
                {
                    $set: { historyLines: note.historyLines.concat(historyLines) },
                }
            )
        }
        
        const updatedNote = await collection.findOne({ title })
        res.status(200).json(updatedNote)
    }, res)
})

const port = 8000
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
