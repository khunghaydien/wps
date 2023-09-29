import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';

import styled from 'styled-components';

import AttTimeField from '../../../commons/components/fields/AttTimeField';
import AttTimeRangeField from '../../../commons/components/fields/AttTimeRangeField';
import TextField from '../../../commons/components/fields/TextField';
import msg from '../../../commons/languages';
import { parseIntOrStringNull } from '../../../commons/utils/NumberUtil';
import TimeUtil from '../../../commons/utils/TimeUtil';
import { Icons } from '../../../core';

import { Allowances } from '../models/attDailyAllowanceAll';

import { actions as DailyAllowanceActions } from '../modules/ui/dailyAllowance';

import LoadingScreen from './LoadingScreen';

import './index.scss';

const ROOT = 'timesheet-pc-allowance-dialog__body';
const classNameOfInputTime = `${ROOT}__table-input-time`;
const classNameOfInputTimeRange = `commons-fields-att-time-field`;
const classNameOfInputQuantity = `${ROOT}__table-input-quantity`;

type Props = {
  isLoading: boolean;
  isSelectedTab: boolean;
  dailyAllowanceAllList: Allowances[];
  toggleSelection: (arg0: Allowances) => void;
};

const ContentsWrapper = styled.div`
  position: relative;
  width: 100%;
  height: calc(90vh - 400px - 60px - 32px);
  min-height: calc(572px - 60px - 60px - 32px);
  z-index: 0;
`;

const S = {
  OuterInput: styled.div`
    margin-top: 50px;
    margin-left: 5%;
    display: flex;
    align-items: center;
    width: 70%;
    height: 32px;
    background: #fff;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    padding: 0 8px;

    :focus-within {
      border: 1px solid #2782ed;
      box-shadow: 0 0 3px #0070d2;
    }
  `,

  SearchIcon: styled(Icons.Search)`
    height: 12px;
    width: 12px;
  `,
};

const rowSelected = {
  backgroundColor: '#58cdff',
};

const filterNameOrCode = (data, condition, type) => {
  if (type === 'all') {
    const filteredList = data.filter((item) => {
      if (
        item.allowanceCode
          .toString()
          .toLowerCase()
          .includes(condition.toString().toLowerCase()) ||
        item.allowanceName
          .toString()
          .toLowerCase()
          .includes(condition.toString().toLowerCase())
      ) {
        return item;
      }
      return false;
    });
    return filteredList;
  } else {
    const filteredList = data.filter((item) => {
      if (
        (item.allowanceCode
          .toString()
          .toLowerCase()
          .includes(condition.toString().toLowerCase()) ||
          item.allowanceName
            .toString()
            .toLowerCase()
            .includes(condition.toString().toLowerCase())) &&
        item.isSelected === true
      ) {
        return item;
      }
      return false;
    });

    return filteredList;
  }
};

