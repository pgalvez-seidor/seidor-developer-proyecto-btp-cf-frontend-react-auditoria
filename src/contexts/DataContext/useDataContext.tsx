import { useContext } from 'react';
import { DataContext } from './DataContext';

export const useDataContext = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error('useAppContext must be used within DataProvider');
    return context;
};
