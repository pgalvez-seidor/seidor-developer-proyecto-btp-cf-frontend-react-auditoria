import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './custom-dialog.module.css';
import { Text } from '@ui5/webcomponents-react';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  closeOnOutsideClick?: boolean;
  closeOnEsc?: boolean;
  header: React.ReactNode;
  footer: React.ReactNode;
}

const CustomDialog = ({
  open,
  onClose,
  children,
  className = '',
  style,
  closeOnOutsideClick = false,
  closeOnEsc = true,
  header,
  footer,
}: DialogProps) => {
  const [isMounted, setIsMounted] = useState(open);

  useEffect(() => {
    setIsMounted(open);
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (closeOnEsc && e.key === 'Escape') {
        // onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, closeOnEsc, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : 'unset';
  }, [open]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOutsideClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isMounted) return null;

  return createPortal(
    <div
      className={`${styles.dialogOverlay} ${open ? styles.open : ''}`}
      onClick={handleOverlayClick}
      role='dialog'
      aria-modal='true'
    >
      <div
        className={`${styles.dialogContent} ${className} ${open ? styles.open : ''}`}
        style={style}
        role='document'
      >
        <header className={styles.dialogHeader}>
          <Text className={styles.dialogTitle}>{header}</Text>
        </header>
        <main
          className={styles.dialogBody}
        >
          {children}
        </main>
        <footer
          className={styles.dialogFooter}
        >
          {footer}
        </footer>
      </div>
    </div>,
    document.body,
  );
};

export default CustomDialog;
