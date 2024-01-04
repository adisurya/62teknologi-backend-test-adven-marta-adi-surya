const MODULE_NAME = 'SRC.BUSINESS.ROUTER';
const express = require('express');
const logger = require('../utils/logger');

const router = express.Router();

function index(req, res) {
  try {
    return res.json({ message: 'OK' });
  } catch (e) {
    logger.error(`${MODULE_NAME} 66640B42: Exception`, {
      eMessage: e.message,
      eCode: e.code,
    });
    return res.status(500).json({ message: e.message });
  }
}

router.get('/', index);
module.exports = router;
