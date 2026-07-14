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
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';
import BmDetail from './BmDetail';

interface BmFinancial {
  balance: number;
  currency: string;
  overdue: number;
}

interface BusinessManager {
  id: string;
  name: string;
  businessId: string;
  verified: boolean;
  adAccountCount: number;
  pageCount: number;
  userCount: number;
  financial: BmFinancial;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.15 },
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

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
};

const mapBmFromApi = (item: any): BusinessManager => ({
  id: String(item.id),
  name: item.name,
  businessId: item.business_id,
  verified: item.verified,
  adAccountCount: item.ad_account_count ?? 0,
  pageCount: item.page_count ?? 0,
  userCount: item.user_count ?? 0,
  financial: item.financial ?? { balance: item.balance ?? 0, currency: item.currency ?? 'USD', overdue: item.overdue ?? 0 },
});

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [selectedBmId, setSelectedBmId] = React.useState<string | null>(null);
  const [bms, setBms] = React.useState<BusinessManager[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

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

  const summaryTotals = React.useMemo(() => {
    const totals = { adAccounts: 0, pages: 0, users: 0, balance: 0, overdue: 0 };
    bms.forEach(bm => {
      totals.adAccounts += bm.adAccountCount;
      totals.pages += bm.pageCount;
      totals.users += bm.userCount;
      totals.balance += bm.financial.balance;
      totals.overdue += bm.financial.overdue;
    });
    return totals;
  }, [bms]);

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
                    className="flex flex-wrap items-center gap-6 mb-8 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05]"
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
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                  >
                    {bms.map((bm) => (
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
                                {formatCurrency(bm.financial.balance, bm.financial.currency)}
                              </span>
                            </div>
                            {bm.financial.overdue > 0 && (
                              <div className="flex items-center justify-between">
                                <span className="flex items-center gap-1 text-[11px] text-titans-accent/70 font-[425]">
                                  <AlertCircle className="w-3 h-3" strokeWidth={1.5} />
                                  Overdue
                                </span>
                                <span className="text-xs font-semibold text-titans-accent">
                                  {formatCurrency(bm.financial.overdue, bm.financial.currency)}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center gap-1 text-[10px] text-white/20 font-[425]">
                              <TrendingUp className="w-3 h-3" strokeWidth={1.5} />
                              {bm.verified ? 'Active' : 'Pending review'}
                            </div>
                            <ChevronDown className="w-3.5 h-3.5 text-white/20 group-hover:text-white/40 transition-default -rotate-90" strokeWidth={1.5} />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </>
              )}
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
