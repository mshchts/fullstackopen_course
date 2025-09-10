const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

// const url = `mongodb+srv://<db_username>:<db_password>@cluster0.m3vemba.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
const url = `mongodb+srv://fullstack:${password}@cluster0.m3vemba.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

// const note = new Note({
//   content: 'HTML is easy',
//   important: true,
// })

Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})

if(process.argv.length > 3 && process.argv.length < 6){
    const note = new Note({
      name: process.argv[3],
      number: process.argv[4],
    })
    note.save().then(result => {
      console.log(`added ${note.content} ${note.important}`)
      mongoose.connection.close()
    })
} else if(process.argv.length === 3) {
    Note.find({ important: true })
    .then(result => {
        console.log(`notes:`)
        result.forEach(note => {
        console.log(`${note.content} ${note.important}`)
      })
      mongoose.connection.close()
    })
} else if(process.argv.length > 5) {
    console.log('Too many arguments');
    mongoose.connection.close()
    // process.exit(1);
}