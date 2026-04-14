import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { UniversityResponse } from '../api/models/UniversityResponse';
import { PublicUniversityService } from '../api/services/PublicUniversityService';

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
                const response = await PublicUniversityService.getUniversities();
                if (response.data) {
                    setUniversities(response.data);
                    // If no selection or invalid selection, select first one
                    const isValidSelection = response.data.some(u => u.id === selectedUniversityId);
                    if ((!selectedUniversityId || !isValidSelection) && response.data.length > 0) {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

// eslint-disable-next-line react-refresh/only-export-components
export function useUniversity() {
    const context = useContext(UniversityContext);
    if (context === undefined) {
        throw new Error('useUniversity must be used within a UniversityProvider');
    }
    return context;
}
