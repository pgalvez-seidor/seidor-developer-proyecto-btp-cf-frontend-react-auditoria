import React, { ReactNode } from 'react';

export interface NuamTabProps {
    text: string;
    children: ReactNode;
    icon?: string;
    onClick?: () => void;
    extraContent?: ReactNode;
}

const NuamTab: React.FC<NuamTabProps> = ({ children }) => {
    return <div>{children}</div>;
};

export default NuamTab;
