const Note = require('../models/Note');
const Average = require('../models/Average');

// CRUD Notes
exports.createNote = async (req, res) => {
  try {
    const { studentId, studentName, score, course, semester, coefficient } = req.body;
    const note = new Note({ studentId, studentName, score, course, semester, coefficient });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const { studentId } = req.query;
    const filter = studentId ? { studentId } : {};
    const notes = await Note.find(filter);
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note non trouvée' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { score, course, semester, studentName, coefficient } = req.body;
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note non trouvée' });

    if (score !== undefined) note.score = score;
    if (course) note.course = course;
    if (semester !== undefined) note.semester = semester;
    if (studentName) note.studentName = studentName;
    if (coefficient !== undefined) note.coefficient = coefficient;

    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note non trouvée' });
    res.json({ message: 'Note supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔥 Calcul et stockage des moyennes pour un étudiant
exports.calculateAndStoreAverages = async (req, res) => {
  try {
    const { studentId } = req.query;
    if (!studentId) return res.status(400).json({ message: 'studentId requis' });

    const notes = await Note.find({ studentId });
    if (notes.length === 0) return res.status(404).json({ message: 'Aucune note trouvée' });

    const studentName = notes[0].studentName;

    // Moyenne générale
    let total = 0, coeff = 0;
    notes.forEach(n => {
      total += n.score * n.coefficient;
      coeff += n.coefficient;
    });
    const generalAverage = total / coeff;

    // Moyenne par semestre
    const semesters = {};
    notes.forEach(n => {
      if (!semesters[n.semester]) semesters[n.semester] = { total: 0, coeff: 0 };
      semesters[n.semester].total += n.score * n.coefficient;
      semesters[n.semester].coeff += n.coefficient;
    });

    const averagesBySemester = Object.keys(semesters).map(s => ({
      semester: Number(s),
      average: semesters[s].total / semesters[s].coeff
    }));

    // Stockage dans MongoDB
    await Average.findOneAndUpdate(
      { studentId },
      { studentId, studentName, generalAverage, averagesBySemester },
      { upsert: true, new: true }
    );

    res.json({ studentId, studentName, generalAverage, averagesBySemester });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔥 Récupérer tous les étudiants avec leurs moyennes
exports.getStudentsWithAverages = async (req, res) => {
  try {
    const averages = await Average.find().sort({ studentName: 1 });
    res.json(averages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔥 Récupérer les moyennes stockées d’un étudiant spécifique
exports.getStoredAverages = async (req, res) => {
  try {
    const { studentId } = req.params;
    if (!studentId) return res.status(400).json({ message: 'studentId requis' });

    const avg = await Average.findOne({ studentId });
    if (!avg) return res.status(404).json({ message: 'Moyennes non trouvées' });

    res.json(avg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
