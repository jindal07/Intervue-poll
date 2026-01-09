const express = require('express');
const router = express.Router();
const participantController = require('../controllers/participant.controller');

// Participant routes
router.get('/', participantController.getParticipants);
router.get('/:id', participantController.getParticipantById);
router.delete('/:id/kick', participantController.kickParticipant);

module.exports = router;

