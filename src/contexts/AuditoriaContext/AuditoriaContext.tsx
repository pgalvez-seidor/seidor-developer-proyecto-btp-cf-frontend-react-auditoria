import { createContext, useState, ReactNode } from 'react';

interface IAuditoriaContext {
  tableAuditoria: any[];
  setTableAuditoria: (data: any[]) => void;
  oPaginationTableAuditoria: {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
  setoPaginationTableAuditoria: (pagination: any) => void;
  page: number;
  setPage: (page: number) => void;
}

export const AuditoriaContext = createContext<IAuditoriaContext>({
  tableAuditoria: [],
  setTableAuditoria: () => {},
  oPaginationTableAuditoria: {
    currentPage: 1,
    perPage: 20,
    totalItems: 0,
    totalPages: 1,
  },
  setoPaginationTableAuditoria: () => {},
  page: 1,
  setPage: () => {},
});

interface IAuditoriaProviderProps {
  children: ReactNode;
}

export const AuditoriaProvider = ({ children }: IAuditoriaProviderProps) => {
  const [tableAuditoria, setTableAuditoria] = useState<any[]>([]);
  const [oPaginationTableAuditoria, setoPaginationTableAuditoria] = useState({
    currentPage: 1,
    perPage: 20,
    totalItems: 0,
    totalPages: 1,
  });
  const [page, setPage] = useState(1);

  return (
    <AuditoriaContext.Provider
      value={{
        tableAuditoria,
        setTableAuditoria,
        oPaginationTableAuditoria,
        setoPaginationTableAuditoria,
        page,
        setPage,
      }}
    >
      {children}
    </AuditoriaContext.Provider>
  );
};
