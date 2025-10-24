import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import {AuthProvider} from './Auth/AuthContext';

const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error('Root element not found.');
}

createRoot(rootElement).render(
    <StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </AuthProvider>
    </StrictMode>,
);
