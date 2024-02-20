const Organization = require('../models/organizationModel');

const createOrganization = async (req, res) => {
  try {
    const organization = new Organization(req.body);
    await organization.validate(); // Validate organization data
    await organization.save(); // Save organization to database
    res.status(201).json(organization);
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Handle validation errors
      return res.status(400).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find();

    if (organizations.length > 0) {
      res.status(200).json(organizations);
    } else {
      res.status(404).json({ error: 'Organization not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getOrganizationById = async (req, res) => {
  try {
    const organizationId = req.params.id;
    const queryParams = req.query;

    if (Object.keys(queryParams).length === 0) {
      const organization = await Organization.findById(organizationId);
      if (!organization) {
        return res.status(404).json({ error: 'Organization not found' });
      }
      return res.status(200).json(organization);
    }

    const aggregationPipeline = buildAggregationPipeline(queryParams);
    const filteredOrganization = await Organization.aggregate(aggregationPipeline);

    if (filteredOrganization.length === 0) {
      return res.status(404).json({ error: 'No matching organization found' });
    }

    return res.status(200).json(filteredOrganization);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to construct the aggregation pipeline based on query parameters
const buildAggregationPipeline = (queryParams) => {
  const matchQuery = buildMatchQuery(queryParams);
  return [
    { $unwind: '$addresses' },
    { $match: matchQuery },
    {
      $group: {
        _id: '$_id',
        name: { $first: '$name' },
        addresses: { $push: '$addresses' },
      },
    },
  ];
};

// Function to construct the match query based on query parameters
const buildMatchQuery = (queryParams) => {
  const matchQuery = {};
  Object.keys(queryParams).forEach((key) => {
    if (key !== 'id') {
      matchQuery[`addresses.${key}`] = queryParams[key];
    }
  });
  return matchQuery;
};

const updateOrganization = async (req, res) => {
  try {
    const organization = await Organization.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    res.status(200).json(organization);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteOrganization = async (req, res) => {
  try {
    const deletedOrganization = await Organization.findByIdAndDelete(req.params.id);

    if (!deletedOrganization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    res.sendStatus(204); // No content response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete organization' });
  }
};

module.exports = {
  createOrganization,
  getAllOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
};
