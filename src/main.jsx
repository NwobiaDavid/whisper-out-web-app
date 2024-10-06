/* eslint-disable no-unused-vars */
import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { NextUIProvider } from '@nextui-org/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import ProtectedRoute from './ProtectedRoute.jsx';
import { AuthProvider, AuthContext } from './config/AuthContext.jsx';

import './index.css';
import store from './state/store.js';

import SplashScreen from './screens/SplashScreen.jsx';
import SignupPage from './screens/SignupPage.jsx';
import ConfirmationPage from './screens/ConfirmationPage';
import FinishSignUp from './screens/FinishSignUp';
import Home from './screens/Home';
import ThemeManager from './components/ThemeManager.jsx';
import CompanyEntry from './screens/CompanyEntry.jsx';

// const ThemeManager = ({ children }) => {
//   const darkMode = useSelector((state) => state.theme.darkMode);

//   useEffect(() => {
//     if (darkMode) {
//       document.documentElement.classList.add('dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//     }
//   }, [darkMode]);

//   return children;
// };

createRoot(document.getElementById('root')).render(
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
                <Route path="/companyentry" element={<CompanyEntry />} />
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
