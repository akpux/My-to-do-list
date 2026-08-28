import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowLeft, CheckCircle } from 'lucide-react';
import { createClient } from '../utils/supabase/client';

interface ForgotPasswordScreenProps {
  onBackToLogin: () => void;
  onResetSuccess: () => void;
  resetMode?: boolean;
}

type Step = 'email' | 'confirmation' | 'reset';

function Header({ onBack, title }: { onBack: () => void; title: string }) {
  return (
    <div className="bg-white px-4 sm:px-6 md:px-8 py-4 max-w-[800px] mx-auto w-full">
      <div className="flex items-center gap-3">
        <motion.button
          onClick={onBack}
          className="p-2 -ml-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={24} className="text-[#0d141c]" />
        </motion.button>
        <h1 className="font-['Nunito:Bold',_sans-serif] text-[20px] text-[#0d141c]">
          {title}
        </h1>
      </div>
    </div>
  );
}

export default function ForgotPasswordScreen({ onBackToLogin, onResetSuccess, resetMode = false }: ForgotPasswordScreenProps) {
  const [currentStep, setCurrentStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Check if user came from password reset link
  useEffect(() => {
    const checkResetToken = async () => {
      const hash = window.location.hash;
      
      // Check for recovery type in URL hash
      if (hash.includes('type=recovery')) {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        // If there's a session from password reset link, show reset form
        if (session) {
          setCurrentStep('reset');
        }
      }
    };
    
    checkResetToken();
    
    // Listen for hash changes (when user clicks email link)
    const handleHashChange = () => {
      checkResetToken();
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSendResetLink = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      
      // Get the current URL origin for redirect
      const redirectUrl = `${window.location.origin}${window.location.pathname}`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) throw error;

      setCurrentStep('confirmation');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link');
      console.error('Error sending reset link:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      // Success - redirect to login
      onResetSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
      console.error('Error resetting password:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (currentStep === 'email') {
        handleSendResetLink();
      } else if (currentStep === 'reset') {
        handleResetPassword();
      }
    }
  };

  return (
    <div className="bg-white flex flex-col h-full items-start justify-start w-full overflow-y-auto">
      <Header 
        onBack={onBackToLogin} 
        title={currentStep === 'reset' ? 'Reset Password' : 'Forgot Password'}
      />

      <div className="flex-1 overflow-y-auto w-full px-4 sm:px-6 md:px-8 pb-6 max-w-[480px] mx-auto">
        {/* Step 1: Enter Email */}
        {currentStep === 'email' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h2 className="font-['Nunito:Bold',_sans-serif] text-[24px] sm:text-[28px] text-[#0d141c]">
                Reset your password
              </h2>
              <p className="font-['Nunito:Regular',_sans-serif] text-[14px] sm:text-[15px] text-[#6b7280]">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            <div className="space-y-4">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="font-['Nunito:SemiBold',_sans-serif] text-[14px] text-[#0d141c]">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Mail size={20} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter your email"
                    autoComplete="email"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck="false"
                    inputMode="email"
                    className="w-full h-12 sm:h-14 pl-11 pr-4 bg-[#f9f9f9] border border-[#e5e5e5] rounded-lg font-['Nunito:Regular',_sans-serif] text-[14px] sm:text-[16px] text-[#0d141c] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8e1ffd] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-3"
                >
                  <p className="font-['Nunito:Regular',_sans-serif] text-[13px] text-red-600">
                    {error}
                  </p>
                </motion.div>
              )}

              <motion.button
                onClick={handleSendResetLink}
                disabled={loading}
                className={`w-full h-12 sm:h-14 rounded-lg font-['Nunito:SemiBold',_sans-serif] text-[16px] text-white transition-all flex items-center justify-center ${
                  loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#8e1ffd]'
                }`}
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Confirmation Message */}
        {currentStep === 'confirmation' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                <Mail size={40} className="text-[#8e1ffd]" />
              </div>
              
              <div className="space-y-3">
                <h2 className="font-['Nunito:Bold',_sans-serif] text-[24px] sm:text-[28px] text-[#0d141c]">
                  Check your email
                </h2>
                <p className="font-['Nunito:Regular',_sans-serif] text-[14px] sm:text-[15px] text-[#6b7280] leading-relaxed">
                  We've sent a password reset link to
                </p>
                <p className="font-['Nunito:SemiBold',_sans-serif] text-[15px] sm:text-[16px] text-[#8e1ffd]">
                  {email}
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 w-full">
                <p className="font-['Nunito:SemiBold',_sans-serif] text-[14px] text-[#0d141c] mb-2">
                  What's next?
                </p>
                <p className="font-['Nunito:Regular',_sans-serif] text-[13px] sm:text-[14px] text-[#6b7280] leading-relaxed">
                  Tap on the link shared to you via email to reset your password. The link will expire in 1 hour.
                </p>
              </div>

              <motion.button
                onClick={onBackToLogin}
                className="w-full h-12 sm:h-14 bg-white border-2 border-[#8e1ffd] rounded-lg font-['Nunito:SemiBold',_sans-serif] text-[16px] text-[#8e1ffd] transition-all flex items-center justify-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Back to Login
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Reset Password */}
        {currentStep === 'reset' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h2 className="font-['Nunito:Bold',_sans-serif] text-[24px] sm:text-[28px] text-[#0d141c]">
                Create new password
              </h2>
              <p className="font-['Nunito:Regular',_sans-serif] text-[14px] sm:text-[15px] text-[#6b7280]">
                Your new password must be different from your previous password.
              </p>
            </div>

            <div className="space-y-4">
              {/* New Password Input */}
              <div className="space-y-2">
                <label className="font-['Nunito:SemiBold',_sans-serif] text-[14px] text-[#0d141c]">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Lock size={20} className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck="false"
                    className="w-full h-12 sm:h-14 pl-11 pr-12 bg-[#f9f9f9] border border-[#e5e5e5] rounded-lg font-['Nunito:Regular',_sans-serif] text-[14px] sm:text-[16px] text-[#0d141c] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8e1ffd] focus:border-transparent transition-all"
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <label className="font-['Nunito:SemiBold',_sans-serif] text-[14px] text-[#0d141c]">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Lock size={20} className="text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError('');
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck="false"
                    className="w-full h-12 sm:h-14 pl-11 pr-12 bg-[#f9f9f9] border border-[#e5e5e5] rounded-lg font-['Nunito:Regular',_sans-serif] text-[14px] sm:text-[16px] text-[#0d141c] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8e1ffd] focus:border-transparent transition-all"
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showConfirmPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="font-['Nunito:SemiBold',_sans-serif] text-[12px] text-[#6b7280] mb-2">
                  Password must contain:
                </p>
                <ul className="space-y-1">
                  <li className={`flex items-center gap-2 font-['Nunito:Regular',_sans-serif] text-[12px] transition-colors ${
                    password.length >= 6 ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    <CheckCircle size={14} />
                    At least 6 characters
                  </li>
                </ul>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-3"
                >
                  <p className="font-['Nunito:Regular',_sans-serif] text-[13px] text-red-600">
                    {error}
                  </p>
                </motion.div>
              )}

              <motion.button
                onClick={handleResetPassword}
                disabled={loading}
                className={`w-full h-12 sm:h-14 rounded-lg font-['Nunito:SemiBold',_sans-serif] text-[16px] text-white transition-all flex items-center justify-center ${
                  loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#8e1ffd]'
                }`}
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Navigation Bar */}
      <div className="bg-white pb-safe">
        <div className="bg-white h-8 flex items-center justify-center">
          <div className="flex items-center gap-2">
            {/* Left bars */}
            <div className="flex gap-1">
              <div className="w-2.5 h-0 border-b-2 border-gray-400 rotate-90" />
              <div className="w-2.5 h-0 border-b-2 border-gray-400 rotate-90" />
              <div className="w-2.5 h-0 border-b-2 border-gray-400 rotate-90" />
            </div>
            
            {/* Center circle */}
            <div className="w-2 h-2 border-2 border-gray-400 rounded-full" />
            
            {/* Right bars */}
            <div className="flex gap-1">
              <div className="w-2.5 h-0 border-b-2 border-gray-400 rotate-90" />
              <div className="w-2.5 h-0 border-b-2 border-gray-400 rotate-90" />
              <div className="w-2.5 h-0 border-b-2 border-gray-400 rotate-90" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
