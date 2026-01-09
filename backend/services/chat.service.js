const ChatMessage = require('../models/ChatMessage');

class ChatService {
  async sendMessage({ senderName, message }) {
    if (!senderName || !message) {
      throw new Error('Sender name and message are required');
    }

    if (message.trim().length === 0) {
      throw new Error('Message cannot be empty');
    }

    const chatMessage = await ChatMessage.create({ senderName, message });
    return {
      id: chatMessage.id,
      senderName: chatMessage.sender_name,
      message: chatMessage.message,
      createdAt: chatMessage.created_at
    };
  }

  async getRecentMessages(limit = 50) {
    const messages = await ChatMessage.getRecent(limit);
    return messages.map(msg => ({
      id: msg.id,
      senderName: msg.sender_name,
      message: msg.message,
      createdAt: msg.created_at
    }));
  }

  async clearMessages() {
    await ChatMessage.deleteAll();
  }
}

module.exports = new ChatService();

