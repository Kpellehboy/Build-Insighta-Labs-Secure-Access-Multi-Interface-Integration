const express = require('express');
const router = express.Router();
const { createProfile, getProfileById, getAllProfiles, deleteProfile, searchProfiles } = require('../controllers/profileController');


router.get('/search', searchProfiles);   // <-- NEW
router.post('/', createProfile);
router.get('/:id', getProfileById);
router.get('/', getAllProfiles);
router.delete('/:id', deleteProfile);


module.exports = router;