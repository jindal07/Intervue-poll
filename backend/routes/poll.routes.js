const express = require('express');
const router = express.Router();
const pollController = require('../controllers/poll.controller');

// Poll routes
router.post('/', pollController.createPoll);
router.get('/active', pollController.getActivePoll);
router.get('/history', pollController.getPollHistory);
router.get('/:id', pollController.getPollById);
router.put('/:id/complete', pollController.completePoll);
router.get('/:id/results', pollController.getPollResults);

module.exports = router;

