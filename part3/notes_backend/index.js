require('dotenv').config()
const express = require('express')
const Note = require('./models/note')
var morgan = require('morgan');

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
app.use(requestLogger);
// app.use(cors());
app.use(express.static('dist'));
app.use(express.json());

app.use(morgan('tiny'));

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
    response.json(notes)
  })
});

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map(n => n.id)) : 0;
  return maxId + 1;
};

app.post('/api/notes', (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing',
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    // id: generateId(),
  });

  // notes = notes.concat(note);
  note.save().then(savedNote => {
    response.json(savedNote)
  })
});

app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note)
  })
});

app.put('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  const body = request.body;
  const note = notes.find(note => note.id === id);

  const changedNote = {
    content: body.content,
    important: body.important,
    id: id,
  };

  // const noteIndex = notes.findIndex(n => n.id === id);

  // if (noteIndex !== -1) {
  if (note) {
    notes = notes.map(note => (note.id === id ? changedNote : note));

    response.json(changedNote);
  } else {
    console.log("error: 'put method, note id:'", id, 'not found');
    response.status(404).json({ error: 'Note not found' });
  }
});

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter(note => note.id !== id);
  console.log('delete ID', note);
  response.status(204).end();
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
