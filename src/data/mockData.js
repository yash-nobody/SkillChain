export const initialMockUser = {
  id: 'usr-student-01',
  role: 'student', // 'student' | 'company' | 'recruiter' | 'admin'
  name: 'Alex Chen',
  email: 'alex.chen@stanford.edu',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  title: 'Full-Stack & Cloud Systems Engineer',
  institution: 'Stanford University',
  degree: 'B.S. in Computer Science (Expected 2027)',
  passportId: 'SKC-PASSPORT-89412-AC',
  trustScore: 98,
  bio: 'Honors Computer Science student passionate about distributed systems, cloud native microservices, and AI-assisted developer tooling. Published researcher and open-source contributor.',
  location: 'San Francisco Bay Area, CA',
  github: 'https://github.com/alexchen-dev',
  linkedin: 'https://linkedin.com/in/alexchen-tech',
  website: 'https://alexchen.codes',
  completedProjects: 14,
  internshipsCompleted: 2,
  qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://skillchain.network/passport/SKC-PASSPORT-89412-AC',
};

export const demoAccounts = [
  {
    role: 'student',
    name: 'Alex Chen',
    email: 'alex.chen@stanford.edu',
    title: 'Student / Candidate',
    description: 'View Verifiable Passport, upload credentials, showcase skills',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    badge: 'Honors Student'
  },
  {
    role: 'company',
    name: 'Acme Cloud Technologies',
    email: 'credentials@acmecloud.io',
    title: 'Credential Issuer / Employer',
    description: 'Issue verifiable certificates, approve student claims',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80',
    badge: 'Enterprise Issuer'
  },
  {
    role: 'recruiter',
    name: 'Sarah Miller',
    email: 'sarah.m@globaltech-hire.com',
    title: 'Senior Technical Recruiter',
    description: 'Search verified talent pool, inspect audited skills',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    badge: 'Verified Employer'
  },
  {
    role: 'admin',
    name: 'SkillChain Protocol Governance',
    email: 'admin@skillchain.network',
    title: 'System Administrator',
    description: 'Manage verification queue, approve issuers, audit ledgers',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    badge: 'Root Authority'
  }
];

