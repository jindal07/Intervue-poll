const pollService = require('../services/poll.service');

class PollController {
  async createPoll(req, res, next) {
    try {
      const { question, options, duration } = req.body;
      const poll = await pollService.createPoll({ question, options, duration });
      res.status(201).json({
        success: true,
        data: poll
      });
    } catch (error) {
      next(error);
    }
  }

  async getActivePoll(req, res, next) {
    try {
      const poll = await pollService.getActivePoll();
      res.status(200).json({
        success: true,
        data: poll
      });
    } catch (error) {
      next(error);
    }
  }

  async getPollById(req, res, next) {
    try {
      const { id } = req.params;
      const poll = await pollService.getPollById(id);
      
      if (!poll) {
        return res.status(404).json({
          success: false,
          error: 'Poll not found'
        });
      }

      res.status(200).json({
        success: true,
        data: poll
      });
    } catch (error) {
      next(error);
    }
  }

  async completePoll(req, res, next) {
    try {
      const { id } = req.params;
      const poll = await pollService.completePoll(id);
      res.status(200).json({
        success: true,
        data: poll
      });
    } catch (error) {
      next(error);
    }
  }

  async getPollResults(req, res, next) {
    try {
      const { id } = req.params;
      const results = await pollService.getPollResults(id);
      res.status(200).json({
        success: true,
        data: results
      });
    } catch (error) {
      next(error);
    }
  }

  async getPollHistory(req, res, next) {
    try {
      const history = await pollService.getPollHistory();
      res.status(200).json({
        success: true,
        data: history
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PollController();

