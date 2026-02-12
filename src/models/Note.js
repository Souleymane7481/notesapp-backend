const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true, // identifiant unique de l'étudiant
  },
  studentName: {
    type: String,
    required: true, // nom lisible pour l'utilisateur
  },
  score: {
    type: Number,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  coefficient: {
    type: Number,
    default: 1, // poids de la matière par défaut = 1
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Note', noteSchema);
