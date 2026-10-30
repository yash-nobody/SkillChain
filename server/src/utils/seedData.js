import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.js';
import { Certificate } from '../models/Certificate.js';
import { VerificationRequest } from '../models/VerificationRequest.js';
import { IssuerCompany } from '../models/IssuerCompany.js';
import {
  seedUsers,
  seedCertificates,
  seedVerificationRequests,
  seedIssuers
} from '../data/mockSeed.js';

dotenv.config();

const seed = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillchain';
  try {
    console.log(`Connecting to MongoDB at: ${mongoURI}`);
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB. Clearing existing data...');

    await User.deleteMany({});
    await Certificate.deleteMany({});
    await VerificationRequest.deleteMany({});
    await IssuerCompany.deleteMany({});

    console.log('Seeding demo users (with hashed passwords)...');
    for (const u of seedUsers) {
      await User.create(u);
    }

    console.log('Seeding certificates...');
    await Certificate.insertMany(seedCertificates);

    console.log('Seeding verification claims...');
    await VerificationRequest.insertMany(seedVerificationRequests);

    console.log('Seeding issuer organizations...');
    await IssuerCompany.insertMany(seedIssuers);

    console.log('MongoDB Seed complete successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();

