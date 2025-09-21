require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const morgan = require('morgan')
const app = express()
// const cors = require('cors');

let persons = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

// app.use(cors());
app.use(express.static('dist'))
app.use(express.json())

morgan.token('body', (req, res) => {
  if (req.method === 'POST' && req.body) {
    return JSON.stringify({ name: req.body.name, number: req.body.number })
  }
  return '-'
})

// app.use(morgan(':tiny'));
// morgan(':method :url :status :res[content-length] - :response-time ms');

app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      tokens['body'](req, res),
    ].join(' ')
  })
)

app.get('/', (req, res) => {
  res.send('<p>Phonebook app</p>')
})

app.get('/info', (req, res) => {
  const date = new Date()
  //   const year = date.getFullYear();
  //   const month = date.getMonth() + 1;
  //   const day = date.getDate();
  Person.find({}).then(persons => {
    res.send(`<p>Phonebook has info for ${persons.length} people. <br>
            ${date}</p>`)
  })
  // ${day}.${month}.${year}</p>`);
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if(person){
        res.json(person)
      } else {
        console.log('no such person (or ID)')
        express.response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  const isDuplicate = persons.some(person => person.name === body.name)
  if (isDuplicate) {
    return res.status(400).json({ error: 'name must be unique' })
  }

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'content missing' })
  } else if (isDuplicate) {
    return res.status(400).json({ error: 'name must be unique' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })
  // persons = persons.concat(person);
  // console.log('newPersons', persons);
  // //   persons = [...persons, person];

  person.save().then(person => {
    console.log(`added ${person.name} number ${person.number} to phonebook by POST method`)
    res.json(person)
  })
    .catch(error => next(error))
})

// Next step, change mongoose validators of update operations
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  const person = {
    name: name,
    number: number,
  }

  Person.findByIdAndUpdate(
    request.params.id,
    person,
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson  => {
      if (!updatedPerson ) {
        return response.status(404).end()
      }

      response.json(updatedPerson)
    })
    .catch(error => next(error))

  // const id = request.params.id;
  // const body = request.body;
  // const person = persons.find(p => p.id === id);

  // const changedPerson = {
  //   name: body.name,
  //   number: body.number,
  //   id: id,
  // };

  // if (person) {
  //   persons = persons.map(person =>
  //     person.id === id ? changedPerson : person
  //   );
  //   response.json(changedPerson);
  // } else {
  //   console.log("error: 'put method, person id:'", id, 'not found');
  //   response.status(404).json({ error: 'Person not found' });
  // }
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      console.log('delete', req.params.id ,result)
      res.status(204).end()
    })
    .catch(error => next(error))
  // persons = persons.filter(person => person.id !== id);
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
// handler of requests with result to errors
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})