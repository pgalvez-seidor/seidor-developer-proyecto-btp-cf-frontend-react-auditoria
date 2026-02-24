import { createContext } from 'react';
import { LoadingState } from '../../types/Loading';

export interface LoadingContextProps {
  loadingState: LoadingState;
  setLoadingState: (open: boolean) => void;
}

export const LoadingContext = createContext<LoadingContextProps | undefined>(undefined);
