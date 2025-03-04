/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import personsService from './services/persons';
import Notification from './components/Notification';

const PersonForm = ({
  newName,
  newNumber,
  handleAddNewName,
  handleAddNumber,
  handleSetPerson,
}) => {
  return (
    <form onSubmit={handleSetPerson}>
      <div>
        name: <input value={newName} onChange={handleAddNewName} />
      </div>
      <br />
      <div>
        <div>
          number: <input value={newNumber} onChange={handleAddNumber} />
        </div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({ personsToShow, handleRemovePerson }) => {
  return (
    <ul>
      {personsToShow.map(person => (
        <>
          <li key={person.id}>
            {person.name} {person.number}
          </li>
          <button onClick={() => handleRemovePerson(person)}>delete</button>
        </>
      ))}
    </ul>
  );
};
const Filter = ({ handleFilterName }) => {
  return (
    <div>
      Filter shown with:
      <input type="text" onChange={handleFilterName} />
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filteredText, setFilteredText] = useState();
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  // const [notificationMessage, setNotificationMessage] = useState(null);

  useEffect(() => {
    personsService.getAll().then(initialPersons => {
      console.log('promise fulfilled');
      setPersons(initialPersons);
      console.log('effect after fetching');
    });
  }, []);

  const handleSetPerson = event => {
    event.preventDefault();

    // const isDuplicate = persons.some(
    //   person => person.name.toLowerCase() === newName.toLowerCase()
    // );
    const samePerson = persons.find(
      person => person.name.toLowerCase() === newName.toLowerCase()
    );

    // if (isDuplicate) {
    // alert(`${newName} is already added to phonebook`);
    //   return;
    // }

    if (samePerson) {
      const ok = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      );
      if (!ok) {
        return;
      }
      const updatedPerson = { ...samePerson, number: newNumber };

      const updatedPersons = persons.map(person =>
        person.name.toLowerCase() === newName.toLowerCase()
          ? updatedPerson
          : person
      );

      // console.log('updatedPersons ==> ', updatedPersons);
      personsService
        .update(updatedPerson.id, updatedPerson)
        .then(() => {
          // personsService.getAll().then(updatedPersons => {
          //   setPersons(updatedPersons);
          // });
          setPersons(updatedPersons);
        })
        .catch(error => {
          console.error('There was an error with updating the person', error);
          setErrorMessage(
            `Information of ${newName} has already been removed from server`
          );
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
          personsService.getAll().then(updatedPersons => {
            setPersons(updatedPersons);
          });
          console.log('persons after error==> ', persons);
        });
      setNewName('');
      setNewNumber('');
      return;
    }

    const newPerson = {
      name: newName,
      number: newNumber,
      // id: persons.length + 1 + '', // (could be improved)
    };
    // setPersons(persons.concat(newPerson));
    personsService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons([...persons, returnedPerson]);

        setSuccessMessage(`Added ${newName}`);
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      })

      .catch(error => console.error('There was an error inside App!', error));
    setNewName('');
    setNewNumber('');
  };

  const handleRemovePerson = person => {
    console.log('handleRemovePerson person ==> ', person);
    personsService
      .remove(person.id)
      .then(() => {
        window.confirm(`Delete ${person.name} ?`);
        setPersons(persons.filter(p => p.id !== person.id));
      })
      .catch(err => {
        console.log('err', err);
      });
  };

  const handleFilterName = event => {
    setFilteredText(event.target.value);
  };

  const handleAddNumber = event => {
    setNewNumber(event.target.value);
  };

  const handleAddNewName = event => {
    setNewName(event.target.value);
  };

  const personsToShow = filteredText
    ? persons.filter(person =>
        person.name.toLowerCase().includes(filteredText.toLowerCase())
      )
    : persons;

  return (
    <div>
      <h3>Phonebook</h3>
      <Notification
        successMessage={successMessage}
        errorMessage={errorMessage}
      />
      <Filter handleFilterName={handleFilterName} filteredText={filteredText} />
      <h3>Add a new</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleAddNewName={handleAddNewName}
        handleAddNumber={handleAddNumber}
        handleSetPerson={handleSetPerson}
      />
      <h3>Numbers</h3>
      <Persons
        personsToShow={personsToShow}
        handleRemovePerson={handleRemovePerson}
      />
    </div>
  );
};

export default App;
