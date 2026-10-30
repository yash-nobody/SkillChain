import { signToken } from '../utils/jwt.js';
import { User } from '../models/User.js';
import { StudentProfile } from '../models/StudentProfile.js';
import { getIsMongoConnected } from '../config/db.js';
import { storeService } from '../services/storeService.js';

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (student, company, recruiter)
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, title, institution, studentIdNumber, phone, degree } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanStudentId = studentIdNumber ? studentIdNumber.trim() : '';

    if (role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Platform administrator accounts cannot be self-registered.',
      });
    }

    if (getIsMongoConnected()) {
      // 1. Check duplicate email (normalized)
      const emailExists = await User.findOne({ email: cleanEmail });
      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: 'This account already exists. Please log in instead.',
        });
      }

      // 2. Check duplicate student registration/enrollment number if provided
      if (cleanStudentId) {
        const studentIdExists = await User.findOne({ studentIdNumber: cleanStudentId });
        if (studentIdExists) {
          return res.status(409).json({
            success: false,
            message: 'A student account with this registration or enrollment number already exists.',
          });
        }
      }

      // 3. Create real user record (isDemo = false)
      const user = await User.create({
        name: name.trim(),
        email: cleanEmail,
        password,
        role: role || 'student',
        studentIdNumber: cleanStudentId,
        title: title || (role === 'student' ? 'Student' : ''),
        institution: institution || '',
        isDemo: false,
      });

      // 4. Create CLEAN student profile for real students (NO DUMMY DATA)
      if (user.role === 'student') {
        const randomPassportNum = Math.floor(10000 + Math.random() * 90000);
        const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'ST';

        await StudentProfile.create({
          userId: user._id,
          email: cleanEmail,
          fullName: user.name,
          studentIdNumber: cleanStudentId,
          passportId: `SKC-PASSPORT-${randomPassportNum}-${initials}`,
          profileImage: '',
          headline: title || 'Student',
          aboutMe: '',
          phone: phone || '',
          location: '',
          education: institution ? [{
            school: institution,
            degree: degree || 'Degree Program',
            branch: '',
            currentYear: '',
            graduationYear: '',
            cgpa: ''
          }] : [],
          skills: [], // EMPTY FOR REAL STUDENTS
          experience: [], // EMPTY FOR REAL STUDENTS
          projects: [], // EMPTY FOR REAL STUDENTS
          completionPercentage: 25,
          trustScore: 60, // Exactly 60/100 default for newly registered students
          isDemo: false,
        });
      }

      const token = signToken({ id: user._id, role: user.role, email: user.email });

      return res.status(201).json({
        success: true,
        message: 'Account created successfully.',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          studentIdNumber: user.studentIdNumber,
          title: user.title,
          institution: user.institution,
          avatar: user.avatar,
          isDemo: false,
        },
      });
    } else {
      // In-memory mode (MongoDB unavailable)
      const emailExists = storeService.findUserByEmail(cleanEmail);
      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: 'This account already exists. Please log in instead.',
        });
      }

      if (cleanStudentId) {
        const studentIdExists = storeService.findUserByStudentId(cleanStudentId);
        if (studentIdExists) {
          return res.status(409).json({
            success: false,
            message: 'A student account with this registration or enrollment number already exists.',
          });
        }
      }

      const user = await storeService.createUser({
        name: name.trim(),
        email: cleanEmail,
        password,
        role: role || 'student',
        studentIdNumber: cleanStudentId,
        title: title || (role === 'student' ? 'Student' : ''),
        institution: institution || '',
        phone: phone || '',
        degree: degree || '',
      });

      const token = signToken({ id: user.id, role: user.role, email: user.email });

      return res.status(201).json({
        success: true,
        message: 'Account created successfully.',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          studentIdNumber: user.studentIdNumber,
          title: user.title,
          institution: user.institution,
          avatar: user.avatar,
          isDemo: false,
        },
      });
    }
  } catch (err) {
    next(err);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and get JWT
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (getIsMongoConnected()) {
      let query = { email: cleanEmail };
      if (role) query.role = role;

      const user = await User.findOne(query).select('+password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or credentials for the specified role.',
        });
      }

      const isMatch = user.isDemo
        ? (await user.matchPassword(password || 'demo-password-123') || password === 'demo-password-123')
        : (password ? await user.matchPassword(password) : false);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
      }

      const token = signToken({ id: user._id, role: user.role, email: user.email });

      return res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          studentIdNumber: user.studentIdNumber,
          title: user.title,
          institution: user.institution,
          avatar: user.avatar,
          isDemo: user.isDemo || false,
        },
      });
    } else {
      const user = storeService.findUserByEmail(cleanEmail);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Account not found. Please check your email or register.',
        });
      }

      if (role && user.role !== role) {
        return res.status(401).json({
          success: false,
          message: `This account is registered as a ${user.role}, not a ${role}.`,
        });
      }

      const isMatch = user.isDemo
        ? (await storeService.comparePassword(password || 'demo-password-123', user) || password === 'demo-password-123')
        : (password ? await storeService.comparePassword(password, user) : false);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
      }

      const token = signToken({ id: user.id, role: user.role, email: user.email });

      return res.json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          studentIdNumber: user.studentIdNumber,
          title: user.title,
          institution: user.institution,
          avatar: user.avatar,
          isDemo: user.isDemo || false,
        },
      });
    }
  } catch (err) {
    next(err);
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get currently authenticated user details
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (err) {
    next(err);
  }
};