export const initialCertificates = [
  {
    id: 'SKC-2026-89412-V',
    title: 'Cloud Architecture & Distributed Microservices',
    issuer: 'Google Cloud Training & Stanford EECS',
    issuerCategory: 'Cloud & Infrastructure',
    issuerLogo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Google.png',
    issueDate: 'October 14, 2026',
    expiryDate: 'Never (Lifetime Verifiable)',
    status: 'Verified',
    verificationHash: '0x8f2b98e1a90c4d21e873b526da0f34081c741e893e1b7829',
    grade: 'Score: 98.4% (Summa Cum Laude)',
    skills: ['Go', 'Kubernetes', 'gRPC', 'Distributed Systems', 'Cloud Pub/Sub'],
    credentialType: 'Professional Specialization',
    verifiedBy: 'Google Cloud Verifiable Registry Authority #GCP-8819',
    ledgerBlock: 18942104,
    description: 'Rigorous 16-week advanced engineering curriculum demonstrating mastery of large-scale distributed architectures, fault-tolerant microservices, and container orchestration.',
    evidenceUrl: 'https://storage.googleapis.com/skillchain-credentials/certs/SKC-2026-89412-V.pdf'
  },
  {
    id: 'SKC-2026-77319-V',
    title: 'Advanced React, Next.js & TypeScript Engineering',
    issuer: 'Meta Open Source & Dev Academy',
    issuerCategory: 'Frontend Engineering',
    issuerLogo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
    issueDate: 'August 22, 2026',
    expiryDate: 'August 2029',
    status: 'Verified',
    verificationHash: '0x3c71a94f6e1820b9e8471b02938a1cf882e3019842a1bc77',
    grade: 'Top 2% Milestone Assessment',
    skills: ['React 19', 'TypeScript', 'Next.js App Router', 'Tailwind CSS', 'State Machines'],
    credentialType: 'Industry Master Certification',
    verifiedBy: 'Meta Verified Developer Standards Board',
    ledgerBlock: 18451920,
    description: 'Comprehensive certification verifying production-level mastery of React concurrency, server components, TypeScript strict typing, and high-performance client architectures.',
    evidenceUrl: 'https://storage.googleapis.com/skillchain-credentials/certs/SKC-2026-77319-V.pdf'
  },
  {
    id: 'SKC-2026-65120-V',
    title: 'Deep Learning & Neural Network Foundations',
    issuer: 'DeepLearning.AI & Stanford Online',
    issuerCategory: 'AI & Data Science',
    issuerLogo: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Neural_network_icon.svg',
    issueDate: 'May 30, 2026',
    expiryDate: 'Never (Lifetime)',
    status: 'Verified',
    verificationHash: '0x71e9a3b04c8f22e89a310c8d19762bf61039a8c1f9042b33',
    grade: 'Grade: A+ (100% on Capstone)',
    skills: ['PyTorch', 'Transformer Architectures', 'CNNs', 'Vector Search', 'Model Optimization'],
    credentialType: 'Academic Specialization',
    verifiedBy: 'DeepLearning.AI Academic Registrar',
    ledgerBlock: 17920145,
    description: 'In-depth laboratory research focusing on multi-head attention mechanisms, self-supervised representation learning, and edge model deployment.',
    evidenceUrl: 'https://storage.googleapis.com/skillchain-credentials/certs/SKC-2026-65120-V.pdf'
  },
  {
    id: 'SKC-2026-44321-V',
    title: 'Enterprise Software Engineering Internship Credential',
    issuer: 'Acme Cloud Technologies',
    issuerCategory: 'Industry Work Experience',
    issuerLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80',
    issueDate: 'September 1, 2026',
    expiryDate: 'Never',
    status: 'Verified',
    verificationHash: '0x55aa31b0e7741c880299f0183eec18402a7b29381e4b8899',
    grade: 'Exceeds Expectations (Return Offer Extended)',
    skills: ['PostgreSQL', 'Docker', 'RESTful APIs', 'Kafka', 'CI/CD Pipelines'],
    credentialType: 'Verified Internship Experience',
    verifiedBy: 'Acme Cloud Engineering VP & HR Verifier',
    ledgerBlock: 18602931,
    description: 'Awarded for exceptional performance during a 12-week software engineering internship optimizing database query execution time by 42% on core billing APIs.',
    evidenceUrl: 'https://storage.googleapis.com/skillchain-credentials/certs/SKC-2026-44321-V.pdf'
  },
  {
    id: 'SKC-2026-32109-P',
    title: 'Distributed Consensus & Fault-Tolerant Systems',
    issuer: 'MIT EECS Laboratory',
    issuerCategory: 'Systems Research',
    issuerLogo: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/MIT_logo.svg',
    issueDate: 'October 25, 2026',
    expiryDate: 'Lifetime',
    status: 'Pending',
    verificationHash: '0x99bb12e7a04c7810e9471b02138a1cf882e3019842a1bb44',
    grade: 'Under Review by Faculty Reviewer',
    skills: ['Raft Consensus', 'Distributed Hash Tables', 'C++', 'Network Emulation'],
    credentialType: 'Advanced Research Lab',
    verifiedBy: 'Awaiting Faculty Digital Key Signature',
    ledgerBlock: 0,
    description: 'Implementation and formal verification of a Paxos and Raft-based replicated state machine resilient to network partitioning and Byzantine failures.',
    evidenceUrl: 'https://storage.googleapis.com/skillchain-credentials/certs/SKC-2026-32109-P.pdf'
  },
  {
    id: 'SKC-2026-11980-R',
    title: 'Smart Contract Security & Bytecode Auditing',
    issuer: 'Web3 Security Guild',
    issuerCategory: 'Blockchain Security',
    issuerLogo: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Etherium-logo-purple.svg',
    issueDate: 'July 11, 2026',
    expiryDate: 'N/A',
    status: 'Rejected',
    verificationHash: '0x11cc45e9a04c7810e9471b02138a1cf882e3019842a1cc12',
    grade: 'Audit Incomplete',
    skills: ['Solidity', 'Slither', 'Foundry', 'Formal Verification'],
    credentialType: 'Guild Assessment',
    verifiedBy: 'Web3 Security Peer Audit Committee',
    ledgerBlock: 0,
    description: 'Submission flagged due to missing required unit test fuzzing documentation for re-entrancy vectors. Resubmission allowed after revised lab audit.',
    evidenceUrl: 'https://storage.googleapis.com/skillchain-credentials/certs/SKC-2026-11980-R.pdf'
  }
];

