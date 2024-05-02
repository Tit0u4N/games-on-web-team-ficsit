import React, { ReactNode } from 'react';

type Props = {
  title: string;
  description: string;
  children: ReactNode;
};

export const OptionLayout: React.FC<Props> = ({ title, description = '', children }) => {
  return (
    <div className={'w-full flex justify-between aline-center'}>
      <div>
        <h3 className={'text-l'}>{title}</h3>
        <p className={'m-0 text-sm text-gray-400'}>{description}</p>
      </div>
      {children}
    </div>
  );
};
