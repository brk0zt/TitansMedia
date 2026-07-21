import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
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
  DollarSign,
  CalendarDays,
  AlertCircle,
  CreditCard,
  Plus,
  Settings2,
  Globe,
  Key,
  UserCheck,
  Bell,
  Timer,
  ToggleLeft,
  Save,
  X,
  FlaskConical,
  Cookie,
} from 'lucide-react';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import AnimatedSearchBar from '@/components/ui/AnimatedSearchBar';
import { AdAccountToast, type AdAccountNotification } from '@/components/ui/AdAccountToast';
import { FormInfoPanel } from '@/components/ui/FormInfoPanel';

interface BillingData {
  loading: boolean;
  error: string | null;
  errorType: string | null;
  data: BillingResponse | null;
}

interface BillingResponse {
  id: string;
  ad_account_id: string;
  name: string;
  facebook: {
    balance: number | null;
    spend: number | null;
    amount_spent: number | null;
    account_status: number | null;
    currency: string | null;
    business_name: string | null;
    spend_cap: number | null;
    budget_remaining: number | null;
    daily_spend: number | null;
    min_campaign_group_spend_cap: number | null;
    disable_reason: number | null;
  } | null;
  local: {
    spend: number;
    impressions: number;
    clicks: number;
    currency: string;
  };
}

interface AdAccount {
  id: string;
  accountId: string;
  fbAdAccountId: string | null;
  fbAccountId: string | null;
  pixelId: string | null;
  ownerAccount: string | null;
  sharedAccounts: any[] | null;
  name: string;
  status: string;
  spend: number;
  currency: string;
  impressions: number;
  clicks: number;
  balance: number;
  outstandingBalance: number;
  availableCredit: number;
  billingThreshold: number | null;
  dailySpendingLimit: number | null;
  accountSpendingLimit: number | null;
  automation_mode: 'api' | 'cookie' | 'manual';
  manual_mode: boolean;
  token: string;
  useragent: string;
  proxy: string | null;
  cookie: string | null;
  cookie_raw: string;
  cookie_c_user: string;
  cookie_xs: string;
  cookie_datr: string;
  notify_balance_threshold: number;
  notify_cooldown_minutes: number;
  notify_moderation: boolean;
  notify_cabinet_status: boolean;
  notify_billing: boolean;
  fetch_boosted_posts: boolean;
  fetch_dark_posts: boolean;
  fetch_lead_forms: boolean;
  monitor_impressions: boolean;
  monitor_clicks: boolean;
  monitor_budget: boolean;
  monitor_reach: boolean;
  monitor_engagement: boolean;
  paymentMethod: string | null;
  paymentMethodCount: number;
  cardStatus: string | null;
  cardExpiration: string | null;
  autoPay: boolean;
  manualPay: boolean;
  billingNotifications: boolean;
  country: string | null;
  vatId: string | null;
  todaySpend: number;
  yesterdaySpend: number;
  dailyBudget: number | null;
  lifetimeBudget: number | null;
  remainingSpend: number;
  reviewFeedback: string | null;
  policyViolations: number;
  notificationCount: number;
  accountHealth: string | null;
  deliveryIssues: string | null;
  appliedAutoRules: any[] | null;
  autoComment: boolean;
  restricted: boolean;
  unsettled: boolean;
  pendingReview: boolean;
  appealSubmitted: boolean;
  reviewResult: string | null;
}

interface Page {
  id: string;
  pageId: string;
  name: string;
  category: string;
  followers: number;
  engaged: number;
  status: string;
  automation_mode: 'api' | 'cookie' | 'manual';
  token: string;
  useragent: string;
  proxy: string | null;
  group_name: string | null;
  cookie: string | null;
  cookie_raw: string;
  cookie_c_user: string;
  cookie_xs: string;
  cookie_datr: string;
  notify_balance_threshold: number;
  notify_cooldown_minutes: number;
  notify_moderation: boolean;
  notify_cabinet_status: boolean;
  notify_billing: boolean;
  fetch_boosted_posts: boolean;
  fetch_dark_posts: boolean;
  fetch_lead_forms: boolean;
  monitor_impressions: boolean;
  monitor_clicks: boolean;
  monitor_budget: boolean;
  monitor_reach: boolean;
  monitor_engagement: boolean;
  linkedInstagram: string | null;
  banned: boolean;
  unpublishedReason: string | null;
  adminRole: boolean;
  editor: boolean;
  advertiser: boolean;
  moderator: boolean;
  permissionList: any[] | null;
  restrictionReason: string | null;
  policyStrike: number;
  appealAvailable: boolean;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'disabled';
  lastActive: string;
  permissions: MemberPermissions;
}

interface MemberPermissions {
  manage_ad_accounts: boolean;
  manage_pages: boolean;
  invite_users: boolean;
  manage_roles: boolean;
  remove_members: boolean;
}

const defaultPermissions: MemberPermissions = {
  manage_ad_accounts: false,
  manage_pages: false,
  invite_users: false,
  manage_roles: false,
  remove_members: false,
};

const rolePermissionPresets: Record<string, MemberPermissions> = {
  'Admin': {
    manage_ad_accounts: true,
    manage_pages: true,
    invite_users: true,
    manage_roles: true,
    remove_members: true,
  },
  'Ad Manager': {
    manage_ad_accounts: true,
    manage_pages: false,
    invite_users: false,
    manage_roles: false,
    remove_members: false,
  },
  'Analyst': {
    manage_ad_accounts: false,
    manage_pages: false,
    invite_users: false,
    manage_roles: false,
    remove_members: false,
  },
};

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
  restrictionState: string | null;
  appealsRemaining: number;
  adminRole: string | null;
  verificationStatus: string;
  businessVerification: string;
  pixelCount: number;
  partnerCount: number;
  createdAt: string;
}

const availableRoles = ['Admin', 'Ad Manager', 'Analyst'];

// Returns the effective permissions for a given role. When custom permissions are provided, they override the role defaults.
const getEffectivePermissions = (role: string, custom?: MemberPermissions): MemberPermissions => {
  const preset = rolePermissionPresets[role] || defaultPermissions;
  if (!custom) return preset;
  const result = { ...preset };
  for (const key of Object.keys(defaultPermissions) as (keyof MemberPermissions)[]) {
    if (custom[key] !== undefined) result[key] = custom[key];
  }
  return result;
};

const can = (perms: MemberPermissions, action: keyof MemberPermissions): boolean => {
  return perms[action] === true;
};

const mapAdAccount = (item: any): AdAccount => ({
  id: String(item.id ?? ''),
  accountId: item.account_id || String(item.id ?? ''),
  fbAdAccountId: item.fb_ad_account_id || null,
  fbAccountId: item.fb_account_id || null,
  pixelId: item.pixel_id || null,
  ownerAccount: item.owner_account || null,
  sharedAccounts: item.shared_accounts || null,
  name: item.name ?? '',
  status: item.status ?? 'active',
  spend: item.spend ?? 0,
  currency: item.currency ?? 'USD',
  impressions: item.impressions ?? 0,
  clicks: item.clicks ?? 0,
  balance: item.balance ?? 0,
  outstandingBalance: item.outstanding_balance ?? 0,
  availableCredit: item.available_credit ?? 0,
  billingThreshold: item.billing_threshold ?? null,
  dailySpendingLimit: item.daily_spending_limit ?? null,
  accountSpendingLimit: item.account_spending_limit ?? null,
  automation_mode: item.automation_mode || 'api',
  manual_mode: item.manual_mode ?? false,
  token: item.token || '',
  useragent: item.useragent || '',
  proxy: item.proxy || null,
  cookie: item.cookie || null,
  cookie_raw: item.cookie_raw || '',
  cookie_c_user: item.cookie_c_user || '',
  cookie_xs: item.cookie_xs || '',
  cookie_datr: item.cookie_datr || '',
  notify_balance_threshold: item.notify_balance_threshold ?? 0,
  notify_cooldown_minutes: item.notify_cooldown_minutes ?? 60,
  notify_moderation: item.notify_moderation ?? true,
  notify_cabinet_status: item.notify_cabinet_status ?? true,
  notify_billing: item.notify_billing ?? true,
  fetch_boosted_posts: item.fetch_boosted_posts ?? true,
  fetch_dark_posts: item.fetch_dark_posts ?? true,
  fetch_lead_forms: item.fetch_lead_forms ?? true,
  monitor_impressions: item.monitor_impressions ?? true,
  monitor_clicks: item.monitor_clicks ?? true,
  monitor_budget: item.monitor_budget ?? true,
  monitor_reach: item.monitor_reach ?? true,
  monitor_engagement: item.monitor_engagement ?? true,
  paymentMethod: item.payment_method ?? null,
  paymentMethodCount: item.payment_method_count ?? 0,
  cardStatus: item.card_status ?? null,
  cardExpiration: item.card_expiration ?? null,
  autoPay: item.auto_pay ?? false,
  manualPay: item.manual_pay ?? false,
  billingNotifications: item.billing_notifications ?? true,
  country: item.country ?? null,
  vatId: item.vat_id ?? null,
  todaySpend: item.today_spend ?? 0,
  yesterdaySpend: item.yesterday_spend ?? 0,
  dailyBudget: item.daily_budget ?? null,
  lifetimeBudget: item.lifetime_budget ?? null,
  remainingSpend: item.remaining_spend ?? 0,
  reviewFeedback: item.review_feedback ?? null,
  policyViolations: item.policy_violations ?? 0,
  notificationCount: item.notification_count ?? 0,
  accountHealth: item.account_health ?? null,
  deliveryIssues: item.delivery_issues ?? null,
  appliedAutoRules: item.applied_auto_rules ?? null,
  autoComment: item.auto_comment ?? false,
  restricted: item.restricted ?? false,
  unsettled: item.unsettled ?? false,
  pendingReview: item.pending_review ?? false,
  appealSubmitted: item.appeal_submitted ?? false,
  reviewResult: item.review_result ?? null,
});

const mapPage = (item: any): Page => ({
  id: item.page_id || String(item.id ?? ''),
  pageId: item.page_id || String(item.id ?? ''),
  name: item.name ?? '',
  category: item.category ?? '',
  followers: item.followers ?? 0,
  engaged: item.engaged ?? 0,
  status: item.status || 'published',
  automation_mode: item.automation_mode || 'api',
  token: item.token || '',
  useragent: item.useragent || '',
  proxy: item.proxy || null,
  group_name: item.group_name || null,
  cookie: item.cookie || null,
  cookie_raw: item.cookie_raw || '',
  cookie_c_user: item.cookie_c_user || '',
  cookie_xs: item.cookie_xs || '',
  cookie_datr: item.cookie_datr || '',
  notify_balance_threshold: item.notify_balance_threshold ?? 0,
  notify_cooldown_minutes: item.notify_cooldown_minutes ?? 60,
  notify_moderation: item.notify_moderation ?? true,
  notify_cabinet_status: item.notify_cabinet_status ?? true,
  notify_billing: item.notify_billing ?? true,
  fetch_boosted_posts: item.fetch_boosted_posts ?? true,
  fetch_dark_posts: item.fetch_dark_posts ?? true,
  fetch_lead_forms: item.fetch_lead_forms ?? true,
  monitor_impressions: item.monitor_impressions ?? true,
  monitor_clicks: item.monitor_clicks ?? true,
  monitor_budget: item.monitor_budget ?? true,
  monitor_reach: item.monitor_reach ?? true,
  monitor_engagement: item.monitor_engagement ?? true,
  linkedInstagram: item.linked_instagram ?? null,
  banned: item.banned ?? false,
  unpublishedReason: item.unpublished_reason ?? null,
  adminRole: item.admin_role ?? false,
  editor: item.editor ?? false,
  advertiser: item.advertiser ?? false,
  moderator: item.moderator ?? false,
  permissionList: item.permission_list ?? null,
  restrictionReason: item.restriction_reason ?? null,
  policyStrike: item.policy_strike ?? 0,
  appealAvailable: item.appeal_available ?? false,
});

