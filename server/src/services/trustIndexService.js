/**
 * SkillChain Trust Index Calculation Service
 * 
 * Rules:
 * - Default Base Score: 60 / 100 for all newly registered students
 * - Verified Certificates: +5 pts each (Max +20 pts) (status: 'Verified' or 'Company Confirmed')
 * - Verified Experience/Internships: +5 pts each (Max +10 pts) (isVerified === true)
 * - Evaluated Projects with verified evidence: +5 pts each (Max +10 pts) (isVerified === true)
 * - Verified Education: +5 pts (Max +5 pts) (isVerified === true)
 * 
 * Maximum additional points: +45
 * Formula: Math.min(100, Math.max(0, 60 + points))
 * 
 * Integrity guarantees:
 * - Empty profile starts at exactly 60.
 * - Self-reported skills alone = +0 points.
 * - Uploaded but unverified/pending certificates = +0 points.
 * - Rejected certificates = +0 points.
 * - Backend-calculated only; frontend cannot forge its own score.
 */

export const calculateTrustIndex = ({
  certificates = [],
  experience = [],
  projects = [],
  education = [],
} = {}) => {
  const BASE_SCORE = 60;

  // 1. Verified Certificates: +5 each, max +20
  const verifiedCerts = (certificates || []).filter(
    (c) => c && (c.status === 'Verified' || c.status === 'Company Confirmed')
  );
  const certPoints = Math.min(20, verifiedCerts.length * 5);

  // 2. Verified Experience / Internships: +5 each, max +10
  const verifiedExperience = (experience || []).filter(
    (e) => e && (e.isVerified === true || e.verified === true)
  );
  const expPoints = Math.min(10, verifiedExperience.length * 5);

  // 3. Evaluated Projects with verified evidence: +5 each, max +10
  const verifiedProjects = (projects || []).filter(
    (p) => p && (p.isVerified === true || p.verified === true)
  );
  const projPoints = Math.min(10, verifiedProjects.length * 5);

  // 4. Verified Education: +5 max
  const verifiedEducation = (education || []).filter(
    (ed) => ed && (ed.isVerified === true || ed.verified === true)
  );
  const eduPoints = verifiedEducation.length > 0 ? 5 : 0;

  const additionalPoints = certPoints + expPoints + projPoints + eduPoints;
  const totalScore = Math.min(100, Math.max(0, BASE_SCORE + additionalPoints));

  return {
    score: totalScore,
    breakdown: {
      baseScore: BASE_SCORE,
      certificates: {
        count: verifiedCerts.length,
        points: certPoints,
        maxPoints: 20,
        items: verifiedCerts.map((c) => ({
          id: c.id,
          title: c.title,
          issuer: c.issuer,
          status: c.status,
        })),
      },
      experience: {
        count: verifiedExperience.length,
        points: expPoints,
        maxPoints: 10,
        items: verifiedExperience.map((e) => ({
          id: e.id,
          organization: e.organization,
          role: e.role,
        })),
      },
      projects: {
        count: verifiedProjects.length,
        points: projPoints,
        maxPoints: 10,
        items: verifiedProjects.map((p) => ({
          id: p.id,
          title: p.title,
        })),
      },
      education: {
        count: verifiedEducation.length,
        points: eduPoints,
        maxPoints: 5,
        items: verifiedEducation.map((ed) => ({
          school: ed.school,
          degree: ed.degree,
        })),
      },
      totalEarnedPoints: additionalPoints,
      maxPossibleScore: 100,
    },
  };
};

