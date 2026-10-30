import jwt from 'jsonwebtoken';

export const signToken = (payload) => {
  const secret = process.env.JWT_SECRET || 'skillchain_verifiable_passport_jwt_super_secret_key_2026';
  const expiresIn = process.env.JWT_EXPIRE || '7d';
  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || 'skillchain_verifiable_passport_jwt_super_secret_key_2026';
  return jwt.verify(token, secret);
};

