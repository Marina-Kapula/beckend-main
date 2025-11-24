const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()
const mongoose = require('mongoose')
const Person = require('./models/person')
const path = require('path')
app.use(express.static('dist'))

// подключение к MongoDB
mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB_URI, { family: 4 })

// ===== MIDDLEWARES =====
app.use(cors({
  origin: 'https://test-main-i3r1.onrender.com'
}));app.use(express.json())
app.use(morgan('tiny'))

// раздача собранного фронтенда (папка dist)
app.use(express.static('dist'))

// ===== ROUTES =====

// GET all persons
app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => res.json(persons))
    .catch(error => next(error))
})

// GET person by id
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

// DELETE person
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch(error => next(error))
})

// POST new person
app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  if (!name || !number) {
    return res.status(400).json({ error: 'name or number missing' })
  }

  const person = new Person({ name, number })

  person.save()
    .then(savedPerson => res.status(201).json(savedPerson))
    .catch(error => next(error))
})

// PUT update person
app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    {
      new: true,
      runValidators: true,
      context: 'query',
    }
  )
    .then(updatedPerson => {
      if (updatedPerson) {
        res.json(updatedPerson)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

// info route
app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then(count => {
      res.send(
        `<p>Phonebook has info for ${count} people</p>
         <p>${new Date()}</p>`
      )
    })
    .catch(error => next(error))
})

// ===== FRONTEND CATCH-ALL =====
// все неизвестные GET-ы отдаем index.html фронта


// ===== UNKNOWN ENDPOINT =====
app.use('/api', (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
})

// ===== ERROR HANDLER =====
app.use((error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
})

// ===== START SERVER =====
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
