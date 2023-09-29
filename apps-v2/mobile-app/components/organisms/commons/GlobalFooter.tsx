import React, { useMemo } from 'react';

import { Tab, Tabs } from '../../molecules/commons/Tabs';

type Tab = {
  label: string;
  handleOnClick: () => void;
  key: string;
};

type Props = Readonly<{
  tabs: Array<Tab>;
  activeTab: string;
}>;

const GlobalFooter = ({ tabs, activeTab }: Props) => {
  const isActive = useMemo(
    () => (model: string) => activeTab === model,
    [activeTab]
  );
  return (
    <Tabs position="bottom">
      {tabs.map(({ label, handleOnClick, key }) => (
        <Tab
          key={key}
          label={label}
          onClick={handleOnClick}
          active={isActive(key)}
        />
      ))}
    </Tabs>
  );
};

export default GlobalFooter;
