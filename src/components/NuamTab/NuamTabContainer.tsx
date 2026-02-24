import React, { useState, ReactNode, Children, isValidElement } from "react";

import { NuamTabProps } from "./NuamTab";

interface NuamTabContainerProps {
  children: ReactNode;
}

const NuamTabContainer: React.FC<NuamTabContainerProps> = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Relajamos validación estricta de tipo para evitar errores de Fast Refresh y HOCs
  const tabs = Children.toArray(children).filter(
    (child): child is React.ReactElement<NuamTabProps> =>
      isValidElement(child) && Boolean((child.props as NuamTabProps).text),
  ) as React.ReactElement<NuamTabProps>[];

  if (tabs.length === 0) {
    return (
      <div className="tw-flex tw-items-center tw-justify-center tw-p-8 tw-text-slate-400 tw-bg-slate-50 tw-rounded-3xl tw-border tw-border-dashed tw-border-slate-200 tw-m-8">
        <span className="tw-font-medium tw-text-sm">
          No hay pestañas disponibles
        </span>
      </div>
    );
  }

  return (
    <div className="tw-w-full tw-flex tw-flex-col tw-h-full tw-bg-white">
      {/* Header Moderno con estilo Píldora Flotante */}
      <div className="tw-px-8 tw-pt-6 tw-pb-4 tw-border-b tw-border-slate-100 tw-bg-white/80 tw-backdrop-blur-xl tw-z-10 tw-sticky tw-top-0 tw-flex tw-justify-between tw-items-center">
        <div className="tw-relative tw-inline-flex tw-bg-slate-100/70 tw-p-1.5 tw-rounded-[20px] tw-gap-2 tw-border tw-border-white/60 tw-shadow-inner">
          {tabs.map((tab, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={index}
                onClick={() => {
                  setActiveIndex(index);
                  if (tab.props.onClick) tab.props.onClick();
                }}
                className={`
                                    tw-relative tw-flex tw-items-center tw-justify-center tw-py-2.5 tw-px-7 tw-cursor-pointer tw-transition-all tw-duration-300 tw-rounded-2xl tw-outline-none tw-border-none tw-bg-transparent
                                    ${
                                      isActive
                                        ? "tw-text-blue-700"
                                        : "tw-text-slate-500 hover:tw-text-slate-800 hover:tw-bg-slate-200/50"
                                    }
                                `}
              >
                {/* Fondo Activo */}
                {isActive && (
                  <div className="tw-absolute tw-inset-0 tw-bg-white tw-rounded-2xl tw-shadow-sm tw-shadow-slate-200/40 tw-border tw-border-slate-50 tw-z-0" />
                )}

                {/* Contenido - solo texto, sin iconos */}
                <div className="tw-relative tw-z-10 tw-flex tw-items-center tw-justify-center">
                  <span
                    className={`tw-text-[13px] tw-font-bold tw-tracking-wide tw-transition-all tw-duration-300 ${isActive ? "tw-text-slate-900" : ""}`}
                  >
                    {tab.props.text}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        {/* Extra content area (e.g., Edit/Save/Cancel buttons for active tab) */}
        {tabs[activeIndex].props.extraContent && (
          <div className="tw-ml-auto">
            {tabs[activeIndex].props.extraContent}
          </div>
        )}
      </div>

      {/* Tab Content con animación de entrada fluida */}
      <div className="tw-flex-1 tw-overflow-y-auto tw-overflow-x-hidden tw-bg-slate-50/30 tw-relative">
        <div
          key={activeIndex}
          className="tw-h-full tw-animate-[nuamTabFadeIn_0.35s_cubic-bezier(0.16,1,0.3,1)]"
          style={{ animationFillMode: "both" }}
        >
          {tabs[activeIndex].props.children}
        </div>
      </div>

      <style>{`
              @keyframes nuamTabFadeIn {
                from { opacity: 0; transform: translateY(6px) scale(0.995); }
                to { opacity: 1; transform: translateY(0) scale(1); }
              }
            `}</style>
    </div>
  );
};

export default NuamTabContainer;
