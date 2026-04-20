require('dotenv').config();
const mongoose = require('mongoose');
const Profile = require('../src/models/Profile');
const fs = require('fs');
const path = require('path');
const connectDB = require('../src/config/db');

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('Connected to DB, starting seed...');

    const filePath = path.join(__dirname, '..', 'seed_profiles.json');
    console.log(`Reading JSON from: ${filePath}`);
    const rawData = fs.readFileSync(filePath, 'utf8');
    let parsed = JSON.parse(rawData);
    let profiles = Array.isArray(parsed) ? parsed : parsed.profiles;

    console.log(`Read ${profiles.length} profiles from JSON`);

    let inserted = 0;
    let errors = 0;

    for (let i = 0; i < profiles.length; i++) {
      const p = profiles[i];
      try {
        const exists = await Profile.findOne({ name: p.name });
        if (!exists) {
          await Profile.create({
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
          inserted++;
          if (inserted % 100 === 0) console.log(`Inserted ${inserted} profiles so far...`);
        }
      } catch (err) {
        errors++;
        console.error(`Error with profile ${p.name}:`, err.message);
      }
    }

    console.log(`Seeding complete. Inserted ${inserted} new profiles. Errors: ${errors}`);
    process.exit(0);
  } catch (error) {
    console.error('Fatal seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();