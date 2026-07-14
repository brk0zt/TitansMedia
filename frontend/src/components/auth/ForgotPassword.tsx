import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2, KeyRound, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const emailSchema = z.object({
  email: z.string().min(1, 'Email address is required.').email('Invalid email address format.'),
});

const resetSchema = z
  .object({
    token: z.string().min(1, 'Reset code is required.').length(64, 'Invalid reset code.'),
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    password_confirmation: z.string().min(1, 'Confirm password is required.'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match.',
    path: ['password_confirmation'],
  });

type EmailFormData = z.infer<typeof emailSchema>;
type ResetFormData = z.infer<typeof resetSchema>;

interface ForgotPasswordProps {
  onSuccess?: () => void;
  onNavigateToLogin?: () => void;
}

const gradientOrbs = [
  { size: 600, x: '20%', y: '10%', color: 'rgba(225,29,72,0.12)', delay: 0 },
  { size: 500, x: '70%', y: '60%', color: 'rgba(225,29,72,0.08)', delay: 2 },
  { size: 400, x: '40%', y: '80%', color: 'rgba(63,63,70,0.15)', delay: 4 },
  { size: 350, x: '80%', y: '20%', color: 'rgba(225,29,72,0.06)', delay: 1 },
  { size: 450, x: '10%', y: '70%', color: 'rgba(39,39,42,0.12)', delay: 3 },
];

type ResetStep = 'email' | 'sent' | 'reset' | 'done';

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onNavigateToLogin }) => {
  const { forgotPassword, resetPassword, error, clearError } = useAuth();
  const [step, setStep] = React.useState<ResetStep>('email');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [resetEmail, setResetEmail] = React.useState('');
  const [resetToken, setResetToken] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  const resetForm = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  const onEmailSubmit = async (data: EmailFormData) => {
    setIsSubmitting(true);
    clearError();
    try {
      const result = await forgotPassword(data.email);
      setResetEmail(result.email || data.email);
      if (result.reset_token) {
        setResetToken(result.reset_token);
        resetForm.setValue('token', result.reset_token);
      }
      setStep('sent');
    } catch (err) {
      console.error('Forgot password error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onResetSubmit = async (data: ResetFormData) => {
    setIsSubmitting(true);
    clearError();
    try {
      await resetPassword({
        email: resetEmail || emailForm.getValues('email'),
        token: data.token,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });
      setStep('done');
    } catch (err) {
      console.error('Reset password error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 } as const,
    },
  };

  const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-titans-bg flex items-center justify-center p-4">
      {gradientOrbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            left: orb.x,
            top: orb.y,
          }}
          initial={{ x: 0, y: 0, scale: 1, opacity: 0 }}
          animate={{
            x: ['0%', '5%', '-3%', '2%', '0%'],
            y: ['0%', '-4%', '6%', '-2%', '0%'],
            scale: [1, 1.08, 0.95, 1.03, 1],
            opacity: [0.6, 1, 0.7, 0.9, 0.6],
          }}
          transition={{
            duration: 12 + i * 2,
            delay: orb.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-sm"
      >
        <div className="relative overflow-hidden rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] shadow-soft-lg">
          <div className="absolute inset-0 shimmer-bg animate-shimmer pointer-events-none" />

          <div className="relative px-8 py-10">
            <AnimatePresence mode="wait">
              {step === 'email' && (
                <motion.div
                  key="email"
                  variants={container}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}
                >
                  <motion.div variants={item} className="flex flex-col items-center mb-9">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-titans-accent to-rose-500 flex items-center justify-center mb-4 shadow-glow-sm">
                      <KeyRound className="w-5 h-5 text-white" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight text-white/90">
                      Reset password
                    </h1>
                    <p className="text-sm text-white/40 mt-1.5 font-[425] text-center">
                      Enter the email address associated with your account
                    </p>
                  </motion.div>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="p-3 rounded-xl bg-titans-accent/15 border border-titans-accent/20 text-rose-200 text-sm font-[425] leading-relaxed">
                          {error}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.form variants={item} onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-5">
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-2 tracking-wide uppercase" htmlFor="reset-email">
                        Email address
                      </label>
                      <div className="relative">
                        <input
                          {...emailForm.register('email')}
                          id="reset-email"
                          type="email"
                          autoComplete="email"
                          placeholder="michael@titans.media"
                          className={`w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 pl-0 pr-2 border-b transition-default ${
                            emailForm.formState.errors.email
                              ? 'border-titans-accent/60'
                              : 'border-white/[0.08] focus:border-titans-accent'
                          } focus:outline-none focus:shadow-[0_4px_20px_-4px_rgba(225,29,72,0.3)]`}
                        />
                      </div>
                      {emailForm.formState.errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-xs text-titans-accent/80 font-[425]"
                        >
                          {emailForm.formState.errors.email.message}
                        </motion.p>
                      )}
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileTap={{ scale: 0.97 }}
                      transition={{ duration: 0.15, ease: 'easeInOut' }}
                      className="relative w-full py-3 rounded-xl bg-titans-accent text-white text-sm font-medium tracking-wide shadow-glow-sm hover:shadow-glow hover:bg-titans-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-250 overflow-hidden"
                    >
                      {isSubmitting ? (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center justify-center gap-2"
                        >
                          <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
                          <span>Sending...</span>
                        </motion.span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <KeyRound className="w-4 h-4" strokeWidth={1.5} />
                          <span>Send Reset Link</span>
                        </span>
                      )}
                    </motion.button>
                  </motion.form>

                  {onNavigateToLogin && (
                    <motion.div variants={item} className="mt-8 text-center">
                      <button
                        onClick={onNavigateToLogin}
                        className="inline-flex items-center gap-1.5 text-sm text-white/30 hover:text-white/60 transition-default font-[425]"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
                        Back to sign in
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {step === 'sent' && (
                <motion.div
                  key="sent"
                  variants={container}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}
                >
                  <motion.div variants={item} className="flex flex-col items-center mb-9">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight text-white/90">
                      Check your email
                    </h1>
                    <p className="text-sm text-white/40 mt-1.5 font-[425] text-center leading-relaxed">
                      If an account exists for <span className="text-white/70">{resetEmail}</span>, you'll receive a password reset code shortly.
                    </p>
                  </motion.div>

                  {resetToken && (
                    <motion.div variants={item} className="mb-6 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <p className="text-[11px] text-white/30 font-[425] tracking-wide uppercase mb-2 text-center">
                        Development mode — reset token
                      </p>
                      <p className="text-xs text-emerald-400/90 font-mono text-center break-all select-all">
                        {resetToken}
                      </p>
                    </motion.div>
                  )}

                  <motion.div variants={item} className="space-y-3">
                    <motion.button
                      onClick={() => setStep('reset')}
                      whileTap={{ scale: 0.97 }}
                      transition={{ duration: 0.15, ease: 'easeInOut' }}
                      className="w-full py-3 rounded-xl bg-white/[0.06] text-white/80 text-sm font-medium hover:bg-white/[0.10] transition-default border border-white/[0.06]"
                    >
                      I have a reset code
                    </motion.button>

                    <motion.button
                      onClick={() => { setStep('email'); clearError(); }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ duration: 0.15, ease: 'easeInOut' }}
                      className="w-full py-2 text-sm text-white/30 hover:text-white/60 transition-default font-[425]"
                    >
                      Send again
                    </motion.button>
                  </motion.div>

                  {onNavigateToLogin && (
                    <motion.div variants={item} className="mt-6 text-center">
                      <button
                        onClick={onNavigateToLogin}
                        className="inline-flex items-center gap-1.5 text-sm text-white/30 hover:text-white/60 transition-default font-[425]"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
                        Back to sign in
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {step === 'reset' && (
                <motion.div
                  key="reset"
                  variants={container}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}
                >
                  <motion.div variants={item} className="flex flex-col items-center mb-9">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-titans-accent to-rose-500 flex items-center justify-center mb-4 shadow-glow-sm">
                      <ShieldCheck className="w-5 h-5 text-white" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight text-white/90">
                      Set new password
                    </h1>
                    <p className="text-sm text-white/40 mt-1.5 font-[425] text-center">
                      Enter the reset code and your new password
                    </p>
                  </motion.div>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="p-3 rounded-xl bg-titans-accent/15 border border-titans-accent/20 text-rose-200 text-sm font-[425] leading-relaxed">
                          {error}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.form variants={item} onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-5">
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-2 tracking-wide uppercase" htmlFor="reset-token">
                        Reset code
                      </label>
                      <div className="relative">
                        <input
                          {...resetForm.register('token')}
                          id="reset-token"
                          type="text"
                          autoComplete="off"
                          placeholder="Paste your reset code"
                          className={`w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 pl-0 pr-2 border-b transition-default ${
                            resetForm.formState.errors.token
                              ? 'border-titans-accent/60'
                              : 'border-white/[0.08] focus:border-titans-accent'
                          } focus:outline-none focus:shadow-[0_4px_20px_-4px_rgba(225,29,72,0.3)]`}
                        />
                      </div>
                      {resetForm.formState.errors.token && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-xs text-titans-accent/80 font-[425]"
                        >
                          {resetForm.formState.errors.token.message}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-2 tracking-wide uppercase" htmlFor="reset-password">
                        New password
                      </label>
                      <div className="relative">
                        <input
                          {...resetForm.register('password')}
                          id="reset-password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          placeholder="At least 8 characters"
                          className={`w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 pr-8 pl-0 border-b transition-default ${
                            resetForm.formState.errors.password
                              ? 'border-titans-accent/60'
                              : 'border-white/[0.08] focus:border-titans-accent'
                          } focus:outline-none focus:shadow-[0_4px_20px_-4px_rgba(225,29,72,0.3)]`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-0 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-default"
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" strokeWidth={1.5} /> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
                        </button>
                      </div>
                      {resetForm.formState.errors.password && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-xs text-titans-accent/80 font-[425]"
                        >
                          {resetForm.formState.errors.password.message}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-2 tracking-wide uppercase" htmlFor="reset-confirm">
                        Confirm new password
                      </label>
                      <div className="relative">
                        <input
                          {...resetForm.register('password_confirmation')}
                          id="reset-confirm"
                          type={showConfirm ? 'text' : 'password'}
                          autoComplete="new-password"
                          placeholder="Re-enter your password"
                          className={`w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 pr-8 pl-0 border-b transition-default ${
                            resetForm.formState.errors.password_confirmation
                              ? 'border-titans-accent/60'
                              : 'border-white/[0.08] focus:border-titans-accent'
                          } focus:outline-none focus:shadow-[0_4px_20px_-4px_rgba(225,29,72,0.3)]`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-0 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-default"
                          tabIndex={-1}
                        >
                          {showConfirm ? <EyeOff className="w-4 h-4" strokeWidth={1.5} /> : <Eye className="w-4 h-4" strokeWidth={1.5} />}
                        </button>
                      </div>
                      {resetForm.formState.errors.password_confirmation && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-xs text-titans-accent/80 font-[425]"
                        >
                          {resetForm.formState.errors.password_confirmation.message}
                        </motion.p>
                      )}
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileTap={{ scale: 0.97 }}
                      transition={{ duration: 0.15, ease: 'easeInOut' }}
                      className="relative w-full py-3 rounded-xl bg-titans-accent text-white text-sm font-medium tracking-wide shadow-glow-sm hover:shadow-glow hover:bg-titans-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-250 overflow-hidden"
                    >
                      {isSubmitting ? (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center justify-center gap-2"
                        >
                          <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
                          <span>Resetting...</span>
                        </motion.span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
                          <span>Reset Password</span>
                        </span>
                      )}
                    </motion.button>
                  </motion.form>

                  <motion.div variants={item} className="mt-8 text-center">
                    <button
                      onClick={() => { setStep('email'); clearError(); }}
                      className="inline-flex items-center gap-1.5 text-sm text-white/30 hover:text-white/60 transition-default font-[425]"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
                      Request new code
                    </button>
                  </motion.div>
                </motion.div>
              )}

              {step === 'done' && (
                <motion.div
                  key="done"
                  variants={container}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}
                >
                  <motion.div variants={item} className="flex flex-col items-center mb-9">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-4">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}
                      >
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" strokeWidth={1.5} />
                      </motion.div>
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight text-white/90">
                      Password reset
                    </h1>
                    <p className="text-sm text-white/40 mt-1.5 font-[425] text-center">
                      Your password has been successfully reset.
                    </p>
                  </motion.div>

                  <motion.button
                    variants={item}
                    onClick={onNavigateToLogin}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.15, ease: 'easeInOut' }}
                    className="w-full py-3 rounded-xl bg-titans-accent text-white text-sm font-medium tracking-wide shadow-glow-sm hover:shadow-glow hover:bg-titans-accent-hover transition-all duration-250"
                  >
                    Sign in with new password
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-white/[0.15] tracking-wide font-[425]">
          Titans Media &copy; {new Date().getFullYear()}
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
