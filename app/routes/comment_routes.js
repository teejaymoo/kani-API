const express = require('express')
const router = express.Router()
const Issue = require('../models/issue')
const { handle404 } = require('./../../lib/custom_errors')
const passport = require('passport')
const requireToken = passport.authenticate('bearer', { session: false })

router.post('/blogposts/:id', requireToken, (req, res, next) => {
  const commentData = req.body.comment
  const issueId = req.params.id
  Issue.findById(issueId)
    .then(handle404)
    .then(issue => {
      issue.comments.push(commentData)
      return issue.save()
    })
    .then(issue => res.status(201).json({ issue }))
    .catch(next)
})

module.exports = router
