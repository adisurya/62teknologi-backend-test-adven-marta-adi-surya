const MODULE_NAME = 'BUSINESS.ROUTER';
const express = require('express');
const { body, query, validationResult } = require('express-validator');

const logger = require('../utils/logger');
const upsert = require('./upsert');
const paginate = require('./paginate');
const remove = require('./delete');
const findByName = require('./find-by-name');

const router = express.Router();

async function index(req, res) {
  try {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(422).json({ message: 'Invalid parameters', errors: validationErrors.mapped() });
    }

    const businesses = await paginate(req.query, req.prisma);
    const region = {
      center: {
        latitude: req.environments.CENTER_LATITUDE,
        longitude: req.environments.CENTER_LONGITUDE,
      },
    };

    return res.json({ message: 'OK', businesses, region });
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
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(422).json({ message: 'Invalid data', errors: validationErrors.mapped() });
    }

    const business = await prisma.business.findUnique({
      where: {
        id,
      },
    });
    if (!business) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    const center = {
      latitude: req.environments.CENTER_LATITUDE,
      longitude: req.environments.CENTER_LONGITUDE,
    };

    const updated = await upsert(data, prisma, center);

    return res.status(200).json({ message: 'OK', updated });
  } catch (e) {
    logger.error(`${MODULE_NAME} 9AFDF39B: Exception`, {
      eMessage: e.message,
      eCode: e.code,
    });

    return res.status(500).json({ message: e.message });
  }
}

function bodyMiddlewares() {
  return [
    express.json(),
    body('name')
      .notEmpty()
      .withMessage('Name is required.')
      .isLength({ max: 191 })
      .withMessage('Name max 191 characters.')
      .custom(async (value, { req }) => {
        const id = req.body && req.body.id;
        const business = await findByName(value, id, req.prisma);

        if (business) {
          throw new Error('Name already in use');
        }
      }),
    body('phone')
      .notEmpty()
      .withMessage('Phone is required.'),
    body('price')
      .notEmpty()
      .withMessage('Price is required.'),
    body('coordinates.latitude')
      .notEmpty()
      .withMessage('coordinates.latitude (latitude) is required.'),
    body('coordinates.longitude')
      .notEmpty()
      .withMessage('coordinates.longitude (longitude) is required.'),

    body('location.address1')
      .notEmpty()
      .withMessage('location.address1 (address1) is required.'),
    body('location.city')
      .notEmpty()
      .withMessage('location.city (city) is required.'),
    body('location.zip_code')
      .notEmpty()
      .withMessage('location.zip_code (zip_code) is required.'),
    body('location.country')
      .notEmpty()
      .withMessage('location.country (country) is required.'),
    body('location.state')
      .notEmpty()
      .withMessage('location.state (state) is required.'),

  ];
}

function queryMiddlewares() {
  return [
    query('limit')
      .optional()
      .isInt({ max: 50 })
      .withMessage('Limit is greater than maximum  of 50.')
      .isInt({ min: 1 })
      .withMessage('Limit is lower than minimum  of 1.')
      .toInt(),
    query('offset')
      .optional()
      .isInt({ max: 1000 })
      .withMessage('Offset is greater than maximum  of 1000.')
      .isInt({ min: 0 })
      .withMessage('Offset is lower than minimum  of 0.')
      .toInt(),
  ];
}

router.get('/', queryMiddlewares(), index);
router.get('/search', queryMiddlewares(), index);
router.post('/', bodyMiddlewares(), add);
router.put('/', bodyMiddlewares(), edit);
router.delete('/', [express.json()], del);

module.exports = router;
