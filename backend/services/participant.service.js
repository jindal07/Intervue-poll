const Participant = require('../models/Participant');

class ParticipantService {
  async addParticipant({ name, socketId }) {
    if (!name || !socketId) {
      throw new Error('Name and Socket ID are required');
    }

    // Check if participant with this name already exists
    const existingByName = await Participant.findByName(name);
    if (existingByName) {
      // Update their socket ID (handles reconnections/refreshes)
      const updated = await Participant.updateSocketIdById(existingByName.id, socketId);
      return {
        id: updated.id,
        name: updated.name,
        socketId: updated.socket_id,
        isKicked: updated.is_kicked,
        joinedAt: updated.joined_at
      };
    }

    // Check if this socket ID is already used (shouldn't happen, but safety check)
    const existingBySocket = await Participant.findBySocketId(socketId);
    if (existingBySocket) {
      return {
        id: existingBySocket.id,
        name: existingBySocket.name,
        socketId: existingBySocket.socket_id,
        isKicked: existingBySocket.is_kicked,
        joinedAt: existingBySocket.joined_at
      };
    }

    // Create new participant
    const participant = await Participant.create({ name, socketId });
    return {
      id: participant.id,
      name: participant.name,
      socketId: participant.socket_id,
      isKicked: participant.is_kicked,
      joinedAt: participant.joined_at
    };
  }

  async getParticipants() {
    const participants = await Participant.findAll();
    return participants.map(p => ({
      id: p.id,
      name: p.name,
      isKicked: p.is_kicked,
      joinedAt: p.joined_at
    }));
  }

  async getParticipantBySocketId(socketId) {
    const participant = await Participant.findBySocketId(socketId);
    if (!participant) {
      return null;
    }
    return {
      id: participant.id,
      name: participant.name,
      socketId: participant.socket_id,
      isKicked: participant.is_kicked,
      joinedAt: participant.joined_at
    };
  }

  async getParticipantById(id) {
    const participant = await Participant.findById(id);
    if (!participant) {
      return null;
    }
    return {
      id: participant.id,
      name: participant.name,
      socketId: participant.socket_id,
      isKicked: participant.is_kicked,
      joinedAt: participant.joined_at
    };
  }

  async kickParticipant(id) {
    const participant = await Participant.kickParticipant(id);
    if (!participant) {
      throw new Error('Participant not found');
    }
    return {
      id: participant.id,
      name: participant.name,
      socketId: participant.socket_id,
      isKicked: participant.is_kicked,
      joinedAt: participant.joined_at
    };
  }

  async removeParticipant(socketId) {
    const participant = await Participant.deleteBySocketId(socketId);
    return participant !== null;
  }

  async updateParticipantSocket(oldSocketId, newSocketId) {
    const participant = await Participant.updateSocketId(oldSocketId, newSocketId);
    if (!participant) {
      return null;
    }
    return {
      id: participant.id,
      name: participant.name,
      socketId: participant.socket_id,
      isKicked: participant.is_kicked,
      joinedAt: participant.joined_at
    };
  }

  async cleanupDuplicates() {
    try {
      const count = await Participant.removeDuplicates();
      return count;
    } catch (error) {
      console.error('Error cleaning up duplicates:', error);
      return 0;
    }
  }
}

module.exports = new ParticipantService();

