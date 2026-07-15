import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut,
  Building2,
  Hash,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  AlertCircle,
  TrendingUp,
  Users,
  Newspaper,
  BarChart3,
  Loader2,
  SlidersHorizontal,
  CalendarDays,
  ArrowRight,
  Plus,
  X,
  Save,
  Bell,
  Timer,
  ToggleLeft,
  DollarSign,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';
import BmDetail from './BmDetail';
import AnimatedSearchBar from '@/components/ui/AnimatedSearchBar';

interface BusinessManager {
  id: string;
  name: string;
  businessId: string;
  verified: boolean;
  adAccountCount: number;
  pageCount: number;
  userCount: number;
  balance: number;
  currency: string;
  overdue: number;
  createdAt: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const formatCurrency = (amount: number, currency: string) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2 }).format(amount);

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return '';
  }
};

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
};

const mapBmFromApi = (item: any): BusinessManager => ({
  id: String(item.id ?? ''),
  name: item.name ?? '',
  businessId: item.business_id ?? '',
  verified: item.verified ?? false,
  adAccountCount: item.ad_account_count ?? 0,
  pageCount: item.page_count ?? 0,
  userCount: item.user_count ?? 0,
  balance: item.financial?.balance ?? item.balance ?? 0,
  currency: item.financial?.currency ?? item.currency ?? 'USD',
  overdue: item.financial?.overdue ?? item.overdue ?? 0,
  createdAt: item.created_at ?? '',
});

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [selectedBmId, setSelectedBmId] = React.useState<string | null>(null);
  const [bms, setBms] = React.useState<BusinessManager[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [search, setSearch] = React.useState('');
  const [filterVerified, setFilterVerified] = React.useState<'all' | 'verified' | 'unverified'>('all');
  const [showBmForm, setShowBmForm] = React.useState(false);
  const [bmSaving, setBmSaving] = React.useState(false);
  const [bmForm, setBmForm] = React.useState({
    name: '',
    business_id: '',
    currency: 'USD',
    verified: true,
    balance: '',
    overdue: '',
    notify_balance_threshold: 0,
    notify_cooldown_minutes: 60,
    notify_moderation: true,
    notify_cabinet_status: true,
    notify_billing: true,
  });

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    apiClient.get('/business-managers')
      .then(res => {
        if (!cancelled) {
          const list = (res.data?.data ?? []).map(mapBmFromApi);
          setBms(list);
        }
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load business managers.');
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const selectedBm = React.useMemo(
    () => bms.find(b => b.id === selectedBmId) || null,
    [selectedBmId, bms]
  );

  const filteredBms = React.useMemo(() => {
    let list = bms;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(b =>
        b.name?.toLowerCase().includes(q) ||
        b.businessId?.toLowerCase().includes(q)
      );
    }
    if (filterVerified === 'verified') list = list.filter(b => b.verified);
    if (filterVerified === 'unverified') list = list.filter(b => !b.verified);
    return list;
  }, [search, filterVerified, bms]);

  const summaryTotals = React.useMemo(() => {
    const totals = { adAccounts: 0, pages: 0, users: 0, balance: 0, overdue: 0 };
    bms.forEach(bm => {
      totals.adAccounts += bm.adAccountCount;
      totals.pages += bm.pageCount;
      totals.users += bm.userCount;
      totals.balance += bm.balance;
      totals.overdue += bm.overdue;
    });
    return totals;
  }, [bms]);

  const saveBm = () => {
    if (!bmForm.name.trim() || !bmForm.business_id.trim()) return;
    setBmSaving(true);
    apiClient.post('/business-managers', {
      ...bmForm,
      balance: parseFloat(bmForm.balance) || 0,
      overdue: parseFloat(bmForm.overdue) || 0,
    })
      .then(res => {
        const created = mapBmFromApi(res.data?.data ?? res.data);
        setBms(prev => [created, ...prev]);
        setShowBmForm(false);
        setBmForm({
          name: '', business_id: '', currency: 'USD', verified: true,
          balance: '', overdue: '',
          notify_balance_threshold: 0, notify_cooldown_minutes: 60,
          notify_moderation: true, notify_cabinet_status: true, notify_billing: true,
        });
      })
      .catch(err => {
        alert('Failed to create BM: ' + JSON.stringify(err.response?.data || err.message));
      })
      .finally(() => setBmSaving(false));
  };

  return (
    <div className="min-h-screen bg-titans-bg text-white flex flex-col font-sans">
      {!selectedBm && (
      <header className="sticky top-0 z-50 bg-titans-bg/70 backdrop-blur-2xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-titans-accent to-rose-600 flex items-center justify-center shadow-glow-sm">
              <BarChart3 className="w-4 h-4 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-white/90">FBTool</h1>
              <p className="text-[10px] text-white/30 font-[425] tracking-wide">Titans Media</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pr-4 border-r border-white/[0.06]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-titans-accent/20 to-titans-accent/5 border border-white/[0.06] flex items-center justify-center">
                <span className="text-xs font-semibold text-white/80">
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-white/80 leading-none">{user?.name || 'User'}</p>
                <p className="text-[11px] text-white/30 mt-0.5 font-[425]">{user?.email || 'user@titans.media'}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-[425] text-white/40 hover:text-titans-accent hover:bg-titans-accent/[0.08] transition-default"
            >
              <LogOut className="w-3.5 h-3.5" strokeWidth={1.5} />
              Exit
            </button>
          </div>
        </div>
      </header>
      )}

      <AnimatePresence mode="wait">
        {selectedBm ? (
          <motion.div key="detail" {...pageTransition} className="flex-1 flex flex-col">
            <BmDetail bm={selectedBm} onBack={() => setSelectedBmId(null)} />
          </motion.div>
        ) : (
          <motion.div key="dashboard" {...pageTransition} className="flex-1 flex flex-col">
            <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
              {loading ? (
                <div className="flex items-center justify-center py-24">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-6 h-6 text-white/30 animate-spin" strokeWidth={1.5} />
                    <p className="text-sm text-white/20 font-[425]">Loading business managers...</p>
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
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-8"
                  >
                    <h2 className="text-xl font-semibold tracking-tight text-white/90">Business Managers</h2>
                    <p className="text-sm text-white/30 mt-1 font-[425]">
                      {bms.length} connected &middot; {formatCurrency(summaryTotals.balance, 'USD')} total balance
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-wrap items-center gap-6 mb-6 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05]"
                  >
                    {[
                      { icon: BarChart3, label: 'Ad Accounts', value: summaryTotals.adAccounts },
                      { icon: Newspaper, label: 'Pages', value: summaryTotals.pages },
                      { icon: Users, label: 'Users', value: summaryTotals.users },
                      { icon: CreditCard, label: 'Total Balance', value: formatCurrency(summaryTotals.balance, 'USD'), accent: true },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
                          <item.icon className="w-4 h-4 text-white/40" strokeWidth={1.5} />
                        </div>
                        <div>
                          <p className="text-[11px] text-white/30 font-[425]">{item.label}</p>
                          <p className={`text-sm font-semibold ${item.accent ? 'text-titans-accent' : 'text-white/80'}`}>
                            {item.value}
                          </p>
                        </div>
                        {i < 3 && <div className="w-px h-8 bg-white/[0.06] ml-2" />}
                      </div>
                    ))}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8"
                  >
                    <AnimatedSearchBar value={search} onChange={setSearch} placeholder="Search by Business name or ID..." className="flex-1" />
                    <div className="flex items-center gap-3">
                      <SlidersHorizontal className="w-4 h-4 text-white/25" strokeWidth={1.5} />
                      {(['all', 'verified', 'unverified'] as const).map(f => (
                        <button
                          key={f}
                          onClick={() => setFilterVerified(f)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-[425] transition-default ${
                            filterVerified === f
                              ? 'bg-white/[0.08] text-white/80 border border-white/[0.1]'
                              : 'text-white/30 hover:text-white/50'
                          }`}
                        >
                          {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                      ))}
                    </div>
                    <motion.button
                      onClick={() => setShowBmForm(true)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white text-xs font-medium shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30 hover:from-sky-600 hover:to-sky-700 transition-all duration-250"
                    >
                      <Plus className="w-3.5 h-3.5" strokeWidth={2} />
                      Add BM
                    </motion.button>
                  </motion.div>

                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                  >
                    {filteredBms.map((bm) => (
                      <motion.div
                        key={bm.id}
                        variants={cardVariants}
                        whileHover={{ y: -4 }}
                        onClick={() => setSelectedBmId(bm.id)}
                        className="group relative overflow-hidden rounded-2xl bg-titans-card border border-white/[0.06] shadow-soft-sm hover:shadow-glow-sm transition-all duration-250 cursor-pointer"
                      >
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-250 pointer-events-none">
                          <div className="absolute inset-0 bg-gradient-to-br from-titans-accent/[0.03] to-transparent" />
                        </div>

                        <div className="relative p-5 space-y-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.06] flex items-center justify-center shrink-0">
                                <Building2 className="w-5 h-5 text-white/50" strokeWidth={1.5} />
                              </div>
                              <div className="min-w-0">
                                <h3 className="text-sm font-semibold text-white/90 truncate">{bm.name}</h3>
                                <p className="flex items-center gap-1 text-[11px] text-white/30 font-[425] mt-0.5">
                                  <Hash className="w-3 h-3" strokeWidth={1.5} />
                                  {bm.businessId}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wide ${
                                bm.verified
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15'
                                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/15'
                              }`}
                            >
                              {bm.verified ? (
                                <CheckCircle2 className="w-3 h-3" strokeWidth={2} />
                              ) : (
                                <AlertTriangle className="w-3 h-3" strokeWidth={2} />
                              )}
                              {bm.verified ? 'Verified' : 'Unverified'}
                            </span>
                          </div>

                          {bm.createdAt && (
                            <div className="flex items-center gap-1.5">
                              <CalendarDays className="w-3.5 h-3.5 text-white/25" strokeWidth={1.5} />
                              <span className="text-[11px] text-white/30 font-[425]">Created {formatDate(bm.createdAt)}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-4 pt-1">
                            {[
                              { icon: BarChart3, label: 'Ads', count: bm.adAccountCount },
                              { icon: Newspaper, label: 'Pages', count: bm.pageCount },
                              { icon: Users, label: 'Users', count: bm.userCount },
                            ].map((stat, i) => (
                              <div key={i} className="flex items-center gap-1.5">
                                <stat.icon className="w-3.5 h-3.5 text-white/30" strokeWidth={1.5} />
                                <span className="text-xs text-white/60 font-medium">{stat.count}</span>
                                <span className="text-[10px] text-white/25 font-[425]">{stat.label}</span>
                              </div>
                            ))}
                          </div>

                          <div className="border-t border-white/[0.06]" />

                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-white/30 font-[425]">Balance</span>
                              <span className="text-xs font-semibold text-white/80">
                                {formatCurrency(bm.balance, bm.currency)}
                              </span>
                            </div>
                            {bm.overdue > 0 && (
                              <div className="flex items-center justify-between">
                                <span className="flex items-center gap-1 text-[11px] text-titans-accent/70 font-[425]">
                                  <AlertCircle className="w-3 h-3" strokeWidth={1.5} />
                                  Overdue
                                </span>
                                <span className="text-xs font-semibold text-titans-accent">
                                  {formatCurrency(bm.overdue, bm.currency)}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center gap-1 text-[10px] text-white/20 font-[425]">
                              <TrendingUp className="w-3 h-3" strokeWidth={1.5} />
                              {bm.verified ? 'Active' : 'Pending review'}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-titans-accent/40 group-hover:text-titans-accent/70 transition-default font-[425]">
                              View details
                              <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>

                  {filteredBms.length === 0 && (
                    <div className="text-center py-16">
                      <Building2 className="w-12 h-12 mx-auto text-white/[0.08] mb-4" strokeWidth={1} />
                      <p className="text-sm text-white/20 font-[425]">No business managers match your criteria.</p>
                    </div>
                  )}
                </>
              )}
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      {showBmForm && (
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
            onClick={() => setShowBmForm(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className="relative w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl bg-titans-card border border-white/[0.08] shadow-soft-lg overflow-hidden max-h-[85vh]"
          >
            <div className="overflow-y-auto max-h-[85vh] p-6 pb-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-500/15 to-sky-500/5 border border-sky-500/20 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-sky-400" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white/90">Add Business Manager</h2>
                    <p className="text-sm text-white/30 font-[425]">Enter the business manager info and credentials.</p>
                    <p className="text-sm text-white/40 mt-1">
                      Don&apos;t know how to do it?{' '}
                      <a
                        href="https://developers.facebook.com/tools/explorer"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-titans-accent hover:text-titans-accent/80 underline transition-default"
                      >
                        Click to here
                      </a>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBmForm(false)}
                  className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] flex items-center justify-center transition-default"
                >
                  <X className="w-4 h-4 text-white/50" strokeWidth={1.5} />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-[11px] text-white/30 font-[425] tracking-wide uppercase">Business Info</p>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">
                    Business Name <span className="text-titans-accent">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" strokeWidth={1.5} />
                    <input
                      type="text"
                      value={bmForm.name}
                      onChange={e => setBmForm({ ...bmForm, name: e.target.value })}
                      placeholder="My Business"
                      className="w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 pl-6 border-b border-white/[0.08] focus:outline-none focus:border-sky-500/50 focus:shadow-[0_4px_20px_-4px_rgba(0,150,255,0.3)] transition-default"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">
                      Business ID <span className="text-titans-accent">*</span>
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" strokeWidth={1.5} />
                      <input
                        type="text"
                        value={bmForm.business_id}
                        onChange={e => setBmForm({ ...bmForm, business_id: e.target.value })}
                        placeholder="123456789012345"
                        className="w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 pl-6 border-b border-white/[0.08] focus:outline-none focus:border-sky-500/50 focus:shadow-[0_4px_20px_-4px_rgba(0,150,255,0.3)] transition-default"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">Currency</label>
                    <div className="relative">
                      <DollarSign className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" strokeWidth={1.5} />
                      <select
                        value={bmForm.currency}
                        onChange={e => setBmForm({ ...bmForm, currency: e.target.value })}
                        className="w-full bg-transparent text-sm text-white/90 py-2.5 pl-6 border-b border-white/[0.08] focus:outline-none focus:border-sky-500/50 focus:shadow-[0_4px_20px_-4px_rgba(0,150,255,0.3)] transition-default appearance-none"
                      >
                        {['USD', 'EUR', 'GBP', 'AUD', 'TRY', 'JPY'].map(c => (
                          <option key={c} value={c} className="bg-titans-card">{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/[0.06] pt-6 space-y-4">
                <p className="text-[11px] text-white/30 font-[425] tracking-wide uppercase">Financial Details</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">
                      <CreditCard className="w-3.5 h-3.5 inline mr-1.5" strokeWidth={1.5} />
                      Balance
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={bmForm.balance}
                      onChange={e => setBmForm({ ...bmForm, balance: e.target.value })}
                      placeholder="0.00"
                      className="w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 border-b border-white/[0.08] focus:outline-none focus:border-sky-500/50 focus:shadow-[0_4px_20px_-4px_rgba(0,150,255,0.3)] transition-default"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">
                      <AlertTriangle className="w-3.5 h-3.5 inline mr-1.5" strokeWidth={1.5} />
                      Overdue
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={bmForm.overdue}
                      onChange={e => setBmForm({ ...bmForm, overdue: e.target.value })}
                      placeholder="0.00"
                      className="w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 border-b border-white/[0.08] focus:outline-none focus:border-sky-500/50 focus:shadow-[0_4px_20px_-4px_rgba(0,150,255,0.3)] transition-default"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-white/[0.06] pt-6 space-y-4">
                <p className="text-[11px] text-white/30 font-[425] tracking-wide uppercase">Notifications</p>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">
                    <Bell className="w-3.5 h-3.5 inline mr-1.5" strokeWidth={1.5} />
                    Notify when balance before billing is less than
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" strokeWidth={1.5} />
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={bmForm.notify_balance_threshold}
                      onChange={e => setBmForm({ ...bmForm, notify_balance_threshold: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                      className="w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 pl-6 border-b border-white/[0.08] focus:outline-none focus:border-sky-500/50 focus:shadow-[0_4px_20px_-4px_rgba(0,150,255,0.3)] transition-default"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">
                    <Timer className="w-3.5 h-3.5 inline mr-1.5" strokeWidth={1.5} />
                    Send notifications no more than once in (minutes)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={bmForm.notify_cooldown_minutes}
                    onChange={e => setBmForm({ ...bmForm, notify_cooldown_minutes: parseInt(e.target.value) || 60 })}
                    className="w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 border-b border-white/[0.08] focus:outline-none focus:border-sky-500/50 focus:shadow-[0_4px_20px_-4px_rgba(0,150,255,0.3)] transition-default"
                  />
                </div>
                <div className="space-y-1 pt-2">
                  <p className="text-[11px] text-white/30 font-[425] tracking-wide uppercase mb-2">
                    <ToggleLeft className="w-3.5 h-3.5 inline mr-1.5" strokeWidth={1.5} />
                    Notification Types
                  </p>
                  {[
                    { key: 'notify_moderation', label: 'Moderation notifications' },
                    { key: 'notify_cabinet_status', label: 'Cabinet status notices' },
                    { key: 'notify_billing', label: 'Billing notices' },
                  ].map(f => (
                    <div key={f.key} className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                      <span className="text-sm text-white/70">{f.label}</span>
                      <button
                        onClick={() => setBmForm({ ...bmForm, [f.key]: !(bmForm as any)[f.key] })}
                        className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
                          (bmForm as any)[f.key] ? 'bg-sky-500' : 'bg-white/[0.12]'
                        }`}
                      >
                        <motion.div
                          layout
                          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm ${
                            (bmForm as any)[f.key] ? 'right-0.5' : 'left-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <motion.button
                onClick={saveBm}
                disabled={bmSaving || !bmForm.name || !bmForm.business_id}
                whileTap={{ scale: 0.97 }}
                className="relative w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white text-sm font-medium shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30 hover:from-sky-600 hover:to-sky-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-250 overflow-hidden"
              >
                {bmSaving ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
                    Adding...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Save className="w-4 h-4" strokeWidth={1.5} />
                    Add Business Manager
                  </span>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
