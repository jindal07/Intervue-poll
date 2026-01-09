const Vote = require('../models/Vote');
const Poll = require('../models/Poll');

class VoteService {
  async submitVote({ pollId, studentId, optionId }) {
    // Validate inputs
    if (!pollId || !studentId || !optionId) {
      throw new Error('Poll ID, Student ID, and Option ID are required');
    }

    // Check if poll exists and is active
    const poll = await Poll.findById(pollId);
    if (!poll) {
      throw new Error('Poll not found');
    }
    if (poll.status !== 'active') {
      throw new Error('This poll is no longer active');
    }

    // Check if poll has expired
    const elapsed = Math.floor((Date.now() - poll.start_time) / 1000);
    if (elapsed >= poll.duration) {
      throw new Error('Poll time has expired');
    }

    // Check if student has already voted
    const existingVote = await Vote.findByPollAndStudent(pollId, studentId);
    if (existingVote) {
      throw new Error('You have already voted on this poll');
    }

    // Validate option exists in poll
    // PostgreSQL JSONB is already parsed by the driver
    const options = poll.options;
    const validOption = options.find(opt => opt.id === optionId);
    if (!validOption) {
      throw new Error('Invalid option selected');
    }

    // Create the vote
    try {
      const vote = await Vote.create({ pollId, studentId, optionId });
      return {
        id: vote.id,
        pollId: vote.poll_id,
        studentId: vote.student_id,
        optionId: vote.option_id,
        createdAt: vote.created_at
      };
    } catch (error) {
      // Handle unique constraint violation
      if (error.message.includes('already voted')) {
        throw error;
      }
      throw new Error('Failed to submit vote');
    }
  }

  async getStudentVote(pollId, studentId) {
    const vote = await Vote.findByPollAndStudent(pollId, studentId);
    if (!vote) {
      return null;
    }
    return {
      id: vote.id,
      pollId: vote.poll_id,
      studentId: vote.student_id,
      optionId: vote.option_id,
      createdAt: vote.created_at
    };
  }

  async hasStudentVoted(pollId, studentId) {
    const vote = await Vote.findByPollAndStudent(pollId, studentId);
    return vote !== null;
  }

  async getVotesByPoll(pollId) {
    const votes = await Vote.findByPoll(pollId);
    return votes.map(vote => ({
      id: vote.id,
      pollId: vote.poll_id,
      studentId: vote.student_id,
      optionId: vote.option_id,
      createdAt: vote.created_at
    }));
  }
}

module.exports = new VoteService();

