import React, { useState } from 'react';
import { SnackbarContext } from './SnackbarContext';
import { SnackbarState } from '../../types/Snackbar';
import { initialSnackbarState } from './initialState';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [snackbarState, setSnackbar] = useState<SnackbarState>(initialSnackbarState);

  const setSnackbarState = (
    title: string,
    content: string,
    type: 'SUCCESS' | 'ERROR' | 'WARNING',
    textoCopy = '',
  ) => {
    setSnackbar({ title, content, open: true, type, textoCopy });

    // Lanzar elegant sweetalert notification
    if (type === 'SUCCESS') {
      MySwal.fire({
        title: title,
        text: content,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#1d2d3e',
        background: '#fff',
        customClass: {
          popup: '!tw-rounded-[24px] tw-shadow-2xl',
          title: 'tw-text-xl tw-font-bold',
          confirmButton: '!tw-rounded-full !tw-px-6 !tw-py-2 tw-font-bold text-white',
        },
      });
      // toast.success(title, { description: content }); // old sonner alternative
    } else if (type === 'ERROR') {
      MySwal.fire({
        title: title,
        text: content,
        icon: 'error',
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#e02424', // Red-600
        background: '#fff',
        customClass: {
          popup: '!tw-rounded-[24px] tw-shadow-2xl',
          title: 'tw-text-xl tw-font-bold',
          confirmButton: '!tw-rounded-full !tw-px-6 !tw-py-2 tw-font-bold text-white',
        },
      });
    } else {
      MySwal.fire({
        title: title,
        text: content,
        icon: 'warning',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#eab308', // Yellow-500
        background: '#fff',
        customClass: {
          popup: '!tw-rounded-[24px] tw-shadow-2xl',
          title: 'tw-text-xl tw-font-bold',
          confirmButton: '!tw-rounded-full !tw-px-6 !tw-py-2 tw-font-bold text-white',
        },
      });
    }
  };

  const setSnackbarStateForce = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <SnackbarContext.Provider
      value={{ snackbarState, setSnackbarState, setSnackbarStateForce }}
    >
      <style>
        {`
          .swal2-popup {
            border-radius: 24px !important;
          }
          .swal2-styled {
            border-radius: 9999px !important;
          }
        `}
      </style>
      {children}
    </SnackbarContext.Provider>
  );
};
