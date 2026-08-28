import { useState } from 'react';
import { motion } from 'motion/react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet';
import svgPaths from '../imports/svg-xeiysos07t';

interface TaskFormData {
  title: string;
  type?: 'Work' | 'Home' | 'Random';
  priority?: 'High' | 'Medium' | 'Low';
  month?: string;
  date?: string;
  time?: string;
}

interface AddTaskScreenProps {
  onBack: () => void;
  onCreateTask: (task: TaskFormData) => void;
}

function Header({ onBack }: { onBack: () => void }) {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex items-center justify-between pl-4 pr-5 py-2 relative w-full bg-[rgba(0,0,0,0)]">
          <div className="content-stretch flex gap-[52px] items-center justify-start relative shrink-0">
            <div className="content-stretch flex gap-2 items-center justify-start relative shrink-0">
              <motion.button
                onClick={onBack}
                className="content-stretch flex items-center justify-center relative shrink-0 size-8"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative shrink-0 size-5">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                    <path d={svgPaths.p10c4b680} fill="#0D141C" />
                  </svg>
                </div>
              </motion.button>
              <div className="box-border content-stretch flex flex-col items-center justify-start pl-0 pr-12 py-0 relative shrink-0 w-[296px]">
                <div className="font-['Nunito:Bold',_sans-serif] font-bold leading-[0] relative shrink-0 text-[#0d141c] text-[20px] w-full">
                  <p className="leading-[23px]">New Task</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskTitleInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="max-w-[480px] relative shrink-0 w-full">
      <div className="flex flex-row items-end max-w-inherit relative size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-end flex flex-wrap gap-4 items-end justify-start max-w-inherit px-4 py-3 relative w-full">
          <div className="h-14 relative rounded-[8px] shrink-0 w-[358px]">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-14 items-center justify-start overflow-clip pb-[17px] pt-4 px-0 relative w-[358px]">
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Task Title"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="sentences"
                spellCheck="true"
                inputMode="text"
                className="basis-0 font-['Nunito:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px relative shrink-0 text-[rgb(0,0,0)] text-[16px] bg-transparent border-none outline-none placeholder:text-[#8e8e8e] font-bold"
              />
            </div>
            <div aria-hidden="true" className="absolute border-[#8e96a0] border-[0px_0px_1px] border-solid inset-0 pointer-events-none rounded-[8px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskTypeSection({ selected, onSelect }: { selected: string | undefined; onSelect: (type: 'Work' | 'Home' | 'Random' | undefined) => void }) {
  const types = ['Work', 'Home', 'Random'] as const;
  
  return (
    <div className="relative shrink-0 w-full">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start justify-start relative w-full">
        <div className="content-stretch flex flex-col items-start justify-start relative shrink-0 w-full">
          <div className="relative shrink-0 w-full">
            <div className="relative size-full">
              <div className="box-border content-stretch flex flex-col items-start justify-start pb-1 pt-4 px-4 relative w-full">
                <div className="font-['Nunito:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#0d141c] text-[16px] w-full">
                  <p className="leading-[23px]">Task Type <span className="text-[#9a959c] text-[12px] font-normal">(Optional)</span></p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative shrink-0 w-full">
            <div className="relative size-full">
              <div className="box-border content-start flex flex-wrap gap-3 items-start justify-start pl-3 pr-4 py-3 relative w-full">
                {types.map((type) => (
                  <motion.button
                    key={type}
                    onClick={() => onSelect(selected === type ? undefined : type)}
                    className="relative rounded-[8px] shrink-0"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div aria-hidden="true" className={`absolute border border-solid inset-0 pointer-events-none rounded-[8px] ${
                      selected === type ? 'border-[#8e1ffd]' : 'border-[#8e96a0]'
                    }`} />
                    <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-2 items-center justify-center p-[9px] relative">
                      <div className={`basis-0 grow min-h-px min-w-px relative shrink-0 ${type === 'Random' ? '' : 'basis-0 grow min-h-px min-w-px relative shrink-0'}`}>
                        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start justify-start relative w-full">
                          <div className={`flex flex-col justify-center leading-[0] relative shrink-0 text-[14px] text-center ${
                            selected === type 
                              ? "font-['Nunito:SemiBold',_sans-serif] font-semibold text-[#8e1ffd] w-full"
                              : "font-['Nunito:Regular',_sans-serif] font-normal text-[#9a959c] w-full text-nowrap"
                          }`}>
                            <p className={`leading-[1.4] ${type === 'Random' ? 'whitespace-pre' : ''}`}>{type}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrioritySection({ selected, onSelect }: { selected: string | undefined; onSelect: (priority: 'High' | 'Medium' | 'Low' | undefined) => void }) {
  const priorities = ['High', 'Medium', 'Low'] as const;
  
  return (
    <div className="relative shrink-0 w-full">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start justify-start relative w-full">
        <div className="content-stretch flex flex-col items-start justify-start relative shrink-0 w-full">
          <div className="relative shrink-0 w-full">
            <div className="relative size-full">
              <div className="box-border content-stretch flex flex-col items-start justify-start pb-1 pt-4 px-4 relative w-full">
                <div className="font-['Nunito:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#0d141c] text-[16px] w-full">
                  <p className="leading-[23px]">Priority <span className="text-[#9a959c] text-[12px] font-normal">(Optional)</span></p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative shrink-0 w-full">
            <div className="relative size-full">
              <div className="box-border content-start flex flex-wrap gap-3 items-start justify-start pl-3 pr-4 py-3 relative w-full">
                {priorities.map((priority) => (
                  <motion.button
                    key={priority}
                    onClick={() => onSelect(selected === priority ? undefined : priority)}
                    className="relative rounded-[8px] shrink-0"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div aria-hidden="true" className={`absolute border border-solid inset-0 pointer-events-none rounded-[8px] ${
                      selected === priority ? 'border-[#8e1ffd]' : 'border-[#8e96a0]'
                    }`} />
                    <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-2 items-center justify-center p-[9px] relative">
                      <div className={`${priority === 'High' || priority === 'Medium' ? 'basis-0 grow min-h-px min-w-px relative shrink-0' : 'relative shrink-0'}`}>
                        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start justify-start relative">
                          <div className={`flex flex-col justify-center leading-[0] relative shrink-0 text-[14px] text-center ${
                            selected === priority 
                              ? "font-['Nunito:SemiBold',_sans-serif] font-semibold text-[#8e1ffd] w-full"
                              : "font-['Nunito:Regular',_sans-serif] font-normal text-[#9a959c] text-nowrap"
                          }`}>
                            <p className="leading-[1.4] whitespace-pre">{priority}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeadlineSection({ month, date, time, onMonthChange, onDateChange, onTimeChange, onOpenPicker, disabled }: {
  month?: string;
  date?: string;
  time?: string;
  onMonthChange: (month: string) => void;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onOpenPicker: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="relative shrink-0 w-full">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start justify-start relative w-full">
        <div className="content-stretch flex flex-col items-start justify-start relative shrink-0 w-full">
          <div className="relative shrink-0 w-full">
            <div className="flex flex-col justify-center relative size-full">
              <div className="box-border content-stretch flex flex-col items-start justify-center pb-1 pt-4 px-4 relative w-full">
                <div className="font-['Nunito:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#0d141c] text-[16px] w-full">
                  <p className="leading-[23px]">Deadline <span className="text-[#9a959c] text-[12px] font-normal">(Optional)</span></p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative shrink-0 w-full">
            <div className="flex flex-row items-center relative size-full">
              <div className="box-border content-stretch flex gap-2 items-center justify-start pl-3 pr-4 py-3 relative w-full">
                {/* Month Button */}
                <button
                  onClick={onOpenPicker}
                  className="h-8 relative rounded-[8px] shrink-0 bg-[#fbfbfb]"
                >
                  <div aria-hidden="true" className="absolute border border-[#c4c4c4] border-solid inset-0 pointer-events-none rounded-[8px]" />
                  <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-1 h-8 items-center justify-center px-[17px] py-px relative">
                    <span className="font-['Nunito:Regular',_sans-serif] font-normal text-[14px] leading-[21px] text-[#0d141c]">
                      {month || 'Month'}
                    </span>
                    <div className="relative shrink-0 size-4">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                        <path d={svgPaths.p21637080} fill="black" />
                      </svg>
                    </div>
                  </div>
                </button>
                
                {/* Separator */}
                <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[14px] text-nowrap text-[#0d141c]">
                  <p className="leading-[21px] whitespace-pre">:</p>
                </div>
                
                {/* Date Button */}
                <button
                  onClick={onOpenPicker}
                  className="h-8 relative rounded-[8px] shrink-0 bg-[#fbfbfb]"
                >
                  <div aria-hidden="true" className="absolute border border-[#c4c4c4] border-solid inset-0 pointer-events-none rounded-[8px]" />
                  <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-1 h-8 items-center justify-center px-[17px] py-px relative">
                    <span className="font-['Nunito:Regular',_sans-serif] font-normal text-[14px] leading-[21px] text-[#0d141c]">
                      {date || 'Date'}
                    </span>
                    <div className="relative shrink-0 size-4">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                        <path d={svgPaths.p21637080} fill="black" />
                      </svg>
                    </div>
                  </div>
                </button>
                
                {/* Separator */}
                <div className="font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[14px] text-nowrap text-[#0d141c]">
                  <p className="leading-[21px] whitespace-pre">:</p>
                </div>
                
                {/* Time Button */}
                <button
                  onClick={onOpenPicker}
                  className="h-8 relative rounded-[8px] shrink-0 bg-[#fbfbfb]"
                >
                  <div aria-hidden="true" className="absolute border border-[#c4c4c4] border-solid inset-0 pointer-events-none rounded-[8px]" />
                  <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-1 h-8 items-center justify-center px-[17px] py-px relative">
                    <span className="font-['Nunito:Regular',_sans-serif] font-normal text-[14px] leading-[21px] text-[#0d141c]">
                      {time || 'Time'}
                    </span>
                    <div className="relative shrink-0 size-4">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                        <path d={svgPaths.p21637080} fill="black" />
                      </svg>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DateTimePicker({ 
  isOpen, 
  onClose, 
  month,
  date,
  time,
  onMonthChange,
  onDateChange,
  onTimeChange
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  month?: string;
  date?: string;
  time?: string;
  onMonthChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
}) {
  // Get current defaults if not set
  const now = new Date();
  const defaultMonth = month || now.toLocaleString('en-US', { month: 'short' });
  const defaultDate = date || now.getDate().toString();
  const defaultTime = time || (() => {
    const currentHour = now.getHours();
    const currentPeriod = currentHour >= 12 ? 'PM' : 'AM';
    const currentHour12 = currentHour % 12 || 12;
    return `${currentHour12} ${currentPeriod}`;
  })();

  // Generate month options - reorganized to put current month at top
  const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonthIndex = allMonths.indexOf(defaultMonth);
  const monthOptions = currentMonthIndex !== -1 
    ? [defaultMonth, ...allMonths.slice(currentMonthIndex + 1), ...allMonths.slice(0, currentMonthIndex)]
    : allMonths;

  // Generate date options (1-31) - reorganized to put current date at top
  const allDates = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const currentDateIndex = allDates.indexOf(defaultDate);
  const dateOptions = currentDateIndex !== -1
    ? [defaultDate, ...allDates.slice(currentDateIndex + 1), ...allDates.slice(0, currentDateIndex)]
    : allDates;

  // Generate time options (hours only) - reorganized to put current time at top
  const allTimes = (() => {
    const times = [];
    for (let hour = 1; hour <= 12; hour++) {
      times.push(`${hour} AM`);
    }
    for (let hour = 1; hour <= 12; hour++) {
      times.push(`${hour} PM`);
    }
    return times;
  })();
  const currentTimeIndex = allTimes.indexOf(defaultTime);
  const timeOptions = currentTimeIndex !== -1
    ? [defaultTime, ...allTimes.slice(currentTimeIndex + 1), ...allTimes.slice(0, currentTimeIndex)]
    : allTimes;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="rounded-t-xl max-h-[500px]">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-center font-nunito font-bold text-[18px]">Set Deadline</SheetTitle>
          <SheetDescription className="sr-only">
            Scroll through the columns to select date, day and time for your task deadline
          </SheetDescription>
        </SheetHeader>
        
        <div className="relative h-[280px] overflow-hidden">
          {/* Bottom gradient only */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
          
          {/* Three column layout */}
          <div className="flex h-full gap-2">
            {/* Month Column */}
            <div className="flex-1 flex flex-col items-center">
              <div className="font-nunito font-semibold text-[12px] text-[#9a959c] mb-2">Month</div>
              <div className="flex-1 overflow-y-auto scrollbar-hide pt-2 pb-24 w-full">
                {monthOptions.map((option, index) => (
                  <button
                    key={`month-${option}-${index}`}
                    onClick={() => onMonthChange(option)}
                    className={`w-full h-12 flex items-center justify-center transition-all ${
                      option === (month || defaultMonth)
                        ? 'font-nunito text-[#8e1ffd] text-[18px] font-bold' 
                        : 'font-nunito text-[#9a959c] text-[14px] font-normal'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Separator */}
            <div className="w-px bg-gray-200 my-8" />

            {/* Date Column */}
            <div className="flex-1 flex flex-col items-center">
              <div className="font-nunito font-semibold text-[12px] text-[#9a959c] mb-2">Date</div>
              <div className="flex-1 overflow-y-auto scrollbar-hide pt-2 pb-24 w-full">
                {dateOptions.map((option, index) => (
                  <button
                    key={`date-${option}-${index}`}
                    onClick={() => onDateChange(option)}
                    className={`w-full h-12 flex items-center justify-center transition-all ${
                      option === (date || defaultDate)
                        ? 'font-nunito text-[#8e1ffd] text-[18px] font-bold' 
                        : 'font-nunito text-[#9a959c] text-[14px] font-normal'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Separator */}
            <div className="w-px bg-gray-200 my-8" />

            {/* Time Column */}
            <div className="flex-1 flex flex-col items-center">
              <div className="font-nunito font-semibold text-[12px] text-[#9a959c] mb-2">Time</div>
              <div className="flex-1 overflow-y-auto scrollbar-hide pt-2 pb-24 w-full">
                {timeOptions.map((option, index) => (
                  <button
                    key={`time-${option}-${index}`}
                    onClick={() => onTimeChange(option)}
                    className={`w-full h-12 flex items-center justify-center transition-all ${
                      option === (time || defaultTime)
                        ? 'font-nunito text-[#8e1ffd] text-[18px] font-bold' 
                        : 'font-nunito text-[#9a959c] text-[14px] font-normal'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-[14px] pr-[0px] pb-[28px] pl-[0px] mx-[16px] my-[0px]">
          <motion.button
            onClick={onClose}
            className="w-full h-12 bg-[#8e1ffd] rounded-[8px] font-nunito font-semibold text-[16px] text-white flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Done
          </motion.button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function CreateButton({ onClick, disabled }: { onClick: () => void; disabled: boolean }) {
  return (
    <div className="relative shrink-0 w-full">
      <div className="relative size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-start justify-start p-[16px] pb-[40px] relative w-full">
          <motion.button
            onClick={onClick}
            disabled={disabled}
            className={`basis-0 grow min-h-px min-w-px relative rounded-[8px] shrink-0 ${
              disabled ? 'bg-gray-400' : 'bg-[#8e1ffd]'
            }`}
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
          >
            <div className="flex flex-row items-center justify-center relative size-full">
              <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[13px] items-center justify-center px-6 py-3 relative w-full">
                <div className="flex flex-col font-['Nunito:Medium',_sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#fcfcfc] text-[16px] text-nowrap">
                  <p className="leading-[24px] whitespace-pre">Create To-do list</p>
                </div>
              </div>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default function AddTaskScreen({ onBack, onCreateTask }: AddTaskScreenProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    type: undefined,
    priority: undefined,
    month: undefined,
    date: undefined,
    time: undefined
  });

  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleCreateTask = () => {
    if (formData.title.trim()) {
      onCreateTask(formData);
    }
  };

  const handleOpenPicker = () => {
    setIsPickerOpen(true);
  };

  const handleClosePicker = () => {
    setIsPickerOpen(false);
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({ ...prev, title }));
  };

  const isFormValid = formData.title.trim().length > 0;

  return (
    <motion.div
      className="absolute bg-white content-stretch flex flex-col min-h-[600px] h-full items-start justify-between left-0 overflow-clip top-0 w-full pt-8 z-50"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Main Section */}
      <div className="relative shrink-0 w-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start justify-start relative w-full max-w-[480px] mx-auto">
          {/* Header */}
          <div className="relative shrink-0 w-full">
            <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col items-start justify-start relative w-full">
              <Header onBack={onBack} />
            </div>
          </div>
          
          {/* Task Title Input */}
          <TaskTitleInput
            value={formData.title}
            onChange={handleTitleChange}
          />
          
          {/* Task Type Section */}
          <TaskTypeSection
            selected={formData.type}
            onSelect={(type) => setFormData(prev => ({ ...prev, type }))}
          />
          
          {/* Priority Section */}
          <PrioritySection
            selected={formData.priority}
            onSelect={(priority) => setFormData(prev => ({ ...prev, priority }))}
          />
          
          {/* Deadline Section */}
          <DeadlineSection
            month={formData.month}
            date={formData.date}
            time={formData.time}
            onMonthChange={(month) => setFormData(prev => ({ ...prev, month }))}
            onDateChange={(date) => setFormData(prev => ({ ...prev, date }))}
            onTimeChange={(time) => setFormData(prev => ({ ...prev, time }))}
            onOpenPicker={handleOpenPicker}
          />
        </div>
      </div>
      
      {/* Date/Time Picker Bottom Sheet */}
      <DateTimePicker
        isOpen={isPickerOpen}
        onClose={handleClosePicker}
        month={formData.month}
        date={formData.date}
        time={formData.time}
        onMonthChange={(month) => setFormData(prev => ({ ...prev, month }))}
        onDateChange={(date) => setFormData(prev => ({ ...prev, date }))}
        onTimeChange={(time) => setFormData(prev => ({ ...prev, time }))}
      />
      
      {/* Bottom Sheet */}
      <CreateButton onClick={handleCreateTask} disabled={!isFormValid} />
    </motion.div>
  );
}