import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => `edu-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  },
  school: {
    type: String,
    required: [true, 'College or university name is required'],
    trim: true,
  },
  degree: {
    type: String,
    required: [true, 'Degree is required'],
    trim: true,
  },
  branch: {
    type: String,
    default: '',
    trim: true,
  },
  currentYear: {
    type: String,
    default: '',
    trim: true,
  },
  graduationYear: {
    type: String,
    default: '',
    trim: true,
  },
  cgpa: {
    type: String,
    default: '',
    trim: true,
  }
}, { _id: false });

const skillItemSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => `skl-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  },
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true,
  },
  category: {
    type: String,
    default: 'Technical',
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Intermediate',
  },
  yearsOfExperience: {
    type: String,
    default: '1 year',
  },
  isVerified: {
    type: Boolean,
    default: false, // Default to self-reported until evidence is verified!
  },
  verifiedDate: {
    type: String,
    default: '',
  },
  verifiedBy: {
    type: String,
    default: '',
  }
}, { _id: false });

const experienceSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => `exp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  },
  organization: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true,
  },
  role: {
    type: String,
    required: [true, 'Role title is required'],
    trim: true,
  },
  startDate: {
    type: String,
    default: '',
  },
  endDate: {
    type: String,
    default: 'Present',
  },
  description: {
    type: String,
    default: '',
  },
  certificateUrl: {
    type: String,
    default: '',
  },
  isVerified: {
    type: Boolean,
    default: false, // Unverified until verified independently
  }
}, { _id: false });

const studentProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  studentIdNumber: {
    type: String,
    trim: true,
    default: '',
  },
  passportId: {
    type: String,
    required: true,
    unique: true,
  },
  profileImage: {
    type: String,
    default: '',
  },
  headline: {
    type: String,
    default: '',
    trim: true,
  },
  aboutMe: {
    type: String,
    default: '',
  },
  phone: {
    type: String,
    default: '',
    trim: true,
  },
  location: {
    type: String,
    default: '',
    trim: true,
  },
  linkedinUrl: {
    type: String,
    default: '',
    trim: true,
  },
  githubUrl: {
    type: String,
    default: '',
    trim: true,
  },
  portfolioUrl: {
    type: String,
    default: '',
    trim: true,
  },
  education: [educationSchema],
  skills: [skillItemSchema],
  experience: [experienceSchema],
  projects: [{
    id: String,
    title: String,
    description: String,
    github: String,
    demo: String,
    tech: [String],
    isVerified: { type: Boolean, default: false }
  }],
  completionPercentage: {
    type: Number,
    default: 20,
  },
  trustScore: {
    type: Number,
    default: 60, // Exactly 60/100 default for new students
  },
  isDemo: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Helper to calculate profile completion
studentProfileSchema.methods.calculateCompletion = function () {
  let score = 0;
  if (this.fullName) score += 10;
  if (this.email) score += 10;
  if (this.profileImage) score += 15;
  if (this.headline) score += 15;
  if (this.aboutMe && this.aboutMe.length > 20) score += 15;
  if (this.location || this.phone) score += 10;
  if (this.education && this.education.length > 0) score += 10;
  if (this.skills && this.skills.length > 0) score += 10;
  if (this.linkedinUrl || this.githubUrl || this.portfolioUrl) score += 5;
  return Math.min(100, score);
};

export const StudentProfile = mongoose.models.StudentProfile || mongoose.model('StudentProfile', studentProfileSchema);
