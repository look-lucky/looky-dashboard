import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../widgets/layout/DashboardLayout';
import { HomePage } from '../pages/HomePage';
import { StoreReviewPage } from '../pages/StoreReviewPage';
import { CommercialAreaPage } from '../pages/CommercialAreaPage';
import { PartnershipPage } from '../pages/PartnershipPage';
import { UniversityPage } from '../pages/UniversityPage';
import { OrganizationPage } from '../pages/OrganizationPage';
import { LoginPage } from '../pages/LoginPage';
import { AuthGuard } from '../widgets/auth/AuthGuard';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route element={<AuthGuard />}>
                    <Route path="/" element={<DashboardLayout />}>
                        <Route index element={<HomePage />} />
                        <Route path="reviews" element={<StoreReviewPage />} />
                        <Route path="commercial-areas" element={<CommercialAreaPage />} />
                        <Route path="partnerships" element={<PartnershipPage />} />
                        <Route path="universities" element={<UniversityPage />} />
                        <Route path="organizations" element={<OrganizationPage />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
