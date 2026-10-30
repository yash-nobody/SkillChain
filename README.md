# SkillChain – Verifiable Skill Passport

SkillChain is an AI-powered, modern web application that helps students create verified digital skill profiles containing certificates, internships, projects, and technical achievements. Companies can issue cryptographically signed credentials, and recruiters can search and view candidates' verified achievements with zero fraud.

---

## 🚀 Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Custom SaaS design system with navy & blue/purple accents)
- **Routing**: [React Router DOM v6](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State & Data**: React Context API (`SkillChainContext`) with persistent LocalStorage state and realistic mock data

---

## 📂 Project Folder Structure

```
SkillChain/
├── index.html                           # Root HTML with Google Inter typography
├── package.json                         # Project dependencies and scripts
├── postcss.config.js                    # PostCSS configuration
├── tailwind.config.js                   # Tailwind CSS theme with brand & navy colors
├── vite.config.js                       # Vite configuration
├── README.md                            # Complete documentation & usage guide
└── src/
    ├── main.jsx                         # Application entrypoint & providers
    ├── App.jsx                          # Router configuration and layout routing
    ├── index.css                        # Tailwind directives and utility classes
    ├── context/
    │   └── SkillChainContext.jsx        # Central state: users, roles, certs, claims, requests
    ├── data/
    │   └── mockData.js                  # Realistic mock datasets for all platform roles
    ├── components/
    │   ├── common/
    │   │   ├── Navbar.jsx               # Universal header with logo, navigation & role switcher
    │   │   ├── Footer.jsx               # Detailed footer with ecosystem links & compliance seals
    │   │   ├── RoleSwitcherBanner.jsx   # 1-click interactive demo banner (Student/Company/Recruiter/Admin)
    │   │   ├── StatCard.jsx             # Metric card with icons, trends, and badges
    │   │   ├── Badge.jsx                # Verified, Pending, Approved, and Rejected status badges
    │   │   ├── Modal.jsx                # Accessible modal overlay with smooth transitions
    │   │   └── Toast.jsx                # Toast notifications for stateful actions
    │   ├── dashboard/
    │   │   ├── DashboardLayout.jsx      # Persistent dashboard wrapper with responsive sidebar
    │   │   ├── Sidebar.jsx              # Role-specific navigation links and user card
    │   │   └── Header.jsx               # Dashboard header with page title and actions
    │   ├── certificate/
    │   │   ├── CertificateCard.jsx      # Card display for certificates with quick actions
    │   │   ├── CertificateDetailModal.jsx # Official verifiable credential with gold seal & hash
    │   │   └── UploadCertificateModal.jsx # Certificate upload & claim interface
    │   └── passport/
    │       └── QRCodeModal.jsx          # Shareable QR Code key card with 1-click copy
    └── pages/
        ├── LandingPage.jsx              # Hero ("Your Skills. Your Proof. Your Future"), features, how it works
        ├── auth/
        │   ├── LoginPage.jsx            # Sign in with role selector & 1-click quick demo accounts
        │   └── RegisterPage.jsx         # Role-specific registration (Student, Company, Recruiter)
        ├── student/
        │   ├── StudentDashboard.jsx     # Profile overview, skill matrix, metrics, projects, internships
        │   └── CertificateManagement.jsx# Certificate list, status filters, search, table/grid views
        ├── passport/
        │   └── DigitalSkillPassport.jsx # Public verifiable passport, QR key, audited dossier
        ├── company/
        │   ├── CompanyDashboard.jsx     # Company profile, stats, review queue, issued registry
        │   ├── IssueCertificate.jsx     # Interface to mint and sign credentials for students
        │   └── CandidateRequests.jsx    # Review & approve/reject student claims
        ├── recruiter/
        │   └── RecruiterDashboard.jsx   # Talent search engine, trust score filter, candidate dossiers
        ├── admin/
        │   └── AdminDashboard.jsx       # Verification queue, approve/reject, student & issuer directories
        └── verifier/
            └── GlobalVerifierPage.jsx   # Universal credential checker by ID or hash
```

---

## 🛠️ How to Run the Project

### Prerequisites
- Node.js (v18 or higher) and npm installed on your machine.

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
The local server will start at `http://localhost:3000` (or `http://localhost:5173`). Open this URL in any modern browser.

### 3. Build for Production
```bash
npm run build
```
To preview the production build locally:
```bash
npm run preview
```

---

## 🌟 Key Application Pages & Features

### 1. Landing Page (`/`)
- **Brand Logo & Clean Navigation**: Quick access to Home, Features, How It Works, Verifier, and Live Passport Demo.
- **Hero Section**: Prominent headline: *"Your Skills. Your Proof. Your Future."*
- **Live Verifier Widget**: Instant credential checker directly on the landing page with sample ID `SKC-2026-89412-V`.
- **Metrics Bar**: 14,800+ Verifiable Passports, 480+ Issuers, 99.8% Fraud Detection Rate.
- **Multi-Stakeholder Architecture Cards**: Dedicated pathways for Students, Companies, and Recruiters.
- **Features & How It Works**: 4-step workflow explaining the cryptographic verification cycle.

### 2. Authentication (`/login`, `/register`)
- **Role Selection**: Toggle between **Student**, **Company**, and **Recruiter**.
- **1-Click Quick Demo Sign-in**: Instantly log in as:
  - *Alex Chen* (Student / Stanford University)
  - *Acme Cloud Technologies* (Enterprise Issuer)
  - *Sarah Miller* (Senior Technical Recruiter)
  - *SkillChain Protocol Governance* (Admin)
- **Persistent Session**: Keeps role selections synced across pages.

### 3. Student Dashboard (`/student`)
- **Profile Overview**: Student details, Trust Index score (98/100), Stanford University enrollment, and Verifiable Passport ID.
- **Key Metric Cards**: Total Certificates, Verified Credentials, Pending Reviews, Recruiter Views.
- **Audited Skills Matrix**: Interactive skill tags with verified proof counters.
- **Multi-Tab Switcher**:
  - *Certificates*: Grid of certificates with status badges and details inspector.
  - *Projects*: Verified capstone repositories with benchmark badges and GitHub links.
  - *Internships*: Verified corporate work experience cards.
  - *Recent Activity*: Live log of credential verifications and recruiter views.

### 4. Certificate Management (`/student/certificates`)
- **Upload Certificate Interface**: Modal to upload certificates, enter course details, specify acquired skills, and attach proof documents.
- **Search & Filters**: Real-time search by title, issuer, or skill; filters for **All**, **Verified**, **Pending**, and **Rejected**.
- **Layout Switcher**: Toggle between responsive Grid View and high-density Table View.
- **Certificate Detail Inspector**: Official credential view with gold verification watermark, SHA-256 hash, and PDF download action.

### 5. Digital Skill Passport (`/passport`)
- **Publicly Shareable Profile Layout**: Clean, high-reputation layout suitable for recruiters and LinkedIn.
- **QR Key Generator**: Stylized QR code linking directly to the student's tamper-proof dossier.
- **Audited Skills & Experience Matrix**: Comprehensive breakdown of confirmed skills, internships, and capstone achievements.
- **Export Options**: One-click "Copy Public Link" and "Export Dossier PDF".

### 6. Company Dashboard (`/company`)
- **Company Profile**: Issuer identity, Accredited status, and active digital signing key.
- **Issue Certificate Interface (`/company/issue`)**: Mint credentials directly to student profiles with skill tags, grade, and evaluation notes.
- **Candidate Claims Manager (`/company/requests`)**: Interactive queue to review student claims with instant **Approve & Sign** or **Reject** actions that dynamically update student records!

### 7. Recruiter Dashboard (`/recruiter`)
- **Talent Search Engine**: Filter by keyword, role title, university, and specific audited skills.
- **Trust Index Slider**: Filter candidates by minimum verified trust score.
- **Candidate Dossier Modal**: In-depth inspection of candidate credentials, capstone projects, and availability.
- **Talent Pipeline**: 1-click bookmarking to save candidates to your recruitment pipeline.

### 8. Admin Dashboard (`/admin`)
- **System Governance Overview**: Monitor platform verifications, fraud rejection rate, and network health.
- **Verification Queue**: Review incoming institutional claims with one-click approval and rejection.
- **Directory Managers**: Search and manage enrolled students and accredited issuer organizations.
- **Cryptographic Audit Trail**: Live ledger activity log displaying verified block hashes.

### 9. Global Verifier (`/verify`)
- Universal public verification tool where anyone can enter a Certificate ID or cryptographic hash to verify authentic credentials against the decentralized registry.

