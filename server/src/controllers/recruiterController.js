import { storeService } from '../services/storeService.js';

export const searchCandidates = async (req, res, next) => {
  try {
    const { query, university, minScore } = req.query;
    let candidates = storeService.getAllCandidates();

    if (query) {
      const q = query.toLowerCase();
      candidates = candidates.filter(
        c =>
          c.name.toLowerCase().includes(q) ||
          c.primaryRole.toLowerCase().includes(q) ||
          c.topSkills.some(s => s.toLowerCase().includes(q))
      );
    }

    if (university) {
      candidates = candidates.filter(c =>
        c.university.toLowerCase().includes(university.toLowerCase())
      );
    }

    if (minScore) {
      candidates = candidates.filter(c => c.trustScore >= Number(minScore));
    }

    res.json({
      success: true,
      count: candidates.length,
      data: candidates,
    });
  } catch (err) {
    next(err);
  }
};

export const toggleShortlist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = storeService.toggleShortlist(id);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Candidate not found.' });
    }

    res.json({
      success: true,
      message: `Candidate ${updated.shortlisted ? 'shortlisted' : 'removed from shortlist'}.`,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

