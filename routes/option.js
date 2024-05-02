const express = require('express');
const router = express.Router();
const optionController = require('../controller/option_controller');

// Define routes for option-related operations
router.post('/:id/create', optionController.create);
router.delete('/:id/delete', optionController.delete);
router.get('/:id/add_vote', optionController.addVote);

module.exports = router;