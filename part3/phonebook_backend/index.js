const express = require('express');
const morgan = require('morgan');
const app = express();
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
];

// app.use(cors());
app.use(express.static('dist'));
app.use(express.json());

morgan.token('body', (req, res) => {
  if (req.method === 'POST' && req.body) {
    return JSON.stringify({ name: req.body.name, number: req.body.number });
  }
  return '-';
});

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
    ].join(' ');
  })
);

app.get('/', (req, res) => {
  res.send(`<p>Phonebook app</p>`);
});

app.get('/info', (req, res) => {
  const date = new Date();
  //   const year = date.getFullYear();
  //   const month = date.getMonth() + 1;
  //   const day = date.getDate();
  res.send(`<p>Phonebook has info for ${persons.length} people. <br>
          ${date}</p>`);
  // ${day}.${month}.${year}</p>`);
});

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

const generateId = () => {
  // const randomN = Math.floor(Math.random() * 1000).toString();
  // return randomN;
  const maxId = persons.length > 0 ? Math.max(...persons.map(n => Number(n.id))) : 0;
  return (maxId + 1).toString();
};

app.get('/api/persons/:id', (req, res) => {
  console.log(req.params.id, 'req.params.id');
  //   const id = Number(req.params.id); if ID is a number;
  const id = req.params.id;
  const person = persons.find(person => person.id === id);
  if (person) {
    res.json(person);
  } else {
    console.log('no such person');
    res.status(404).end();
  }
});

app.post('/api/persons', (req, res) => {
  const body = req.body;
  //   console.log('body ==> ', body);

  const isDuplicate = persons.some(person => person.name === body.name);
    if (isDuplicate) {
    return res.status(400).json({ error: 'name must be unique' });
  }

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'content missing' });
  } else if (isDuplicate) {
    return res.status(400).json({ error: 'name must be unique' });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };
  persons = persons.concat(person);
  console.log('newPersons', persons);
  //   persons = [...persons, person];

  res.json(person);
});

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  persons = persons.filter(person => person.id !== id);
  res.status(204).end();
});

app.put('/api/npersons/:id', (request, response) => {
  // const id = Number(request.params.id);
  const id = request.params.id;
  const body = request.body;

  const person = persons.find(p => p.id === id);
  console.log('put person', person);

  const changedPerson = {
    name: body.name,
    number: body.number,
    id: id,
  };

  if (person) {
    persons = persons.map(person =>
      person.id === id ? changedPerson : person
    );
    response.json(changedPerson);
  } else {
    console.log("error: 'put method, person id:'", id, 'not found');
    response.status(404).json({ error: 'Person not found' });
  }
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, (req, res) => {
  console.log(`Server is running on port ${PORT}`);
});
