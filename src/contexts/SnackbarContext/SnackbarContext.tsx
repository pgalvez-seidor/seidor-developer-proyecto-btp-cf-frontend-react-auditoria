import { createContext } from 'react';
import { SnackbarState } from '../../types/Snackbar';

export interface SnackbarContextProps {
  snackbarState: SnackbarState;
  setSnackbarState: (
    title: string,
    content: string,
    type: 'SUCCESS' | 'ERROR' | 'WARNING' | 'INFORMATION',
    textoCopy?: string,
  ) => void;
  setSnackbarStateForce: () => void;
}

export const SnackbarContext = createContext<SnackbarContextProps | undefined>(undefined);
