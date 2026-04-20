const mongoose = require('mongoose');
const { v7: uuidv7 } = require('uuid');

const profileSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => uuidv7(),
    alias: 'id'
  },
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  normalizedName: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', null],
    default: null
  },
  genderProbability: {
    type: Number,
    min: 0,
    max: 1,
    default: null
  },
  sampleSize: {
    type: Number,
    min: 0,
    default: null
  },
  age: {
    type: Number,
    min: 0,
    default: null
  },
  ageGroup: {
    type: String,
    enum: ['child', 'teenager', 'adult', 'senior', null],
    default: null,
    index: true
  },
  countryId: {
    type: String,
    uppercase: true,
    trim: true,
    default: null,
    index: true
  },
  countryName: {            // <-- NEW FIELD
    type: String,
    trim: true,
    default: null
  },
  countryProbability: {
    type: Number,
    min: 0,
    max: 1,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
    index: true
  }
}, {
  timestamps: false,
  versionKey: false,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.normalizedName;

      // Map to required snake_case fields
      ret.gender_probability = ret.genderProbability;
      delete ret.genderProbability;

      ret.sample_size = ret.sampleSize;
      delete ret.sampleSize;

      ret.country_id = ret.countryId;
      delete ret.countryId;

      ret.country_name = ret.countryName;   // <-- add mapping
      delete ret.countryName;

      ret.country_probability = ret.countryProbability;
      delete ret.countryProbability;

      ret.age_group = ret.ageGroup;
      delete ret.ageGroup;

      ret.created_at = ret.createdAt;
      delete ret.createdAt;

      if (ret.created_at && ret.created_at.toISOString) {
        ret.created_at = ret.created_at.toISOString();
      }
      return ret;
    }
  }
});

profileSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.normalizedName = this.name.toLowerCase().trim();
  }
  next();
});

profileSchema.statics.findByName = function(name) {
  return this.findOne({ normalizedName: name.toLowerCase().trim() });
};

module.exports = mongoose.model('Profile', profileSchema);