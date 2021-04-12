const express = require('express')

const passport = require('passport')
const Issue = require('../models/issue')

const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /examples
router.get('/issues', requireToken, (req, res, next) => {
  Issue.find()
    .then(issues => {
      // `examples` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return issues.map(issue => issue.toObject())
    })
    // respond with status 200 and JSON of the examples
    .then(issues => res.status(200).json({ issues: issues }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
// GET /examples/5a7db6c74d55bc51bdf39793
router.get('/issues/:id', requireToken, (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Issue.findById(req.params.id)
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "example" JSON
    .then(issue => res.status(200).json({ issue: issue.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// CREATE
// POST /examples
router.post('/issues', requireToken, (req, res, next) => {
  // set owner of new example to be current user
  req.body.issues.owner = req.user.id

  Issue.create(req.body.example)
    // respond to succesful `create` with status 201 and JSON of new "example"
    .then(issue => {
      res.status(201).json({ issue: issue.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

// UPDATE
// PATCH /examples/5a7db6c74d55bc51bdf39793
router.patch('/issues/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.issue.owner

  Issue.findById(req.params.id)
    .then(handle404)
    .then(issue => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, issue)

      // pass the result of Mongoose's `.update` to the next `.then`
      return issue.updateOne(req.body.issue)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /examples/5a7db6c74d55bc51bdf39793
router.delete('/issues/:id', requireToken, (req, res, next) => {
  Issue.findById(req.params.id)
    .then(handle404)
    .then(issue => {
      // throw an error if current user doesn't own `example`
      requireOwnership(req, issue)
      // delete the example ONLY IF the above didn't throw
      issue.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
