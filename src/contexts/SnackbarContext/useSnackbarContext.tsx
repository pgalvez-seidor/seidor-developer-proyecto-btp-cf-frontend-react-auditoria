import { useContext } from 'react';
import { SnackbarContext } from './SnackbarContext';

export const useSnackbarContext = () => {
  const context = useContext(SnackbarContext);
  if (!context)
    throw new Error('useAppContext must be used within DataProvider para Snackbar');
  return context;
};
