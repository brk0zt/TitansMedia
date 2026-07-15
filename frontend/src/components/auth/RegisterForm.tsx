import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AnimatedGradientBackground from '@/components/ui/animated-gradient-background';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters.').max(128, 'Name must be at most 128 characters.'),
    email: z.string().min(1, 'Email address is required.').email('Invalid email address format.'),
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    password_confirmation: z.string().min(1, 'Confirm password is required.'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match.',
    path: ['password_confirmation'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSuccess?: () => void;
  onNavigateToLogin?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onNavigateToLogin }) => {
  const { register: registerUser, error, clearError } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    clearError();
    try {
      await registerUser(data);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Registration submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-titans-bg flex flex-col items-center justify-center p-4">
      <AnimatedGradientBackground
        Breathing={true}
        startingGap={125}
        gradientColors={["#0A0A0A", "#ec4d6f", "#fca5a5", "#6b7280", "#dc2626", "#4b5563", "#d1d5db"]}
        gradientStops={[50, 57, 66, 74, 83, 91, 100]}
      />

      <p className="relative z-10 text-lg text-gray-300 md:text-xl max-w-lg text-center mb-12 px-4">
        Manage your Facebook ad accounts, pages from one dashboard with AI support
      </p>

      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="relative overflow-hidden rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] shadow-soft-lg">
          <div className="absolute inset-0 shimmer-bg animate-shimmer pointer-events-none" />

          <div className="relative px-8 py-10">
            <div className="flex flex-col items-center mb-9">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-titans-accent to-rose-500 flex items-center justify-center mb-4 shadow-glow-sm"
              >
                <UserPlus className="w-5 h-5 text-white" strokeWidth={1.5} />
              </motion.div>
              <h1 className="text-2xl font-semibold tracking-tight text-white/90">
                Create account
              </h1>
              <p className="text-sm text-white/40 mt-1.5 font-[425]">
                Join Titans Media to manage your campaigns
              </p>
            </div>

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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-white/50 mb-2 tracking-wide uppercase" htmlFor="name">
                  Full name
                </label>
                <div className="relative">
                  <input
                    {...register('name')}
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="John Doe"
                    className={`w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 pl-0 pr-2 border-b transition-default ${
                      errors.name
                        ? 'border-titans-accent/60'
                        : 'border-white/[0.08] focus:border-titans-accent'
                    } focus:outline-none focus:shadow-[0_4px_20px_-4px_rgba(225,29,72,0.3)]`}
                  />
                </div>
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-xs text-titans-accent/80 font-[425]"
                  >
                    {errors.name.message}
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-white/50 mb-2 tracking-wide uppercase" htmlFor="email">
                  Email address
                </label>
                <div className="relative">
                  <input
                    {...register('email')}
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@titans.media"
                    className={`w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 pl-0 pr-2 border-b transition-default ${
                      errors.email
                        ? 'border-titans-accent/60'
                        : 'border-white/[0.08] focus:border-titans-accent'
                    } focus:outline-none focus:shadow-[0_4px_20px_-4px_rgba(225,29,72,0.3)]`}
                  />
                </div>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-xs text-titans-accent/80 font-[425]"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-white/50 mb-2 tracking-wide uppercase" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register('password')}
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Create a strong password"
                    className={`w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 pr-8 pl-0 border-b transition-default ${
                      errors.password
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
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-xs text-titans-accent/80 font-[425]"
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-white/50 mb-2 tracking-wide uppercase" htmlFor="password_confirmation">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    {...register('password_confirmation')}
                    id="password_confirmation"
                    type={showConfirm ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Re-enter your password"
                    className={`w-full bg-transparent text-sm text-white/90 placeholder-white/20 py-2.5 pr-8 pl-0 border-b transition-default ${
                      errors.password_confirmation
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
                {errors.password_confirmation && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-xs text-titans-accent/80 font-[425]"
                  >
                    {errors.password_confirmation.message}
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
                    <span>Creating account...</span>
                  </motion.span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <UserPlus className="w-4 h-4" strokeWidth={1.5} />
                    <span>Create Account</span>
                  </span>
                )}
              </motion.button>
            </form>

            {onNavigateToLogin && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 text-center"
              >
                <p className="text-sm text-white/30 font-[425]">
                  Already have an account?{' '}
                  <button
                    onClick={onNavigateToLogin}
                    className="text-titans-accent hover:text-titans-accent-hover transition-default font-medium"
                  >
                    Sign in
                  </button>
                </p>
              </motion.div>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-white/[0.15] tracking-wide font-[425]">
          Titans Media &copy; {new Date().getFullYear()}
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterForm;
