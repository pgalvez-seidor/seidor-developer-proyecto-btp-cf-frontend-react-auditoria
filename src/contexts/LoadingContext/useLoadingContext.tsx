import { useContext } from 'react';
import { LoadingContext } from './LoadingContext';

export const useLoadingContext = () => {
  const context = useContext(LoadingContext);
  if (!context)
    throw new Error('useAppContext must be used within DataProvider para Loading');
  return context;
};
