const participantService = require('../services/participant.service');

class ParticipantController {
  async getParticipants(req, res, next) {
    try {
      const participants = await participantService.getParticipants();
      res.status(200).json({
        success: true,
        data: participants
      });
    } catch (error) {
      next(error);
    }
  }

  async kickParticipant(req, res, next) {
    try {
      const { id } = req.params;
      const participant = await participantService.kickParticipant(id);
      res.status(200).json({
        success: true,
        data: participant
      });
    } catch (error) {
      next(error);
    }
  }

  async getParticipantById(req, res, next) {
    try {
      const { id } = req.params;
      const participant = await participantService.getParticipantById(id);
      
      if (!participant) {
        return res.status(404).json({
          success: false,
          error: 'Participant not found'
        });
      }

      res.status(200).json({
        success: true,
        data: participant
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ParticipantController();

