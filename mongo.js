const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://marynakapula_fulstack:${password}@cluster0.sjes0to.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

// далі тимчасова схема, тільки для тесту:
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// приклад: додати один запис
const person = new Person({
  name: 'Anna',
  number: '040-1234556',
})

person.save().then(() => {
  console.log('person saved!')
  mongoose.connection.close()
})
