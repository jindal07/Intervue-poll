const voteService = require('../services/vote.service');

class VoteController {
  async submitVote(req, res, next) {
    try {
      const { pollId, studentId, optionId } = req.body;
      const vote = await voteService.submitVote({ pollId, studentId, optionId });
      res.status(201).json({
        success: true,
        data: vote
      });
    } catch (error) {
      next(error);
    }
  }

  async getStudentVote(req, res, next) {
    try {
      const { pollId, studentId } = req.params;
      const vote = await voteService.getStudentVote(pollId, studentId);
      res.status(200).json({
        success: true,
        data: vote
      });
    } catch (error) {
      next(error);
    }
  }

  async checkIfVoted(req, res, next) {
    try {
      const { pollId, studentId } = req.params;
      const hasVoted = await voteService.hasStudentVoted(pollId, studentId);
      res.status(200).json({
        success: true,
        data: { hasVoted }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new VoteController();

