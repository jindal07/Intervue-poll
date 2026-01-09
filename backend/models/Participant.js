const { pool } = require('../config/database');

class Participant {
  static async create({ name, socketId }) {
    const query = `
      INSERT INTO participants (name, socket_id, is_kicked)
      VALUES ($1, $2, false)
      RETURNING *
    `;
    const values = [name, socketId];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findBySocketId(socketId) {
    const query = `
      SELECT * FROM participants 
      WHERE socket_id = $1
    `;
    const result = await pool.query(query, [socketId]);
    return result.rows[0];
  }

  static async findByName(name) {
    const query = `
      SELECT * FROM participants 
      WHERE LOWER(name) = LOWER($1)
      ORDER BY joined_at DESC
      LIMIT 1
    `;
    const result = await pool.query(query, [name]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT * FROM participants 
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async updateSocketIdById(id, newSocketId) {
    const query = `
      UPDATE participants 
      SET socket_id = $1, is_kicked = false
      WHERE id = $2 
      RETURNING *
    `;
    const result = await pool.query(query, [newSocketId, id]);
    return result.rows[0];
  }

  static async findAll() {
    const query = `
      SELECT id, name, is_kicked, joined_at 
      FROM participants 
      WHERE is_kicked = false
      ORDER BY joined_at ASC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async kickParticipant(id) {
    const query = `
      UPDATE participants 
      SET is_kicked = true 
      WHERE id = $1 
      RETURNING *
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async deleteBySocketId(socketId) {
    const query = `
      DELETE FROM participants 
      WHERE socket_id = $1 
      RETURNING *
    `;
    const result = await pool.query(query, [socketId]);
    return result.rows[0];
  }

  static async updateSocketId(oldSocketId, newSocketId) {
    const query = `
      UPDATE participants 
      SET socket_id = $1 
      WHERE socket_id = $2 
      RETURNING *
    `;
    const result = await pool.query(query, [newSocketId, oldSocketId]);
    return result.rows[0];
  }

  static async removeDuplicates() {
    // Keep only the most recent entry for each unique name (case-insensitive)
    const query = `
      DELETE FROM participants
      WHERE id NOT IN (
        SELECT DISTINCT ON (LOWER(name)) id
        FROM participants
        ORDER BY LOWER(name), joined_at DESC
      )
    `;
    const result = await pool.query(query);
    return result.rowCount;
  }
}

module.exports = Participant;