export const mockSkills = [
  { name: 'TypeScript & React', category: 'Frontend', level: 'Expert', verifiedCount: 4, endorsementRate: 98 },
  { name: 'Go & Microservices', category: 'Backend', level: 'Advanced', verifiedCount: 3, endorsementRate: 94 },
  { name: 'Kubernetes & Docker', category: 'DevOps & Cloud', level: 'Advanced', verifiedCount: 3, endorsementRate: 92 },
  { name: 'PyTorch & Deep Learning', category: 'AI & ML', level: 'Proficient', verifiedCount: 2, endorsementRate: 89 },
  { name: 'PostgreSQL & Redis', category: 'Database', level: 'Advanced', verifiedCount: 4, endorsementRate: 95 },
  { name: 'Distributed Systems', category: 'Architecture', level: 'Advanced', verifiedCount: 2, endorsementRate: 91 },
  { name: 'Technical Communication', category: 'Soft Skills', level: 'Expert', verifiedCount: 5, endorsementRate: 99 },
];

export const mockProjects = [
  {
    id: 'proj-01',
    title: 'AuraDB – Distributed Key-Value Store',
    description: 'A fault-tolerant distributed key-value store built in Go with Raft consensus, consistent hashing, and WAL replication handling 45k ops/sec.',
    github: 'https://github.com/alexchen-dev/auradb',
    demo: 'https://auradb.io/benchmarks',
    stars: 342,
    tech: ['Go', 'Raft', 'gRPC', 'Docker'],
    verificationBadge: 'Verified Codebase & Benchmarks',
    verifiedBy: 'Stanford EECS Open Source Review'
  },
  {
    id: 'proj-02',
    title: 'NeuroLens – Realtime Medical Image Segmentation',
    description: 'Edge-optimized PyTorch model for detecting retinal anomalies with 99.2% sensitivity, deployed via WebAssembly in browser.',
    github: 'https://github.com/alexchen-dev/neurolens',
    demo: 'https://neurolens-health.dev',
    stars: 189,
    tech: ['Python', 'PyTorch', 'ONNX', 'React', 'Wasm'],
    verificationBadge: 'Verified ML Capstone Winner',
    verifiedBy: 'DeepLearning.AI Capstone Committee'
  },
  {
    id: 'proj-03',
    title: 'CloudMesh – Multi-Cluster K8s Telemetry',
    description: 'Observability platform providing real-time eBPF network packet tracing and dynamic pod scaling recommendations.',
    github: 'https://github.com/alexchen-dev/cloudmesh',
    demo: 'https://cloudmesh-demo.app',
    stars: 215,
    tech: ['Rust', 'eBPF', 'Kubernetes', 'Grafana'],
    verificationBadge: 'Acme Cloud Hackathon 1st Place',
    verifiedBy: 'Acme Cloud Engineering'
  }
];

export const mockInternships = [
  {
    id: 'intern-01',
    company: 'Acme Cloud Technologies',
    role: 'Software Engineering Intern (Cloud Platforms)',
    period: 'June 2026 - August 2026',
    location: 'San Francisco, CA (Hybrid)',
    summary: 'Spearheaded zero-downtime database migration tooling, reducing cross-region replication lag from 420ms to 65ms. Mentored 2 high school STEM fellows.',
    verifiedStatus: 'Verified by Acme VP of Engineering',
    verifiedDate: 'Sep 2026',
    badgeHash: '0x55aa31b0e7741c880299f0183eec18402a7b29381e4b8899'
  },
  {
    id: 'intern-02',
    company: 'NextGen AI Labs',
    role: 'Undergraduate AI Research Fellow',
    period: 'Jan 2026 - May 2026',
    location: 'Palo Alto, CA',
    summary: 'Researched low-rank adaptation (LoRA) efficiency on multimodal vision models. Co-authored workshop paper submitted to CVPR.',
    verifiedStatus: 'Verified by Lab Director',
    verifiedDate: 'May 2026',
    badgeHash: '0x71e9a3b04c8f22e89a310c8d19762bf61039a8c1f9042b33'
  }
];

