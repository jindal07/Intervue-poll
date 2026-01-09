const { pool } = require('../config/database');

class Vote {
  static async create({ pollId, studentId, optionId }) {
    try {
      const query = `
        INSERT INTO votes (poll_id, student_id, option_id)
        VALUES ($1, $2, $3)
        RETURNING *
      `;
      const values = [pollId, studentId, optionId];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      // Check for unique constraint violation
      if (error.code === '23505') {
        throw new Error('You have already voted on this poll');
      }
      throw error;
    }
  }

  static async findByPollAndStudent(pollId, studentId) {
    const query = `
      SELECT * FROM votes 
      WHERE poll_id = $1 AND student_id = $2
    `;
    const result = await pool.query(query, [pollId, studentId]);
    return result.rows[0];
  }

  static async findByPoll(pollId) {
    const query = `
      SELECT * FROM votes 
      WHERE poll_id = $1
    `;
    const result = await pool.query(query, [pollId]);
    return result.rows;
  }

  static async getVoteCountByOption(pollId) {
    const query = `
      SELECT option_id, COUNT(*) as count
      FROM votes
      WHERE poll_id = $1
      GROUP BY option_id
    `;
    const result = await pool.query(query, [pollId]);
    return result.rows;
  }

  static async getTotalVoteCount(pollId) {
    const query = `
      SELECT COUNT(*) as total
      FROM votes
      WHERE poll_id = $1
    `;
    const result = await pool.query(query, [pollId]);
    return parseInt(result.rows[0].total);
  }
}

module.exports = Vote;

