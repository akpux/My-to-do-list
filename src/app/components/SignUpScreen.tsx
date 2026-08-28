import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, User, ArrowLeft } from 'lucide-react';
import { createClient } from '../utils/supabase/client';
import svgPaths from '../imports/svg-wizf7kbxcj';

interface SignUpScreenProps {
  onSignUpSuccess: () => void;
  onBackToLogin: () => void;
}

export default function SignUpScreen({ onSignUpSuccess, onBackToLogin }: SignUpScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    auth: ''
  });

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Form validation
  const isFormValid = 
    name.length > 0 && 
    email.length > 0 && 
    validateEmail(email) && 
    password.length >= 6 && 
    confirmPassword === password;

  const handleNameChange = (value: string) => {
    setName(value);
    if (value.length > 0 && value.length < 2) {
      setErrors(prev => ({ ...prev, name: 'Name must be at least 2 characters' }));
    } else {
      setErrors(prev => ({ ...prev, name: '' }));
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (value.length > 0 && !validateEmail(value)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
    } else {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (value.length > 0 && value.length < 6) {
      setErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }));
    } else {
      setErrors(prev => ({ ...prev, password: '' }));
    }
    
    // Also check confirm password when password changes
    if (confirmPassword.length > 0 && value !== confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: '' }));
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (value.length > 0 && value !== password) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: '' }));
    }
  };

  const handleSignUp = async () => {
    if (!isFormValid) return;
    
    setIsLoading(true);
    setErrors(prev => ({ ...prev, auth: '' }));
    
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          }
        }
      });

      if (error) {
        setErrors(prev => ({ 
          ...prev, 
          auth: error.message || 'Failed to create account. Please try again.' 
        }));
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // Note: Supabase may require email confirmation depending on your settings
        // If email confirmation is enabled, you might want to show a different message
        onSignUpSuccess();
      }
    } catch (error) {
      setErrors(prev => ({ 
        ...prev, 
        auth: 'An unexpected error occurred. Please try again.' 
      }));
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isFormValid && !isLoading) {
      handleSignUp();
    }
  };

  return (
    <div className="bg-white flex flex-col h-full w-full overflow-y-auto">
      {/* Back Button */}
      <div className="px-6 max-w-[480px] mx-auto w-full pt-[8px] pr-[21px] pb-[8px] pl-[21px]">
        <motion.button
          onClick={onBackToLogin}
          className="flex items-center gap-2 text-[#0d141c]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={20} />
          <span className="font-['Nunito:Medium',_sans-serif] text-[14px]">Back to Login</span>
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center flex-1 px-6 pb-6 max-w-[480px] mx-auto w-full"
      >
        {/* Icon */}
        <motion.div
          className="w-20 h-20 bg-[#f3f0ff] rounded-full flex items-center justify-center mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <User size={40} className="text-[#8e1ffd]" />
        </motion.div>

        {/* Title */}
        <h1 className="font-['Nunito:Bold',_sans-serif] text-[28px] text-[#0d141c] mb-2">
          Create Account
        </h1>
        
        {/* Subtitle */}
        <p className="font-['Nunito:Regular',_sans-serif] text-[16px] text-[#717182] text-center mb-6">
          Sign up to get started with your tasks
        </p>

        {/* Auth Error Message */}
        {errors.auth && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="font-['Nunito:Regular',_sans-serif] text-[14px] text-[#d30000] text-center">
              {errors.auth}
            </p>
          </motion.div>
        )}

        {/* Name Input */}
        <div className="w-full mb-3">
          <label className="font-['Nunito:SemiBold',_sans-serif] text-[14px] text-[#0d141c] mb-2 block">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <User size={20} className="text-[#717182]" />
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your name"
              autoComplete="name"
              autoCorrect="off"
              autoCapitalize="words"
              spellCheck="false"
              inputMode="text"
              className="w-full h-14 pl-12 pr-4 bg-white border border-[#e9ebef] rounded-[8px] font-['Nunito:Regular',_sans-serif] text-[16px] text-[#0d141c] outline-none focus:border-[#8e1ffd] transition-colors placeholder:text-[#8e8e8e]"
            />
          </div>
          {errors.name && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-['Nunito:Regular',_sans-serif] text-[12px] text-[#d30000] mt-2"
            >
              {errors.name}
            </motion.p>
          )}
        </div>

        {/* Email Input */}
        <div className="w-full mb-3">
          <label className="font-['Nunito:SemiBold',_sans-serif] text-[14px] text-[#0d141c] mb-2 block">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Mail size={20} className="text-[#717182]" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your email"
              autoComplete="email"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck="false"
              inputMode="email"
              className="w-full h-14 pl-12 pr-4 bg-white border border-[#e9ebef] rounded-[8px] font-['Nunito:Regular',_sans-serif] text-[16px] text-[#0d141c] outline-none focus:border-[#8e1ffd] transition-colors placeholder:text-[#8e8e8e]"
            />
          </div>
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-['Nunito:Regular',_sans-serif] text-[12px] text-[#d30000] mt-2"
            >
              {errors.email}
            </motion.p>
          )}
        </div>

        {/* Password Input */}
        <div className="w-full mb-3">
          <label className="font-['Nunito:SemiBold',_sans-serif] text-[14px] text-[#0d141c] mb-2 block">
            Password
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Lock size={20} className="text-[#717182]" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your password"
              autoComplete="new-password"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck="false"
              className="w-full h-14 pl-12 pr-12 bg-white border border-[#e9ebef] rounded-[8px] font-['Nunito:Regular',_sans-serif] text-[16px] text-[#0d141c] outline-none focus:border-[#8e1ffd] transition-colors placeholder:text-[#8e8e8e]"
            />
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {showPassword ? (
                <EyeOff size={20} className="text-[#717182]" />
              ) : (
                <Eye size={20} className="text-[#717182]" />
              )}
            </motion.button>
          </div>
          {errors.password && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-['Nunito:Regular',_sans-serif] text-[12px] text-[#d30000] mt-2"
            >
              {errors.password}
            </motion.p>
          )}
        </div>

        {/* Confirm Password Input */}
        <div className="w-full mb-6">
          <label className="font-['Nunito:SemiBold',_sans-serif] text-[14px] text-[#0d141c] mb-2 block">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Lock size={20} className="text-[#717182]" />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => handleConfirmPasswordChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Confirm your password"
              autoComplete="new-password"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck="false"
              className="w-full h-14 pl-12 pr-12 bg-white border border-[#e9ebef] rounded-[8px] font-['Nunito:Regular',_sans-serif] text-[16px] text-[#0d141c] outline-none focus:border-[#8e1ffd] transition-colors placeholder:text-[#8e8e8e]"
            />
            <motion.button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {showConfirmPassword ? (
                <EyeOff size={20} className="text-[#717182]" />
              ) : (
                <Eye size={20} className="text-[#717182]" />
              )}
            </motion.button>
          </div>
          {errors.confirmPassword && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-['Nunito:Regular',_sans-serif] text-[12px] text-[#d30000] mt-2"
            >
              {errors.confirmPassword}
            </motion.p>
          )}
        </div>

        {/* Sign Up Button */}
        <motion.button
          onClick={handleSignUp}
          disabled={!isFormValid || isLoading}
          className={`w-full h-12 rounded-[8px] font-['Nunito:SemiBold',_sans-serif] text-[16px] text-white text-center transition-all ${
            isFormValid && !isLoading ? 'bg-[#8e1ffd]' : 'bg-gray-300'
          }`}
          whileHover={isFormValid && !isLoading ? { scale: 1.02 } : {}}
          whileTap={isFormValid && !isLoading ? { scale: 0.98 } : {}}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <motion.div
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span>Creating account...</span>
            </div>
          ) : (
            'Create Account'
          )}
        </motion.button>

        {/* Login Link */}
        <div className="mt-4 text-center">
          <span className="font-['Nunito:Regular',_sans-serif] text-[14px] text-[#717182]">
            Already have an account?{' '}
          </span>
          <motion.button
            className="font-['Nunito:SemiBold',_sans-serif] text-[14px] text-[#8e1ffd]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBackToLogin}
          >
            Sign In
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