export const mockRecentActivity = [
  {
    id: 'act-01',
    title: 'Credential Verified on Ledger',
    detail: 'Cloud Architecture & Distributed Microservices verified by Google Cloud Authority',
    time: '2 hours ago',
    type: 'verified'
  },
  {
    id: 'act-02',
    title: 'Recruiter Viewed Skill Passport',
    detail: 'Sarah Miller (GlobalTech Innovations) unlocked Alex Chen\'s verified dossier',
    time: 'Yesterday at 4:15 PM',
    type: 'view'
  },
  {
    id: 'act-03',
    title: 'New Verification Request Submitted',
    detail: 'MIT EECS Laboratory received claim for Distributed Consensus course',
    time: '3 days ago',
    type: 'request'
  },
  {
    id: 'act-04',
    title: 'Verified Return Offer Issued',
    detail: 'Acme Cloud Technologies signed verifiable internship completion certificate',
    time: '1 week ago',
    type: 'offer'
  }
];

export const mockCandidates = [
  {
    id: 'cand-01',
    name: 'Alex Chen',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    university: 'Stanford University',
    degree: 'B.S. Computer Science (\'27)',
    location: 'San Francisco, CA',
    trustScore: 98,
    primaryRole: 'Full Stack & Cloud Systems Engineer',
    topSkills: ['Go', 'React', 'Kubernetes', 'Distributed Systems', 'PyTorch'],
    verifiedCertsCount: 4,
    pendingCertsCount: 1,
    availability: 'Available Summer 2027 (Full-time / Intern)',
    passportId: 'SKC-PASSPORT-89412-AC',
    shortlisted: false,
    bio: 'High-performing systems engineer with top-tier verified credentials from Google Cloud and Meta. 14 completed projects.'
  },
  {
    id: 'cand-02',
    name: 'Maya Patel',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    university: 'UC Berkeley',
    degree: 'B.S. EECS & Data Science (\'26)',
    location: 'Berkeley, CA',
    trustScore: 96,
    primaryRole: 'AI/ML Research & NLP Engineer',
    topSkills: ['Python', 'PyTorch', 'LLMs', 'C++', 'Ray', 'CUDA'],
    verifiedCertsCount: 6,
    pendingCertsCount: 0,
    availability: 'Open to Offers (Immediate / 2026)',
    passportId: 'SKC-PASSPORT-44102-MP',
    shortlisted: true,
    bio: 'Published NLP researcher. Implemented low-latency speculative decoding pipeline for open-weights models.'
  },
  {
    id: 'cand-03',
    name: 'Liam Johansson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    university: 'Carnegie Mellon University',
    degree: 'M.S. Software Engineering (\'26)',
    location: 'Pittsburgh, PA (Open to Remote)',
    trustScore: 99,
    primaryRole: 'Site Reliability & Infrastructure Engineer',
    topSkills: ['Rust', 'Terraform', 'Kubernetes', 'AWS', 'Linux Kernel', 'Prometheus'],
    verifiedCertsCount: 7,
    pendingCertsCount: 1,
    availability: 'Full-time Fall 2026',
    passportId: 'SKC-PASSPORT-90214-LJ',
    shortlisted: false,
    bio: 'SRE Specialist with proven zero-downtime infrastructure orchestration certifications from AWS and CNCF.'
  },
  {
    id: 'cand-04',
    name: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    university: 'Georgia Tech',
    degree: 'B.S. Computer Science (\'27)',
    location: 'Atlanta, GA',
    trustScore: 94,
    primaryRole: 'Full Stack Product Engineer',
    topSkills: ['TypeScript', 'Next.js', 'Node.js', 'PostgreSQL', 'Tailwind', 'GraphQL'],
    verifiedCertsCount: 5,
    pendingCertsCount: 0,
    availability: 'Summer 2027 Internship',
    passportId: 'SKC-PASSPORT-66120-PS',
    shortlisted: false,
    bio: 'Product-focused builder. Built and scaled educational tools used by 30k+ college students.'
  },
  {
    id: 'cand-05',
    name: 'Marcus Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    university: 'University of Michigan',
    degree: 'B.S. Computer Engineering (\'26)',
    location: 'Ann Arbor, MI',
    trustScore: 92,
    primaryRole: 'Security & Embedded Systems Engineer',
    topSkills: ['C', 'Rust', 'Embedded Linux', 'Cryptography', 'Reverse Engineering'],
    verifiedCertsCount: 3,
    pendingCertsCount: 2,
    availability: 'Full-time Summer 2026',
    passportId: 'SKC-PASSPORT-11894-MR',
    shortlisted: false,
    bio: 'Hardware-level security enthusiast with audited research on secure bootloader implementations.'
  }
];

