const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.m3vemba.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  date: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

if(process.argv.length === 5){
  const note = new Note({
    content: process.argv[3],
    date: new Date(),
    important: process.argv[4] === 'true',
  })
  note.save().then(result => {
    console.log(`added ${result.content} ${result.important}`)
    mongoose.connection.close()
  })
}
else if(process.argv.length === 3) {
  Note.find({ important: true })
    .then(result => {
      console.log('notes:')
      result.forEach(note => {
        console.log(`${note.content} ${note.important}`)
      })
      mongoose.connection.close()
    })
} else {
  console.log('Provide correct number of arguments: password, note content and importance.')
  mongoose.connection.close()
}