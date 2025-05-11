require("dotenv").config()
const express = require("express")
const http = require("http")
const mongoose = require("mongoose")
const { Code } = require("./models/Code")

const app = express()
app.use(express.json())

function mustHaveProperties(properties, obj) {
    return properties.every(prop => prop in obj && obj[prop] != "")
}

app.post('/code', async (req, res) => {
    try {
        let snippet = req.body
        if (mustHaveProperties(["code", "description", "language"], snippet)) {
            snippet.created_at = new Date()
            snippet.modified_at = new Date()
            await Code.insertOne(snippet)
            res.sendStatus(200)
        } else {
            res.status(400).json({ "error": "Missing fields code, language and description" })
        }
    } catch (e) {
        console.log(`Exception, ${e} occurred when inserting a new code snippet`)
        res.status(500).json({ "error": "Error occurred when saving snippet" })
    }
})

app.patch('/code', async (req, res) => {
    try {
        const snippet = req.body
        if (mustHaveProperties(["id"], snippet)) {
            const document = await Code.findOne({ _id: snippet.id })
            if (document == undefined) {
                res.status(404).json({ "error": "Document does not exist" })
                return
            }
            document.modified_at = new Date()
            if (mustHaveProperties(["code"], snippet))
                document.code = snippet.code

            if (mustHaveProperties(["description"], snippet))
                document.description = snippet.description

            if (mustHaveProperties(["tags"], snippet))
                document.tags = snippet.tags
            await document.save()
            res.sendStatus(201)
        } else {
            res.status(400).json({ "error": "Missing parameter id" })
        }
    } catch (e) {
        console.log(`Exception, ${e} occurred when updating a code snippet`)
        res.status(500).json({ "error": "Error occurred when updating snippet" })
    }
})

app.get('/code', async (req, res) => {
    try {
        let query = {}
        if (mustHaveProperties(["tags"], req.query)) {
            const tags = req.query.tags.split(",")
            query = { tags: { $in: tags } }
        }
        const documents = await Code.find(query).exec()
        res.json({ "codes": documents })
    } catch (e) {
        console.log(`Exception, ${e} occurred when fetching code snippets`)
        res.status(500).json({ "error": "Error occurred when fetching snippet" })
    }
})

app.patch('/tags', async (req, res) => {
    try {
        const snippet = req.body
        if (mustHaveProperties(["id", "tags", "operation"], snippet)) {
            const document = await Code.findOne({ _id: snippet.id })
            if (document == undefined) {
                res.status(404).json({ "error": "Document does not exist" })
                return
            }
            document.modified_at = new Date()
            switch (snippet.operation) {
                case "add":
                    document.tags = [...document.tags, ...snippet.tags]
                    break
                case "remove":
                    document.tags = document.tags.filter(item => item in snippet.tags)
                    break
                default:
                    res.status(400).json({ "error": `operation ${snippet.operation} is an invalid operation` })
            }
            await document.save()
            res.sendStatus(201)
        } else {
            res.status(400).json({ "error": "Missing fields id, tags and operation" })
        }
    } catch (e) {
        console.log(`Exception, ${e} occurred when updating tags`)
        res.status(500).json({ "error": "Error occurred when updating tags" })
    }
})

app.delete('/code', async (req, res) => {
    try {
        if (mustHaveProperties(["id"], req.query)) {
            const result = await Code.findByIdAndDelete(req.query.id)
            if (result != undefined) {
                res.sendStatus(204)
            } else {
                res.status(404).json({ "error": "Document does not exist" })
            }
        } else {
            res.status(400).json({ "error": "Missing field id" })
        }
    } catch (e) {
        console.log(`Exception, ${e} occurred when deleting code snippet`)
        res.status(500).json({ "error": "Error occurred when deleting code snippet" })
    }
})

const server = http.createServer(app)

server.listen(4000, "0.0.0.0", async () => {
    console.log("Server is listening on port 4000")
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Connected to mongo db")
})