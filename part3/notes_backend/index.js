require('dotenv').config()
const express = require('express')
const Note = require('./models/note')
const morgan = require('morgan');

const app = express();
// const cors = require('cors');

// const password = process.argv[2]
// const url = `mongodb+srv://fullstack:${password}@cluster0.m3vemba.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

let notes = [
  {
    id: 1,
    content: 'HTML is easy',
    important: true,
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    important: false,
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true,
  },
];

// Logging
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
// app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use(requestLogger);
app.use(morgan('tiny'));


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
    response.json(notes)
  })
});

// const generateId = () => {
//   const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0;
//   return maxId + 1;
// };

app.post('/api/notes', (request, response, next) => {
  const body = request.body;

  // if (!body.content) {
  //   return response.status(400).json({
  //     error: 'content missing',
  //   });
  // }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    // id: generateId(),
  });

  // notes = notes.concat(note);
  note.save().then(savedNote => {
    response.json(savedNote)
  })
  .catch(error => next(error));
});

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
    //   console.log(error)
    //   response.status(400).send({ error: 'malformatted id' })
    // })
});

app.put('/api/notes/:id', (request, response, next) => {
  const { content, important} = request.body;

  // const note = notes.find(note => note.id === id);
  // const id = Number(request.params.id);
  // const changedNote = {
  //   content: body.content,
  //   important: body.important,
  //   id: id,
  // };

Note.findById(request.params.id)
  .then(note => {
      if (!note) {
        return response.status(404).end()
      }

      note.content = content;
      note.important = important;

      return note.save().then((updatedNote) => {
        response.json(updatedNote)
      })
  })
  .catch(error => next(error))

  // if (note) {
  //   notes = notes.map(note => (note.id === id ? changedNote : note));

  //   response.json(changedNote);
  // } else {
  //   console.log("error: 'put method, note id:'", id, 'not found');
  //   response.status(404).json({ error: 'Note not found' });
  // }
});

app.delete('/api/notes/:id', (request, response, next) => {
  // const id = Number(request.params.id);
  // notes = notes.filter(note => note.id !== id);
  Note.findByIdAndDelete(request.params.id)
    .then(result => {
      console.log('delete ID result', result);
      response.status(204).end()
    })
    .catch(error => next(error))
});

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
    return response.status(400).json({ error: error.message})
  }

  next(error)
}
// handler of requests with result to errors
app.use(errorHandler)

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
