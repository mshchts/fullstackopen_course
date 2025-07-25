const express = require('express');
const app = express();
// const cors = require('cors');

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

app.use(express.static('dist'));
// app.use(cors());
app.use(express.json());

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/api/notes', (request, response) => {
  response.json(notes);
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

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  };

  notes = notes.concat(note);

  response.json(note);
});

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find(note => note.id === id);
  if (note) {
    console.log('Get ID json', note);
    response.json(note);
  } else {
    console.log('x');
    response.status(404).end();
  }
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
