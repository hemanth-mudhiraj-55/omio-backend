const express = require('express');
const { getSiteSettings } = require('../db/database');

const router = express.Router();

router.get('/', (_req, res) => {
  res.json(getSiteSettings());
});

module.exports = router;
