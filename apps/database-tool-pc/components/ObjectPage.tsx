import React, { useEffect, useMemo, useState } from 'react';
import ReactTable from 'react-table';

import classNames from 'classnames';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import {
  FIELD_KEY_MAP,
  KeyMap,
  RELATIONSHIP_KEY_MAP,
} from '../constants/keyMap';
import { RecordTableMode } from '../constants/recordTable';

import Button from '../../commons/components/buttons/Button';
import Collapse from '../../commons/components/Collapse';
import SearchableDropdown, {
  OptionProps,
} from '../../commons/components/fields/SearchableDropdown';
import TextAreaField from '../../commons/components/fields/TextAreaField';
import MultiColumnsGrid from '../../commons/components/MultiColumnsGrid';
import msg from '../../commons/languages';

import { field, relationship, sObjDetail } from '../models/ObjectDetail';
import { sObj, sObjList } from '../models/ObjectList';

import { State as SelectedObjSetting } from '../modules/ui/selectedObj';

import QueryTemplate from '../containers/QueryTemplateContainer';
import RecordTableContainer from '../containers/RecordTableContainer';

import './ObjectPage.scss';

const ROOT = 'db-tool-object-page';

type Props = {
  selectedObjSetting: SelectedObjSetting;
  objList: sObjList;
  objDetail: sObjDetail;
  selectedObjKey: string;
  mode: number;
  setDeletedChecked: (arg0: boolean) => void;
  setHighlightRefItem: (arg0: boolean) => void;
  setSelectedObjKey: (arg0: string) => void;
  setSqlQuery: (arg0: string) => void;
  setSearchCondition: (arg0: string) => void;
  setSortCondition: (arg0: string) => void;
  onChangeSelectedObj: (value: Record<string, any>) => void;
  onClickSearchRecords: () => void;
  onClickCancel: () => void;
  onClickDownload: () => void;
  setQueryTemplate: (arg0: string, arg1: string, arg2: string) => void;
};

const getObjOption = (
  objList: sObjList,
  isCustom = false
): Array<OptionProps> => {
  const res = [];
  const keys = Object.keys(objList);
  keys.sort();
  if (isCustom) {
    keys.forEach((key) => {
      const value = objList[key];
      if (value && value.isCustom) {
        const item = {} as OptionProps;
        item.value = key;
        item.label = `${get(value, 'name')}(${get(value, 'label')})`;
        res.push(item);
      }
    });
  } else {
    keys.forEach((key) => {
      const item = {} as OptionProps;
      item.value = key;
      item.label = `${get(objList[key], 'name')}(${get(
        objList,
        `${key}.label`
      )})`;
      res.push(item);
    });
  }
  return res;
};

const isSelectedObjIncluded = (
  selected: string,
  optionList: Array<OptionProps>
): boolean => {
  const objNames = optionList.map((item) => item.value);
  return objNames.includes(selected);
};

const renderAttribute = (obj: sObj) => {
  const res = [];
  Object.entries(obj).forEach(([key, value]) => {
    const val = String(value);
    res.push(<li>{`${key} : ${val}`}</li>);
  });
  return <ul className={`${ROOT}__attribute-list`}>{res}</ul>;
};

const getTableRows = (data: Array<field | relationship>, keyMap: KeyMap) => {
  const keys = Object.keys(keyMap);
  const rows = data.map((x) => {
    const row = {};
    keys.forEach((key) => {
      const mappedKey = keyMap[key];
      if (key === 'picklist') {
        const options = x[mappedKey].map((opt) => <li>{opt.value}</li>);
        row[key] = <ul>{options}</ul>;
      } else if (key === 'referenceTo') {
        row[key] = x[mappedKey].join(',');
      } else if (typeof x[mappedKey] === 'boolean') {
        row[key] = x[mappedKey].toString();
      } else {
        row[key] = x[mappedKey];
      }
    });
    return row;
  });
  return rows;
};