const mapMember = (item: any): TeamMember => ({
  id: String(item.id ?? ''),
  name: item.name ?? '',
  email: item.email ?? '',
  role: item.role ?? 'Analyst',
  status: item.status ?? 'active',
  lastActive: item.last_active ?? null,
  permissions: item.permissions ? {
    manage_ad_accounts: !!item.permissions.manage_ad_accounts,
    manage_pages: !!item.permissions.manage_pages,
    invite_users: !!item.permissions.invite_users,
    manage_roles: !!item.permissions.manage_roles,
    remove_members: !!item.permissions.remove_members,
  } : rolePermissionPresets[item.role] || defaultPermissions,
});

const formatNumber = (n: number) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toLocaleString();
};

const formatCurrency = (amount: number, currency: string) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2 }).format(amount);

const timeAgo = (iso: string) => {
  if (!iso) return 'Never';
  const diff = Date.now() - new Date(iso).getTime();
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 1) return 'Just now';
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return '';
  }
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

const Toggle: React.FC<{
  value: boolean;
  onChange: (v: boolean) => void;
  label: string;
}> = ({ value, onChange, label }) => (
  <div className="flex items-center justify-between py-1.5">
    <span className="text-sm text-white/70">{label}</span>
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
        value ? 'bg-titans-accent' : 'bg-white/[0.1]'
      }`}
    >
      <motion.div
        animate={{ x: value ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
      />
    </button>
  </div>
);

const permissionLabels: Record<keyof MemberPermissions, string> = {
  manage_ad_accounts: 'Manage Ad Accounts',
  manage_pages: 'Manage Pages',
  invite_users: 'Invite Users',
  manage_roles: 'Manage Roles',
  remove_members: 'Remove Members',
};

const PersmissionsEditor: React.FC<{
  permissions: MemberPermissions;
  onChange: (perms: MemberPermissions) => void;
}> = ({ permissions, onChange }) => {
  const toggle = (key: keyof MemberPermissions) => {
    onChange({ ...permissions, [key]: !permissions[key] });
  };
  return (
    <div className="space-y-1">
      {(Object.keys(permissionLabels) as (keyof MemberPermissions)[]).map(key => (
        <div key={key} className="flex items-center justify-between py-1.5">
          <span className="text-xs text-white/60">{permissionLabels[key]}</span>
          <button
            type="button"
            onClick={() => toggle(key)}
            className={`relative w-9 h-4.5 rounded-full transition-colors duration-200 ${
              permissions[key] ? 'bg-titans-accent' : 'bg-white/[0.1]'
            }`}
          >
            <motion.div
              animate={{ x: permissions[key] ? 18 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow-sm"
            />
          </button>
        </div>
      ))}
    </div>
  );
};

interface BmDetailProps {
  bm: BusinessManager;
  onBack: () => void;
}

type TabId = 'ad-accounts' | 'pages' | 'team';

type PageFormData = {
  name: string;
  page_id: string;
  category: string;
  followers: number;
  engaged: number;
  automation_mode: 'api' | 'cookie' | 'manual';
  token: string;
  useragent: string;
  proxy: string;
  group_name: string;
  cookie: string;
  cookie_raw: string;
  cookie_c_user: string;
  cookie_xs: string;
  cookie_datr: string;
  notify_balance_threshold: number;
  notify_cooldown_minutes: number;
  notify_moderation: boolean;
  notify_cabinet_status: boolean;
  notify_billing: boolean;
  fetch_boosted_posts: boolean;
  fetch_dark_posts: boolean;
  fetch_lead_forms: boolean;
  monitor_impressions: boolean;
  monitor_clicks: boolean;
  monitor_budget: boolean;
  monitor_reach: boolean;
  monitor_engagement: boolean;
  linked_instagram: string;
  banned: boolean;
  unpublished_reason: string;
  admin_role: boolean;
  editor: boolean;
  advertiser: boolean;
  moderator: boolean;
  restriction_reason: string;
  policy_strike: number;
  appeal_available: boolean;
};

const defaultPageForm: PageFormData = {
  name: '',
  page_id: '',
  category: '',
  followers: 0,
  engaged: 0,
  automation_mode: 'api',
  token: '',
  useragent: navigator.userAgent || 'Mozilla/5.0',
  proxy: '',
  group_name: '',
  cookie: '',
  cookie_raw: '',
  cookie_c_user: '',
  cookie_xs: '',
  cookie_datr: '',
  notify_balance_threshold: 0,
  notify_cooldown_minutes: 60,
  notify_moderation: true,
  notify_cabinet_status: true,
  notify_billing: true,
  fetch_boosted_posts: true,
  fetch_dark_posts: true,
  fetch_lead_forms: true,
  monitor_impressions: true,
  monitor_clicks: true,
  monitor_budget: true,
  monitor_reach: true,
  monitor_engagement: true,
  linked_instagram: '',
  banned: false,
  unpublished_reason: '',
  admin_role: false,
  editor: false,
  advertiser: false,
  moderator: false,
  restriction_reason: '',
  policy_strike: 0,
  appeal_available: false,
};

export const BmDetail: React.FC<BmDetailProps> = ({ bm, onBack }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState<TabId>('ad-accounts');
  const [search, setSearch] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<'all' | 'active' | 'disabled'>('all');

  const [adAccounts, setAdAccounts] = React.useState<AdAccount[]>([]);
  const [pages, setPages] = React.useState<Page[]>([]);
  const [members, setMembers] = React.useState<TeamMember[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [currentUserPerms, setCurrentUserPerms] = React.useState<MemberPermissions>(rolePermissionPresets['Admin']);

  const [showPageForm, setShowPageForm] = React.useState(false);
  const [showPageAuthSelect, setShowPageAuthSelect] = React.useState(false);
  const [editingPageId, setEditingPageId] = React.useState<string | null>(null);
  const [pageForm, setPageForm] = React.useState(defaultPageForm);
  const [pageSaving, setPageSaving] = React.useState(false);

  const [showAdForm, setShowAdForm] = React.useState(false);
  const [showAdAuthSelect, setShowAdAuthSelect] = React.useState(false);
  const [editingAdId, setEditingAdId] = React.useState<string | null>(null);
  const [adForm, setAdForm] = React.useState({
    name: '',
    account_id: '',
    fb_ad_account_id: '',
    fb_account_id: '',
    pixel_id: '',
    owner_account: '',
    status: 'active',
    automation_mode: 'api' as 'api' | 'cookie' | 'manual',
    balance: 0,
    token: '',
    useragent: navigator.userAgent || 'Mozilla/5.0',
    proxy: '',
    cookie: '',
    cookie_raw: '',
    cookie_c_user: '',
    cookie_xs: '',
    cookie_datr: '',
    notify_balance_threshold: 0,
    notify_cooldown_minutes: 60,
    notify_moderation: true,
    notify_cabinet_status: true,
    notify_billing: true,
    fetch_boosted_posts: true,
    fetch_dark_posts: true,
    fetch_lead_forms: true,
    monitor_impressions: true,
    monitor_clicks: true,
    monitor_budget: true,
    monitor_reach: true,
    monitor_engagement: true,
    daily_spending_limit: 0,
    account_spending_limit: 0,
    outstanding_balance: 0,
    available_credit: 0,
    billing_threshold: 0,
    payment_method: '',
    card_status: '',
    card_expiration: '',
    auto_pay: false,
    manual_pay: false,
    billing_notifications: true,
    country: '',
    vat_id: '',
    today_spend: 0,
    yesterday_spend: 0,
    daily_budget: 0,
    lifetime_budget: 0,
    remaining_spend: 0,
    review_feedback: '',
    policy_violations: 0,
    account_health: '',
    delivery_issues: '',
    auto_comment: false,
    restricted: false,
    unsettled: false,
    pending_review: false,
    appeal_submitted: false,
    review_result: '',
    payment_method_count: 0,
  });
  const [adSaving, setAdSaving] = React.useState(false);
  const [toasts, setToasts] = React.useState<AdAccountNotification[]>([]);

  const addToast = React.useCallback((n: Omit<AdAccountNotification, 'id'>) => {
    const id = Date.now().toString();
    setToasts(prev => [{ ...n, id }, ...prev]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4500);
  }, []);

  const [selectedBillingId, setSelectedBillingId] = React.useState<string | null>(null);
  const [billingCache, setBillingCache] = React.useState<Record<string, BillingData>>({});

  const fetchBilling = React.useCallback((adAccountId: string) => {
    const cached = billingCache[adAccountId];
    if (cached && (cached.data || cached.error)) return;

    setBillingCache(prev => ({ ...prev, [adAccountId]: { loading: true, error: null, errorType: null, data: null } }));

    apiClient.get(`/ad-accounts/${adAccountId}/billing`)
      .then(res => {
        setBillingCache(prev => ({ ...prev, [adAccountId]: { loading: false, error: null, errorType: null, data: res.data } }));
      })
      .catch(err => {
        const data = err.response?.data;
        setBillingCache(prev => ({
          ...prev,
          [adAccountId]: {
            loading: false,
            error: data?.message || 'Failed to fetch billing data.',
            errorType: data?.error || 'unknown',
            data: null,
          },
        }));
      });
  }, [billingCache]);

  const [showInvite, setShowInvite] = React.useState(false);
  const [inviteEmail, setInviteEmail] = React.useState('');
  const [inviteRole, setInviteRole] = React.useState('Analyst');
  const [invitePermissions, setInvitePermissions] = React.useState<MemberPermissions>(rolePermissionPresets['Analyst']);
  const [inviteStatus, setInviteStatus] = React.useState<'idle' | 'loading' | 'success'>('idle');
  const [selectedMember, setSelectedMember] = React.useState<TeamMember | null>(null);
  const [memberDetailRole, setMemberDetailRole] = React.useState('');
  const [memberDetailPerms, setMemberDetailPerms] = React.useState<MemberPermissions>(defaultPermissions);

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
          const current = membersData.map(mapMember).find(
            (m: TeamMember) => m.email === user?.email
          );
          if (current) {
            setCurrentUserPerms(getEffectivePermissions(current.role, current.permissions));
          }
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
      list = list.filter(a =>
        a.name?.toLowerCase().includes(q) ||
        a.id?.toLowerCase().includes(q) ||
        a.accountId?.toLowerCase().includes(q)
      );
    }
    if (filterStatus !== 'all') list = list.filter(a => a.status === filterStatus);
    return list;
  }, [search, filterStatus, adAccounts]);

  const filteredPages = React.useMemo(() => {
    let list = pages;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.id?.toLowerCase().includes(q) ||
        (p.group_name && p.group_name.toLowerCase().includes(q))
      );
    }
    if (filterStatus !== 'all') list = list.filter(p => (filterStatus === 'active' ? p.status === 'published' : p.status === 'unpublished'));
    return list;
  }, [search, filterStatus, pages]);

  const filteredMembers = React.useMemo(() => {
    let list = members;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(m =>
        m.name?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q) ||
        m.role?.toLowerCase().includes(q)
      );
    }
    if (filterStatus !== 'all') list = list.filter(m => m.status === filterStatus);
    return list;
  }, [search, filterStatus, members]);

  const totalSpend = React.useMemo(
    () => adAccounts.reduce((sum, a) => sum + a.spend, 0),
    [adAccounts]
  );

  const handleRoleChange = (memberId: string, newRole: string) => {
    const bmId = Number(bm.id);
    apiClient.put(`/business-managers/${bmId}/members/${memberId}/role`, { role: newRole })
      .then(() => {
        setMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m));
      });
  };

  const handlePermissionsUpdate = (memberId: string, permissions: MemberPermissions) => {
    const bmId = Number(bm.id);
    apiClient.put(`/business-managers/${bmId}/members/${memberId}/permissions`, { permissions })
      .then(() => {
        setMembers(prev => prev.map(m => m.id === memberId ? { ...m, permissions } : m));
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
    apiClient.post(`/business-managers/${bmId}/members/invite`, {
      email: inviteEmail,
      role: inviteRole,
      permissions: invitePermissions,
    })
      .then(res => {
        setInviteStatus('success');
        const newMember = mapMember(res.data?.member ?? {});
        setTimeout(() => {
          setMembers(prev => [newMember, ...prev]);
          setShowInvite(false);
          setInviteEmail('');
          setInviteRole('Analyst');
          setInvitePermissions(rolePermissionPresets['Analyst']);
          setInviteStatus('idle');
        }, 800);
      })
      .catch(err => {
        setInviteStatus('idle');
        alert('Invite failed: ' + JSON.stringify(err.response?.data || err.message));
      });
  };

const openPageForm = (existing?: Page) => {
    if (existing) {
      setEditingPageId(existing.id);
      setPageForm({
        name: existing.name,
        page_id: existing.pageId,
        category: existing.category,
        followers: existing.followers,
        engaged: existing.engaged,
        automation_mode: existing.automation_mode,
        token: existing.token,
        useragent: existing.useragent,
        proxy: existing.proxy || '',
        group_name: existing.group_name || '',
        cookie: existing.cookie || '',
        cookie_raw: existing.cookie_raw || '',
        cookie_c_user: existing.cookie_c_user || '',
        cookie_xs: existing.cookie_xs || '',
        cookie_datr: existing.cookie_datr || '',
        notify_balance_threshold: existing.notify_balance_threshold,
        notify_cooldown_minutes: existing.notify_cooldown_minutes,
        notify_moderation: existing.notify_moderation,
        notify_cabinet_status: existing.notify_cabinet_status,
        notify_billing: existing.notify_billing,
        fetch_boosted_posts: existing.fetch_boosted_posts,
        fetch_dark_posts: existing.fetch_dark_posts,
        fetch_lead_forms: existing.fetch_lead_forms,
        monitor_impressions: existing.monitor_impressions,
        monitor_clicks: existing.monitor_clicks,
        monitor_budget: existing.monitor_budget,
        monitor_reach: existing.monitor_reach,
        monitor_engagement: existing.monitor_engagement,
        linked_instagram: existing.linkedInstagram || '',
        banned: existing.banned ?? false,
        unpublished_reason: existing.unpublishedReason || '',
        admin_role: existing.adminRole ?? false,
        editor: existing.editor ?? false,
        advertiser: existing.advertiser ?? false,
        moderator: existing.moderator ?? false,
        restriction_reason: existing.restrictionReason || '',
        policy_strike: existing.policyStrike ?? 0,
        appeal_available: existing.appealAvailable ?? false,
      });
      // For existing pages, determine auth method from automation_mode
      // setPageAuthMethod(existing.automation_mode === 'cookie' ? 'cookie' : 'token');
    } else {
      setEditingPageId(null);
      setPageForm({ ...defaultPageForm, useragent: navigator.userAgent || 'Mozilla/5.0' });
      // setPageAuthMethod(null);
    }
    setShowPageAuthSelect(true);
  };

  const savePage = () => {
    setPageSaving(true);
    const bmId = Number(bm.id);
    const payload = { ...pageForm };

    if (editingPageId) {
      apiClient.put(`/business-managers/${bmId}/pages/${editingPageId}`, payload)
        .then(res => {
          const updated = mapPage(res.data);
          setPages(prev => prev.map(p => p.id === editingPageId ? updated : p));
          setShowPageForm(false);
        })
        .finally(() => setPageSaving(false));
    } else {
      apiClient.post(`/business-managers/${bmId}/pages`, payload)
        .then(res => {
          const created = mapPage(res.data?.data || res.data);
          setPages(prev => [created, ...prev]);
          setShowPageForm(false);
        })
        .catch(err => {
          alert('Server error: ' + JSON.stringify(err.response?.data || err.message));
        })
        .finally(() => setPageSaving(false));
    }
  };

  const deletePage = (id: string) => {
    setPages(prev => prev.filter(p => p.id !== id));
    apiClient.delete(`/business-managers/${Number(bm.id)}/pages/${id}`);
  };

  const openAdForm = (existing?: AdAccount) => {
    if (existing) {
      setEditingAdId(existing.id);
      setAdForm({
        name: existing.name,
        account_id: existing.accountId,
        fb_ad_account_id: existing.fbAdAccountId || '',
        fb_account_id: existing.fbAccountId || '',
        pixel_id: existing.pixelId || '',
        owner_account: existing.ownerAccount || '',
        status: existing.status,
        automation_mode: existing.automation_mode,
        balance: existing.balance,
        token: existing.token || '',
        useragent: existing.useragent || navigator.userAgent || 'Mozilla/5.0',
        proxy: existing.proxy || '',
        cookie: existing.cookie || '',
        cookie_raw: existing.cookie_raw || '',
        cookie_c_user: existing.cookie_c_user || '',
        cookie_xs: existing.cookie_xs || '',
        cookie_datr: existing.cookie_datr || '',
        notify_balance_threshold: existing.notify_balance_threshold,
        notify_cooldown_minutes: existing.notify_cooldown_minutes,
        notify_moderation: existing.notify_moderation,
        notify_cabinet_status: existing.notify_cabinet_status,
        notify_billing: existing.notify_billing,
        fetch_boosted_posts: existing.fetch_boosted_posts,
        fetch_dark_posts: existing.fetch_dark_posts,
        fetch_lead_forms: existing.fetch_lead_forms,
        monitor_impressions: existing.monitor_impressions,
        monitor_clicks: existing.monitor_clicks,
        monitor_budget: existing.monitor_budget,
        monitor_reach: existing.monitor_reach,
        monitor_engagement: existing.monitor_engagement,
        daily_spending_limit: existing.dailySpendingLimit ?? 0,
        account_spending_limit: existing.accountSpendingLimit ?? 0,
        outstanding_balance: existing.outstandingBalance ?? 0,
        available_credit: existing.availableCredit ?? 0,
        billing_threshold: existing.billingThreshold ?? 0,
        payment_method: existing.paymentMethod || '',
        card_status: existing.cardStatus || '',
        card_expiration: existing.cardExpiration || '',
        auto_pay: existing.autoPay ?? false,
        manual_pay: existing.manualPay ?? false,
        billing_notifications: existing.billingNotifications ?? true,
        country: existing.country || '',
        vat_id: existing.vatId || '',
        today_spend: existing.todaySpend ?? 0,
        yesterday_spend: existing.yesterdaySpend ?? 0,
        daily_budget: existing.dailyBudget ?? 0,
        lifetime_budget: existing.lifetimeBudget ?? 0,
        remaining_spend: existing.remainingSpend ?? 0,
        review_feedback: existing.reviewFeedback || '',
        policy_violations: existing.policyViolations ?? 0,
        account_health: existing.accountHealth || '',
        delivery_issues: existing.deliveryIssues || '',
        auto_comment: existing.autoComment ?? false,
        restricted: existing.restricted ?? false,
        unsettled: existing.unsettled ?? false,
        pending_review: existing.pendingReview ?? false,
        appeal_submitted: existing.appealSubmitted ?? false,
        review_result: existing.reviewResult || '',
        payment_method_count: existing.paymentMethodCount ?? 0,
      });
      // setAdAuthMethod(existing.automation_mode === 'cookie' ? 'cookie' : 'token');
    } else {
      setEditingAdId(null);
      setAdForm({
        name: '', account_id: '', fb_ad_account_id: '', fb_account_id: '',
        pixel_id: '', owner_account: '', status: 'active',
        automation_mode: 'api', balance: 0,
        token: '', useragent: navigator.userAgent || 'Mozilla/5.0', proxy: '', cookie: '',
        cookie_raw: '', cookie_c_user: '', cookie_xs: '', cookie_datr: '',
        notify_balance_threshold: 0, notify_cooldown_minutes: 60,
        notify_moderation: true, notify_cabinet_status: true, notify_billing: true,
        fetch_boosted_posts: true, fetch_dark_posts: true, fetch_lead_forms: true,
        monitor_impressions: true, monitor_clicks: true, monitor_budget: true,
        monitor_reach: true, monitor_engagement: true,
        daily_spending_limit: 0, account_spending_limit: 0,
        outstanding_balance: 0, available_credit: 0, billing_threshold: 0,
        payment_method: '', card_status: '', card_expiration: '',
        auto_pay: false, manual_pay: false, billing_notifications: true,
        country: '', vat_id: '',
        today_spend: 0, yesterday_spend: 0, daily_budget: 0, lifetime_budget: 0, remaining_spend: 0,
        review_feedback: '', policy_violations: 0, account_health: '', delivery_issues: '',
        auto_comment: false, restricted: false, unsettled: false,
        pending_review: false, appeal_submitted: false, review_result: '',
        payment_method_count: 0,
      });
    }
    setShowAdAuthSelect(true);
  };

  const saveAdAccount = () => {
    setAdSaving(true);
    const bmId = Number(bm.id);
    const payload = { ...adForm };

    if (editingAdId) {
      apiClient.put(`/business-managers/${bmId}/ad-accounts/${editingAdId}`, payload)
        .then(res => {
          const updated = mapAdAccount(res.data.data ?? res.data);
          setAdAccounts(prev => prev.map(a => a.id === editingAdId ? updated : a));
          setShowAdForm(false);
          addToast({ action: 'updated', name: updated.name, accountId: updated.accountId, status: 'success' });
        })
        .catch(err => {
          addToast({ action: 'updated', name: payload.name, accountId: payload.account_id, status: 'error', message: err.response?.data?.message || 'Failed to update ad account' });
        })
        .finally(() => setAdSaving(false));
    } else {
      apiClient.post(`/business-managers/${bmId}/ad-accounts`, payload)
        .then(res => {
          const created = mapAdAccount(res.data.data ?? res.data);
          setAdAccounts(prev => [created, ...prev]);
          setShowAdForm(false);
          addToast({ action: 'created', name: created.name, accountId: created.accountId, status: 'success' });
        })
        .catch(err => {
          addToast({ action: 'created', name: payload.name, accountId: payload.account_id, status: 'error', message: err.response?.data?.message || 'Failed to create ad account' });
        })
        .finally(() => setAdSaving(false));
    }
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
            {bm.createdAt && (
              <span className="hidden sm:flex items-center gap-1.5 text-[11px] text-white/25 font-[425]">
                <CalendarDays className="w-3.5 h-3.5" strokeWidth={1.5} />
                {formatDate(bm.createdAt)}
              </span>
            )}
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
          </div>
        
        {/* Demo toast trigger (dev only) */}
        {import.meta.env.DEV && (
          <motion.button
            onClick={() => {
              addToast({ action: 'created', name: 'Fusion Labs Campaign', accountId: 'act_123456789', status: 'success' });
              setTimeout(() => addToast({ action: 'updated', name: 'Fusion Labs Retargeting', accountId: 'act_987654321', status: 'success' }), 400);
              setTimeout(() => addToast({ action: 'created', name: 'Fusion Labs Test Ad', accountId: 'act_555555555', status: 'error', message: 'Insufficient balance' }), 800);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] flex items-center justify-center transition-default"
            title="Demo ad account toasts"
          >
            <FlaskConical className="w-4 h-4 text-white/50" strokeWidth={1.5} />
          </motion.button>
        )}
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
              className="flex flex-wrap gap-4 mb-6 items-stretch"
            >
              <div className="flex-1 min-w-[200px] p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-emerald-400" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[11px] text-white/30 font-[425]">Balance</p>
                    <p className="text-base font-semibold text-emerald-400">{formatCurrency(bm.balance, bm.currency)}</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 min-w-[200px] p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-titans-accent/10 border border-titans-accent/15 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-titans-accent" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[11px] text-white/30 font-[425]">Total Spend</p>
                    <p className="text-base font-semibold text-white/80">{formatCurrency(totalSpend, 'USD')}</p>
                  </div>
                </div>
              </div>
              {bm.overdue > 0 && (
                <div className="flex-1 min-w-[200px] p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/15 flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-rose-400" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[11px] text-white/30 font-[425]">Overdue</p>
                      <p className="text-base font-semibold text-rose-400">{formatCurrency(bm.overdue, bm.currency)}</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6"
            >
              <AnimatedSearchBar value={search} onChange={setSearch} placeholder="Search by name, ID, or email..." className="flex-1" />

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

            <div className="relative flex items-center gap-1 mb-6 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-[425] whitespace-nowrap transition-default ${
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
                      layoutId="active-tab-bg-bm"
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
                  <div className="space-y-3">
                    {can(currentUserPerms, 'manage_ad_accounts') && (
                      <motion.button
                        onClick={() => openAdForm()}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-br from-titans-accent/10 to-titans-accent/5 border border-titans-accent/20 text-titans-accent text-sm font-medium hover:bg-titans-accent/15 hover:border-titans-accent/30 transition-default"
                      >
                        <Plus className="w-4 h-4" strokeWidth={1.5} />
                        Add Ad Account
                      </motion.button>
                    )}
                    {filteredAdAccounts.map((account, i) => (
                      <React.Fragment key={account.id}>
                        <motion.div
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03, duration: 0.3 }}
                          onClick={() => {
                            if (selectedBillingId === account.id) {
                              setSelectedBillingId(null);
                            } else {
                              setSelectedBillingId(account.id);
                              if (account.fbAdAccountId) fetchBilling(account.id);
                            }
                          }}
                          className="group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06] transition-default cursor-pointer"
                        >
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-titans-accent/10 to-titans-accent/5 border border-white/[0.06] flex items-center justify-center shrink-0">
                            <BarChart3 className="w-5 h-5 text-white/40" strokeWidth={1.5} />
                          </div>
                          <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-6 items-center gap-4">
                            <div className="sm:col-span-2 min-w-0">
                              <p className="text-sm font-medium text-white/80 truncate">{account.name}</p>
                              <p className="text-[11px] text-white/25 font-[425] mt-0.5">{account.accountId}</p>
                            </div>
                            <div className="hidden sm:block text-right">
                              <p className="text-xs text-white/30 font-[425]">Balance</p>
                              <p className="text-sm font-semibold text-white/80">{formatCurrency(account.balance, account.currency)}</p>
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
                            <ChevronRight className={`w-4 h-4 transition-default ${selectedBillingId === account.id ? 'rotate-90 text-white/40' : 'text-white/15 group-hover:text-white/30'}`} strokeWidth={1.5} />
                          </div>
                        </motion.div>

                        <AnimatePresence>
                          {selectedBillingId === account.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="p-5 ml-14 mb-2 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
                                {!account.fbAdAccountId ? (
                                  <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-white/20 shrink-0 mt-0.5" strokeWidth={1.5} />
                                    <div>
                                      <p className="text-sm text-white/50 font-medium">No Facebook Ad Account linked</p>
                                      <p className="text-xs text-white/25 font-[425] mt-1">Add a Facebook Ad Account ID to this ad account to fetch billing data from Graph API.</p>
                                    </div>
                                  </div>
                                ) : (() => {
                                  const bill = billingCache[account.id];
                                  if (!bill || bill.loading) {
                                    return (
                                      <div className="flex items-center gap-3">
                                        <Loader2 className="w-5 h-5 text-white/30 animate-spin shrink-0" strokeWidth={1.5} />
                                        <p className="text-sm text-white/40 font-[425]">Fetching billing data from Facebook Graph API...</p>
                                      </div>
                                    );
                                  }
                                  if (bill.error) {
                                    const errorConfigs: Record<string, { color: string; icon: typeof AlertCircle; title: string }> = {
                                      'token_expired': { color: 'text-rose-400', icon: XCircle, title: 'Token Expired' },
                                      'rate_limited': { color: 'text-amber-400', icon: Timer, title: 'Rate Limited' },
                                      'permission_error': { color: 'text-orange-400', icon: Shield, title: 'Permission Error' },
                                      'connection_error': { color: 'text-amber-400', icon: Globe, title: 'Connection Error' },
                                    };
                                    const cfg = errorConfigs[bill.errorType || ''] || { color: 'text-white/50', icon: AlertCircle, title: 'Error' };
                                    const Icon = cfg.icon;
                                    return (
                                      <div className="flex items-start gap-3">
                                        <Icon className={`w-5 h-5 ${cfg.color} shrink-0 mt-0.5`} strokeWidth={1.5} />
                                        <div>
                                          <p className={`text-sm font-medium ${cfg.color}`}>{cfg.title}</p>
                                          <p className="text-xs text-white/30 font-[425] mt-1">{bill.error}</p>
                                        </div>
                                      </div>
                                    );
                                  }
                                  if (bill.data && bill.data.facebook) {
                                    const fb = bill.data.facebook;
                                    const accountStatusLabels: Record<number, { label: string; color: string }> = {
                                      1: { label: 'Active', color: 'text-emerald-400' },
                                      2: { label: 'Disabled', color: 'text-rose-400' },
                                      3: { label: 'Unsettled', color: 'text-amber-400' },
                                      7: { label: 'Pending Risk Review', color: 'text-orange-400' },
                                      9: { label: 'In Grace Period', color: 'text-amber-400' },
                                      100: { label: 'Pending Closure', color: 'text-rose-400/70' },
                                      101: { label: 'Closed', color: 'text-white/30' },
                                    };
                                    const st = fb.account_status !== null ? accountStatusLabels[fb.account_status] : null;
                                    const row = (label: string, val: string, accent = false) => (
                                      <div className="flex items-center justify-between py-1.5">
                                        <span className="text-xs text-white/30 font-[425]">{label}</span>
                                        <span className={`text-xs font-semibold ${accent ? 'text-titans-accent' : 'text-white/80'}`}>{val}</span>
                                      </div>
                                    );
                                    return (
                                      <div className="space-y-1">
                                        <div className="flex items-center justify-between mb-3">
                                          <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium text-white/80">Billing & Threshold</p>
                                            <span className="bg-blue-500/10 text-blue-400 text-[10px] px-1.5 py-0.5 rounded font-medium border border-blue-500/15">Graph API</span>
                                          </div>
                                          {st && <span className={`text-xs font-medium ${st.color}`}>{st.label}</span>}
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] mb-2">
                                          <div>
                                            <p className="text-[10px] text-white/25 font-[425]">Balance</p>
                                            <p className="text-sm font-semibold text-emerald-400">
                                              {fb.balance !== null ? formatCurrency(fb.balance / 100, fb.currency || 'USD') : '—'}
                                            </p>
                                          </div>
                                          <div>
                                            <p className="text-[10px] text-white/25 font-[425]">Amount Spent</p>
                                            <p className="text-sm font-semibold text-white/80">
                                              {fb.amount_spent !== null ? formatCurrency(fb.amount_spent / 100, fb.currency || 'USD') : '—'}
                                            </p>
                                          </div>
                                          <div>
                                            <p className="text-[10px] text-white/25 font-[425]">Daily Spend</p>
                                            <p className="text-sm font-semibold text-white/80">
                                              {fb.daily_spend !== null ? formatCurrency(fb.daily_spend / 100, fb.currency || 'USD') : '—'}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="space-y-0.5">
                                          {fb.spend_cap !== null && row('Spend Cap', formatCurrency(fb.spend_cap / 100, fb.currency || 'USD'))}
                                          {fb.budget_remaining !== null && row('Budget Remaining', formatCurrency(fb.budget_remaining / 100, fb.currency || 'USD'))}
                                          {fb.min_campaign_group_spend_cap !== null && row('Min Campaign Spend Cap', formatCurrency(fb.min_campaign_group_spend_cap / 100, fb.currency || 'USD'))}
                                          {fb.business_name && row('Business Name', fb.business_name)}
                                        </div>
                                      </div>
                                    );
                                  }
                                  return null;
                                })()}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    ))}
                    {filteredAdAccounts.length === 0 && (
                      <div className="text-center py-12">
                        <p className="text-sm text-white/20 font-[425]">No ad accounts match your search.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'pages' && (
                  <div className="space-y-3">
                    {can(currentUserPerms, 'manage_pages') && (
                      <motion.button
                        onClick={() => openPageForm()}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-br from-sky-500/10 to-sky-500/5 border border-sky-500/20 text-sky-400 text-sm font-medium hover:bg-sky-500/15 hover:border-sky-500/30 transition-default"
                      >
                        <Plus className="w-4 h-4" strokeWidth={1.5} />
                        Add Facebook Page
                      </motion.button>
                    )}

                    {filteredPages.map((page, i) => (
                      <motion.div
                        key={page.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03, duration: 0.3 }}
                        className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06] transition-default"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500/10 to-sky-500/5 border border-white/[0.06] flex items-center justify-center shrink-0">
                          <Newspaper className="w-5 h-5 text-white/40" strokeWidth={1.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white/80 truncate">{page.name}</p>
                          <p className="text-[11px] text-white/25 font-[425] mt-0.5 truncate">
                            {page.category}
                            {page.group_name && <span className="ml-2 text-white/15">· {page.group_name}</span>}
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium ${page.fetch_boosted_posts ? 'bg-sky-500/10 text-sky-400' : 'bg-white/[0.04] text-white/20'}`}>
                              <BarChart3 className="w-2.5 h-2.5" strokeWidth={2} />
                              Ads
                            </span>
                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium ${page.fetch_dark_posts ? 'bg-violet-500/10 text-violet-400' : 'bg-white/[0.04] text-white/20'}`}>
                              <SlidersHorizontal className="w-2.5 h-2.5" strokeWidth={2} />
                              Dark
                            </span>
                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium ${page.fetch_lead_forms ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/[0.04] text-white/20'}`}>
                              <Users className="w-2.5 h-2.5" strokeWidth={2} />
                              Leads
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="text-right">
                            <p className="text-[10px] text-white/30 font-[425]">Threshold</p>
                            <p className="text-sm font-semibold text-white/80 whitespace-nowrap">{formatCurrency(page.notify_balance_threshold, 'USD')}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-white/30 font-[425]">Cooldown</p>
                            <p className="text-sm font-semibold text-white/80 whitespace-nowrap">{page.notify_cooldown_minutes}m</p>
                          </div>
                        </div>

                        <div className="hidden sm:flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          {can(currentUserPerms, 'manage_pages') && (
                            <>
                              <button
                                onClick={() => openPageForm(page)}
                                className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-sky-500/10 border border-white/[0.06] hover:border-sky-500/20 flex items-center justify-center transition-default group/btn"
                                title="Edit"
                              >
                                <Settings2 className="w-3.5 h-3.5 text-white/30 group-hover/btn:text-sky-400 transition-default" strokeWidth={1.5} />
                              </button>
                              <button
                                onClick={() => deletePage(page.id)}
                                className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-rose-500/10 border border-white/[0.06] hover:border-rose-500/20 flex items-center justify-center transition-default group/btn"
                                title="Remove"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-white/30 group-hover/btn:text-rose-400 transition-default" strokeWidth={1.5} />
                              </button>
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
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
                        </div>
                      </motion.div>
                    ))}
                    {filteredPages.length === 0 && (
                      <div className="text-center py-12">
                        <Newspaper className="w-12 h-12 mx-auto text-white/[0.08] mb-3" strokeWidth={1} />
                        <p className="text-sm text-white/20 font-[425]">No pages yet. Add one with a token to get started.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'team' && (
                  <div className="space-y-3">
                    {can(currentUserPerms, 'invite_users') && (
                      <motion.button
                        onClick={() => setShowInvite(true)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-br from-titans-accent/10 to-titans-accent/5 border border-titans-accent/20 text-titans-accent text-sm font-medium hover:bg-titans-accent/15 hover:border-titans-accent/30 transition-default"
                      >
                        <UserPlus className="w-4 h-4" strokeWidth={1.5} />
                        Invite New User
                      </motion.button>
                    )}

                    {filteredMembers.map((member, i) => (
                      <motion.div
                        key={member.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03, duration: 0.3 }}
                        onClick={() => {
                          setSelectedMember(member);
                          setMemberDetailRole(member.role);
                          setMemberDetailPerms({ ...member.permissions });
                        }}
                        className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06] transition-default cursor-pointer"
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
                          {can(currentUserPerms, 'manage_roles') && (
                            <RoleInlineEditor
                              currentRole={member.role}
                              options={availableRoles}
                              onRoleChange={(newRole) => handleRoleChange(member.id, newRole)}
                            />
                          )}
                          {can(currentUserPerms, 'remove_members') && (
                            <button
                              onClick={() => handleRemove(member.id)}
                              className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-rose-500/10 border border-white/[0.06] hover:border-rose-500/20 flex items-center justify-center transition-default group/btn"
                              title="Remove"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-white/30 group-hover/btn:text-rose-400 transition-default" strokeWidth={1.5} />
                            </button>
                          )}
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
        {selectedMember && (
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
              onClick={() => setSelectedMember(null)}
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
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-purple-500/15 to-purple-500/5 border border-purple-500/20 flex items-center justify-center mb-3">
                    <span className="text-lg font-bold text-purple-400">{selectedMember.name.charAt(0)}</span>
                  </div>
                  <h2 className="text-lg font-semibold text-white/90">{selectedMember.name}</h2>
                  <p className="text-sm text-white/30 font-[425] mt-1">{selectedMember.email}</p>
                </div>

                <div className="space-y-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40 font-[425]">Status</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      selectedMember.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-white/[0.05] text-white/30'
                    }`}>
                      {selectedMember.status === 'active' ? <PlayCircle className="w-3 h-3" strokeWidth={1.5} /> : <PauseCircle className="w-3 h-3" strokeWidth={1.5} />}
                      {selectedMember.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40 font-[425]">Current Role</span>
                    <span className="text-sm font-semibold text-white/80">{selectedMember.role}</span>
                  </div>
                  {can(currentUserPerms, 'manage_roles') && (
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">Change Role</label>
                      <RoleSelect
                        value={memberDetailRole}
                        options={availableRoles}
                        onChange={(role) => {
                          setMemberDetailRole(role);
                          setMemberDetailPerms(rolePermissionPresets[role] || defaultPermissions);
                        }}
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">Permissions</label>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <PersmissionsEditor
                        permissions={memberDetailPerms}
                        onChange={setMemberDetailPerms}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  {can(currentUserPerms, 'manage_roles') && (
                    <motion.button
                      onClick={() => {
                        const permChanged = JSON.stringify(memberDetailPerms) !== JSON.stringify(selectedMember.permissions);
                        if (memberDetailRole !== selectedMember.role || permChanged) {
                          if (memberDetailRole !== selectedMember.role) {
                            handleRoleChange(selectedMember.id, memberDetailRole);
                          }
                          if (permChanged) {
                            handlePermissionsUpdate(selectedMember.id, memberDetailPerms);
                          }
                        }
                        setSelectedMember(null);
                      }}
                      whileTap={{ scale: 0.97 }}
                      className="flex-1 py-3 rounded-xl bg-titans-accent text-white text-sm font-medium shadow-glow-sm hover:shadow-glow hover:bg-titans-accent-hover transition-all duration-250"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Save className="w-4 h-4" strokeWidth={1.5} />
                        Save Changes
                      </div>
                    </motion.button>
                  )}
                  {can(currentUserPerms, 'remove_members') && (
                    <motion.button
                      onClick={() => {
                        handleRemove(selectedMember.id);
                        setSelectedMember(null);
                      }}
                      whileTap={{ scale: 0.97 }}
                      className="py-3 px-5 rounded-xl bg-rose-500/10 text-rose-400 text-sm font-medium border border-rose-500/20 hover:bg-rose-500/20 transition-default"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                    </motion.button>
                  )}
                  <motion.button
                    onClick={() => setSelectedMember(null)}
                    whileTap={{ scale: 0.97 }}
                    className="py-3 px-5 rounded-xl bg-white/[0.05] text-white/50 text-sm font-medium hover:bg-white/[0.08] transition-default"
                  >
                    <X className="w-4 h-4" strokeWidth={1.5} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Auth Method Selection Modal */}
      <AnimatePresence>
        {showPageAuthSelect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-6"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPageAuthSelect(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="relative w-full sm:max-w-md rounded-3xl bg-titans-card border border-white/[0.08] shadow-soft-lg overflow-hidden"
            >
              <div className="p-6 pb-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-500/15 to-sky-500/5 border border-sky-500/20 flex items-center justify-center">
                      <Newspaper className="w-5 h-5 text-sky-400" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white/90">Add Facebook Page</h2>
                      <p className="text-sm text-white/30 font-[425] mt-1">How do you want to connect this page?</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPageAuthSelect(false)}
                    className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] flex items-center justify-center transition-default"
                  >
                    <X className="w-4 h-4 text-white/50" strokeWidth={1.5} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      // setPageAuthMethod('token');
                      setShowPageAuthSelect(false);
                      setShowPageForm(true);
                    }}
                    className="relative p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-sky-500/30 hover:bg-sky-500/5 transition-all duration-300 flex flex-col items-center gap-2 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500/20 to-sky-500/5 border border-sky-500/20 flex items-center justify-center">
                      <Key className="w-6 h-6 text-sky-400" strokeWidth={1.5} />
                    </div>
                    <span className="text-sm font-medium text-white/90">Token / API</span>
                    <span className="text-[11px] text-white/40">Graph API token</span>
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-sky-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      // setPageAuthMethod('cookie');
                      setShowPageAuthSelect(false);
                      setShowPageForm(true);
                    }}
                    className="relative p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-rose-500/30 hover:bg-rose-500/5 transition-all duration-300 flex flex-col items-center gap-2 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500/20 to-rose-500/5 border border-rose-500/20 flex items-center justify-center">
                      <Cookie className="w-6 h-6 text-rose-400" strokeWidth={1.5} />
                    </div>
                    <span className="text-sm font-medium text-white/90">Cookie</span>
                    <span className="text-[11px] text-white/40">Browser session</span>
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-rose-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                </div>

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowPageAuthSelect(false)}
                  className="w-full py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white/50 hover:text-white/80 hover:border-white/[0.15] transition-default flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" strokeWidth={1.5} />
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ad Account Auth Method Selection Modal */}
      <AnimatePresence>
        {showAdAuthSelect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-6"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAdAuthSelect(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="relative w-full sm:max-w-md rounded-3xl bg-titans-card border border-white/[0.08] shadow-soft-lg overflow-hidden"
            >
              <div className="p-6 pb-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-titans-accent/15 to-titans-accent/5 border border-titans-accent/20 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-titans-accent" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white/90">Add Ad Account</h2>
                      <p className="text-sm text-white/30 font-[425] mt-1">How do you want to connect this account?</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAdAuthSelect(false)}
                    className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] flex items-center justify-center transition-default"
                  >
                    <X className="w-4 h-4 text-white/50" strokeWidth={1.5} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      // setAdAuthMethod('token');
                      setShowAdAuthSelect(false);
                      setShowAdForm(true);
                    }}
                    className="relative p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-titans-accent/30 hover:bg-titans-accent/5 transition-all duration-300 flex flex-col items-center gap-2 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-titans-accent/20 to-titans-accent/5 border border-titans-accent/20 flex items-center justify-center">
                      <Key className="w-6 h-6 text-titans-accent" strokeWidth={1.5} />
                    </div>
                    <span className="text-sm font-medium text-white/90">Token / API</span>
                    <span className="text-[11px] text-white/40">Graph API token</span>
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-titans-accent/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      // setAdAuthMethod('cookie');
                      setShowAdAuthSelect(false);
                      setShowAdForm(true);
                    }}
                    className="relative p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-rose-500/30 hover:bg-rose-500/5 transition-all duration-300 flex flex-col items-center gap-2 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500/20 to-rose-500/5 border border-rose-500/20 flex items-center justify-center">
                      <Cookie className="w-6 h-6 text-rose-400" strokeWidth={1.5} />
                    </div>
                    <span className="text-sm font-medium text-white/90">Cookie</span>
                    <span className="text-[11px] text-white/40">Browser session</span>
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-rose-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                </div>

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowAdAuthSelect(false)}
                  className="w-full py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white/50 hover:text-white/80 hover:border-white/[0.15] transition-default flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" strokeWidth={1.5} />
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                    Assign a role and send an invitation to their email.
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
                  <RoleSelect value={inviteRole} options={availableRoles} onChange={(role) => {
                    setInviteRole(role);
                    setInvitePermissions(rolePermissionPresets[role] || defaultPermissions);
                  }} />
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">
                    Permissions
                  </label>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <PersmissionsEditor
                      permissions={invitePermissions}
                      onChange={setInvitePermissions}
                    />
                  </div>
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

      <AnimatePresence>
        {showPageForm && (
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
              onClick={() => setShowPageForm(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
className="relative w-full sm:max-w-4xl rounded-t-3xl sm:rounded-3xl bg-titans-card border border-white/[0.08] shadow-soft-lg overflow-hidden max-h-[85vh]"
            >
              <div className="overflow-y-auto max-h-[85vh] p-6 pb-8">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-1 space-y-6">
                     <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-500/15 to-sky-500/5 border border-sky-500/20 flex items-center justify-center">
                      <Newspaper className="w-5 h-5 text-sky-400" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white/90">
                        {editingPageId ? 'Edit Page' : 'Add Facebook Page'}
                      </h2>
                      <p className="text-sm text-white/30 font-[425]">
                        {editingPageId ? 'Update the page details and credentials below.' : 'Enter the page info and account credentials.'}
                      </p>
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
                    onClick={() => setShowPageForm(false)}
                    className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] flex items-center justify-center transition-default"
                  >
                    <X className="w-4 h-4 text-white/50" strokeWidth={1.5} />
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-[11px] text-white/30 font-[425] tracking-wide uppercase">Page Info</p>
                  <div key="name">
                    <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">
                      Page Name <span className="text-titans-accent">*</span>
                    </label>
                    <div className="relative">
                      <Newspaper className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" strokeWidth={1.5} />
                      <input
                        type="text"
                        value={pageForm.name}
                        onChange={e => setPageForm({ ...pageForm, name: e.target.value })}
                        placeholder="My Business Page"
                        className="w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 pl-6 border-b border-white/[0.08] focus:outline-none focus:border-sky-500/50 focus:shadow-[0_4px_20px_-4px_rgba(0,150,255,0.3)] transition-default"
                      />
                    </div>
                  </div>
                  <div key="page_id" className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">Page ID</label>
                      <div className="relative">
                        <Hash className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" strokeWidth={1.5} />
                        <input
                          type="text"
                          value={pageForm.page_id}
                          onChange={e => setPageForm({ ...pageForm, page_id: e.target.value })}
                          placeholder="123456789"
                          className="w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 pl-6 border-b border-white/[0.08] focus:outline-none focus:border-sky-500/50 focus:shadow-[0_4px_20px_-4px_rgba(0,150,255,0.3)] transition-default"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">Category</label>
                      <div className="relative">
                        <Globe className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" strokeWidth={1.5} />
                        <input
                          type="text"
                          value={pageForm.category}
                          onChange={e => setPageForm({ ...pageForm, category: e.target.value })}
                          placeholder="Business"
                          className="w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 pl-6 border-b border-white/[0.08] focus:outline-none focus:border-sky-500/50 focus:shadow-[0_4px_20px_-4px_rgba(0,150,255,0.3)] transition-default"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/[0.06] pt-6 space-y-4">
                  <p className="text-[11px] text-white/30 font-[425] tracking-wide uppercase">Page Status & Permissions</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">Linked Instagram</label>
                      <input type="text" value={pageForm.linked_instagram} onChange={e => setPageForm({...pageForm, linked_instagram: e.target.value})} placeholder="@username" className="w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 border-b border-white/[0.08] focus:outline-none focus:border-sky-500/50 transition-default" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">Unpublished Reason</label>
                      <input type="text" value={pageForm.unpublished_reason} onChange={e => setPageForm({...pageForm, unpublished_reason: e.target.value})} placeholder="Policy violation..." className="w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 border-b border-white/[0.08] focus:outline-none focus:border-sky-500/50 transition-default" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">Restriction Reason</label>
                      <input type="text" value={pageForm.restriction_reason} onChange={e => setPageForm({...pageForm, restriction_reason: e.target.value})} placeholder="Restriction details..." className="w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 border-b border-white/[0.08] focus:outline-none focus:border-sky-500/50 transition-default" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">Policy Strikes</label>
                      <input type="number" min={0} value={pageForm.policy_strike} onChange={e => setPageForm({...pageForm, policy_strike: parseInt(e.target.value) || 0})} className="w-full bg-transparent text-sm text-white/90 py-2.5 border-b border-white/[0.08] focus:outline-none focus:border-sky-500/50 transition-default" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <Toggle value={pageForm.banned} onChange={v => setPageForm({...pageForm, banned: v})} label="Banned" />
                    <Toggle value={pageForm.admin_role} onChange={v => setPageForm({...pageForm, admin_role: v})} label="Admin Role" />
                    <Toggle value={pageForm.editor} onChange={v => setPageForm({...pageForm, editor: v})} label="Editor" />
                    <Toggle value={pageForm.advertiser} onChange={v => setPageForm({...pageForm, advertiser: v})} label="Advertiser" />
                    <Toggle value={pageForm.moderator} onChange={v => setPageForm({...pageForm, moderator: v})} label="Moderator" />
                    <Toggle value={pageForm.appeal_available} onChange={v => setPageForm({...pageForm, appeal_available: v})} label="Appeal Possible" />
                  </div>
                </div>

                  <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div>
                      <p className="text-xs font-medium text-white/70">Automation Mode</p>
                      <p className="text-[10px] text-white/30 mt-0.5">Choose how to connect to this account</p>
                    </div>
                    <div className="flex gap-1 bg-white/[0.04] rounded-lg p-0.5">
                      {(['api', 'cookie', 'manual'] as const).map(mode => (
                        <button
                          key={mode}
                          onClick={() => setPageForm({ ...pageForm, automation_mode: mode })}
                          className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-default ${
                            pageForm.automation_mode === mode
                              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                              : 'text-white/40 hover:text-white/70 border border-transparent'
                          }`}
                        >
                          {mode === 'api' ? 'API/Token' : mode === 'cookie' ? 'Cookie' : 'Manual'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {pageForm.automation_mode === 'api' && (
                <div className="border-t border-white/[0.06] pt-6 space-y-4">
                  <p className="text-[11px] text-white/30 font-[425] tracking-wide uppercase">API Credentials</p>
                  {[
                    { key: 'token', label: 'Token', icon: Key, placeholder: 'EAAB...', required: true },
                    { key: 'useragent', label: 'User Agent', icon: Globe, placeholder: 'Mozilla/5.0...', required: true },
                    { key: 'proxy', label: 'Proxy', icon: Globe, placeholder: 'http://user:pass@host:port', required: false },
                    { key: 'group_name', label: 'Group', icon: Users, placeholder: 'Group name', required: false },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">
                        {field.label} {field.required && <span className="text-titans-accent">*</span>}
                      </label>
                      <div className="relative">
                        <field.icon className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" strokeWidth={1.5} />
                        <input
                          type="text"
                          value={(pageForm as any)[field.key]}
                          onChange={e => setPageForm({ ...pageForm, [field.key]: e.target.value })}
                          placeholder={field.placeholder}
                          className="w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 pl-6 border-b border-white/[0.08] focus:outline-none focus:border-sky-500/50 focus:shadow-[0_4px_20px_-4px_rgba(0,150,255,0.3)] transition-default"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                  )}

                  {pageForm.automation_mode === 'cookie' && (
                <div className="border-t border-white/[0.06] pt-6 space-y-4">
                  <p className="text-[11px] text-white/30 font-[425] tracking-wide uppercase">Cookie Credentials</p>
                  {[
                    { key: 'cookie_c_user', label: 'c_user', icon: UserCheck, placeholder: 'Facebook User ID', required: true },
                    { key: 'cookie_xs', label: 'xs', icon: Key, placeholder: 'Session token', required: true },
                    { key: 'cookie_datr', label: 'datr', icon: Globe, placeholder: 'datr cookie value', required: false },
                    { key: 'useragent', label: 'User Agent', icon: Globe, placeholder: 'Mozilla/5.0...', required: true },
                    { key: 'proxy', label: 'Proxy', icon: Globe, placeholder: 'http://user:pass@host:port', required: false },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">
                        {field.label} {field.required && <span className="text-titans-accent">*</span>}
                      </label>
                      <div className="relative">
                        <field.icon className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" strokeWidth={1.5} />
                        <input
                          type="text"
                          value={(pageForm as any)[field.key]}
                          onChange={e => setPageForm({ ...pageForm, [field.key]: e.target.value })}
                          placeholder={field.placeholder}
                          className="w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 pl-6 border-b border-white/[0.08] focus:outline-none focus:border-sky-500/50 focus:shadow-[0_4px_20px_-4px_rgba(0,150,255,0.3)] transition-default"
                        />
                      </div>
                    </div>
                  ))}
                  <div className="pt-2">
                    <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">Raw Cookie String</label>
                    <textarea
                      value={pageForm.cookie_raw}
                      onChange={e => setPageForm({ ...pageForm, cookie_raw: e.target.value })}
                      placeholder="c_user=123; xs=abc; datr=xyz; sb=..."
                      rows={3}
                      className="w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 px-0 border-b border-white/[0.08] focus:outline-none focus:border-sky-500/50 focus:shadow-[0_4px_20px_-4px_rgba(0,150,255,0.3)] transition-default resize-none font-mono text-[11px]"
                    />
                  </div>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white/50 hover:text-white/80 hover:border-white/[0.15] transition-default flex items-center justify-center gap-2"
                  >
                    <FlaskConical className="w-3.5 h-3.5" strokeWidth={1.5} />
                    Test Cookies
                  </motion.button>
                </div>
                  )}

                <div className="border-t border-white/[0.06] pt-6 space-y-4">
                  <p className="text-[11px] text-white/30 font-[425] tracking-wide uppercase">Data Sources</p>
                  <p className="text-xs text-white/30 font-[425] -mt-2">Select which Meta data to fetch using this token.</p>

                  {[
                    { key: 'fetch_boosted_posts', label: 'Boosted Post Analytics', desc: 'Budget, reach, impressions, clicks, engagement from boosted posts' },
                    { key: 'fetch_dark_posts', label: 'Dark Post Content (ads_posts)', desc: 'Hidden ad posts, comments, reaction types' },
                    { key: 'fetch_lead_forms', label: 'Lead Forms', desc: 'Real-time lead data: name, phone, email from form ads' },
                  ].map(f => (
                    <div key={f.key} className="flex items-start justify-between py-2.5 border-b border-white/[0.04]">
                      <div className="flex-1 pr-4">
                        <span className="text-sm text-white/80 font-medium">{f.label}</span>
                        <p className="text-[11px] text-white/30 mt-0.5">{f.desc}</p>
                      </div>
                      <button
                        onClick={() => setPageForm({ ...pageForm, [f.key]: !(pageForm as any)[f.key] })}
                        className={`relative w-10 h-5 rounded-full flex-shrink-0 mt-1 transition-colors duration-200 ${
                          (pageForm as any)[f.key] ? 'bg-sky-500' : 'bg-white/[0.12]'
                        }`}
                      >
                        <motion.div
                          layout
                          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm ${
                            (pageForm as any)[f.key] ? 'right-0.5' : 'left-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  ))}

                  <p className="text-[11px] text-white/30 font-[425] tracking-wide uppercase pt-2">Monitor Metrics</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {[
                      { key: 'monitor_impressions', label: 'Impressions' },
                      { key: 'monitor_clicks', label: 'Clicks' },
                      { key: 'monitor_budget', label: 'Budget / Spend' },
                      { key: 'monitor_reach', label: 'Reach' },
                      { key: 'monitor_engagement', label: 'Engagement' },
                    ].map(f => (
                      <div key={f.key} className="flex items-center justify-between py-2">
                        <span className="text-sm text-white/60">{f.label}</span>
                        <button
                          onClick={() => setPageForm({ ...pageForm, [f.key]: !(pageForm as any)[f.key] })}
                          className={`relative w-9 h-4.5 rounded-full transition-colors duration-200 ${
                            (pageForm as any)[f.key] ? 'bg-sky-500/70' : 'bg-white/[0.1]'
                          }`}
                        >
                          <motion.div
                            layout
                            className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow-sm ${
                              (pageForm as any)[f.key] ? 'right-0.5' : 'left-0.5'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
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
                        value={pageForm.notify_balance_threshold}
                        onChange={e => setPageForm({ ...pageForm, notify_balance_threshold: parseFloat(e.target.value) || 0 })}
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
                      value={pageForm.notify_cooldown_minutes}
                      onChange={e => setPageForm({ ...pageForm, notify_cooldown_minutes: parseInt(e.target.value) || 60 })}
                      className="w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 border-b border-white/[0.08] focus:outline-none focus:border-sky-500/50 focus:shadow-[0_4px_20px_-4px_rgba(0,150,255,0.3)] transition-default"
                    />
                  </div>

                  <div className="space-y-1 pt-2">
                    <p className="text-[11px] text-white/30 font-[425] tracking-wide uppercase mb-2">
                      <ToggleLeft className="w-3.5 h-3.5 inline mr-1.5" strokeWidth={1.5} />
                      Notification Types
                    </p>
                    <Toggle
                      value={pageForm.notify_moderation}
                      onChange={v => setPageForm({ ...pageForm, notify_moderation: v })}
                      label="Moderation notifications"
                    />
                    <Toggle
                      value={pageForm.notify_cabinet_status}
                      onChange={v => setPageForm({ ...pageForm, notify_cabinet_status: v })}
                      label="Cabinet status notices"
                    />
                    <Toggle
                      value={pageForm.notify_billing}
                      onChange={v => setPageForm({ ...pageForm, notify_billing: v })}
                      label="Billing notices"
                    />
                  </div>
                </div>

                <motion.button
                  onClick={savePage}
                  disabled={pageSaving || !pageForm.name || (pageForm.automation_mode === 'api' && (!pageForm.token || !pageForm.useragent)) || (pageForm.automation_mode === 'cookie' && (!pageForm.cookie_c_user || !pageForm.cookie_xs || !pageForm.useragent))}
                  whileTap={{ scale: 0.97 }}
                  className="relative w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 text-white text-sm font-medium shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30 hover:from-sky-600 hover:to-sky-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-250 overflow-hidden"
                >
                  {pageSaving ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
                      {editingPageId ? 'Updating...' : 'Adding...'}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Save className="w-4 h-4" strokeWidth={1.5} />
                      {editingPageId ? 'Update Page' : 'Add Page'}
                    </span>
                  )}
                </motion.button>
                    </div>

                    <FormInfoPanel />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAdForm && (
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
              onClick={() => setShowAdForm(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              className="relative w-full sm:max-w-4xl rounded-t-3xl sm:rounded-3xl bg-titans-card border border-white/[0.08] shadow-soft-lg overflow-hidden max-h-[85vh]"
            >
              <div className="overflow-y-auto max-h-[85vh] p-6 pb-8">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-1 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-titans-accent/15 to-titans-accent/5 border border-titans-accent/20 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-titans-accent" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white/90">
                        {editingAdId ? 'Edit Ad Account' : 'Add Ad Account'}
                      </h2>
                      <p className="text-sm text-white/30 font-[425]">
                        {editingAdId ? 'Update the ad account details.' : 'Enter the ad account info and credentials.'}
                      </p>
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
                    onClick={() => setShowAdForm(false)}
                    className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] flex items-center justify-center transition-default"
                  >
                    <X className="w-4 h-4 text-white/50" strokeWidth={1.5} />
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-[11px] text-white/30 font-[425] tracking-wide uppercase">Ad Account Info</p>
                  <div key="name">
                    <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">
                      Name <span className="text-titans-accent">*</span>
                    </label>
                    <div className="relative">
                      <BarChart3 className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" strokeWidth={1.5} />
                      <input
                        type="text"
                        value={adForm.name}
                        onChange={e => setAdForm({ ...adForm, name: e.target.value })}
                        placeholder="My Ad Account"
                        className="w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 pl-6 border-b border-white/[0.08] focus:outline-none focus:border-titans-accent/50 focus:shadow-[0_4px_20px_-4px_rgba(225,29,72,0.3)] transition-default"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">Account ID</label>
                      <div className="relative">
                        <Hash className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" strokeWidth={1.5} />
                        <input
                          type="text"
                          value={adForm.account_id}
                          onChange={e => setAdForm({ ...adForm, account_id: e.target.value })}
                          placeholder="act_123456"
                          className="w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 pl-6 border-b border-white/[0.08] focus:outline-none focus:border-titans-accent/50 focus:shadow-[0_4px_20px_-4px_rgba(225,29,72,0.3)] transition-default"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">FB Ad Account ID</label>
                      <div className="relative">
                        <Globe className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" strokeWidth={1.5} />
                        <input
                          type="text"
                          value={adForm.fb_ad_account_id}
                          onChange={e => setAdForm({ ...adForm, fb_ad_account_id: e.target.value })}
                          placeholder="123456789012345"
                          className="w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 pl-6 border-b border-white/[0.08] focus:outline-none focus:border-titans-accent/50 focus:shadow-[0_4px_20px_-4px_rgba(225,29,72,0.3)] transition-default"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">Status</label>
                    <select
                      value={adForm.status}
                      onChange={e => setAdForm({ ...adForm, status: e.target.value as any })}
                      className="w-full bg-transparent text-sm text-white/90 py-2.5 border-b border-white/[0.08] focus:outline-none focus:border-titans-accent/50 focus:shadow-[0_4px_20px_-4px_rgba(225,29,72,0.3)] transition-default"
                    >
                      <option value="active" className="bg-titans-card">Active</option>
                      <option value="disabled" className="bg-titans-card">Disabled</option>
                      <option value="paused" className="bg-titans-card">Paused</option>
                    </select>
                  </div>
                </div>

                <div className="border-t border-white/[0.06] pt-6 space-y-4">
                  <p className="text-[11px] text-white/30 font-[425] tracking-wide uppercase">Facebook Identity</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">FB Account ID</label>
                      <input type="text" value={adForm.fb_account_id} onChange={e => setAdForm({...adForm, fb_account_id: e.target.value})} placeholder="100012345678901" className="w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 border-b border-white/[0.08] focus:outline-none focus:border-titans-accent/50 transition-default" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">Pixel ID</label>
                      <input type="text" value={adForm.pixel_id} onChange={e => setAdForm({...adForm, pixel_id: e.target.value})} placeholder="1234567890" className="w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 border-b border-white/[0.08] focus:outline-none focus:border-titans-accent/50 transition-default" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">Owner Account</label>
                    <input type="text" value={adForm.owner_account} onChange={e => setAdForm({...adForm, owner_account: e.target.value})} placeholder="act_123456789" className="w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 border-b border-white/[0.08] focus:outline-none focus:border-titans-accent/50 transition-default" />
                  </div>
                </div>

                  <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div>
                      <p className="text-xs font-medium text-white/70">Automation Mode</p>
                      <p className="text-[10px] text-white/30 mt-0.5">Choose how to connect to this account</p>
                    </div>
                    <div className="flex gap-1 bg-white/[0.04] rounded-lg p-0.5">
                      {(['api', 'cookie', 'manual'] as const).map(mode => (
                        <button
                          key={mode}
                          onClick={() => setAdForm({ ...adForm, automation_mode: mode })}
                          className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-default ${
                            adForm.automation_mode === mode
                              ? 'bg-titans-accent/15 text-titans-accent border border-titans-accent/30'
                              : 'text-white/40 hover:text-white/70 border border-transparent'
                          }`}
                        >
                          {mode === 'api' ? 'API/Token' : mode === 'cookie' ? 'Cookie' : 'Manual'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {adForm.automation_mode === 'manual' && (
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">
                        <DollarSign className="w-3.5 h-3.5 inline mr-1.5" strokeWidth={1.5} />
                        Current Balance
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" strokeWidth={1.5} />
                        <input
                          type="number"
                          min={0}
                          step={0.01}
                          value={adForm.balance}
                          onChange={e => setAdForm({ ...adForm, balance: parseFloat(e.target.value) || 0 })}
                          placeholder="0.00"
                          className="w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 pl-6 border-b border-white/[0.08] focus:outline-none focus:border-titans-accent/50 focus:shadow-[0_4px_20px_-4px_rgba(225,29,72,0.3)] transition-default"
                        />
                      </div>
                    </div>
                  )}

                  {adForm.automation_mode === 'api' && (
                <div className="border-t border-white/[0.06] pt-6 space-y-4">
                  <p className="text-[11px] text-white/30 font-[425] tracking-wide uppercase">API Credentials</p>
                  {[
                    { key: 'token', label: 'Token', icon: Key, placeholder: 'EAAB...', required: true },
                    { key: 'useragent', label: 'User Agent', icon: Globe, placeholder: 'Mozilla/5.0...', required: true },
                    { key: 'proxy', label: 'Proxy', icon: Globe, placeholder: 'http://user:pass@host:port', required: false },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">
                        {field.label} {field.required && <span className="text-titans-accent">*</span>}
                      </label>
                      <div className="relative">
                        <field.icon className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" strokeWidth={1.5} />
                        <input
                          type="text"
                          value={(adForm as any)[field.key]}
                          onChange={e => setAdForm({ ...adForm, [field.key]: e.target.value })}
                          placeholder={field.placeholder}
                          className="w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 pl-6 border-b border-white/[0.08] focus:outline-none focus:border-titans-accent/50 focus:shadow-[0_4px_20px_-4px_rgba(225,29,72,0.3)] transition-default"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                  )}

                  {adForm.automation_mode === 'cookie' && (
                <div className="border-t border-white/[0.06] pt-6 space-y-4">
                  <p className="text-[11px] text-white/30 font-[425] tracking-wide uppercase">Cookie Credentials</p>
                  {[
                    { key: 'cookie_c_user', label: 'c_user', icon: UserCheck, placeholder: 'Facebook User ID', required: true },
                    { key: 'cookie_xs', label: 'xs', icon: Key, placeholder: 'Session token', required: true },
                    { key: 'cookie_datr', label: 'datr', icon: Globe, placeholder: 'datr cookie value', required: false },
                    { key: 'useragent', label: 'User Agent', icon: Globe, placeholder: 'Mozilla/5.0...', required: true },
                    { key: 'proxy', label: 'Proxy', icon: Globe, placeholder: 'http://user:pass@host:port', required: false },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">
                        {field.label} {field.required && <span className="text-titans-accent">*</span>}
                      </label>
                      <div className="relative">
                        <field.icon className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" strokeWidth={1.5} />
                        <input
                          type="text"
                          value={(adForm as any)[field.key]}
                          onChange={e => setAdForm({ ...adForm, [field.key]: e.target.value })}
                          placeholder={field.placeholder}
                          className="w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 pl-6 border-b border-white/[0.08] focus:outline-none focus:border-titans-accent/50 focus:shadow-[0_4px_20px_-4px_rgba(225,29,72,0.3)] transition-default"
                        />
                      </div>
                    </div>
                  ))}
                  <div className="pt-2">
                    <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">Raw Cookie String</label>
                    <textarea
                      value={adForm.cookie_raw}
                      onChange={e => setAdForm({ ...adForm, cookie_raw: e.target.value })}
                      placeholder="c_user=123; xs=abc; datr=xyz; sb=..."
                      rows={3}
                      className="w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 px-0 border-b border-white/[0.08] focus:outline-none focus:border-titans-accent/50 focus:shadow-[0_4px_20px_-4px_rgba(225,29,72,0.3)] transition-default resize-none font-mono text-[11px]"
                    />
                  </div>
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white/50 hover:text-white/80 hover:border-white/[0.15] transition-default flex items-center justify-center gap-2"
                  >
                    <FlaskConical className="w-3.5 h-3.5" strokeWidth={1.5} />
                    Test Cookies
                  </motion.button>
                </div>
                  )}

                <div className="border-t border-white/[0.06] pt-6 space-y-4">
                  <p className="text-[11px] text-white/30 font-[425] tracking-wide uppercase">Data Sources</p>
                  <p className="text-xs text-white/30 font-[425] -mt-2">Select which Meta data to fetch using this token.</p>

                  {[
                    { key: 'fetch_boosted_posts', label: 'Boosted Post Analytics', desc: 'Budget, reach, impressions, clicks, engagement from boosted posts' },
                    { key: 'fetch_dark_posts', label: 'Dark Post Content (ads_posts)', desc: 'Hidden ad posts, comments, reaction types' },
                    { key: 'fetch_lead_forms', label: 'Lead Forms', desc: 'Real-time lead data: name, phone, email from form ads' },
                  ].map(f => (
                    <div key={f.key} className="flex items-start justify-between py-2.5 border-b border-white/[0.04]">
                      <div className="flex-1 pr-4">
                        <span className="text-sm text-white/80 font-medium">{f.label}</span>
                        <p className="text-[11px] text-white/30 mt-0.5">{f.desc}</p>
                      </div>
                      <button
                        onClick={() => setAdForm({ ...adForm, [f.key]: !(adForm as any)[f.key] })}
                        className={`relative w-10 h-5 rounded-full flex-shrink-0 mt-1 transition-colors duration-200 ${
                          (adForm as any)[f.key] ? 'bg-sky-500' : 'bg-white/[0.12]'
                        }`}
                      >
                        <motion.div
                          layout
                          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm ${
                            (adForm as any)[f.key] ? 'right-0.5' : 'left-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  ))}

                  <p className="text-[11px] text-white/30 font-[425] tracking-wide uppercase pt-2">Monitor Metrics</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {[
                      { key: 'monitor_impressions', label: 'Impressions' },
                      { key: 'monitor_clicks', label: 'Clicks' },
                      { key: 'monitor_budget', label: 'Budget / Spend' },
                      { key: 'monitor_reach', label: 'Reach' },
                      { key: 'monitor_engagement', label: 'Engagement' },
                    ].map(f => (
                      <div key={f.key} className="flex items-center justify-between py-2">
                        <span className="text-sm text-white/60">{f.label}</span>
                        <button
                          onClick={() => setAdForm({ ...adForm, [f.key]: !(adForm as any)[f.key] })}
                          className={`relative w-9 h-4.5 rounded-full transition-colors duration-200 ${
                            (adForm as any)[f.key] ? 'bg-sky-500/70' : 'bg-white/[0.1]'
                          }`}
                        >
                          <motion.div
                            layout
                            className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow-sm ${
                              (adForm as any)[f.key] ? 'right-0.5' : 'left-0.5'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
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
                        value={adForm.notify_balance_threshold}
                        onChange={e => setAdForm({ ...adForm, notify_balance_threshold: parseFloat(e.target.value) || 0 })}
                        placeholder="0.00"
                        className="w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 pl-6 border-b border-white/[0.08] focus:outline-none focus:border-titans-accent/50 focus:shadow-[0_4px_20px_-4px_rgba(225,29,72,0.3)] transition-default"
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
                      value={adForm.notify_cooldown_minutes}
                      onChange={e => setAdForm({ ...adForm, notify_cooldown_minutes: parseInt(e.target.value) || 60 })}
                      className="w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 border-b border-white/[0.08] focus:outline-none focus:border-titans-accent/50 focus:shadow-[0_4px_20px_-4px_rgba(225,29,72,0.3)] transition-default"
                    />
                  </div>

                  <div className="space-y-1 pt-2">
                    <p className="text-[11px] text-white/30 font-[425] tracking-wide uppercase mb-2">
                      <ToggleLeft className="w-3.5 h-3.5 inline mr-1.5" strokeWidth={1.5} />
                      Notification Types
                    </p>
                    <Toggle
                      value={adForm.notify_moderation}
                      onChange={v => setAdForm({ ...adForm, notify_moderation: v })}
                      label="Moderation notifications"
                    />
                    <Toggle
                      value={adForm.notify_cabinet_status}
                      onChange={v => setAdForm({ ...adForm, notify_cabinet_status: v })}
                      label="Cabinet status notices"
                    />
                    <Toggle
                      value={adForm.notify_billing}
                      onChange={v => setAdForm({ ...adForm, notify_billing: v })}
                      label="Billing notices"
                    />
                  </div>
                </div>

                <div className="border-t border-white/[0.06] pt-6 space-y-4">
                  <p className="text-[11px] text-white/30 font-[425] tracking-wide uppercase">Billing & Limits</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">Payment Method</label>
                      <select value={adForm.payment_method} onChange={e => setAdForm({...adForm, payment_method: e.target.value})} className="w-full bg-transparent text-sm text-white/90 py-2.5 border-b border-white/[0.08] focus:outline-none focus:border-titans-accent/50 transition-default">
                        <option value="" className="bg-titans-card">None</option>
                        <option value="visa" className="bg-titans-card">Visa</option>
                        <option value="mastercard" className="bg-titans-card">Mastercard</option>
                        <option value="amex" className="bg-titans-card">Amex</option>
                        <option value="paypal" className="bg-titans-card">PayPal</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">Card Status</label>
                      <input type="text" value={adForm.card_status} onChange={e => setAdForm({...adForm, card_status: e.target.value})} placeholder="active / expired" className="w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 border-b border-white/[0.08] focus:outline-none focus:border-titans-accent/50 transition-default" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">Card Expiration</label>
                      <input type="text" value={adForm.card_expiration} onChange={e => setAdForm({...adForm, card_expiration: e.target.value})} placeholder="MM/YY" className="w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 border-b border-white/[0.08] focus:outline-none focus:border-titans-accent/50 transition-default" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">Country</label>
                      <input type="text" value={adForm.country} onChange={e => setAdForm({...adForm, country: e.target.value})} placeholder="US" className="w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 border-b border-white/[0.08] focus:outline-none focus:border-titans-accent/50 transition-default" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">VAT ID</label>
                      <input type="text" value={adForm.vat_id} onChange={e => setAdForm({...adForm, vat_id: e.target.value})} placeholder="VAT123" className="w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 border-b border-white/[0.08] focus:outline-none focus:border-titans-accent/50 transition-default" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">Daily Spend Limit</label>
                      <input type="number" min={0} step={0.01} value={adForm.daily_spending_limit} onChange={e => setAdForm({...adForm, daily_spending_limit: parseFloat(e.target.value) || 0})} className="w-full bg-transparent text-sm text-white/90 py-2.5 border-b border-white/[0.08] focus:outline-none focus:border-titans-accent/50 transition-default" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">Account Spend Limit</label>
                      <input type="number" min={0} step={0.01} value={adForm.account_spending_limit} onChange={e => setAdForm({...adForm, account_spending_limit: parseFloat(e.target.value) || 0})} className="w-full bg-transparent text-sm text-white/90 py-2.5 border-b border-white/[0.08] focus:outline-none focus:border-titans-accent/50 transition-default" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">Billing Threshold</label>
                      <input type="number" min={0} step={0.01} value={adForm.billing_threshold} onChange={e => setAdForm({...adForm, billing_threshold: parseFloat(e.target.value) || 0})} className="w-full bg-transparent text-sm text-white/90 py-2.5 border-b border-white/[0.08] focus:outline-none focus:border-titans-accent/50 transition-default" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Toggle value={adForm.auto_pay} onChange={v => setAdForm({...adForm, auto_pay: v})} label="Auto Pay" />
                    <Toggle value={adForm.manual_pay} onChange={v => setAdForm({...adForm, manual_pay: v})} label="Manual Pay" />
                    <Toggle value={adForm.billing_notifications} onChange={v => setAdForm({...adForm, billing_notifications: v})} label="Billing Notifications" />
                  </div>
                </div>

                <div className="border-t border-white/[0.06] pt-6 space-y-4">
                  <p className="text-[11px] text-white/30 font-[425] tracking-wide uppercase">Account Quality & Status</p>
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">Review Feedback</label>
                    <input type="text" value={adForm.review_feedback} onChange={e => setAdForm({...adForm, review_feedback: e.target.value})} placeholder="No issues" className="w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 border-b border-white/[0.08] focus:outline-none focus:border-titans-accent/50 transition-default" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">Policy Violations</label>
                      <input type="number" min={0} value={adForm.policy_violations} onChange={e => setAdForm({...adForm, policy_violations: parseInt(e.target.value) || 0})} className="w-full bg-transparent text-sm text-white/90 py-2.5 border-b border-white/[0.08] focus:outline-none focus:border-titans-accent/50 transition-default" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">Payment Method Count</label>
                      <input type="number" min={0} value={adForm.payment_method_count} onChange={e => setAdForm({...adForm, payment_method_count: parseInt(e.target.value) || 0})} className="w-full bg-transparent text-sm text-white/90 py-2.5 border-b border-white/[0.08] focus:outline-none focus:border-titans-accent/50 transition-default" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">Account Health</label>
                      <input type="text" value={adForm.account_health} onChange={e => setAdForm({...adForm, account_health: e.target.value})} placeholder="good / warning / critical" className="w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 border-b border-white/[0.08] focus:outline-none focus:border-titans-accent/50 transition-default" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">Delivery Issues</label>
                      <input type="text" value={adForm.delivery_issues} onChange={e => setAdForm({...adForm, delivery_issues: e.target.value})} placeholder="None" className="w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 border-b border-white/[0.08] focus:outline-none focus:border-titans-accent/50 transition-default" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">Review Result</label>
                      <input type="text" value={adForm.review_result} onChange={e => setAdForm({...adForm, review_result: e.target.value})} placeholder="passed / failed / pending" className="w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 border-b border-white/[0.08] focus:outline-none focus:border-titans-accent/50 transition-default" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5 tracking-wide uppercase">Today Spend</label>
                      <input type="number" min={0} step={0.01} value={adForm.today_spend} onChange={e => setAdForm({...adForm, today_spend: parseFloat(e.target.value) || 0})} className="w-full bg-transparent text-sm text-white/90 py-2.5 border-b border-white/[0.08] focus:outline-none focus:border-titans-accent/50 transition-default" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Toggle value={adForm.restricted} onChange={v => setAdForm({...adForm, restricted: v})} label="Restricted" />
                    <Toggle value={adForm.unsettled} onChange={v => setAdForm({...adForm, unsettled: v})} label="Unsettled" />
                    <Toggle value={adForm.pending_review} onChange={v => setAdForm({...adForm, pending_review: v})} label="Pending Review" />
                    <Toggle value={adForm.appeal_submitted} onChange={v => setAdForm({...adForm, appeal_submitted: v})} label="Appeal Submitted" />
                    <Toggle value={adForm.auto_comment} onChange={v => setAdForm({...adForm, auto_comment: v})} label="Auto Comment" />
                  </div>
                </div>

                <motion.button
                  onClick={saveAdAccount}
                  disabled={adSaving || !adForm.name || (adForm.automation_mode === 'api' && (!adForm.token || !adForm.useragent)) || (adForm.automation_mode === 'cookie' && (!adForm.cookie_c_user || !adForm.cookie_xs || !adForm.useragent))}
                  whileTap={{ scale: 0.97 }}
                  className="relative w-full py-3 rounded-xl bg-gradient-to-r from-titans-accent to-rose-600 text-white text-sm font-medium shadow-lg shadow-titans-accent/20 hover:shadow-titans-accent/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-250 overflow-hidden"
                >
                  {adSaving ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
                      {editingAdId ? 'Updating...' : 'Adding...'}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Save className="w-4 h-4" strokeWidth={1.5} />
                      {editingAdId ? 'Update Account' : 'Add Account'}
                    </span>
                  )}
                </motion.button>
                    </div>

                    <FormInfoPanel />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AdAccountToast notifications={toasts} onDismiss={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />
    </>
  );
};

export default BmDetail;
