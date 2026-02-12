const mongoose = require('mongoose');

const AverageSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, unique: true },
    studentName: { type: String, required: true },

    generalAverage: { type: Number, required: true },

    averagesBySemester: [
      {
        semester: { type: Number, required: true },
        average: { type: Number, required: true }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Average', AverageSchema);

