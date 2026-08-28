import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, List, Tag, AlertCircle, Check, Plus } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './components/ui/sheet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
import AddTaskScreen from './components/AddTaskScreen';
import DateDivider from './components/DateDivider';
import LoginScreen from './components/LoginScreen';
import ReinstateTaskSheet from './components/ReinstateTaskSheet';
import svgPaths from './imports/svg-wizf7kbxcj';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  missed: boolean;
  date?: string;
  category?: string;
  priority?: 'High' | 'Medium' | 'Low';
}

const initialTodos: TodoItem[] = [
  {
    id: '1',
    text: 'Sanitise your hands when you come home from outside',
    completed: false,
    missed: false,
    date: '12 Aug, Mon, 10:30 PM',
    category: 'Work',
    priority: 'High'
  },
  {
    id: '2',
    text: 'Wash daily Clothes',
    completed: false,
    missed: false,
    date: '12 Aug, Mon, 10:30 PM',
    category: 'Work',
    priority: 'High'
  },
  {
    id: '3',
    text: 'Pay Rent to owner',
    completed: false,
    missed: false,
    date: '12 Aug, Mon, 10:30 PM',
    category: 'Work',
    priority: 'High'
  },
  {
    id: '4',
    text: "Don't keep stagnant water near your house.",
    completed: true,
    missed: true,
    date: '12 Aug, Mon, 10:30 PM',
    category: 'Work',
    priority: 'High'
  },
  {
    id: '5',
    text: 'Lock the house',
    completed: true,
    missed: false,
    date: '12 Aug, Mon, 10:30 PM',
    category: 'Work',
    priority: 'High'
  }
];

