import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  BarChart3,
  Newspaper,
  Users,
  CheckCircle2,
  XCircle,
  PauseCircle,
  PlayCircle,
  ChevronRight,
  Hash,
  Mail,
  UserPlus,
  Shield,
  Trash2,
  Loader2,
  Send,
  Check,
  ChevronDown,
} from 'lucide-react';
import apiClient from '../api/client';

interface AdAccount {
  id: string;
  name: string;
  status: 'active' | 'disabled';
  spend: number;
  currency: string;
  impressions: number;
  clicks: number;
}

interface Page {
  id: string;
  name: string;
  category: string;
  followers: number;
  engaged: number;
  status: 'published' | 'unpublished';
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'disabled';
  lastActive: string;
}

interface BusinessManager {
  id: string;
  name: string;
  businessId: string;
  verified: boolean;
  adAccountCount: number;
  pageCount: number;
  userCount: number;
  financial: { balance: number; currency: string; overdue: number };
}

const availableRoles = ['Admin', 'Ad Manager', 'Analyst', 'Viewer'];

const mapAdAccount = (item: any): AdAccount => ({
  id: item.account_id || String(item.id),
  name: item.name,
  status: item.status,
  spend: item.spend,
  currency: item.currency,
  impressions: item.impressions,
  clicks: item.clicks,
});

const mapPage = (item: any): Page => ({
  id: item.page_id || String(item.id),
  name: item.name,
  category: item.category,
  followers: item.followers,
  engaged: item.engaged,
  status: item.status,
});

const mapMember = (item: any): TeamMember => ({
  id: String(item.id),
  name: item.name,
  email: item.email,
  role: item.role,
  status: item.status,
  lastActive: item.last_active,
});

const formatNumber = (n: number) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toLocaleString();
};

