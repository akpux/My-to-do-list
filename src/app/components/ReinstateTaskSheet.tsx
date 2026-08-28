import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ReinstateTaskSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNewDeadline: () => void;
  onRemoveDeadline: () => void;
  taskTitle: string;
}

export default function ReinstateTaskSheet({
  isOpen,
  onClose,
  onAddNewDeadline,
  onRemoveDeadline,
  taskTitle
}: ReinstateTaskSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          
          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ 
              type: 'spring', 
              damping: 30, 
              stiffness: 300 
            }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[24px] shadow-2xl z-50 max-w-[800px] mx-auto"
          >
            <div className="w-full px-6 py-6 flex flex-col items-center">
              {/* Drag handle */}
              <div className="w-12 h-1 bg-gray-300 rounded-full mb-6" />
              
              {/* Illustration */}
              <div className="w-32 h-32 mb-6 rounded-2xl overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1703300450387-047da16a89c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYWxlbmRhciUyMHJlc2NoZWR1bGUlMjBpbGx1c3RyYXRpb258ZW58MXx8fHwxNzYzMjc5Mzg1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Reschedule task"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Title */}
              <h3 className="font-['Nunito:Bold',_sans-serif] text-[20px] text-neutral-950 text-center mb-3 leading-[1.3]">
                Reinstate Task?
              </h3>
              
              {/* Description */}
              <p className="font-['Nunito:Regular',_sans-serif] text-[14px] text-[#6b7280] text-center mb-8 leading-[1.5] max-w-[280px]">
                This task is completed. Choose an option below to move it back to your pending tasks.
              </p>
              
              {/* CTAs */}
              <div className="w-full space-y-3">
                {/* Primary CTA - Add New Deadline */}
                <motion.button
                  onClick={onAddNewDeadline}
                  className="w-full py-4 px-6 bg-[#8E1FFD] text-white rounded-[12px] font-['Nunito:SemiBold',_sans-serif] text-[15px] shadow-md"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Add New Deadline
                </motion.button>
                
                {/* Secondary CTA - Remove Deadline */}
                <motion.button
                  onClick={onRemoveDeadline}
                  className="w-full py-4 px-6 bg-white text-[#8E1FFD] border-2 border-[#8E1FFD] rounded-[12px] font-['Nunito:SemiBold',_sans-serif] text-[15px]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Remove Deadline
                </motion.button>
                
                {/* Cancel */}
                <motion.button
                  onClick={onClose}
                  className="w-full py-3 px-6 text-[#6b7280] font-['Nunito:Regular',_sans-serif] text-[14px]"
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
