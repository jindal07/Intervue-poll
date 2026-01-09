const { pool } = require('../config/database');

class Poll {
  static async create({ question, options, duration, startTime }) {
    const query = `
      INSERT INTO polls (question, options, duration, start_time, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    // Convert options to JSON string if it's an object
    const optionsJson = typeof options === 'string' ? options : JSON.stringify(options);
    const values = [question, optionsJson, duration, startTime, 'active'];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT * FROM polls WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findActive() {
    const query = `
      SELECT * FROM polls 
      WHERE status = 'active' 
      ORDER BY created_at DESC 
      LIMIT 1
    `;
    const result = await pool.query(query);
    return result.rows[0];
  }

  static async updateStatus(id, status) {
    const query = `
      UPDATE polls 
      SET status = $1 
      WHERE id = $2 
      RETURNING *
    `;
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  }

  static async findCompleted() {
    const query = `
      SELECT * FROM polls 
      WHERE status = 'completed' 
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async hasActivePoll() {
    const query = `
      SELECT COUNT(*) as count 
      FROM polls 
      WHERE status = 'active'
    `;
    const result = await pool.query(query);
    return parseInt(result.rows[0].count) > 0;
  }
}

module.exports = Poll;

