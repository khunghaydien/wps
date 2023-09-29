import React, { useMemo } from 'react';

import styled from 'styled-components';

import msg from '@commons/languages';
import { Option, QuickSearchableDropdown, Text } from '../../../../../core';

import { WorkCategory } from '../../../../../domain/models/time-tracking/WorkCategory';

interface Props {
  'data-testid'?: string;
  items: readonly WorkCategory[];
  value?: Partial<WorkCategory>;
  readOnly?: boolean;
  isLoading: boolean;
  onClick: () => void;
  onSelect: (arg0: Option) => void;
}

const S = {
  OptionLabel: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
  `,
  Code: styled(Text)`
    line-height: 1;
  `,
  Name: styled(Text)`
    line-height: 1.2;
  `,
};

const WorkCategoryDropdown: React.FC<Props> = ({
  items = [],
  value = {},
  readOnly,
  isLoading,
  onClick,
  onSelect,
  ...props
}: Props): React.ReactElement => {
  const items_ = useMemo(() => {
    if (value.id) {
      const found = items.find((item) => item.id === value.id);
      return found ? items : [value, ...items];
    } else {
      return items;
    }
  }, [items, value]);

  return (
    <QuickSearchableDropdown
      {...props}
      isLoading={isLoading}
      items={items_}
      hasEmptyOption
      readOnly={readOnly}
      value={value.id}
      placeholder={msg().Com_Lbl_Select}
      onClick={onClick}
      onSelect={onSelect}
      filterSelector={(elem): string => elem.code + elem.name}
      optionSelector={(elem): Option => ({
        value: elem.id,
        label: (
          <S.OptionLabel>
            <S.Code size="medium" color="secondary">
              {elem.code}
            </S.Code>
            <S.Name size="large" color="primary">
              {elem.name}
            </S.Name>
          </S.OptionLabel>
        ),
      })}
    />
  );
};

export default WorkCategoryDropdown;
