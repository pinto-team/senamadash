// src/app/routes/router.tsx
import { createBrowserRouter } from 'react-router-dom'

import AppRoot from '@/app/App'
import { ROUTES } from '@/app/routes/routes'
import LoginPage from '@/features/auth/pages/LoginPage'
import DashboardPage from '@/features/dashboard/pages/DashboardPage'
import { PartnersManagementPage } from '@/features/partners/pages/PartnersManagementPage'

import NotFound from './NotFound'
import ProtectedRoute from './ProtectedRoute'

export const router = createBrowserRouter([
    {
        path: ROUTES.ROOT,
        element: <AppRoot />,
        children: [
            {
                element: <ProtectedRoute />,
                children: [
                    { index: true, element: <DashboardPage /> },
                    { path: ROUTES.DASHBOARD, element: <DashboardPage /> },
                    { path: ROUTES.PARTNER.LIST, element: <PartnersManagementPage /> },
                ],
            },
            { path: ROUTES.LOGIN, element: <LoginPage /> },
            { path: '*', element: <NotFound /> },
        ],
    },
])
