import { useState, useEffect } from 'react';
// import axios from 'axios';
import noteService from './services/notes';
import Note from './components/Note';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [showAll, setShowAll] = useState(true);

  useEffect(() => {
    noteService.getAll().then(initialNotes => {
      setNotes(initialNotes);
    });
  }, []);
  console.log('render', notes.length, 'notes');

  const handleNoteChange = event => {
    console.log(event.target.value);
    setNewNote(event.target.value);
  };

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => (note.id === id ? returnedNote : note)));
      })
      .catch(error => {
        console.log('noteService error ==> ', error);
        alert(`the note '${note.content}' was already deleted from server`);
        setNotes(notes.filter(n => n.id !== id));
      });
  };

  const addNote = event => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      // id: String(notes.length + 1),
    };

    noteService.create(noteObject).then(returnedNote => {
      setNotes(notes.concat(returnedNote));
      setNewNote('');
    });
  };

  const notesToShow = showAll ? notes : notes.filter(note => note.important);

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
    </div>
  );
};

export default App;

// import Course from './components/Course';

// const App = () => {
//   const courses = [
//     {
//       name: 'Half Stack application development',
//       id: 1,
//       parts: [
//         {
//           name: 'Fundamentals of React',
//           exercises: 10,
//           id: 1,
//         },
//         {
//           name: 'Using props to pass data',
//           exercises: 7,
//           id: 2,
//         },
//         {
//           name: 'State of a component',
//           exercises: 14,
//           id: 3,
//         },
//         {
//           name: 'Redux',
//           exercises: 11,
//           id: 4,
//         },
//       ],
//     },
//     {
//       name: 'Node.js',
//       id: 2,
//       parts: [
//         {
//           name: 'Routing',
//           exercises: 3,
//           id: 1,
//         },
//         {
//           name: 'Middlewares',
//           exercises: 7,
//           id: 2,
//         },
//       ],
//     },
//   ];

//   return (
//     <>
//       {courses.map(courses => (
//         <Course key={courses.id} course={courses} />
//       ))}
//     </>
//   );
// };

// export default App;
