import React from 'react';

import styled from 'styled-components';

import fieldSize from '@admin-pc/constants/fieldSize';

import DateRangeField from '@commons/components/fields/DateRangeField';
import Label from '@commons/components/fields/Label';
import TextField from '@commons/components/fields/TextField';
import msg from '@commons/languages';

import { OrganizationHierarchyHistory } from '@apps/domain/models/organization/OrganizationHierarchy';

import HistoryDialog from '@admin-pc/components/MainContents/DetailPane/HistoryDialog';
import { DetailPaneHeaderSubHistory } from '@apps/admin-pc/components/MainContents/DetailPane';

import RevisionList from './RevisionList';
import TreeView, { Props as TreeViewProps } from './TreeView';

type HistoryUiProps = {
  searchHistory: OrganizationHierarchyHistory[];
  currentHistory: OrganizationHierarchyHistory;
  onChangeHistory: (id: string) => void;
  onClickDeleteHistoryButton: () => void;
  onClickRevisionButton: () => void;
  isShowRevisionDialog: boolean;
  onClickExecuteReviseButton: (arg0: {
    targetDate: string;
    comment: string;
  }) => void;
  onClickCancelReviseButton: () => void;
};

type Props = Omit<TreeViewProps, 'validFrom' | 'validTo'> & HistoryUiProps;

const S = {
  Container: styled.div`
    margin: -12px;
  `,
  DetailPaneHeaderSubHistory: styled(DetailPaneHeaderSubHistory)`
    background-color: #c7dae2;
  `,
  DetailBody: styled.div`
    padding: 12px;
  `,
  DateRangeField: styled(DateRangeField)`
    .slds-input {
      width: 110px;
    }
  `,
};

const DetailOrganizationTreeView: React.FC<Props> = ({
  searchHistory,
  currentHistory,
  onChangeHistory,
  onClickDeleteHistoryButton,
  onClickRevisionButton,
  isShowRevisionDialog,
  onClickExecuteReviseButton,
  onClickCancelReviseButton,
  ...treeViewProps
}) => {
  return (
    <S.Container>
      <S.DetailPaneHeaderSubHistory
        title={msg().Admin_Lbl_HistoryProperties}
        modeHistory={''}
        canDeleteHistoryEvenIfItHasNoSiblings
        searchHistory={searchHistory}
        currentHistory={currentHistory?.id}
        onChangeHistory={onChangeHistory}
        onClickDeleteHistoryButton={onClickDeleteHistoryButton}
        onClickRevisionButton={onClickRevisionButton}
      />

      {currentHistory && (
        <>
          <S.DetailBody>
            <Label
              text={msg().Admin_Lbl_ValidDate}
              childCols={fieldSize.SIZE_LARGE}
            >
              <S.DateRangeField
                startDateFieldProps={{ value: currentHistory.validDateFrom }}
                endDateFieldProps={{ value: currentHistory.validDateTo }}
                disabled
              />
            </Label>
            <Label
              text={msg().Admin_Lbl_ReasonForRevision}
              childCols={fieldSize.SIZE_LARGE}
            >
              <TextField value={currentHistory.comment} disabled />
            </Label>
            <TreeView
              {...treeViewProps}
              validFrom={currentHistory.validDateFrom}
              validTo={currentHistory.validDateTo}
            />
          </S.DetailBody>

          <RevisionList searchHistory={searchHistory} />
        </>
      )}

      {isShowRevisionDialog ? (
        <HistoryDialog
          onClickCancelButton={onClickCancelReviseButton}
          onClickSaveButton={onClickExecuteReviseButton}
          title={msg().Admin_Lbl_Revision}
        />
      ) : null}
    </S.Container>
  );
};

export default DetailOrganizationTreeView;
