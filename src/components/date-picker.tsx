'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { format } from 'date-fns';

const DatePicker: React.FC<{ value: Date | undefined; onChange: (date: Date | undefined) => void; fromYear?: number; toYear?: number }> = ({ value, onChange, fromYear, toYear }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value);
  const [currentMonth, setCurrentMonth] = useState(value || new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  useEffect(() => {
    setSelectedDate(value);
  }, [value]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getYearRange = () => {
    const currentYear = new Date().getFullYear();
    const startYear = fromYear || currentYear - 100;
    const endYear = toYear || currentYear;
    const years: number[] = [];
    for (let i = startYear; i <= endYear; i++) {
      years.push(i);
    }
    return years.reverse();
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const isSameDay = (date1: Date | null, date2: Date) => {
    if (!date1) return false;
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return isSameDay(today, date);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate);
    onChange(newDate);
    setIsOpen(false);
  };

  const handleMonthSelect = (monthIndex: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), monthIndex, 1));
    setShowMonthPicker(false);
  };

  const handleYearSelect = (year: number) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
    setShowYearPicker(false);
  };
  
  const years = getYearRange();
  const days = getDaysInMonth(currentMonth);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal h-auto",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <div className="flex items-center gap-3 w-full group">
                <div className="bg-primary/10 text-primary p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-xs text-muted-foreground font-medium mb-1">Date of Birth</div>
                  <div className="text-base font-semibold text-foreground">
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </div>
                </div>
                <ChevronDown className={`ml-auto w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
              </div>
          </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="w-full max-w-md">
            <div className="bg-primary text-primary-foreground p-4 rounded-t-lg">
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setShowMonthPicker(!showMonthPicker); setShowYearPicker(false); }}
                    className="px-4 py-2 hover:bg-white/20 rounded-lg transition-colors duration-200 flex items-center gap-1"
                  >
                    <span className="font-bold text-base">
                      {monthNames[currentMonth.getMonth()]}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showMonthPicker ? 'rotate-180' : ''}`} />
                  </button>
                  <button
                    onClick={() => { setShowYearPicker(!showYearPicker); setShowMonthPicker(false); }}
                    className="px-4 py-2 hover:bg-white/20 rounded-lg transition-colors duration-200 flex items-center gap-1"
                  >
                    <span className="font-bold text-base">
                      {currentMonth.getFullYear()}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showYearPicker ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                <button
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              {!showMonthPicker && !showYearPicker && (
                <div className="grid grid-cols-7 gap-1">
                  {dayNames.map(day => (
                    <div key={day} className="text-center text-primary-foreground/70 text-xs font-semibold py-2">
                      {day}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4">
              {showMonthPicker && (
                <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                  {monthNames.map((month, index) => (
                    <button
                      key={month}
                      onClick={() => handleMonthSelect(index)}
                      className={`py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 ${currentMonth.getMonth() === index ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-gray-50 text-gray-700 hover:bg-primary/10 hover:text-primary' } hover:scale-105 active:scale-95`}
                    >
                      {month}
                    </button>
                  ))}
                </div>
              )}

              {showYearPicker && (
                <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                  {years.map(year => (
                    <button
                      key={year}
                      onClick={() => handleYearSelect(year)}
                      className={`py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 ${currentMonth.getFullYear() === year ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-gray-50 text-gray-700 hover:bg-primary/10 hover:text-primary'} hover:scale-105 active:scale-95`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              )}

              {!showMonthPicker && !showYearPicker && (
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, index) => {
                    if (day === null) {
                      return <div key={`empty-${index}`} className="aspect-square" />;
                    }
                    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                    const isSelected = isSameDay(selectedDate, date);
                    const isTodayDate = isToday(date);
                    return (
                      <button
                        key={day}
                        onClick={() => handleDateClick(day)}
                        className={`aspect-square rounded-xl font-medium text-sm transition-all duration-200 ${isSelected ? 'bg-primary text-white shadow-lg scale-105 ring-4 ring-primary/20' : isTodayDate ? 'bg-accent text-accent-foreground hover:bg-accent/80' : 'text-gray-700 hover:bg-gray-100'} hover:scale-105 active:scale-95`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 p-4 bg-gray-50 rounded-b-lg">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    const today = new Date();
                    setSelectedDate(today);
                    onChange(today);
                    setCurrentMonth(today);
                    setShowMonthPicker(false);
                    setShowYearPicker(false);
                    setIsOpen(false);
                  }}
                  className="flex-1"
                >
                  Today
                </Button>
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    setShowMonthPicker(false);
                    setShowYearPicker(false);
                  }}
                  className="flex-1"
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