const renderDisplayTable = (
  data: Array<field | relationship>,
  keyMap: KeyMap,
  isHighlight = false
) => {
  const keys = Object.keys(keyMap);
  const rows = getTableRows(data, keyMap);

  const rowFn = (state, rowInfo) => {
    if (!rowInfo) {
      return {};
    }

    const hasReference = rowInfo.original.type === 'REFERENCE';
    const isCustom = rowInfo.original.isCustom === 'true';
    const rowStyle = classNames({
      'reference-highlight': isHighlight && hasReference,
      'custom-reference-highlight': isHighlight && hasReference && isCustom,
    });

    return { className: rowStyle };
  };

  const getColumnWidth = (rowsInfo, accessor, headerText) => {
    const maxWidth = 400;
    const magicSpacing = 9;
    const cellLength = Math.max(
      ...rowsInfo.map((row) => (`${row[accessor]}` || '').length),
      headerText.length
    );
    return Math.min(maxWidth, cellLength * magicSpacing);
  };

  return (
    // @ts-ignore
    <ReactTable
      className={`${ROOT}__data-grid`}
      data={rows}
      columns={keys.map((x) => ({
        Header: x,
        accessor: x,
        width: getColumnWidth(rows, x, x),
      }))}
      keyField="id"
      getTrProps={rowFn}
      pageSize={rows.length}
      showPagination={false}
      minRows={0}
      sortable={false}
    />
  );
};

const generateSqlCommand = (data: Array<field>) => {
  const fields = data.map((item) => item.name);
  return fields.join(',\n');
};

