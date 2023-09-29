import React from 'react';

import Select from '@apps/admin-pc/components/MainContents/DetailPane/Select';

type Props = {
  list: ReadonlyArray<{ value: string; label: string; text: string }>;
  onChange: (value: string | undefined) => void;
  value?: string;
  disabled?: boolean;
};
const OrganizationHierarchyListContainer = (
  props: Props
): React.ReactElement => {
  const { list, onChange, value, disabled } = props;

  return (
    <Select
      value={value}
      options={list}
      onChange={onChange}
      disabled={disabled}
    />
  );
};

export default OrganizationHierarchyListContainer;