export const mockVerificationRequests = [
  {
    id: 'req-01',
    studentName: 'Alex Chen',
    studentEmail: 'alex.chen@stanford.edu',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    credentialTitle: 'Distributed Systems & Consensus Algorithms',
    issuingOrg: 'MIT EECS Lab / Acme Cloud',
    courseId: 'CS-6824-DISTRIBUTED',
    submittedDate: 'Oct 25, 2026',
    status: 'Pending',
    evidenceUrl: 'https://storage.googleapis.com/skillchain-credentials/evidence/alex_mit_eecs.pdf',
    skillsClaimed: ['Raft Consensus', 'C++', 'Distributed Hash Tables'],
    notes: 'Completed full 12-week lab sequence with grade 97.2%. Code repo reviewed by TA.'
  },
  {
    id: 'req-02',
    studentName: 'Maya Patel',
    studentEmail: 'maya.p@berkeley.edu',
    studentAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    credentialTitle: 'Generative AI & LLM Inference Optimization',
    issuingOrg: 'Acme Cloud Technologies',
    courseId: 'ACME-AI-OPT-2026',
    submittedDate: 'Oct 27, 2026',
    status: 'Pending',
    evidenceUrl: 'https://storage.googleapis.com/skillchain-credentials/evidence/maya_acme_opt.pdf',
    skillsClaimed: ['vLLM', 'CUDA', 'Quantization (AWQ/GPTQ)'],
    notes: 'Completed Acme AI residency program with top honors capstone project.'
  },
  {
    id: 'req-03',
    studentName: 'Marcus Rodriguez',
    studentEmail: 'marcus.r@umich.edu',
    studentAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    credentialTitle: 'Zero-Knowledge Proofs & Cryptographic Engineering',
    issuingOrg: 'Stanford Applied Crypto Group',
    courseId: 'CRYPTO-450-ZKP',
    submittedDate: 'Oct 28, 2026',
    status: 'Pending',
    evidenceUrl: 'https://storage.googleapis.com/skillchain-credentials/evidence/marcus_zkp.pdf',
    skillsClaimed: ['Circom', 'Snarkjs', 'Number Theory', 'zk-SNARKs'],
    notes: 'Implemented zk-identity verifier module as final lab project.'
  }
];

export const mockCompanyIssuedCerts = [
  {
    id: 'SKC-2026-44321-V',
    recipientName: 'Alex Chen',
    recipientEmail: 'alex.chen@stanford.edu',
    credentialTitle: 'Enterprise Software Engineering Internship Credential',
    issueDate: 'Sep 1, 2026',
    status: 'Verified',
    hash: '0x55aa31b0e7741c880299f0183eec18402a7b29381e4b8899',
    skills: ['PostgreSQL', 'Docker', 'RESTful APIs', 'Kafka']
  },
  {
    id: 'SKC-2026-90212-V',
    recipientName: 'Sarah Jenkins',
    recipientEmail: 's.jenkins@columbia.edu',
    credentialTitle: 'Cloud Native Microservices Fellowship',
    issueDate: 'Aug 15, 2026',
    status: 'Verified',
    hash: '0x22ab88c0119842a1bc7709283719b029381e4b889912',
    skills: ['Kubernetes', 'Golang', 'OpenTelemetry']
  },
  {
    id: 'SKC-2026-89410-V',
    recipientName: 'Devon Vance',
    recipientEmail: 'devon.v@cmu.edu',
    credentialTitle: 'Backend Performance & Database Optimization',
    issueDate: 'Jul 20, 2026',
    status: 'Verified',
    hash: '0x44cd99e1208942a1bc7709283719b029381e4b889977',
    skills: ['PostgreSQL', 'Redis', 'High-Concurrency']
  }
];

export const mockPlatformStats = {
  totalVerifiedCertificates: 14820,
  activeStudents: 6940,
  registeredCompanies: 480,
  partnerUniversities: 85,
  avgVerificationTimeSeconds: 4.2,
  fraudDetectionRatePercent: 99.8,
  monthlyRecruiterSearches: 42100
};

