import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { NextUIProvider } from '@nextui-org/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import './index.css';
import store from './state/store.js';

import SplashScreen from './screens/SplashScreen.jsx';
import SignupPage from './screens/SignupPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <NextUIProvider>
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </NextUIProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
