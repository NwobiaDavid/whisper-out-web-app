/* eslint-disable no-unused-vars */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { NextUIProvider } from '@nextui-org/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import ProtectedRoute from './ProtectedRoute.tsx';
import { AuthProvider } from './config/AuthContext.tsx';

import './index.css';
import store from './state/store.ts';

import SplashScreen from './screens/SplashScreen.tsx';
import SignupPage from './screens/SignupPage.tsx';

import ConfirmationPage from './screens/ConfirmationPage.tsx';
import FinishSignUp from './screens/FinishSignUp.tsx';
import Home from './screens/Home.tsx';
// import ThemeManager from './components/ThemeManager.tsx';
import CompanyEntry from './screens/CompanyEntry.tsx';
import UsersInterests from './screens/UsersInterests.tsx';
import ForgotPassword from './screens/ForgotPassword.tsx';
import Homepage from './screens/dashboard/Homepage.tsx';
import VerifyEmailPage from './screens/VerifyEmailPage.tsx';
import WaitingPage from './screens/WaitingPage.tsx';


createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <NextUIProvider>
        <AuthProvider>
              <Routes>
                <Route path="/" element={<SplashScreen />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/confirmation" element={<ConfirmationPage />} />
                <Route path="/finishSignUp" element={<FinishSignUp />} />
                <Route path="/company-entry" element={<CompanyEntry />} />
                <Route path="/interests" element={<UsersInterests />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/waiting-page" element={<WaitingPage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                {/* Protect home route */}
                <Route path="/home/*" 
                  element={
                    <ProtectedRoute>
                      <Homepage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
        </AuthProvider>
        </NextUIProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
