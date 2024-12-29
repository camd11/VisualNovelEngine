import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { languageService } from './services/languageService';

function LoadingFallback() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      color: '#ffd700',
      fontSize: '1.5em'
    }}>
      Loading...
    </div>
  );
}

const root = createRoot(document.getElementById('root')!);

// Initialize language service and render app
const init = async () => {
  // Ensure language service is initialized
  await Promise.resolve(languageService);
  
  root.render(
    <StrictMode>
      <Suspense fallback={<LoadingFallback />}>
        <App />
      </Suspense>
    </StrictMode>
  );
};

init().catch(console.error);
