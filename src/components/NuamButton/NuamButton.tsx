import React from 'react';
import { Button, ButtonPropTypes } from '@ui5/webcomponents-react';
import type { WithWebComponentPropTypes } from '@ui5/webcomponents-react';

type CustomButtonProps = ButtonPropTypes &
  WithWebComponentPropTypes & {
    variant?: 'primary' | 'secondary' | 'glass';
    disabled?: boolean;
    round?: boolean;
  };

const PILL_RADIUS = { '--sapButton_BorderCornerRadius': '999px' } as React.CSSProperties;

// Secondary (Default) buttons: gray border so they're visible on any background
const SECONDARY_STYLE: React.CSSProperties = {
  ...PILL_RADIUS,
  minWidth: '110px',
  '--sapButton_BorderColor': '#9ca3af',       // gray-400 — visible on white
  '--sapButton_Hover_BorderColor': '#6b7280', // gray-500 on hover
} as React.CSSProperties;

const PILL_STYLE_NORMAL: React.CSSProperties = {
  ...PILL_RADIUS,
  minWidth: '110px',
};

const NuamButton: React.FC<CustomButtonProps> = ({
  variant = 'primary',
  children,
  className,
  disabled = false,
  round = false,
  style,
  ...rest
}) => {
  // 'Emphasized' = azul oscuro relleno (acción principal)
  // 'Default'    = blanco con borde gris visible (acción secundaria)
  // 'Transparent' = sin fondo (acciones de glass/overlay sobre fondo oscuro)
  const sapDesign =
    variant === 'primary' ? 'Emphasized' :
    variant === 'glass'   ? 'Transparent' :
                            'Default';

  const baseStyle: React.CSSProperties = round
    ? { ...PILL_RADIUS, ...style }
    : variant === 'secondary'
      ? { ...SECONDARY_STYLE, ...style }
      : { ...PILL_STYLE_NORMAL, ...style };

  const sizeClass = round
    ? 'tw-p-0 tw-w-9 tw-h-9 tw-flex tw-items-center tw-justify-center tw-shrink-0'
    : '';

  const combinedClassName = [
    sizeClass,
    className,
    disabled ? 'tw-opacity-50 tw-cursor-not-allowed' : '',
  ].filter(Boolean).join(' ');

  return (
    <Button
      design={sapDesign}
      disabled={disabled}
      {...rest}
      style={baseStyle}
      className={combinedClassName || undefined}
    >
      {children}
    </Button>
  );
};

export default NuamButton;
