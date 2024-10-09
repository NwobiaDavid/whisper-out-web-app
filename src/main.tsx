/* eslint-disable no-unused-vars */
import React, { StrictMode, useEffect } from 'react';
import ReactDOM, { createRoot } from 'react-dom/client';
import { NextUIProvider } from '@nextui-org/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import ProtectedRoute from './ProtectedRoute.tsx';
import { AuthProvider, AuthContext } from './config/AuthContext.tsx';

import './index.css';
import store from './state/store.ts';

import SplashScreen from './screens/SplashScreen.tsx';
import SignupPage from './screens/SignupPage.tsx';

import ConfirmationPage from './screens/ConfirmationPage.tsx';
import FinishSignUp from './screens/FinishSignUp.tsx';
import Home from './screens/Home.tsx';
// import ThemeManager from './components/ThemeManager.tsx';
import CompanyEntry from './screens/CompanyEntry.tsx';
import CompanyInterests from './screens/CompanyInterests.tsx';


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
                <Route path="/company-interests" element={<CompanyInterests />} />
                {/* Protect home route */}
                <Route path="/home" 
                  element={
                    <ProtectedRoute>
                      <Home />
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
