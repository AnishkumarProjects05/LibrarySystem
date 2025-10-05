const express = require('express');
const router = express.Router();
const bookController = require('../controller/bookController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', bookController.getBooks);

router.post('/', authMiddleware, roleMiddleware(['admin']), bookController.createBook);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), bookController.updateBook);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), bookController.deleteBook);

module.exports = router;
