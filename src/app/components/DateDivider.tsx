import { motion } from 'motion/react';

interface DateDividerProps {
  label: string;
}

export default function DateDivider({ label }: DateDividerProps) {
  return (
    <motion.div
      className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0 w-full"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Left line */}
      <div className="basis-0 grow h-0 min-h-px min-w-px relative shrink-0">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 126 1">
            <line stroke="#EFEFEF" x2="125.5" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      
      {/* Date text */}
      <div className="flex flex-col font-['Nunito:SemiBold',_sans-serif] font-semibold justify-center leading-[0] overflow-ellipsis overflow-hidden relative shrink-0 text-[#434144] text-[12px] text-nowrap">
        <p className="leading-[1.4] overflow-ellipsis overflow-hidden whitespace-pre">{label}</p>
      </div>
      
      {/* Right line */}
      <div className="basis-0 grow h-0 min-h-px min-w-px relative shrink-0">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 126 1">
            <line stroke="#EFEFEF" x2="125.5" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
