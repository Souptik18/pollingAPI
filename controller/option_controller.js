const Option = require('../models/option');
const Question = require('../models/question');

// Controller function to create an option for a given question
module.exports.create = async function (req, res) {
  try {
    let question = await Question.findById(req.params.id);
    if (question) {
      let option = await Option.create({
        text: req.body.text
      });
      option.link_to_vote = `http://localhost:8000/options/${option._id}/add_vote`;
      await option.save();
      question.options.push(option._id);
      await question.save();
      return res.json(option);
    } else {
      return res.status(404).json({ error: 'Cannot find question' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller function to delete an option
module.exports.delete = async function (req, res) {
  try {
    let option = await Option.findById(req.params.id);
    if (option) {
      if (option.votes < 1) {
        let question = await Question.findOne({ options: req.params.id });
        if (question) {
          await Option.findByIdAndDelete(req.params.id);
          await Question.findByIdAndUpdate(question._id, { $pull: { options: req.params.id } });
          return res.json({ message: "Option deleted successfully", data: option });
        }
      } else {
        return res.status(403).json({ error: 'Option votes are given, cannot delete it' });
      }
    } else {
      return res.status(404).json({ error: 'Cannot find option' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller function to add a vote to an option
module.exports.addVote = async function (req, res) {
  try {
    let option = await Option.findById(req.params.id);
    if (option) {
      option.votes += 1;
      await option.save();
      return res.json({ message: "Vote added to option", data: option });
    } else {
      return res.status(404).json({ error: 'Option not found' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
