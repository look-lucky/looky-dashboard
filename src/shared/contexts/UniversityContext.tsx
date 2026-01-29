import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { UniversityResponse } from '../api/models/UniversityResponse';
import { UniversityService } from '../api/services/UniversityService';

interface UniversityContextType {
    universities: UniversityResponse[];
    selectedUniversityId: number | null;
    setSelectedUniversityId: (id: number | null) => void;
    selectedUniversity: UniversityResponse | undefined;
    isLoading: boolean;
}

const UniversityContext = createContext<UniversityContextType | undefined>(undefined);

export function UniversityProvider({ children }: { children: ReactNode }) {
    const [universities, setUniversities] = useState<UniversityResponse[]>([]);
    const [selectedUniversityId, setSelectedUniversityId] = useState<number | null>(() => {
        const saved = localStorage.getItem('selectedUniversityId');
        return saved ? Number(saved) : null;
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchUniversities() {
            try {
                const response = await UniversityService.getUniversities();
                if (response.data) {
                    setUniversities(response.data);
                    // If no selection or invalid selection, select first one
                    if (!selectedUniversityId && response.data.length > 0) {
                        const firstId = response.data[0].id;
                        if (firstId !== undefined) {
                            setSelectedUniversityId(firstId);
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to fetch universities:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchUniversities();
    }, []);

    useEffect(() => {
        if (selectedUniversityId) {
            localStorage.setItem('selectedUniversityId', String(selectedUniversityId));
        }
    }, [selectedUniversityId]);

    const selectedUniversity = universities.find(u => u.id === selectedUniversityId);

    return (
        <UniversityContext.Provider
            value={{
                universities,
                selectedUniversityId,
                setSelectedUniversityId,
                selectedUniversity,
                isLoading
            }}
        >
            {children}
        </UniversityContext.Provider>
    );
}

export function useUniversity() {
    const context = useContext(UniversityContext);
    if (context === undefined) {
        throw new Error('useUniversity must be used within a UniversityProvider');
    }
    return context;
}
