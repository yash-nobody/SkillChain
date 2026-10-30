import React, { useState } from 'react';
import { 
  Award, 
  Plus, 
  Search, 
  LayoutGrid,
  ListFilter,
  Send,
  Building2,
  Clock,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useSkillChain } from '../../context/SkillChainContext';
import { Header } from '../../components/dashboard/Header';
import { CertificateCard } from '../../components/certificate/CertificateCard';
import { CertificateDetailModal } from '../../components/certificate/CertificateDetailModal';
import { UploadCertificateModal } from '../../components/certificate/UploadCertificateModal';
import { SendToCompanyModal } from '../../components/certificate/SendToCompanyModal';
import { Badge } from '../../components/common/Badge';
import { useNavigate } from 'react-router-dom';

export const CertificateManagement = () => {
  const { certificates } = useSkillChain();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); 
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCert, setSelectedCert] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSendToCompanyOpen, setIsSendToCompanyOpen] = useState(false);
  const [certToSend, setCertToSend] = useState(null);

  const statusCategories = [
    { key: 'ALL', label: 'All' },
    { key: 'VERIFIED', label: 'Verified' },
    { key: 'PENDING_AUTO', label: 'Pending Auto' },
    { key: 'UNABLE_TO_VERIFY', label: 'Unable to Verify' },
    { key: 'COMPANY_REVIEW', label: 'Company Review' },
    { key: 'REJECTED', label: 'Rejected' },
  ];

  const filteredCerts = certificates.filter(cert => {
    const s = (cert.status || '').toLowerCase();

    const matchesSearch = 
      cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.skills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
      cert.id.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesStatus = true;
    if (statusFilter === 'VERIFIED') {
      matchesStatus = s === 'verified' || s === 'company confirmed';
    } else if (statusFilter === 'PENDING_AUTO') {
      matchesStatus = s === 'pending automatic verification' || s === 'pending';
    } else if (statusFilter === 'UNABLE_TO_VERIFY') {
      matchesStatus = s === 'unable to verify';
    } else if (statusFilter === 'COMPANY_REVIEW') {
      matchesStatus = s === 'pending company review' || s === 'additional information required';
    } else if (statusFilter === 'REJECTED') {
      matchesStatus = s === 'rejected' || s === 'company rejected';
    }

    return matchesSearch && matchesStatus;
  });

  const handleViewCert = (cert) => {
    setSelectedCert(cert);
    setIsDetailOpen(true);
  };

  const handleVerifyNow = (cert) => {
    navigate(`/verify?id=${encodeURIComponent(cert.id)}`);
  };

  const handleOpenSendToCompany = (cert) => {
    setCertToSend(cert);
    setIsSendToCompanyOpen(true);
  };

  return (
    <div>
      <Header
        pageTitle="Certificate Management"
        pageSubtitle="Student-controlled credential repository with automated & institutional verification"
        actionButton={
          <button
            onClick={() => setIsUploadOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Certificate</span>
          </button>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, issuer, or skill..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-slate-400"
            />
          </div>

          {/* Status Filter Tabs & Layout toggle */}
          <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 w-full md:w-auto">
            <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              {statusCategories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setStatusFilter(cat.key)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    statusFilter === cat.key
                      ? 'bg-white text-brand-700 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 border-l border-slate-200 pl-3">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg cursor-pointer ${viewMode === 'grid' ? 'bg-slate-200 text-slate-900' : 'text-slate-400 hover:text-slate-700'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg cursor-pointer ${viewMode === 'table' ? 'bg-slate-200 text-slate-900' : 'text-slate-400 hover:text-slate-700'}`}
                title="Table View"
              >
                <ListFilter className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Certificate Display Area */}
        {filteredCerts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-xs max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">No certificates found</h4>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Try adjusting your search criteria or upload a new certificate into your passport.
            </p>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-md cursor-pointer"
            >
              Upload Certificate
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCerts.map((cert) => (
              <CertificateCard
                key={cert.id}
                certificate={cert}
                onViewDetails={handleViewCert}
                onVerifyNow={handleVerifyNow}
                onSendToCompany={handleOpenSendToCompany}
              />
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-5 py-3.5">Certificate & Issuer</th>
                    <th className="px-5 py-3.5">Credential ID</th>
                    <th className="px-5 py-3.5">Issue Date</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {filteredCerts.map((cert) => (
                    <tr key={cert.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shrink-0">
                            {cert.issuerLogo ? (
                              <img src={cert.issuerLogo} alt={cert.issuer} className="max-h-full max-w-full object-contain" />
                            ) : (
                              <Award className="w-5 h-5 text-brand-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 line-clamp-1">{cert.title}</p>
                            <p className="text-[11px] text-slate-500">{cert.issuer}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono text-[11px] text-slate-500">
                        {cert.id}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {cert.issueDate}
                      </td>
                      <td className="px-5 py-4">
                        <Badge status={cert.status} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {['Unable to Verify', 'Rejected'].includes(cert.status) && !cert.companySharing?.sharedWithCompany && (
                            <button
                              onClick={() => handleOpenSendToCompany(cert)}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors cursor-pointer"
                            >
                              Send to Company
                            </button>
                          )}
                          <button
                            onClick={() => handleViewCert(cert)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                          >
                            Inspect
                          </button>
                          <button
                            onClick={() => handleVerifyNow(cert)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 transition-colors cursor-pointer"
                          >
                            Verify
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Modals */}
      <CertificateDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        certificate={selectedCert}
        onSendToCompany={(cert) => {
          setIsDetailOpen(false);
          handleOpenSendToCompany(cert);
        }}
      />

      <UploadCertificateModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />

      <SendToCompanyModal
        isOpen={isSendToCompanyOpen}
        onClose={() => {
          setIsSendToCompanyOpen(false);
          setCertToSend(null);
        }}
        certificate={certToSend}
      />
    </div>
  );
};
