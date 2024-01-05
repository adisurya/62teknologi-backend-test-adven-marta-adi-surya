const MODULE_NAME = 'BUSINESS.ROUTER';
const express = require('express');
const { body, validationResult } = require('express-validator');

const logger = require('../utils/logger');
const upsert = require('./upsert');
const paginate = require('./paginate');
const remove = require('./delete');

const router = express.Router();

async function index(req, res) {
  try {
    const businesses = await paginate(req.query, req.prisma);
    return res.json({ message: 'OK', businesses });
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
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(422).json({ message: 'Invalid data', errors: validationErrors.mapped() });
    }
    req.body.id = '';
    console.log(req.environments);
    const center = {
      latitude: req.environments.CENTER_LATITUDE,
      longitude: req.environments.CENTER_LONGITUDE,
    };
    const result = await upsert(req.body, req.prisma, center);
    return res.status(201).json({ message: 'OK', result });
  } catch (e) {
    logger.error(`${MODULE_NAME} 9AFDF39B: Exception`, {
      eMessage: e.message,
      eCode: e.code,
    });

    return res.status(500).json({ message: e.message });
  }
}

async function del(req, res) {
  const id = req.body.id || '';
  const { prisma } = req;

  try {
    const business = await prisma.business.findUnique({
      where: {
        id,
      },
    });
    if (!business) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    const deleted = await remove(business, prisma);

    return res.status(200).json({ message: 'OK', deleted });
  } catch (e) {
    logger.error(`${MODULE_NAME} 9AFDF39B: Exception`, {
      eMessage: e.message,
      eCode: e.code,
    });

    return res.status(500).json({ message: e.message });
  }
}

async function edit(req, res) {
  const id = req.body.id || '';
  const { prisma, body: data = {} } = req;

  try {
    const business = await prisma.business.findUnique({
      where: {
        id,
      },
    });
    if (!business) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    const updated = await upsert(data, prisma);

    return res.status(200).json({ message: 'OK', updated });
  } catch (e) {
    logger.error(`${MODULE_NAME} 9AFDF39B: Exception`, {
      eMessage: e.message,
      eCode: e.code,
    });

    return res.status(500).json({ message: e.message });
  }
}

function addMiddlewares() {
  return [
    express.json(),
    body('name')
      .notEmpty()
      .withMessage('Name is required.')
      .isLength({ max: 191 })
      .withMessage('Name max 191 characters.'),
    body('phone')
      .notEmpty()
      .withMessage('Phone is required.'),
    body('price')
      .notEmpty()
      .withMessage('Price is required.'),
  ];
}

function editMiddlewares() {
  return [
    express.json(),
    body('id').notEmpty(),
    body('name')
      .notEmpty()
      .withMessage('Name is required.')
      .isLength({ max: 191 })
      .withMessage('Name max 191 characters.'),
    body('phone')
      .notEmpty()
      .withMessage('Phone is required.'),
    body('price')
      .notEmpty()
      .withMessage('Price is required.'),
  ];
}

router.get('/', index);
router.post('/', addMiddlewares(), add);
router.put('/', editMiddlewares(), edit);
router.delete('/', [express.json()], del);

module.exports = router;
