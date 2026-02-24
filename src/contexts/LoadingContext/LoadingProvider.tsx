import React, { useState } from 'react';
import { LoadingContext } from './LoadingContext';
import { LoadingState } from '../../types/Loading';

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const initialLoadingState: LoadingState = {
    open: null,
  };

  const [loadingState, setLoading] = useState(initialLoadingState);

  const setLoadingState = (open: boolean) => {
    setLoading({
      open: open,
    });

    // setTimeout(() => {
    //   setLoading(initialLoadingState);
    // }, 3000);
  };

  return (
    <LoadingContext.Provider
      value={{
        loadingState,
        setLoadingState,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};
