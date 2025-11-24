const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,            // имя минимум 3 символа
    required: true,
  },
  number: {
    type: String,
    minlength: 8,            // номер минимум 8 символов
    required: true,
    validate: {
      validator: function (v) {
        // 2–3 цифры, дефис, потом ещё цифры (например 09-1234556, 040-22334455)
        return /^\d{2,3}-\d+$/.test(v)
      },
      message:
        props =>
          `${props.value} is not a valid phone number! Use form XX-XXXXXXX or XXX-XXXXXXX.`,
    },
  },
})

module.exports = mongoose.model('Person', personSchema)
