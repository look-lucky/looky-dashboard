import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../widgets/layout/DashboardLayout';
import { HomePage } from '../pages/HomePage';
import { StoreReviewPage } from '../pages/StoreReviewPage';
import { CommercialAreaPage } from '../pages/CommercialAreaPage';
import { PartnershipPage } from '../pages/PartnershipPage';
import { UniversityOrgPage } from '../pages/UniversityOrgPage';
import { EventPage } from '../pages/EventPage';
import { LoginPage } from '../pages/LoginPage';
import { StoreImportPage } from '../features/stores/StoreImportPage';
import { AuthGuard } from '../widgets/auth/AuthGuard';
import { UniversityProvider } from '../shared/contexts/UniversityContext';
import { UniversityLayout } from '../widgets/layout/UniversityLayout';
//
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route element={<AuthGuard />}>
                    <Route path="/" element={<DashboardLayout />}>
                        <Route index element={<HomePage />} />
                        <Route path="universities" element={<UniversityOrgPage />} />
                        <Route path="reviews" element={<StoreReviewPage />} />

                        <Route element={
                            <UniversityProvider>
                                <UniversityLayout />
                            </UniversityProvider>
                        }>
                            <Route path="events" element={<EventPage />} />
                            <Route path="partnerships" element={<PartnershipPage />} />
                            <Route path="commercial-areas" element={<CommercialAreaPage />} />
                            <Route path="commercial-areas/import" element={<StoreImportPage />} />
                        </Route>
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
