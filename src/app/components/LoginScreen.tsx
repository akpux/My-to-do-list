import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Phone } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (name: string) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');

  const isValid = name.trim().length >= 2;

  const handleContinue = () => {
    if (isValid) onLoginSuccess(name.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid) handleContinue();
  };

  return (
    <div className="bg-white flex flex-col h-full w-full overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center flex-1 px-6 max-w-[480px] mx-auto w-full py-12"
      >
        {/* Icon */}
        <motion.div
          className="w-20 h-20 bg-[#f3f0ff] rounded-full flex items-center justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <User size={40} className="text-[#8e1ffd]" />
        </motion.div>

        <h1 className="font-['Nunito:Bold',_sans-serif] text-[28px] text-[#0d141c] mb-2 text-center">
          Welcome!
        </h1>
        <p className="font-['Nunito:Regular',_sans-serif] text-[16px] text-[#717182] text-center mb-10">
          What should we call you?
        </p>

        {/* Name input */}
        <div className="w-full mb-4">
          <label className="font-['Nunito:SemiBold',_sans-serif] text-[14px] text-[#0d141c] mb-2 block">
            Your Name
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <User size={20} className="text-[#717182]" />
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your name"
              autoComplete="name"
              autoCapitalize="words"
              spellCheck="false"
              className="w-full h-14 pl-12 pr-4 bg-white border border-[#e9ebef] rounded-[8px] font-['Nunito:Regular',_sans-serif] text-[16px] text-[#0d141c] outline-none focus:border-[#8e1ffd] transition-colors placeholder:text-[#8e8e8e]"
            />
          </div>
        </div>

        {/* Mobile number input */}
        <div className="w-full mb-6">
          <label className="font-['Nunito:SemiBold',_sans-serif] text-[14px] text-[#0d141c] mb-2 block">
            Mobile Number
          </label>
          <div className="relative flex">
            {/* Country code prefix */}
            <div className="flex items-center gap-1.5 h-14 px-3 bg-[#f7f7f9] border border-[#e9ebef] border-r-0 rounded-l-[8px] shrink-0">
              <span className="text-[18px] leading-none">🇮🇳</span>
              <span className="font-['Nunito:Regular',_sans-serif] text-[16px] text-[#0d141c]">+91</span>
            </div>
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Phone size={20} className="text-[#717182]" />
              </div>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="Enter mobile number"
                autoComplete="tel"
                inputMode="numeric"
                className="w-full h-14 pl-12 pr-4 bg-white border border-[#e9ebef] rounded-r-[8px] font-['Nunito:Regular',_sans-serif] text-[16px] text-[#0d141c] outline-none focus:border-[#8e1ffd] transition-colors placeholder:text-[#8e8e8e]"
              />
            </div>
          </div>
        </div>

        <motion.button
          onClick={handleContinue}
          disabled={!isValid}
          className={`w-full h-12 rounded-[8px] font-['Nunito:SemiBold',_sans-serif] text-[16px] text-white transition-all ${
            isValid ? 'bg-[#8e1ffd]' : 'bg-gray-300 cursor-not-allowed'
          }`}
          whileHover={isValid ? { scale: 1.02 } : {}}
          whileTap={isValid ? { scale: 0.98 } : {}}
        >
          Get Started
        </motion.button>
      </motion.div>
    </div>
  );
}
