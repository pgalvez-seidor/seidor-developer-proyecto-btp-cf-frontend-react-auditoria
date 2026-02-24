import { ThemeProvider } from '@ui5/webcomponents-react';
import { HashRouter } from 'react-router-dom';
import { LoadingProvider } from './contexts/LoadingContext/LoadingProvider';
import { SnackbarProvider } from './contexts/SnackbarContext/SnackbarProvider';
import { AuditoriaProvider } from './contexts/AuditoriaContext/AuditoriaContext';
import { Auditoria } from './pages/Auditoria/Auditoria';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <LoadingProvider>
          <SnackbarProvider>
            <AuditoriaProvider>
              <Auditoria />
            </AuditoriaProvider>
          </SnackbarProvider>
        </LoadingProvider>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
