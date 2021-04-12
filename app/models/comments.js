const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  response: {
    type: String
  }
}, {
  timestamps: true
})

module.exports = commentSchema
