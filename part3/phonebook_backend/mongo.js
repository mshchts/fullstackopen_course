const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

// const url = `mongodb+srv://<db_username>:<db_password>@cluster0.m3vemba.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
const url = `mongodb+srv://fullstack:${password}@cluster0.m3vemba.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length > 3 && process.argv.length < 6){
    const person = new Person({
      name: process.argv[3],
      number: process.argv[4],
    })
    person.save().then(result => {
      console.log(`added ${person.name} number ${person.number} to phonebook`)
      mongoose.connection.close()
    })
} else if(process.argv.length === 3) {
    Person.find({})
    .then(result => {
        console.log(`phonebook:`)
        result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })
} else if(process.argv.length > 5) {
    console.log('Too many arguments');
    mongoose.connection.close()
    // process.exit(1);
}