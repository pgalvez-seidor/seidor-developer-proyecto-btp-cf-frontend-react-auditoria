import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Button, Icon } from '@ui5/webcomponents-react';

// IMPORTANTE: registra los íconos
import '@ui5/webcomponents-icons/dist/slim-arrow-down.js';
import '@ui5/webcomponents-icons/dist/slim-arrow-up.js';

type CollapseWithPinProps = {
  storageKey: string;
  defaultOpen?: boolean;
  className?: string;
  children: React.ReactNode;
  liteHandle?: boolean;
};

const LS_KEY = (k: string) => `collapse:${k}`;

export default function CollapseWithPin({
  storageKey,
  defaultOpen = true,
  className = '',
  children,
  liteHandle = false,
}: CollapseWithPinProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [animating, setAnimating] = useState(false);


  // --- cargar estado persistido
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(LS_KEY(storageKey));
      if (raw) {
        const parsed = JSON.parse(raw);
        setIsOpen(typeof parsed.open === 'boolean' ? parsed.open : defaultOpen);
      } else {
        setIsOpen(defaultOpen);
      }
    } catch (e) {
      console.error(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // --- guardar
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(
        LS_KEY(storageKey),
        JSON.stringify({ open: isOpen }),
      );
    } catch (e) {
      console.error(e);
    }
  }, [isOpen, storageKey]);

  // --- medir altura real
  const measure = useCallback(() => {
    const el = contentRef.current;
    if (!el) return 0;
    // medir sin restricciones
    const prev = el.style.height;
    el.style.height = 'auto';
    const h = el.scrollHeight;
    el.style.height = prev || '';

    return h;
  }, []);

  // medir al montar y cuando cambie contenido
  useLayoutEffect(() => {
    measure();
  }, [children, measure]);

  // recalcular on resize (sin depender de ResizeObserver)
  useEffect(() => {
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [measure]);

  // --- animación con height numérica
  const openWithAnim = () => {
    const el = contentRef.current;
    if (!el) return;
    const target = measure();
    el.style.overflow = 'hidden'; // <- mientras anima
    requestAnimationFrame(() => {
      el.style.height = '0px';
      el.style.transition = 'height 300ms ease';
      requestAnimationFrame(() => {
        el.style.height = `${target}px`;
      });
    });
  };

  const closeWithAnim = () => {
    const el = contentRef.current;
    if (!el) return;
    const current = el.getBoundingClientRect().height || measure();
    el.style.height = `${current}px`;
    el.style.overflow = 'hidden'; // <- mantener
    el.style.transition = 'height 300ms ease';
    requestAnimationFrame(() => {
      el.style.height = '0px';
    });
  };

  // 3) en handleTransitionEnd, NO limpies overflow cuando esté cerrado
  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== 'height') return;
    const el = contentRef.current;
    if (!el) return;
    el.style.transition = '';

    if (isOpen) {
      el.style.height = 'auto';
      el.style.overflow = ''; // <- abierto: restaurar
    } else {
      el.style.height = '0px';
      el.style.overflow = 'hidden'; // <- cerrado: mantener hidden
    }
    setAnimating(false);
  };

  const toggleOpen = () => {
    if (animating) return;
    if (isOpen) {
      setIsOpen(false);
      closeWithAnim();
    } else {
      setIsOpen(true);
      openWithAnim();
    }
  };



  // 4) estado inicial coherente (también setea overflow)
  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    if (isOpen) {
      el.style.height = 'auto';
      el.style.overflow = '';
      measure();
    } else {
      el.style.height = '0px';
      el.style.overflow = 'hidden'; // <- importante al montar
    }
  }, [isOpen, measure]);

  return (
    <div
      ref={wrapperRef}
      className={`
        tw-relative tw-w-full tw-overflow-visible
        ${className}
        tw-z-10
      `}
    >
      <div
        ref={contentRef}
        className={`section-filters ${!isOpen ? 'tw-overflow-hidden' : ''}`}
        onTransitionEnd={handleTransitionEnd}
        style={{ willChange: 'height' }}
      >
        {children}
      </div>

      {/* manija centrada, con z-index alto */}
      <div
        className={`
          tw-absolute tw-left-1/2 -tw-translate-x-1/2
          ${liteHandle ? 'tw-bottom-[-20px]' : 'tw-bottom-[-18px] md:tw-bottom-[-20px]'}
          tw-flex tw-items-center tw-gap-2 tw-z-40 pointer-events-auto
        `}
      >
        <Button
          design='Transparent'
          onClick={toggleOpen}
          title={isOpen ? 'Contraer filtros' : 'Expandir filtros'}
          className={`
            ${liteHandle
              ? 'tw-bg-white/10 tw-border-white/20 tw-text-white tw-backdrop-blur-md hover:tw-bg-white/20'
              : 'tw-bg-white tw-border tw-border-slate-200 tw-shadow-sm tw-px-3'}
            tw-rounded-full tw-transition-all tw-duration-300
          `}
        >
          {!liteHandle && <span className='tw-mr-2'>{isOpen ? 'Ocultar' : 'Mostrar'} filtros</span>}
          <Icon name={isOpen ? 'slim-arrow-up' : 'slim-arrow-down'} className={liteHandle ? 'tw-w-6 tw-h-6' : ''} />
        </Button>
      </div>

      {/* espacio para que la manija no se superponga con lo siguiente */}
      {/* <div className='tw-h-6 md:tw-h-7' /> */}
    </div>
  );
}