const ObjectPage = (props: Props) => {
  const {
    objList,
    objDetail,
    mode,
    selectedObjKey,
    onClickSearchRecords,
    selectedObjSetting,
    onClickCancel,
    onClickDownload,
    setSelectedObjKey,
    setHighlightRefItem,
    setDeletedChecked,
    setSqlQuery,
    setSearchCondition,
    setSortCondition,
  } = props;
  // @ts-ignore
  const { fields, childRelationships } = objDetail || [];
  const {
    isDisplayRecord,
    isHighlightRefItem,
    isDeletedIncludedChecked,
    sqlList,
    searchCondition,
    sortCondition,
  } = selectedObjSetting;
  const objLists = getObjOption(objList);
  const customObjLists = getObjOption(objList, true);

  const [isCustomObject, setIsCustomObject] = useState(true);
  const selectedObjAttribute = objList[selectedObjKey] || {};
  useEffect(() => {
    const sqlKeys = sqlList || (fields && generateSqlCommand(fields));
    setSqlQuery(sqlKeys);
  }, [fields, sqlList]);

  // change to customized object filter will check whether selected object is included in updated list. If not, reset to empty option
  const onClickIsCustomObject = () => {
    if (!isCustomObject && selectedObjKey) {
      const isIncluded = isSelectedObjIncluded(selectedObjKey, customObjLists);
      if (!isIncluded) {
        setSelectedObjKey('');
      }
    }
    setIsCustomObject(!isCustomObject);
  };

  const onChangeSelectedObj = async (targetedObj: Record<string, any>) => {
    if (targetedObj.value) {
      props.onChangeSelectedObj(targetedObj);
    }
  };

  const onClickSearch = () => {
    if (mode !== RecordTableMode.readOnly) {
      onClickCancel();
    } else {
      onClickSearchRecords();
    }
  };

  return (
    <div className={`${ROOT}`}>
      <MultiColumnsGrid sizeList={[3]} className={`${ROOT}-row-section`}>
        <div>
          <input
            type="checkbox"
            key="custom-object-checkbox"
            className={`${ROOT}__checkbox`}
            onChange={onClickIsCustomObject}
            checked={isCustomObject}
          />
          {msg().Dbt_Lbl_CustomObjectOnly}
        </div>
      </MultiColumnsGrid>
      <MultiColumnsGrid sizeList={[6]} className={`${ROOT}-row-section`}>
        <div>
          <SearchableDropdown
            onChange={onChangeSelectedObj}
            options={isCustomObject ? customObjLists : objLists}
            value={selectedObjKey}
            isSearchable
          />
        </div>
      </MultiColumnsGrid>
      <div className={`${ROOT}-panel-section`}>
        <Collapse header="Attribute" isCollapsed>
          <>
            {useMemo(
              () =>
                !isEmpty(selectedObjAttribute) &&
                renderAttribute(selectedObjAttribute as sObj),
              [selectedObjKey]
            )}
          </>
        </Collapse>
      </div>
      <div className={`${ROOT}-panel-section`}>
        <Collapse header="Fields" isCollapsed>
          <>
            <div>
              <input
                type="checkbox"
                key="reference-checkbox"
                className={`${ROOT}__checkbox`}
                onChange={() => setHighlightRefItem(!isHighlightRefItem)}
                checked={isHighlightRefItem}
              />
              {msg().Dbt_Lbl_HighlightReferenceItem}
            </div>
            {useMemo(
              () =>
                !isEmpty(fields) &&
                renderDisplayTable(fields, FIELD_KEY_MAP, isHighlightRefItem),
              [objDetail, isHighlightRefItem]
            )}
          </>
        </Collapse>
      </div>
      <div className={`${ROOT}-panel-section`}>
        <Collapse header="RelationShip" isCollapsed>
          <>
            {useMemo(
              () =>
                !isEmpty(childRelationships) &&
                renderDisplayTable(childRelationships, RELATIONSHIP_KEY_MAP),
              [objDetail]
            )}
          </>
        </Collapse>
      </div>
      <div className={`${ROOT}-panel-section`}>
        <Collapse header="SOQL Query">
          <>
            <QueryTemplate onChangeTemplate={props.setQueryTemplate} />
            <MultiColumnsGrid sizeList={[6, 6]}>
              <div className={`${ROOT}-sql-section`}>
                <div>SOQL</div>
                {useMemo(
                  () => (
                    <TextAreaField
                      className="sql-text-area"
                      minRows={20}
                      maxRows={40}
                      value={sqlList}
                      onChange={(e) => setSqlQuery(e.target.value)}
                    />
                  ),
                  [sqlList]
                )}
              </div>
              <div>
                <div>where</div>
                {useMemo(
                  () => (
                    <TextAreaField
                      value={searchCondition}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSearchCondition(e.target.value)
                      }
                      onKeyDown={(e: any) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                        }
                      }}
                    />
                  ),
                  [searchCondition]
                )}

                <div>order by</div>
                {useMemo(
                  () => (
                    <TextAreaField
                      value={sortCondition}
                      onChange={(e, value: string) => setSortCondition(value)}
                      onKeyDown={(e: any) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                        }
                      }}
                    />
                  ),
                  [sortCondition]
                )}
              </div>
            </MultiColumnsGrid>
          </>
        </Collapse>
      </div>

      <div className={`${ROOT}-row-section`}>
        <input
          type="checkbox"
          key="deletedRecordIncluded"
          className={`${ROOT}__checkbox`}
          checked={isDeletedIncludedChecked}
          onChange={() => setDeletedChecked(!isDeletedIncludedChecked)}
        />
        {msg().Dbt_Lbl_IncludeDeletedRecords}
      </div>
      <div className={`${ROOT}-row-section`}>
        <Button
          className={`${ROOT}-btn--table-search`}
          onClick={onClickSearch}
          disabled={!selectedObjKey}
        >
          {msg().Com_Btn_Search}
        </Button>
        <Button
          className={`${ROOT}-btn--table-download`}
          onClick={onClickDownload}
          disabled={!selectedObjKey}
        >
          {msg().Com_Btn_Download}
        </Button>
      </div>
      {isDisplayRecord && (
        <RecordTableContainer
          sql={sqlList}
          searchCondition={searchCondition}
          sortCondition={sortCondition}
        />
      )}
    </div>
  );
};

export default ObjectPage;
