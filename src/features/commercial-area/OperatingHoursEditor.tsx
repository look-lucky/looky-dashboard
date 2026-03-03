import React, { useState, useEffect } from 'react';

// Type definitions for the complex JSON structure
type TimeRange = [string, string];
type DailySchedule = [TimeRange | null, TimeRange | null] | null;

// The structure expected by the backend
export type OperatingHoursData = {
    [key in '0' | '1' | '2' | '3' | '4' | '5' | '6']: DailySchedule;
};

interface OperatingHoursEditorProps {
    value: string;
    onChange: (value: string) => void;
}

const DAYS = ['월', '화', '수', '목', '금', '토', '일'];

const DEFAULT_TIME = '09:00';
const DEFAULT_END_TIME = '22:00';
const DEFAULT_BREAK_START = '15:00';
const DEFAULT_BREAK_END = '17:00';

export const OperatingHoursEditor: React.FC<OperatingHoursEditorProps> = ({ value, onChange }) => {
    // We maintain a local state that matches the parsed structure to easily render the UI
    const [schedule, setSchedule] = useState<OperatingHoursData>(() => {
        try {
            if (!value) throw new Error("Empty value");
            const parsed = JSON.parse(value);
            // Basic validation
            if (typeof parsed !== 'object' || parsed === null) throw new Error("Invalid object structure");
            return parsed;
        } catch (e) {
            // Provide a default empty structure if parsing fails or value is empty
            return {
                '0': null, '1': null, '2': null, '3': null, '4': null, '5': null, '6': null
            };
        }
    });

    // Whenever internal schedule changes, stringify and call onChange
    useEffect(() => {
        onChange(JSON.stringify(schedule));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [schedule]);

    const updateDay = (dayIndex: number, newSchedule: DailySchedule) => {
        setSchedule(prev => ({
            ...prev,
            [dayIndex.toString()]: newSchedule
        }));
    };

    const handleToggleClosed = (dayIndex: number, isClosed: boolean) => {
        if (isClosed) {
            updateDay(dayIndex, null);
        } else {
            // Open with default hours, no break
            updateDay(dayIndex, [[DEFAULT_TIME, DEFAULT_END_TIME], null]);
        }
    };

    const handleToggleBreak = (dayIndex: number, hasBreak: boolean, currentSchedule: DailySchedule) => {
        if (!currentSchedule) return; // Should not happen if UI is rendering correctly
        const [operating,] = currentSchedule;
        if (hasBreak) {
            updateDay(dayIndex, [operating, [DEFAULT_BREAK_START, DEFAULT_BREAK_END]]);
        } else {
            updateDay(dayIndex, [operating, null]);
        }
    };

    const handleTimeChange = (
        dayIndex: number,
        type: 'operating' | 'break',
        bound: 'start' | 'end',
        timeStr: string,
        currentSchedule: DailySchedule
    ) => {
        if (!currentSchedule) return;
        const [operating, breakTime] = currentSchedule;

        let newOperating = operating;
        let newBreak = breakTime;

        if (type === 'operating' && operating) {
            const newStart = bound === 'start' ? timeStr : operating[0];
            const newEnd = bound === 'end' ? timeStr : operating[1];
            newOperating = [newStart, newEnd];
        } else if (type === 'break' && breakTime) {
            const newStart = bound === 'start' ? timeStr : breakTime[0];
            const newEnd = bound === 'end' ? timeStr : breakTime[1];
            newBreak = [newStart, newEnd];
        }

        updateDay(dayIndex, [newOperating, newBreak]);
    };

    // Helper to render a common time input
    const TimeInput = ({
        val,
        onChange
    }: {
        val: string,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    }) => (
        <input
            type="time"
            value={val || ''}
            onChange={onChange}
            className="p-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none w-[110px]"
        />
    );

    return (
        <div className="flex flex-col gap-3 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-sm p-4 text-sm">
            <div className="grid grid-cols-[40px_1fr] md:grid-cols-[60px_1fr] gap-4 items-center mb-2 pb-2 border-b border-gray-100 font-medium text-gray-700">
                <div className="text-center">요일</div>
                <div>설정</div>
            </div>

            {DAYS.map((dayLabel, idx) => {
                const dayKey = idx.toString() as keyof OperatingHoursData;
                const dailyData = schedule[dayKey];
                const isClosed = dailyData === null;
                const hasBreak = !isClosed && dailyData[1] !== null;

                return (
                    <div key={idx} className="grid grid-cols-[40px_1fr] md:grid-cols-[60px_1fr] gap-4 items-start py-2 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors rounded">
                        <div className="text-center font-medium mt-1.5">{dayLabel}</div>
                        <div className="flex flex-col gap-2">
                            {/* Row 1: Open/Close Toggle & Operating Hours */}
                            <div className="flex flex-wrap items-center gap-3">
                                <label className="flex items-center cursor-pointer gap-1.5 select-none w-16">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        checked={isClosed}
                                        onChange={(e) => handleToggleClosed(idx, e.target.checked)}
                                    />
                                    <span className="text-gray-600">휴무</span>
                                </label>

                                {!isClosed && dailyData && dailyData[0] && (
                                    <div className="flex items-center gap-2">
                                        <TimeInput
                                            val={dailyData[0][0]}
                                            onChange={(e) => handleTimeChange(idx, 'operating', 'start', e.target.value, dailyData)}
                                        />
                                        <span className="text-gray-400">~</span>
                                        <TimeInput
                                            val={dailyData[0][1]}
                                            onChange={(e) => handleTimeChange(idx, 'operating', 'end', e.target.value, dailyData)}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Row 2: Break Time Settings (only if not closed) */}
                            {!isClosed && dailyData && (
                                <div className="flex flex-wrap items-center gap-3 pl-0 md:pl-[76px] mt-1">
                                    <label className="flex items-center cursor-pointer gap-1.5 select-none w-24">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                            checked={hasBreak}
                                            onChange={(e) => handleToggleBreak(idx, e.target.checked, dailyData)}
                                        />
                                        <span className="text-gray-600 text-xs">브레이크 타임</span>
                                    </label>

                                    {hasBreak && dailyData[1] && (
                                        <div className="flex items-center gap-2">
                                            <TimeInput
                                                val={dailyData[1][0]}
                                                onChange={(e) => handleTimeChange(idx, 'break', 'start', e.target.value, dailyData)}
                                            />
                                            <span className="text-gray-400 text-xs">~</span>
                                            <TimeInput
                                                val={dailyData[1][1]}
                                                onChange={(e) => handleTimeChange(idx, 'break', 'end', e.target.value, dailyData)}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
