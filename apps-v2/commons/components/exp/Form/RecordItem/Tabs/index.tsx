import React, { ReactElement, useEffect, useState } from 'react';

import get from 'lodash/get';

import styled from 'styled-components';

import RecordIcon from '@commons/components/exp/Form/RecordList/Icon';
import Tab from '@commons/components/Tab';
import msg from '@commons/languages';
import WspStyle from '@commons/styles/wsp.scss';

import { RecordErrors, Touched } from '..';

enum RecordItemTabs {
  Record,
  Itemization,
}

type Props = {
  actionButtonContent?: ReactElement;
  attachmentContent?: ReactElement;
  errors?: RecordErrors;
  hasItemizeRequiredError?: boolean;
  itemizationTabContent?: ReactElement;
  recordIdx?: number;
  recordTabContent: ReactElement;
  touched?: Touched;
};

const Tabs = ({
  actionButtonContent = null,
  attachmentContent = null,
  itemizationTabContent = null,
  errors,
  hasItemizeRequiredError,
  recordIdx = 0,
  recordTabContent,
  touched,
}: Props) => {
  const { Record: record, Itemization: itemization } = RecordItemTabs;
  const [selectedTab, setSelectedTab] = useState(record);

  useEffect(() => {
    setSelectedTab(record);
  }, [recordIdx]);

  const onChangeTab = (tab: RecordItemTabs) => setSelectedTab(tab);

  const isRecordTabSelected = selectedTab === record;
  const isItemizationTabSelected = selectedTab === itemization;
  const isShowItemizationTab = !!itemizationTabContent;
  const itemError = get(errors, 'items', []);
  const [_, ...childError] = itemError;
  const hasChildItemError = childError.length > 0 || hasItemizeRequiredError;

  return (
    <>
      <Header>
        <div>
          <Tab
            label={msg().Exp_Lbl_Records}
            selected={isRecordTabSelected}
            onSelect={() => onChangeTab(record)}
          />
          {isShowItemizationTab && (
            <ItemizationTabWrapper>
              <ItemizationTabGroup>
                <Tab
                  label={msg().Exp_Lbl_Itemization}
                  selected={isItemizationTabSelected}
                  onSelect={() => onChangeTab(itemization)}
                />
                {hasChildItemError && (
                  <ErrorIcon
                    className=""
                    errors={errors}
                    idx={1}
                    touched={touched}
                  />
                )}
              </ItemizationTabGroup>
            </ItemizationTabWrapper>
          )}
        </div>
        <ActionButtonGroup>
          {attachmentContent}
          {actionButtonContent}
        </ActionButtonGroup>
      </Header>

      {isRecordTabSelected && recordTabContent}

      {isItemizationTabSelected && itemizationTabContent}
    </>
  );
};

export default Tabs;

const Header = styled.div`
  display: flex;
  min-height: 51.37px;
  justify-content: space-between;
  padding: 0 20px;
  background-color: ${WspStyle['color-selected-2']};

  .tab:first-child > .tab__anchor {
    padding-left: 5px;
  }
`;

const ItemizationTabWrapper = styled.div`
  display: table-cell;
`;

const ItemizationTabGroup = styled.div`
  display: flex;
  align-items: center;
`;

const ErrorIcon = styled(RecordIcon)`
  padding-top: 10px;

  > svg > path {
    fill: ${WspStyle['color-error']};
  }
`;

const ActionButtonGroup = styled.div`
  display: flex;
  align-items: center;
`;
