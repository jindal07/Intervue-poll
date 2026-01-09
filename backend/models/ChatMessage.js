const { pool } = require('../config/database');

class ChatMessage {
  static async create({ senderName, message }) {
    const query = `
      INSERT INTO chat_messages (sender_name, message)
      VALUES ($1, $2)
      RETURNING *
    `;
    const values = [senderName, message];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getRecent(limit = 50) {
    const query = `
      SELECT * FROM chat_messages 
      ORDER BY created_at DESC 
      LIMIT $1
    `;
    const result = await pool.query(query, [limit]);
    return result.rows.reverse(); // Return in chronological order
  }

  static async deleteAll() {
    const query = 'DELETE FROM chat_messages';
    await pool.query(query);
  }
}

module.exports = ChatMessage;

