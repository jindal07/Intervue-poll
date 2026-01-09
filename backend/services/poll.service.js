const Poll = require('../models/Poll');
const Vote = require('../models/Vote');

class PollService {
  async createPoll({ question, options, duration }) {
    // Validate inputs
    if (!question || question.length > 100) {
      throw new Error('Question is required and must be max 100 characters');
    }
    if (!options || options.length < 2) {
      throw new Error('At least 2 options are required');
    }
    if (!duration || duration < 1 || duration > 60) {
      throw new Error('Duration must be between 1 and 60 seconds');
    }

    // Check if there's already an active poll
    const hasActive = await Poll.hasActivePoll();
    if (hasActive) {
      throw new Error('There is already an active poll. Please wait for it to complete.');
    }

    const startTime = Date.now();
    const poll = await Poll.create({
      question,
      options,
      duration,
      startTime
    });

    return this.formatPoll(poll);
  }

  async getActivePoll() {
    const poll = await Poll.findActive();
    if (!poll) {
      return null;
    }

    const formattedPoll = this.formatPoll(poll);
    
    // Calculate remaining time
    const elapsed = Math.floor((Date.now() - poll.start_time) / 1000);
    const remainingTime = Math.max(0, poll.duration - elapsed);
    
    // Get vote counts
    const results = await this.getPollResults(poll.id);

    return {
      ...formattedPoll,
      remainingTime,
      results
    };
  }

  async getPollById(pollId) {
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return null;
    }
    return this.formatPoll(poll);
  }

  async completePoll(pollId) {
    const poll = await Poll.updateStatus(pollId, 'completed');
    return this.formatPoll(poll);
  }

  async getPollResults(pollId) {
    const voteCounts = await Vote.getVoteCountByOption(pollId);
    const totalVotes = await Vote.getTotalVoteCount(pollId);

    const poll = await Poll.findById(pollId);
    if (!poll) {
      throw new Error('Poll not found');
    }

    // PostgreSQL JSONB is already parsed by the driver
    const options = poll.options;
    
    // Create results map with percentages
    const results = options.map(option => {
      const voteData = voteCounts.find(v => v.option_id === option.id);
      const count = voteData ? parseInt(voteData.count) : 0;
      const percentage = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;

      return {
        optionId: option.id,
        optionText: option.text,
        count,
        percentage
      };
    });

    return {
      pollId,
      totalVotes,
      results
    };
  }

  async getPollHistory() {
    const polls = await Poll.findCompleted();
    
    const history = await Promise.all(
      polls.map(async (poll) => {
        const results = await this.getPollResults(poll.id);
        return {
          ...this.formatPoll(poll),
          results
        };
      })
    );

    return history;
  }

  async autoCompletePoll(pollId) {
    // This will be called by a timer when the poll duration expires
    const poll = await Poll.findById(pollId);
    if (!poll || poll.status !== 'active') {
      return null;
    }

    const elapsed = Math.floor((Date.now() - poll.start_time) / 1000);
    if (elapsed >= poll.duration) {
      return await this.completePoll(pollId);
    }

    return null;
  }

  formatPoll(poll) {
    return {
      id: poll.id,
      question: poll.question,
      options: poll.options, // PostgreSQL JSONB is already parsed
      duration: poll.duration,
      startTime: parseInt(poll.start_time), // Convert to number
      status: poll.status,
      createdAt: poll.created_at
    };
  }
}

module.exports = new PollService();

