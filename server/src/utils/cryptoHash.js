import crypto from 'crypto';

/**
 * Generates an immutable SHA-256 cryptographic verification hash
 * simulating blockchain ledger anchoring for verifiable credentials.
 */
export const generateCertificateHash = (payload) => {
  const content = JSON.stringify({
    title: payload.title,
    recipient: payload.recipientName || payload.studentEmail,
    issuer: payload.issuer || payload.issuingOrg,
    issueDate: payload.issueDate || new Date().toISOString(),
    skills: payload.skills || [],
    salt: crypto.randomBytes(8).toString('hex')
  });

  return '0x' + crypto.createHash('sha256').update(content).digest('hex');
};

/**
 * Generates an incremented simulated ledger block number
 */
export const generateLedgerBlock = () => {
  return 18940000 + Math.floor(Math.random() * 25000);
};