const Contents = ({ isLoading = false, ...props }: Props) => {
  const [dailyAllowanceAllList, setDailyAllowanceAllList] = useState(
    props.dailyAllowanceAllList
  );
  const [switchType, setSwitchType] = useState(() => {
    return props.isSelectedTab ? 'selected' : 'all';
  });
  const [allTab, setAllTab] = useState(!props.isSelectedTab);
  const [condition, setCondition] = useState('');

  const selectedNumber = props.dailyAllowanceAllList.filter((item) => {
    return item.isSelected === true;
  }).length;

  useEffect(() => {
    switchTab(props.dailyAllowanceAllList, switchType);
  }, [props.dailyAllowanceAllList]);

  /**
   * select all or selected tab
   */
  const switchTab = (data, type) => {
    if (type === 'all') {
      setSwitchType('all');
      setAllTab(true);
    } else {
      setSwitchType('selected');
      setAllTab(false);
    }

    dataListFilter(condition, data, type);
  };

  /**
   * enter the allowance name or code to ambiguous search
   */
  const dataListFilter = (condition, data, type) => {
    setCondition(condition);
    if (condition === '' || condition === undefined || condition === null) {
      if (type === 'all') {
        setDailyAllowanceAllList(data);
      } else {
        const isSelectedData = data.filter((item) => {
          return item.isSelected === true;
        });
        setDailyAllowanceAllList(isSelectedData);
      }
    } else {
      const filteredList = filterNameOrCode(data, condition, type);
      setDailyAllowanceAllList(filteredList);
    }
  };

  const dispatch = useDispatch();

  const Actions = React.useMemo(
    () =>
      bindActionCreators(
        {
          setHours: DailyAllowanceActions.setHours,
          setStartTime: DailyAllowanceActions.setStartTime,
          setEndTime: DailyAllowanceActions.setEndTime,
          setQuantity: DailyAllowanceActions.setQuantity,
        },
        dispatch
      ),
    [dispatch]
  );

  /**
   * save input value to store
   */
  const allowanceInputChange = (value, allowanceId, type) => {
    switch (type) {
      case 'Hours':
        return Actions.setHours(TimeUtil.parseMinutes(value), allowanceId);
      case 'StartTime':
        return Actions.setStartTime(TimeUtil.parseMinutes(value), allowanceId);
      case 'EndTime':
        return Actions.setEndTime(TimeUtil.parseMinutes(value), allowanceId);
      case 'Quantity':
        return Actions.setQuantity(value, allowanceId);
    }
  };

  /**
   * Render the corresponding components according to the management type
   */
  const renderManageType = (item) => {
    switch (item.managementType) {
      case 'Hours':
        return (
          <>
            <span className={`${ROOT}__table-span`}>
              {msg().Att_Lbl_DailyAllowanceRecordInputHours}
            </span>
            <AttTimeField
              className={`${classNameOfInputTime}`}
              onBlur={(value) => {
                allowanceInputChange(value, item.allowanceId, 'Hours');
              }}
              value={TimeUtil.toHHmm(item.totalTime)}
              required={item.isSelected}
            />
          </>
        );
      case 'StartEndTime':
        return (
          <>
            <span className={`${ROOT}__table-span`}>
              {msg().Att_Lbl_DailyAllowanceRecordInputTime}
            </span>
            <AttTimeRangeField
              className={`${classNameOfInputTimeRange}`}
              key={item.allowanceId}
              onBlurAtStart={(value) => {
                allowanceInputChange(value, item.allowanceId, 'StartTime');
              }}
              onBlurAtEnd={(value) => {
                allowanceInputChange(value, item.allowanceId, 'EndTime');
              }}
              startTime={TimeUtil.toHHmm(item.startTime)}
              endTime={TimeUtil.toHHmm(item.endTime)}
            />
          </>
        );
      case 'Quantity':
        return (
          <>
            <span className={`${ROOT}__table-span`}>
              {msg().Att_Lbl_DailyAllowanceRecordInputQuantity}
            </span>
            <TextField
              key={item.allowanceId}
              className={`${classNameOfInputQuantity}`}
              type="number"
              min={0}
              max={9999}
              step={1}
              value={parseIntOrStringNull(item.quantity)}
              onChange={(e: React.SyntheticEvent<HTMLInputElement>) =>
                allowanceInputChange(
                  String(parseIntOrStringNull(e.currentTarget.value)),
                  item.allowanceId,
                  'Quantity'
                )
              }
            />
          </>
        );
      case 'None':
        return (
          <>
            <span className={`${ROOT}__table-span`}>
              {msg().Admin_Lbl_ManageTypeNone}
            </span>
          </>
        );
      default:
        return (
          <>
            <span className={`${ROOT}__table-span`}></span>
          </>
        );
    }
  };

  /**
   * get table min height
   */
  const getMinHeight = (setHeight, numberOfRowsVisibleWithoutScrolling) => {
    const rowHeight = setHeight || 35;
    let minHeight = 350;
    const scrollbarOffset = 15;

    if (numberOfRowsVisibleWithoutScrolling !== 0) {
      minHeight = rowHeight; // NOTE: ヘッダー分を確保
      if (dailyAllowanceAllList.length > 0) {
        const numberOfRows =
          dailyAllowanceAllList.length > numberOfRowsVisibleWithoutScrolling
            ? numberOfRowsVisibleWithoutScrolling
            : dailyAllowanceAllList.length;
        minHeight += numberOfRows * rowHeight;
      }
      const borderOffset = 1; // NOTE: ボーダーの調整分
      minHeight += borderOffset;
    }

    return minHeight + scrollbarOffset;
  };

  const rowClick = (e, item) => {
    const isInput =
      e.target.getAttribute('class').indexOf(`${classNameOfInputTime}`) !==
        -1 ||
      e.target.getAttribute('class').indexOf(`${classNameOfInputTimeRange}`) !==
        -1 ||
      e.target.getAttribute('class').indexOf(`${classNameOfInputQuantity}`) !==
        -1;
    if (!isInput) {
      props.toggleSelection(item);
    }
  };

  return (
    <ContentsWrapper>
      <LoadingScreen isLoading={isLoading} />
      <div className={`${ROOT}__input-radio`}>
        <label htmlFor="all" className={`${ROOT}__input-text`}>
          <input
            type="radio"
            value="all"
            name="approvalType"
            id="all"
            checked={allTab}
            onChange={() => {
              switchTab(props.dailyAllowanceAllList, 'all');
            }}
          />
          &nbsp;{msg().Com_Sel_All}
        </label>
        <label htmlFor="selected" className={`${ROOT}__input-text`}>
          <input
            type="radio"
            value="selected"
            name="approvalType"
            id="selected"
            checked={!allTab}
            onChange={() => {
              switchTab(props.dailyAllowanceAllList, 'selected');
            }}
          />
          &nbsp;{msg().Com_Lbl_Chosen}
        </label>
        <span>
          {`(`} {selectedNumber} {`)`}
        </span>
      </div>
      <S.OuterInput>
        <S.SearchIcon color="disable" />
        <input
          type="text"
          placeholder={msg().Att_Lbl_DailyAllowanceRecordFilter}
          className={`${ROOT}__filter-input`}
          onChange={(event) => {
            dataListFilter(
              event.target.value,
              props.dailyAllowanceAllList,
              switchType
            );
          }}
        />
      </S.OuterInput>
      <div className={`${ROOT}__allowance-table`}>
        <div>
          <div className={`${ROOT}__table-header-wrapper`}>
            <div
              className={`${ROOT}__table-header-cell ${ROOT}__table-cell1`}
            ></div>
            <div className={`${ROOT}__table-header-cell ${ROOT}__table-cell2`}>
              {msg().Att_Lbl_AttAllowanceName}
            </div>
            <div className={`${ROOT}__table-header-cell ${ROOT}__table-cell3`}>
              {msg().Admin_Lbl_Code}
            </div>
            <div className={`${ROOT}__table-header-cell ${ROOT}__table-cell4`}>
              {msg().Admin_Lbl_ManagementType}
            </div>
          </div>
          <div
            className={`${ROOT}__table-body-wrapper`}
            style={{ minHeight: `${getMinHeight(0, 4)}` + 'px' }}
          >
            {dailyAllowanceAllList.map((item) => {
              return (
                <div
                  className={`${ROOT}__table-row`}
                  key={item.allowanceId}
                  style={item.isSelected ? rowSelected : {}}
                  onClick={(e) => rowClick(e, item)}
                  onKeyDown={() => {}}
                  role="button"
                >
                  <div className={`${ROOT}__table-cell ${ROOT}__table-cell1`}>
                    <input
                      type="checkbox"
                      onChange={() => {
                        props.toggleSelection(item);
                      }}
                      checked={item.isSelected}
                    />
                  </div>
                  <div
                    title={item.allowanceName}
                    className={`${ROOT}__table-cell ${ROOT}__table-cell2`}
                  >
                    {item.allowanceName}
                  </div>
                  <div
                    title={item.allowanceCode}
                    className={`${ROOT}__table-cell ${ROOT}__table-cell3`}
                  >
                    {item.allowanceCode}
                  </div>
                  <div className={`${ROOT}__table-cell ${ROOT}__table-cell4`}>
                    {renderManageType(item)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ContentsWrapper>
  );
};

export default Contents;
