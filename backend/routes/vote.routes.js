const express = require('express');
const router = express.Router();
const voteController = require('../controllers/vote.controller');

// Vote routes
router.post('/', voteController.submitVote);
router.get('/:pollId/:studentId', voteController.getStudentVote);
router.get('/:pollId/:studentId/check', voteController.checkIfVoted);

module.exports = router;

