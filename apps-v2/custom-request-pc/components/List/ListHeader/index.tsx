import React, { useState } from 'react';

import Button from '@apps/commons/components/buttons/Button';
import SelectField from '@apps/commons/components/fields/SelectField';
import downIcon from '@apps/commons/images/icons/down.svg';
import refreshIcon from '@apps/commons/images/icons/refresh.svg';
import msg from '@apps/commons/languages';
import TextUtil from '@apps/commons/utils/TextUtil';
import { Text } from '@apps/core';

import { MAX_CLONE_NO } from '@apps/domain/models/customRequest/consts';
import { RecordTypes } from '@apps/domain/models/customRequest/types';

import './index.scss';

type Props = {
  recordTypeList: RecordTypes;
  selectedRecordTypeId: string;
  rowCount: number;
  selectedIdList: Array<string>;
  isShowClone: boolean;
  onClickNew: () => void;
  onSelectRecordType: (id: string) => void;
  onClickRefresh: () => void;
  onClickDelete: () => void;
  onClickClone: () => void;
};

const ROOT = 'ts-custom-request-list-header';

const ListHeader = (props: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const {
    recordTypeList,
    selectedRecordTypeId,
    selectedIdList,
    isShowClone,
    onClickNew,
  } = props;

  const options = recordTypeList.map(({ id, name }) => ({
    text: name,
    value: id,
  }));

  const onSelectRecordType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    props.onSelectRecordType(e.target.value);
  };

  const noOfSelected = selectedIdList.length;

  return (
    <div className={ROOT}>
      <div>
        <Text size="xxl" color="secondary" bold>
          {msg().Exp_Lbl_CustomRequestList}
        </Text>
      </div>
      <div className={`${ROOT}__right`}>
        <Text size="medium" color="secondary" bold>
          {TextUtil.template(
            msg().Exp_Msg_ShowingCustomRequest,
            props.rowCount
          )}
        </Text>
        <Button
          iconSrc={refreshIcon}
          onClick={props.onClickRefresh}
          iconSrcType="svg"
          iconAlt="refresh"
        />
        <SelectField
          className={`${ROOT}__record-type-select`}
          onChange={onSelectRecordType}
          options={options}
          value={selectedRecordTypeId}
        />
        <Button type="primary" onClick={onClickNew}>
          {msg().Exp_Lbl_CreateNew}
        </Button>
        <div>
          <Button
            iconSrc={downIcon}
            className={`${ROOT}__extra-button`}
            onClick={() => {
              setIsMenuOpen((prevState) => !prevState);
            }}
            iconSrcType="svg"
            iconAlt="down"
          />
          {isMenuOpen && (
            <div className={`${ROOT}__submenu`}>
              {isShowClone && (
                <Button
                  className={`${ROOT}__clone`}
                  onClick={() => {
                    setIsMenuOpen(false);
                    props.onClickClone();
                  }}
                  type="default"
                  disabled={!noOfSelected || noOfSelected > MAX_CLONE_NO}
                >
                  {msg().Com_Lbl_Clone}
                </Button>
              )}

              <Button
                className={`${ROOT}__delete`}
                onClick={() => {
                  setIsMenuOpen(false);
                  props.onClickDelete();
                }}
                type="destructive"
                disabled={!noOfSelected}
              >
                {msg().Com_Btn_Delete}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListHeader;
