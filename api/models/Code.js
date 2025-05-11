const mongoose = require("mongoose")

const CodeSchema = new mongoose.Schema({
    description: String,
    code: String,
    language: String,
    created_at: Date,
    modified_at: Date,
    tags: Array
})

const Code = mongoose.model('Code', CodeSchema)

module.exports = { Code }