function Header({ userName, onSort }: { userName: string; onSort: (sortType: 'time' | 'type' | 'missed' | 'priority') => void }) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSort = (sortType: 'time' | 'type' | 'missed' | 'priority') => {
    onSort(sortType);
    setIsSheetOpen(false);
  };

  // Generate initials for avatar
  const getInitials = (name: string) => {
    const names = name.trim().split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="bg-white flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 max-w-[800px] mx-auto w-full p-[14px]">
      <div className="flex items-center gap-3">
        {/* Profile Picture */}
        <div className="size-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-['Nunito:Bold',_sans-serif] text-sm">
          {getInitials(userName)}
        </div>
        {/* Name */}
        <h1 className="font-['Nunito:Bold',_sans-serif] text-[17.5px] text-black tracking-[-0.4358px]">
          Hey, {userName}
        </h1>
      </div>
      
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <button className="content-stretch flex items-center justify-center relative shrink-0 size-8">
            <div className="relative shrink-0 size-5">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                <path d={svgPaths.p340bcf80} fill="#8E96A0" />
              </svg>
            </div>
          </button>
        </SheetTrigger>
        
        <SheetContent side="bottom" className="rounded-t-xl">
          <SheetHeader className="pt-[14px] pr-[14px] pb-[0px] pl-[14px]">
            <SheetTitle className="text-left">Sort by</SheetTitle>
            <SheetDescription className="text-left">Choose how you want to sort your todo items</SheetDescription>
          </SheetHeader>
          
          <div className="space-y-2 m-[0px] pt-[0px] pr-[0px] pb-[14px] pl-[0px]">
            <motion.button
              onClick={() => handleSort('time')}
              className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 rounded-lg transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Clock size={20} className="text-gray-600" />
              <span className="font-medium">Time</span>
            </motion.button>
            
            <motion.button
              onClick={() => handleSort('type')}
              className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 rounded-lg transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <List size={20} className="text-gray-600" />
              <span className="font-medium">Type of task</span>
            </motion.button>
            
            <motion.button
              onClick={() => handleSort('missed')}
              className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 rounded-lg transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <AlertCircle size={20} className="text-red-600" />
              <span className="font-medium">Missed</span>
            </motion.button>
            
            <motion.button
              onClick={() => handleSort('priority')}
              className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 rounded-lg transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Tag size={20} className="text-orange-500" />
              <span className="font-medium">Priority</span>
            </motion.button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

// Helper function to parse date and get relative label
function getDateLabel(dateString: string | undefined): { label: string; sortKey: string } {
  // If no date provided, return "No Date" label
  if (!dateString) {
    return { label: 'No Date', sortKey: '9-no-date' };
  }
  
  // Parse "12 Aug, Mon, 10:30 PM" format
  const parts = dateString.split(', ');
  const datePart = parts[0]; // "12 Aug"
  const dayPart = parts[1]; // "Mon"
  
  // For now, we'll use simple logic. In a real app, you'd compare with actual dates
  const today = new Date();
  const todayDate = today.getDate();
  const todayMonth = today.toLocaleString('en-US', { month: 'short' });
  
  // Extract date number from datePart (e.g., "12" from "12 Aug")
  const dateNum = parseInt(datePart.split(' ')[0]);
  const month = datePart.split(' ')[1];
  
  // Simple comparison logic
  if (dateNum === todayDate && month === todayMonth) {
    return { label: 'Today', sortKey: '1' };
  } else if (dateNum === todayDate - 1 && month === todayMonth) {
    return { label: 'Yesterday', sortKey: '2' };
  } else {
    return { label: `${datePart}, ${dayPart}`, sortKey: `3-${datePart}` };
  }
}

function TodoItem({ todo, onToggle, onDelete, onCompletedClick }: { 
  todo: TodoItem; 
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onCompletedClick?: (id: string) => void;
}) {
  // Check if there are any metadata to display
  const hasMetadata = todo.date || todo.category || todo.priority;
  const isClickable = todo.completed && todo.date && onCompletedClick;
  
  const handleClick = () => {
    // Only trigger onCompletedClick if task is completed and has a deadline
    if (isClickable) {
      onCompletedClick(todo.id);
    }
  };
  
  return (
    <div
      className={`bg-white content-stretch flex flex-col items-start relative rounded-[8px] shrink-0 w-full transition-all ${
        isClickable ? 'cursor-pointer hover:bg-purple-50/30 active:bg-purple-100/50' : ''
      }`}
      data-name="list item"
      onClick={handleClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      <div aria-hidden="true" className="absolute border border-[#efefef] border-solid inset-0 pointer-events-none rounded-[8px]" />
      
      <div className="relative rounded-[8px] shrink-0 w-full">
        <div className="size-full">
          <div className="box-border content-stretch flex flex-col gap-[2px] items-start p-[12px] relative w-full">
            {/* Main row: checkbox + title + delete button */}
            <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
              {/* Checkbox */}
              <motion.div 
                className="content-stretch flex items-center justify-center relative shrink-0 size-[24px]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="box-border content-stretch flex items-center justify-center p-[11px] relative rounded-[100px] shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggle(todo.id);
                    }}
                    className="relative rounded-[2px] shrink-0 size-[16px]"
                  >
                    {todo.completed ? (
                      <>
                        <div className="bg-[#a1a1a1] rounded-[2px] shrink-0 size-[16px]" />
                        <motion.div
                          className="absolute left-1/2 size-[16px] top-1/2 translate-x-[-50%] translate-y-[-50%]"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                            <path d={svgPaths.p13190080} fill="white" />
                          </svg>
                        </motion.div>
                      </>
                    ) : (
                      <div aria-hidden="true" className="absolute border border-[#929292] border-solid inset-0 pointer-events-none rounded-[2px]" />
                    )}
                  </button>
                </div>
              </motion.div>
              
              {/* Title */}
              <div className="basis-0 content-stretch flex gap-[16px] grow items-start max-h-[40px] min-h-px min-w-px relative shrink-0">
                <div 
                  className={`basis-0 flex-col grow justify-center leading-[0] min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-[14px] ${
                    todo.completed 
                      ? 'css-opaqfo font-["Nunito:SemiBold",_sans-serif] font-semibold text-[#939295]' 
                      : '-webkit-box css-1pl2q8 flex-col font-["Nunito:SemiBold",_sans-serif] font-semibold text-neutral-950'
                  }`}
                >
                  <p className={`leading-[1.4] ${todo.completed ? '[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid line-through' : ''}`}>
                    {todo.text}
                  </p>
                </div>
              </div>
              
              {/* Delete button - only for completed items */}
              {todo.completed && (
                <div className="content-stretch flex gap-[8px] items-center relative rounded-br-[8px] rounded-tr-[8px] shrink-0">
                  <motion.div
                    className="bg-[#ffeded] box-border content-stretch flex gap-[10px] items-center p-[4px] relative rounded-[4px] shrink-0"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(todo.id);
                      }} 
                      className="relative shrink-0 size-[12px]"
                    >
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
                        <path d={svgPaths.p30dbe380} fill="#D30000" />
                      </svg>
                    </button>
                  </motion.div>
                </div>
              )}
            </div>
            
            {/* Metadata row - only show if there's any metadata */}
            {hasMetadata && (
              <div className="box-border content-stretch flex gap-[9px] items-center pl-[36px] pr-0 py-0 relative shrink-0">
                {/* Time - only show if date exists */}
                {todo.date && (
                  <div className="box-border content-stretch flex gap-[2px] items-center justify-center px-0 py-[4px] relative shrink-0">
                    <div className="relative shrink-0 size-[14px]">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
                        <path d={svgPaths.p36d95180} fill={todo.completed ? "#A8A4AC" : "#4D4C4F"} />
                      </svg>
                    </div>
                    <div className="box-border content-stretch flex gap-[10px] items-center justify-center pb-0 pt-[2px] px-0 relative shrink-0">
                      <div className={`flex flex-col font-['Nunito:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[12px] text-nowrap ${
                        todo.completed ? 'text-[#a8a4ac]' : 'text-[#434144]'
                      }`}>
                        <p className="leading-[1.4] whitespace-pre">{todo.date.split(', ')[2] || '10:30 PM'}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Category - only show if category exists */}
                {todo.category && (
                  <div className="box-border content-stretch flex gap-[2px] items-center justify-center px-0 py-[4px] relative shrink-0">
                    <div className="relative shrink-0 size-[14px]">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
                        <path d={svgPaths.pdde6800} fill={todo.completed ? "#A8A4AC" : "#4D4C4F"} />
                      </svg>
                    </div>
                    <div className="box-border content-stretch flex gap-[10px] items-center justify-center pb-0 pt-[2px] px-0 relative shrink-0">
                      <div className={`flex flex-col font-['Nunito:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[12px] text-nowrap ${
                        todo.completed ? 'text-[#a8a4ac]' : 'text-[#434144]'
                      }`}>
                        <p className="leading-[1.4] whitespace-pre">{todo.category}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Priority - only show if priority exists */}
                {todo.priority && (
                  <div className="box-border content-stretch flex gap-[2px] items-center justify-center px-0 py-[4px] relative shrink-0">
                    <div className="relative shrink-0 size-[14px]">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
                        <path d={svgPaths.p1e646b80} fill={
                          todo.completed 
                            ? "#A8A4AC" 
                            : todo.priority === 'High' 
                              ? "#EA580C" 
                              : todo.priority === 'Medium' 
                                ? "#CA8A04" 
                                : "#16A34A"
                        } />
                      </svg>
                    </div>
                    <div className="box-border content-stretch flex gap-[10px] items-center justify-center pb-0 pt-[2px] px-0 relative shrink-0">
                      <div className={`flex flex-col font-['Nunito:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[12px] text-nowrap ${
                        todo.completed 
                          ? 'text-[#a8a4ac]' 
                          : todo.priority === 'High' 
                            ? 'text-[#ea580c]' 
                            : todo.priority === 'Medium' 
                              ? 'text-[#ca8a04]' 
                              : 'text-[#16a34a]'
                      }`}>
                        <p className="leading-[1.4] whitespace-pre">{todo.priority}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Missed banner - appears at bottom of card */}
      {todo.missed && (
        <div
          className="bg-[#ffe7e7] box-border content-stretch flex gap-[2px] items-center justify-center px-0 py-[2px] relative rounded-bl-[8px] rounded-br-[8px] shrink-0 w-full"
        >
          <div className="relative shrink-0 size-[14px]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
              <path d={svgPaths.p34201500} fill="#D30000" />
            </svg>
          </div>
          <div className="box-border content-stretch flex gap-[10px] items-center justify-center pb-0 pt-[2px] px-0 relative shrink-0">
            <div className="flex flex-col font-['Nunito:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#d30000] text-[12px] text-nowrap">
              <p className="leading-[1.4] whitespace-pre">Missed</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FloatingActionButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white rounded-full shadow-lg flex items-center gap-2 px-4 py-3 z-10 font-nunito"
      style={{ backgroundColor: '#8E1FFD' }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 8px 25px rgba(142, 31, 253, 0.3)"
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.3,
        ease: "easeOut"
      }}
    >
      <motion.div
        whileHover={{ rotate: 90 }}
        transition={{ duration: 0.2 }}
      >
        <Plus size={20} />
      </motion.div>
      <span className="text-sm font-medium">Add task</span>
    </motion.button>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos);
  const [currentScreen, setCurrentScreen] = useState<'list' | 'add'>('list');
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const [reinstateSheetOpen, setReinstateSheetOpen] = useState(false);
  const [selectedTaskForReinstate, setSelectedTaskForReinstate] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLoginSuccess = (name: string) => {
    setUserName(name);
    setIsAuthenticated(true);
  };

  const handleToggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed }
        : todo
    ));
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const handleCompletedTaskClick = (id: string) => {
    const task = todos.find(t => t.id === id);
    // Only show reinstate sheet if task is completed and has a deadline
    if (task?.completed && task?.date) {
      setSelectedTaskForReinstate(id);
      setReinstateSheetOpen(true);
    }
  };

  const handleAddNewDeadline = () => {
    // Move task back to pending and open AddTaskScreen to edit/add new deadline
    if (selectedTaskForReinstate) {
      setTodos(prev => prev.map(todo => 
        todo.id === selectedTaskForReinstate 
          ? { ...todo, completed: false }
          : todo
      ));
      setReinstateSheetOpen(false);
      setSelectedTaskForReinstate(null);
      setCurrentScreen('add');
      setActiveTab('pending');
    }
  };

  const handleRemoveDeadline = () => {
    // Move task back to pending and remove deadline, then go back to homepage
    if (selectedTaskForReinstate) {
      setTodos(prev => prev.map(todo => 
        todo.id === selectedTaskForReinstate 
          ? { ...todo, completed: false, date: undefined }
          : todo
      ));
      setReinstateSheetOpen(false);
      setSelectedTaskForReinstate(null);
      setCurrentScreen('list');
      setActiveTab('pending');
    }
  };

  const handleSort = (sortType: 'time' | 'type' | 'missed' | 'priority') => {
    setTodos(prev => {
      const sorted = [...prev].sort((a, b) => {
        switch (sortType) {
          case 'time': {
            const aTime = a.date ? new Date(a.date).getTime() : 0;
            const bTime = b.date ? new Date(b.date).getTime() : 0;
            return bTime - aTime;
          }
          case 'type': {
            const categoryOrder: Record<string, number> = { 'Work': 0, 'Personal': 1 };
            const aOrder = a.category !== undefined ? (categoryOrder[a.category] ?? 2) : 2;
            const bOrder = b.category !== undefined ? (categoryOrder[b.category] ?? 2) : 2;
            if (aOrder !== bOrder) return aOrder - bOrder;
            return (a.category ?? '').localeCompare(b.category ?? '');
          }
          case 'missed':
            if (a.missed && !b.missed) return -1;
            if (!a.missed && b.missed) return 1;
            return 0;
          case 'priority': {
            const priorityOrder: Record<string, number> = { 'High': 0, 'Medium': 1, 'Low': 2 };
            return (priorityOrder[a.priority ?? ''] ?? 3) - (priorityOrder[b.priority ?? ''] ?? 3);
          }
          default:
            return 0;
        }
      });
      return sorted;
    });
  };

  const handleShowAddTask = () => {
    setCurrentScreen('add');
  };

  const handleBackToList = () => {
    setCurrentScreen('list');
  };

  const handleCreateTask = (taskData: {
    title: string;
    type?: 'Work' | 'Home' | 'Random';
    priority?: 'High' | 'Medium' | 'Low';
    month?: string;
    date?: string;
    time?: string;
  }) => {
    const newTask: TodoItem = {
      id: Date.now().toString(),
      text: taskData.title,
      completed: false,
      missed: false,
      // Only include date if all date components are provided
      ...(taskData.date && taskData.month && taskData.time && {
        date: `${taskData.date} ${taskData.month}, Mon, ${taskData.time}`
      }),
      // Only include category if provided
      ...(taskData.type && { category: taskData.type }),
      // Only include priority if provided
      ...(taskData.priority && { priority: taskData.priority })
    };
    
    setTodos(prev => [newTask, ...prev]);
    setCurrentScreen('list');
    setActiveTab('pending');
  };

  // Separate todos into pending and completed
  const pendingTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  // Group todos by date
  const groupTodosByDate = (todoList: TodoItem[]) => {
    const groups: { [key: string]: { label: string; sortKey: string; todos: TodoItem[] } } = {};
    
    todoList.forEach(todo => {
      const { label, sortKey } = getDateLabel(todo.date);
      
      if (!groups[sortKey]) {
        groups[sortKey] = { label, sortKey, todos: [] };
      }
      groups[sortKey].todos.push(todo);
    });
    
    // Sort groups by sortKey (Today first, then Yesterday, then other dates)
    return Object.values(groups).sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  };

  const groupedPendingTodos = useMemo(() => groupTodosByDate(pendingTodos), [pendingTodos]);
  const groupedCompletedTodos = useMemo(() => groupTodosByDate(completedTodos), [completedTodos]);

  if (!isAuthenticated) {
    return (
      <div className="bg-white overflow-clip relative rounded-[16px] size-full min-w-[360px] max-w-[800px] w-full mx-auto">
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className="bg-[rgb(255,255,255)] overflow-hidden relative rounded-[16px] h-screen min-w-[360px] max-w-[800px] w-full mx-auto">
      {/* Main list screen - always rendered */}
      <div className="h-full flex flex-col bg-white">
            <Header userName={userName} onSort={handleSort} />
            
            {/* Tabs Section */}
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'pending' | 'completed')} className="flex-1 flex flex-col w-full px-4 sm:px-6 md:px-8 overflow-hidden max-w-[800px] mx-auto">
              <TabsList className="grid w-full grid-cols-2 mb-2 h-auto p-0 bg-transparent border-0">
                <TabsTrigger 
                  value="pending" 
                  className="relative data-[state=active]:bg-purple-50 data-[state=inactive]:bg-white rounded-none border-0 border-b-[1.6px] border-solid data-[state=active]:[border-bottom-color:#8e1ffd] data-[state=inactive]:[border-bottom-color:#cecece] py-3.5 px-10 font-['Inter:Medium',_sans-serif] text-[12.25px] tracking-[-0.0179px] data-[state=active]:text-neutral-950 data-[state=inactive]:text-neutral-950"
                >
                  <div className="flex items-center gap-1">
                    <span>Pending</span>
                    {pendingTodos.length > 0 && (
                      <span className="bg-[#8e1ffd] text-white text-[10.5px] font-['Inter:Medium',_sans-serif] rounded-full px-1.5 py-0.5 leading-[14px] tracking-[0.0923px]">
                        {pendingTodos.length}
                      </span>
                    )}
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="completed" 
                  className="relative data-[state=active]:bg-purple-50 data-[state=inactive]:bg-white rounded-none border-0 border-b-[1.6px] border-solid data-[state=active]:border-b-[#8e1ffd] data-[state=inactive]:border-b-[#cecece] py-3.5 px-[33px] font-['Inter:Medium',_sans-serif] text-[12.25px] tracking-[-0.0179px] data-[state=active]:text-neutral-950 data-[state=inactive]:text-neutral-950"
                >
                  <div className="flex items-center gap-1">
                    <span>Completed</span>
                    {completedTodos.length > 0 && (
                      <span className="bg-[#cecece] text-white text-[10.5px] font-['Inter:Medium',_sans-serif] rounded-full px-1.5 py-0.5 leading-[14px] tracking-[0.0923px]">
                        {completedTodos.length}
                      </span>
                    )}
                  </div>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="mt-4 flex-1 overflow-y-auto pb-24">
                <div className="relative w-full max-w-[600px] mx-auto">
                  <div className="flex flex-col items-center relative w-full">
                    <div className="box-border content-stretch flex flex-col gap-[16px] items-center justify-start py-0 relative w-full">
                      {pendingTodos.length === 0 ? (
                        <div className="w-full flex flex-col items-center justify-center py-12 text-center">
                          <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                            <Check size={32} className="text-gray-400" />
                          </div>
                          <p className="text-gray-500 font-medium">No pending tasks</p>
                          <p className="text-gray-400 text-sm mt-1">All caught up!</p>
                        </div>
                      ) : (
                        groupedPendingTodos.map((group, groupIndex) => (
                          <div key={group.sortKey} className="content-stretch flex flex-col gap-[16px] items-start w-full">
                            {/* Date Divider */}
                            <DateDivider label={group.label} />
                            
                            {/* Todos for this date */}
                            {group.todos.map((todo, index) => (
                              <motion.div
                                key={todo.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ delay: (groupIndex * 0.1) + (index * 0.05) }}
                                className="w-full"
                              >
                                <TodoItem 
                                  todo={todo} 
                                  onToggle={handleToggleTodo}
                                  onDelete={handleDeleteTodo}
                                  onCompletedClick={handleCompletedTaskClick}
                                />
                              </motion.div>
                            ))}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="completed" className="mt-4 flex-1 overflow-y-auto pb-24">
                <div className="relative w-full max-w-[600px] mx-auto">
                  <div className="flex flex-col items-center relative w-full">
                    <div className="box-border content-stretch flex flex-col gap-[16px] items-center justify-start py-0 relative w-full">
                      {completedTodos.length === 0 ? (
                        <div className="w-full flex flex-col items-center justify-center py-12 text-center">
                          <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                            <AlertCircle size={32} className="text-gray-400" />
                          </div>
                          <p className="text-gray-500 font-medium">No completed tasks</p>
                          <p className="text-gray-400 text-sm mt-1">Start checking off your tasks!</p>
                        </div>
                      ) : (
                        groupedCompletedTodos.map((group, groupIndex) => (
                          <div key={group.sortKey} className="content-stretch flex flex-col gap-[16px] items-start w-full">
                            {/* Date Divider */}
                            <DateDivider label={group.label} />
                            
                            {/* Todos for this date */}
                            {group.todos.map((todo, index) => (
                              <motion.div
                                key={todo.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ delay: (groupIndex * 0.1) + (index * 0.05) }}
                                className="w-full"
                              >
                                <TodoItem 
                                  todo={todo} 
                                  onToggle={handleToggleTodo}
                                  onDelete={handleDeleteTodo}
                                  onCompletedClick={handleCompletedTaskClick}
                                />
                              </motion.div>
                            ))}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <FloatingActionButton onClick={handleShowAddTask} />
      </div>

      {/* Add Task Screen - overlay with slide up animation */}
      <AnimatePresence>
        {currentScreen === 'add' && (
          <AddTaskScreen
            key="add"
            onBack={handleBackToList}
            onCreateTask={handleCreateTask}
          />
        )}
      </AnimatePresence>

      {/* Reinstate Task Sheet */}
      <ReinstateTaskSheet
        isOpen={reinstateSheetOpen}
        onClose={() => {
          setReinstateSheetOpen(false);
          setSelectedTaskForReinstate(null);
        }}
        onAddNewDeadline={handleAddNewDeadline}
        onRemoveDeadline={handleRemoveDeadline}
        taskTitle={selectedTaskForReinstate ? todos.find(t => t.id === selectedTaskForReinstate)?.text || '' : ''}
      />
    </div>
  );
}