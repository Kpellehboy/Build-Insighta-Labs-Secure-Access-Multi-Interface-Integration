// scripts/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Profile = require('../src/models/Profile');
const fs = require('fs');
const path = require('path');

const connectDB = require('../src/config/db');

const seedDatabase = async () => {
  try {
    await connectDB();
    
    
    const filePath = path.join(__dirname, '..', 'seed_profiles.json');
    const rawData = fs.readFileSync(filePath, 'utf8');
    const profiles = JSON.parse(rawData);
    
    let inserted = 0;
    let skipped = 0;
    
    for (const p of profiles) {
      // Check if profile already exists by name (case-insensitive)
      const exists = await Profile.findOne({ normalizedName: p.name.toLowerCase().trim() });
      if (exists) {
        skipped++;
        continue;
      }
      
      const profile = new Profile({
        name: p.name,
        normalizedName: p.name.toLowerCase().trim(),
        gender: p.gender,
        genderProbability: p.gender_probability,
        sampleSize: p.sample_size || null,
        age: p.age,
        ageGroup: p.age_group,
        countryId: p.country_id,
        countryName: p.country_name,
        countryProbability: p.country_probability,
        createdAt: p.created_at ? new Date(p.created_at) : new Date()
      });
      
      await profile.save();
      inserted++;
    }
    
    console.log(`Seeding complete. Inserted: ${inserted}, Skipped (duplicates): ${skipped}`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();