const formatCurrency = (amount: number, currency: string) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2 }).format(amount);

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 1) return 'Just now';
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const RoleSelect: React.FC<{
  value: string;
  options: string[];
  onChange: (val: string) => void;
}> = ({ value, options, onChange }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white/80 hover:border-white/[0.15] focus:outline-none focus:border-titans-accent/50 focus:shadow-[0_0_0_1px_rgba(225,29,72,0.2)] transition-default"
      >
        <span className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-white/30" strokeWidth={1.5} />
          {value}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-white/30" strokeWidth={1.5} />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute z-20 mt-1.5 w-full rounded-xl bg-titans-card border border-white/[0.08] shadow-soft-lg overflow-hidden"
          >
            {options.map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`flex items-center gap-2 w-full px-3.5 py-2.5 text-sm text-left transition-default ${
                  opt === value
                    ? 'text-white bg-white/[0.06]'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                {opt === value && (
                  <Check className="w-3.5 h-3.5 text-titans-accent" strokeWidth={2} />
                )}
                {opt !== value && <span className="w-3.5" />}
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const RoleInlineEditor: React.FC<{
  currentRole: string;
  options: string[];
  onRoleChange: (role: string) => void;
}> = ({ currentRole, options, onRoleChange }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-titans-accent/10 border border-white/[0.06] hover:border-titans-accent/20 flex items-center justify-center transition-default group/btn"
        title="Edit Role"
      >
        <Shield className="w-3.5 h-3.5 text-white/30 group-hover/btn:text-titans-accent transition-default" strokeWidth={1.5} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-full mt-1.5 z-30 w-40 rounded-xl bg-titans-card border border-white/[0.08] shadow-soft-lg overflow-hidden"
          >
            {options.map(opt => (
              <button
                key={opt}
                onClick={() => { onRoleChange(opt); setOpen(false); }}
                className={`flex items-center gap-2 w-full px-3 py-2.5 text-xs text-left transition-default ${
                  opt === currentRole
                    ? 'text-white bg-white/[0.06]'
                    : 'text-white/50 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                {opt === currentRole && (
                  <Check className="w-3 h-3 text-titans-accent" strokeWidth={2} />
                )}
                {opt !== currentRole && <span className="w-3" />}
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface BmDetailProps {
  bm: BusinessManager;
  onBack: () => void;
}

type TabId = 'ad-accounts' | 'pages' | 'team';

export const BmDetail: React.FC<BmDetailProps> = ({ bm, onBack }) => {
  const [activeTab, setActiveTab] = React.useState<TabId>('ad-accounts');
  const [search, setSearch] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<'all' | 'active' | 'disabled'>('all');

  const [adAccounts, setAdAccounts] = React.useState<AdAccount[]>([]);
  const [pages, setPages] = React.useState<Page[]>([]);
  const [members, setMembers] = React.useState<TeamMember[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [showInvite, setShowInvite] = React.useState(false);
  const [inviteEmail, setInviteEmail] = React.useState('');
  const [inviteRole, setInviteRole] = React.useState('Analyst');
  const [inviteStatus, setInviteStatus] = React.useState<'idle' | 'loading' | 'success'>('idle');

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const bmId = Number(bm.id);
    Promise.all([
      apiClient.get(`/business-managers/${bmId}/ad-accounts`).then(r => r.data?.data ?? []),
      apiClient.get(`/business-managers/${bmId}/pages`).then(r => r.data?.data ?? []),
      apiClient.get(`/business-managers/${bmId}/members`).then(r => r.data?.data ?? []),
    ])
      .then(([accountsData, pagesData, membersData]) => {
        if (!cancelled) {
          setAdAccounts(accountsData.map(mapAdAccount));
          setPages(pagesData.map(mapPage));
          setMembers(membersData.map(mapMember));
        }
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load data.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [bm.id]);

  const tabs: { id: TabId; label: string; icon: typeof BarChart3; count: number }[] = [
    { id: 'ad-accounts', label: 'Ad Accounts', icon: BarChart3, count: adAccounts.length },
    { id: 'pages', label: 'Facebook Pages', icon: Newspaper, count: pages.length },
    { id: 'team', label: 'Team Members', icon: Users, count: members.length },
  ];

  const filteredAdAccounts = React.useMemo(() => {
    let list = adAccounts;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(a => a.name.toLowerCase().includes(q) || a.id.toLowerCase().includes(q));
    }
    if (filterStatus !== 'all') list = list.filter(a => a.status === filterStatus);
    return list;
  }, [search, filterStatus, adAccounts]);

  const filteredPages = React.useMemo(() => {
    let list = pages;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (filterStatus !== 'all') list = list.filter(p => (filterStatus === 'active' ? p.status === 'published' : p.status === 'unpublished'));
    return list;
  }, [search, filterStatus, pages]);

  const filteredMembers = React.useMemo(() => {
    let list = members;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(m => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.role.toLowerCase().includes(q));
    }
    if (filterStatus !== 'all') list = list.filter(m => m.status === filterStatus);
    return list;
  }, [search, filterStatus, members]);

  const handleRoleChange = (memberId: string, newRole: string) => {
    const bmId = Number(bm.id);
    apiClient.put(`/business-managers/${bmId}/members/${memberId}/role`, { role: newRole })
      .then(() => {
        setMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m));
      });
  };

  const handleRemove = (memberId: string) => {
    const bmId = Number(bm.id);
    setMembers(prev => prev.filter(m => m.id !== memberId));
    apiClient.delete(`/business-managers/${bmId}/members/${memberId}`);
  };

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    setInviteStatus('loading');
    const bmId = Number(bm.id);
    apiClient.post(`/business-managers/${bmId}/members/invite`, { email: inviteEmail, role: inviteRole })
      .then(res => {
        setInviteStatus('success');
        const newMember = mapMember(res.data?.member ?? {});
        setTimeout(() => {
          setMembers(prev => [newMember, ...prev]);
          setShowInvite(false);
          setInviteEmail('');
          setInviteRole('Analyst');
          setInviteStatus('idle');
        }, 800);
      })
      .catch(() => {
        setInviteStatus('idle');
      });
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-titans-bg/70 backdrop-blur-2xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={onBack}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] flex items-center justify-center transition-default"
            >
              <ArrowLeft className="w-4 h-4 text-white/50" strokeWidth={1.5} />
            </motion.button>
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-white/90">{bm.name}</h1>
              <p className="flex items-center gap-1 text-[11px] text-white/30 font-[425]">
                <Hash className="w-3 h-3" strokeWidth={1.5} />
                {bm.businessId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wide ${
                bm.verified
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/15'
              }`}
            >
              {bm.verified ? (
                <CheckCircle2 className="w-3 h-3" strokeWidth={2} />
              ) : (
                <XCircle className="w-3 h-3" strokeWidth={2} />
              )}
              {bm.verified ? 'Verified' : 'Unverified'}
            </span>
            <span className="text-xs font-semibold text-white/80">
              {formatCurrency(bm.financial.balance, bm.financial.currency)}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-6 h-6 text-white/30 animate-spin" strokeWidth={1.5} />
              <p className="text-sm text-white/20 font-[425]">Loading data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-24">
            <p className="text-sm text-white/30 font-[425]">{error}</p>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6"
            >
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" strokeWidth={1.5} />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white/80 placeholder-white/20 focus:outline-none focus:border-white/[0.12] focus:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_4px_24px_rgba(0,0,0,0.4)] transition-default"
                />
              </div>

              <div className="flex items-center gap-3">
                <SlidersHorizontal className="w-4 h-4 text-white/25" strokeWidth={1.5} />
                {(['all', 'active', 'disabled'] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-[425] transition-default ${
                      filterStatus === status
                        ? 'bg-white/[0.08] text-white/80 border border-white/[0.1]'
                        : 'text-white/30 hover:text-white/50'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </motion.div>

            <div className="relative flex items-center gap-1 mb-6">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-[425] transition-default ${
                    activeTab === tab.id ? 'text-white/90' : 'text-white/30 hover:text-white/50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" strokeWidth={1.5} />
                  {tab.label}
                  <span className={`text-[11px] px-1.5 py-0.5 rounded-md ${
                    activeTab === tab.id ? 'bg-white/[0.08] text-white/50' : 'bg-white/[0.04] text-white/25'
                  }`}>
                    {tab.count}
                  </span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="active-tab-bg"
                      className="absolute inset-0 bg-white/[0.06] rounded-lg -z-10"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                {activeTab === 'ad-accounts' && (
                  <div className="space-y-2">
                    {filteredAdAccounts.map((account, i) => (
                      <motion.div
                        key={account.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03, duration: 0.3 }}
                        className="group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06] transition-default cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-titans-accent/10 to-titans-accent/5 border border-white/[0.06] flex items-center justify-center shrink-0">
                          <BarChart3 className="w-5 h-5 text-white/40" strokeWidth={1.5} />
                        </div>
                        <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-5 items-center gap-4">
                          <div className="sm:col-span-2 min-w-0">
                            <p className="text-sm font-medium text-white/80 truncate">{account.name}</p>
                            <p className="text-[11px] text-white/25 font-[425] mt-0.5">{account.id}</p>
                          </div>
                          <div className="hidden sm:block text-right">
                            <p className="text-xs text-white/30 font-[425]">Spend</p>
                            <p className="text-sm font-semibold text-white/80">{formatCurrency(account.spend, account.currency)}</p>
                          </div>
                          <div className="hidden sm:block text-right">
                            <p className="text-xs text-white/30 font-[425]">Impressions</p>
                            <p className="text-sm font-semibold text-white/80">{formatNumber(account.impressions)}</p>
                          </div>
                          <div className="hidden sm:block text-right">
                            <p className="text-xs text-white/30 font-[425]">Clicks</p>
                            <p className="text-sm font-semibold text-white/80">{formatNumber(account.clicks)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                              account.status === 'active'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-white/[0.05] text-white/30'
                            }`}
                          >
                            {account.status === 'active' ? (
                              <PlayCircle className="w-3 h-3" strokeWidth={1.5} />
                            ) : (
                              <PauseCircle className="w-3 h-3" strokeWidth={1.5} />
                            )}
                            {account.status}
                          </span>
                          <ChevronRight className="w-4 h-4 text-white/15 group-hover:text-white/30 transition-default" strokeWidth={1.5} />
                        </div>
                      </motion.div>
                    ))}
                    {filteredAdAccounts.length === 0 && (
                      <div className="text-center py-12">
                        <p className="text-sm text-white/20 font-[425]">No ad accounts match your search.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'pages' && (
                  <div className="space-y-2">
                    {filteredPages.map((page, i) => (
                      <motion.div
                        key={page.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03, duration: 0.3 }}
                        className="group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06] transition-default cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500/10 to-sky-500/5 border border-white/[0.06] flex items-center justify-center shrink-0">
                          <Newspaper className="w-5 h-5 text-white/40" strokeWidth={1.5} />
                        </div>
                        <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-4 items-center gap-4">
                          <div className="sm:col-span-2 min-w-0">
                            <p className="text-sm font-medium text-white/80 truncate">{page.name}</p>
                            <p className="text-[11px] text-white/25 font-[425] mt-0.5">{page.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-white/30 font-[425]">Followers</p>
                            <p className="text-sm font-semibold text-white/80">{formatNumber(page.followers)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-white/30 font-[425]">Engaged</p>
                            <p className="text-sm font-semibold text-white/80">{formatNumber(page.engaged)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                              page.status === 'published'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-white/[0.05] text-white/30'
                            }`}
                          >
                            {page.status === 'published' ? (
                              <PlayCircle className="w-3 h-3" strokeWidth={1.5} />
                            ) : (
                              <PauseCircle className="w-3 h-3" strokeWidth={1.5} />
                            )}
                            {page.status}
                          </span>
                          <ChevronRight className="w-4 h-4 text-white/15 group-hover:text-white/30 transition-default" strokeWidth={1.5} />
                        </div>
                      </motion.div>
                    ))}
                    {filteredPages.length === 0 && (
                      <div className="text-center py-12">
                        <p className="text-sm text-white/20 font-[425]">No pages match your search.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'team' && (
                  <div className="space-y-3">
                    <motion.button
                      onClick={() => setShowInvite(true)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-br from-titans-accent/10 to-titans-accent/5 border border-titans-accent/20 text-titans-accent text-sm font-medium hover:bg-titans-accent/15 hover:border-titans-accent/30 transition-default"
                    >
                      <UserPlus className="w-4 h-4" strokeWidth={1.5} />
                      Invite New User
                    </motion.button>

                    {filteredMembers.map((member, i) => (
                      <motion.div
                        key={member.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03, duration: 0.3 }}
                        className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06] transition-default"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-white/[0.06] flex items-center justify-center shrink-0">
                          <span className="text-sm font-semibold text-white/50">{member.name.charAt(0)}</span>
                        </div>
                        <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-4 items-center gap-4">
                          <div className="sm:col-span-2 min-w-0">
                            <p className="text-sm font-medium text-white/80 truncate">{member.name}</p>
                            <p className="flex items-center gap-1 text-[11px] text-white/25 font-[425] mt-0.5 truncate">
                              <Mail className="w-3 h-3 shrink-0" strokeWidth={1.5} />
                              {member.email}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-white/30 font-[425]">Role</p>
                            <p className="text-sm font-semibold text-white/80">{member.role}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-white/30 font-[425]">Active</p>
                            <p className="text-sm font-semibold text-white/80">{timeAgo(member.lastActive)}</p>
                          </div>
                        </div>

                        <div className="sm:hidden flex items-center gap-2 shrink-0">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                              member.status === 'active'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-white/[0.05] text-white/30'
                            }`}
                          >
                            {member.status === 'active' ? (
                              <PlayCircle className="w-3 h-3" strokeWidth={1.5} />
                            ) : (
                              <PauseCircle className="w-3 h-3" strokeWidth={1.5} />
                            )}
                            {member.status}
                          </span>
                        </div>

                        <div className="hidden sm:flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <RoleInlineEditor
                            currentRole={member.role}
                            options={availableRoles}
                            onRoleChange={(newRole) => handleRoleChange(member.id, newRole)}
                          />
                          <button
                            onClick={() => handleRemove(member.id)}
                            className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-rose-500/10 border border-white/[0.06] hover:border-rose-500/20 flex items-center justify-center transition-default group/btn"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-white/30 group-hover/btn:text-rose-400 transition-default" strokeWidth={1.5} />
                          </button>
                        </div>

                        <div className="hidden sm:flex items-center gap-2 shrink-0 group-hover:opacity-0 transition-opacity duration-200">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                              member.status === 'active'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-white/[0.05] text-white/30'
                            }`}
                          >
                            {member.status === 'active' ? (
                              <PlayCircle className="w-3 h-3" strokeWidth={1.5} />
                            ) : (
                              <PauseCircle className="w-3 h-3" strokeWidth={1.5} />
                            )}
                            {member.status}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                    {filteredMembers.length === 0 && (
                      <div className="text-center py-12">
                        <p className="text-sm text-white/20 font-[425]">No team members match your search.</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </main>

      <AnimatePresence>
        {showInvite && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { if (inviteStatus !== 'loading') { setShowInvite(false); setInviteStatus('idle'); } }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-titans-card border border-white/[0.08] shadow-soft-lg overflow-hidden"
            >
              <div className="p-6 pb-8 space-y-6">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-titans-accent/15 to-titans-accent/5 border border-titans-accent/20 flex items-center justify-center mb-3">
                    <UserPlus className="w-5 h-5 text-titans-accent" strokeWidth={1.5} />
                  </div>
                  <h2 className="text-lg font-semibold text-white/90">Invite Team Member</h2>
                  <p className="text-sm text-white/30 font-[425] mt-1">
                    They'll receive an email with a secure link.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    placeholder="colleague@titans.media"
                    disabled={inviteStatus !== 'idle'}
                    className="w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 pl-0 border-b border-white/[0.08] focus:outline-none focus:border-titans-accent focus:shadow-[0_4px_20px_-4px_rgba(225,29,72,0.3)] transition-default disabled:opacity-40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">
                    Role
                  </label>
                  <RoleSelect value={inviteRole} options={availableRoles} onChange={setInviteRole} />
                </div>

                <motion.button
                  onClick={handleInvite}
                  disabled={inviteStatus !== 'idle' || !inviteEmail.trim()}
                  whileTap={inviteStatus === 'idle' ? { scale: 0.97 } : {}}
                  className="relative w-full py-3 rounded-xl bg-titans-accent text-white text-sm font-medium shadow-glow-sm hover:shadow-glow hover:bg-titans-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-250 overflow-hidden"
                >
                  <AnimatePresence mode="wait">
                    {inviteStatus === 'idle' && (
                      <motion.span
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" strokeWidth={1.5} />
                        Send Invite
                      </motion.span>
                    )}
                    {inviteStatus === 'loading' && (
                      <motion.span
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center gap-2"
                      >
                        <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
                        Sending...
                      </motion.span>
                    )}
                    {inviteStatus === 'success' && (
                      <motion.span
                        key="success"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center gap-2"
                      >
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        >
                          <Check className="w-5 h-5" strokeWidth={2.5} />
                        </motion.span>
                        Invitation Sent
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BmDetail;
