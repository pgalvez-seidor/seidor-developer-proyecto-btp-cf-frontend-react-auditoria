import React from 'react';
import { useNavigate } from 'react-router-dom';
import NuamButton from '../NuamButton/NuamButton';

interface HeaderSectionProps {
  title: string;
  principal?: boolean;
  children?: React.ReactNode;
  isDrawer?: boolean;
  toggleDrawer?: any;
}

const HeaderSection: React.FC<HeaderSectionProps> = props => {
  const navigate = useNavigate();
  return (
    <div className='nuam-header-section animate-fade-in'>
      <div className='tw-w-full tw-px-4 md:tw-px-8 lg:tw-px-10'>
        <div className='tw-flex tw-items-center tw-justify-between tw-mb-3 tw-gap-4'>
          <div className='tw-flex tw-items-center tw-gap-3'>
            {props.isDrawer ? (
              <NuamButton variant='secondary' icon='menu' onClick={() => props.toggleDrawer()} />
            ) : !props.principal ? (
              <NuamButton variant='secondary' icon='nav-back' onClick={() => navigate(-1)} />
            ) : null}
            <div>
              <h1 className='tw-text-2xl md:tw-text-3xl tw-font-extrabold tw-tracking-tight tw-m-0 tw-text-white'>
                {props.title}
              </h1>

            </div>
          </div>
        </div>
        {props.children}
      </div>
    </div>
  );
};

export default HeaderSection;
