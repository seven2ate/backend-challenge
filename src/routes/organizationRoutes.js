const express = require('express');
const {
  createOrganization,
  getAllOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
} = require('../controllers/organizationController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticate, createOrganization);
router.get('/', getAllOrganizations);
router.get('/:id', getOrganizationById);
router.put('/:id', authenticate, updateOrganization);
router.delete('/:id', authenticate, deleteOrganization);

module.exports = router;
