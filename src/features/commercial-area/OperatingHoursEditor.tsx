import React, { useState, useEffect } from 'react';

type TimeRange = [string, string];
type DailySchedule = [TimeRange | null, TimeRange | null] | null;

export type OperatingHoursData = {
    [key in '0' | '1' | '2' | '3' | '4' | '5' | '6']: DailySchedule;
};

interface OperatingHoursEditorProps {
    value: string;
    onChange: (value: string) => void;
}

const DAYS = ['월', '화', '수', '목', '금', '토', '일'];

const DEFAULT_TIME = '10:00';
const DEFAULT_END_TIME = '22:00';
const DEFAULT_BREAK_START = '15:00';
const DEFAULT_BREAK_END = '17:00';

const generateDefaultDay = (): DailySchedule => [[DEFAULT_TIME, DEFAULT_END_TIME], null];

export const OperatingHoursEditor: React.FC<OperatingHoursEditorProps> = ({ value, onChange }) => {
    // Determine global break time based on initial value or default false
    const [globalHasBreak, setGlobalHasBreak] = useState(() => {
        try {
            if (!value) return false;
            const parsed = JSON.parse(value);
            if (typeof parsed !== 'object' || parsed === null || Object.keys(parsed).length === 0) return false;
            for (let i = 0; i < 7; i++) {
                const day = parsed[i.toString()];
                if (day && day[1]) {
                    return true;
                }
            }
        } catch (e) {
            // Ignore parse errors here
        }
        return false;
    });

    const [schedule, setSchedule] = useState<OperatingHoursData>(() => {
        try {
            if (!value) throw new Error("Empty value");
            const parsed = JSON.parse(value);
            if (typeof parsed !== 'object' || parsed === null || Object.keys(parsed).length === 0) throw new Error("Empty object");
            return parsed;
        } catch (e) {
            // Default: Every day is open, no break time
            return {
                '0': generateDefaultDay(),
                '1': generateDefaultDay(),
                '2': generateDefaultDay(),
                '3': generateDefaultDay(),
                '4': generateDefaultDay(),
                '5': generateDefaultDay(),
                '6': generateDefaultDay(),
            };
        }
    });

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
            updateDay(dayIndex, [
                [DEFAULT_TIME, DEFAULT_END_TIME],
                globalHasBreak ? [DEFAULT_BREAK_START, DEFAULT_BREAK_END] : null
            ]);
        }
    };

    const handleGlobalBreakToggle = (enabled: boolean) => {
        setGlobalHasBreak(enabled);
        setSchedule(prev => {
            const next = { ...prev };
            for (let i = 0; i < 7; i++) {
                const day = next[i.toString() as keyof OperatingHoursData];
                if (day) { // if not closed
                    const [operating, existingBreak] = day;
                    if (enabled) {
                        next[i.toString() as keyof OperatingHoursData] = [
                            operating,
                            existingBreak || [DEFAULT_BREAK_START, DEFAULT_BREAK_END]
                        ];
                    } else {
                        next[i.toString() as keyof OperatingHoursData] = [operating, null];
                    }
                }
            }
            return next;
        });
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

    const TimeInput = ({
        val,
        onChange,
        disabled
    }: {
        val: string,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
        disabled?: boolean
    }) => (
        <input
            type="time"
            value={val || ''}
            onChange={onChange}
            disabled={disabled}
            className={`p-1.5 border border-gray-300 rounded-md text-sm outline-none w-[110px] sm:w-[130px] transition-colors ${disabled ? 'bg-gray-200/60 text-gray-400 cursor-not-allowed border-gray-200' : 'bg-white focus:ring-1 focus:ring-blue-500 hover:border-blue-400'}`}
        />
    );

    return (
        <div className="w-full bg-white border-2 border-blue-500 shadow-sm rounded-lg p-5 font-sans">
            {/* Header Area */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                        <h3 className="text-gray-900 font-bold text-base">영업시간/브레이크타임</h3>
                        <p className="text-xs text-gray-500 mt-0.5">상단: 영업시간, <span className="text-orange-500 font-medium">하단: 브레이크타임</span></p>
                    </div>
                </div>
            </div>

            {/* Global Break Toggle */}
            <div className="mb-6 pl-1">
                <label className="flex items-center cursor-pointer gap-2 select-none w-max">
                    <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        checked={globalHasBreak}
                        onChange={(e) => handleGlobalBreakToggle(e.target.checked)}
                    />
                    <span className="text-sm font-bold text-gray-800 tracking-tight">브레이크타임 있음</span>
                </label>
            </div>

            {/* Daily Schedule List */}
            <div className="flex flex-col gap-4 pl-1">
                {DAYS.map((dayLabel, idx) => {
                    const dayKey = idx.toString() as keyof OperatingHoursData;
                    const dailyData = schedule[dayKey];
                    const isClosed = dailyData === null;

                    // Display values: if closed, fallback to defaults just for visual graying out
                    const operating = dailyData?.[0] || [DEFAULT_TIME, DEFAULT_END_TIME];
                    const breakTime = dailyData?.[1] || [DEFAULT_BREAK_START, DEFAULT_BREAK_END];

                    return (
                        <div key={idx} className="flex items-start gap-4">
                            {/* Day Label */}
                            <div className="w-6 pt-2 font-bold text-gray-900 text-sm shrink-0 text-left">
                                {dayLabel}
                            </div>

                            {/* Time Controls Column */}
                            <div className="flex flex-col gap-2 flex-1">
                                {/* Operating Hours */}
                                <div className="flex items-center space-x-2">
                                    <TimeInput
                                        val={operating[0]}
                                        disabled={isClosed}
                                        onChange={(e) => handleTimeChange(idx, 'operating', 'start', e.target.value, dailyData)}
                                    />
                                    <span className="text-gray-900 font-bold text-lg">~</span>
                                    <TimeInput
                                        val={operating[1]}
                                        disabled={isClosed}
                                        onChange={(e) => handleTimeChange(idx, 'operating', 'end', e.target.value, dailyData)}
                                    />
                                </div>

                                {/* Break Time */}
                                {globalHasBreak && (
                                    <div className="flex items-center space-x-2">
                                        <TimeInput
                                            val={breakTime[0]}
                                            disabled={isClosed}
                                            onChange={(e) => handleTimeChange(idx, 'break', 'start', e.target.value, dailyData)}
                                        />
                                        <span className="text-gray-900 font-bold text-lg">~</span>
                                        <TimeInput
                                            val={breakTime[1]}
                                            disabled={isClosed}
                                            onChange={(e) => handleTimeChange(idx, 'break', 'end', e.target.value, dailyData)}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Closed Toggle Column */}
                            <div className="w-16 shrink-0 flex items-start justify-end pt-2 pr-2">
                                <label className="flex items-center cursor-pointer gap-1.5 select-none">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500 cursor-pointer"
                                        checked={isClosed}
                                        onChange={(e) => handleToggleClosed(idx, e.target.checked)}
                                    />
                                    <span className={`text-sm font-bold ${isClosed ? 'text-gray-900' : 'text-gray-500'}`}>휴무</span>
                                </label>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
