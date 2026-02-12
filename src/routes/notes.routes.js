const express = require('express');
const router = express.Router();
const noteController = require('../controllers/notes.controller');

// 🔥 ROUTES SPÉCIALES
router.get('/calculate-average', noteController.calculateAndStoreAverages); // Calcul + stockage
router.get('/students-with-average', noteController.getStudentsWithAverages); // Liste des étudiants
router.get('/average/stored/:studentId', noteController.getStoredAverages);   // Moyennes stockées

// 🔥 CRUD Notes
router.post('/', noteController.createNote);
router.get('/', noteController.getNotes);
router.get('/:id', noteController.getNoteById);
router.put('/:id', noteController.updateNote);
router.delete('/:id', noteController.deleteNote);

module.exports = router;
