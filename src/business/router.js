const MODULE_NAME = 'BUSINESS.ROUTER';
const express = require('express');
const logger = require('../utils/logger');
const save = require('./save');

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

async function add(req, res) {
  try {
    const result = await save(req.body, req.prisma);
    return res.status(201).json({ message: 'OK', result });
  } catch (e) {
    logger.error(`${MODULE_NAME} 9AFDF39B: Exception`, {
      eMessage: e.message,
      eCode: e.code,
    });

    return res.status(500).json({ message: e.message });
  }
}

router.get('/', index);
router.post('/', [express.json()], add);

module.exports = router;
