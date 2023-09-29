import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import styled from 'styled-components';

import { Color } from '../../../core/styles';

import EIDragAndDrop from './EIDragAndDrop/EIDragAndDrop';

type Props = {
  disabled: boolean;
  tmpEditRecord: { [key: string]: any };
  config: Record<string, any>;
  onChangeDetailItem: (key: string, value: Array<any>) => void;
};

const DndContainer = styled.div<{ disabled?: boolean }>`
  width: 100%;
  background-color: ${({ disabled }) =>
    disabled ? Color.background : Color.base};
  border: 1px solid ${Color.border1};
  max-height: 320px;
  overflow-y: scroll;
`;

const prefixLength = 12; // Length for 'extendedItem'

const EILayoutConfigArea = ({
  disabled,
  tmpEditRecord,
  config,
  onChangeDetailItem,
}: Props) => {
  const [eILayout, setEILayout] = useState([]);
  const getExtendedItemArray = (items: {
    [key: string]: any;
  }): Array<{ id: string; text: string }> => {
    const result = [];
    for (const key in items) {
      if (key.length > prefixLength && key.slice(-2) === 'Id' && items[key]) {
        result.push({
          id: items[key],
          text: key.substring(prefixLength, key.search(/\d/) + 2),
        });
      }
    }
    result.sort((a, b) => a.id.localeCompare(b.id));
    return result;
  };
  const initializeOrderGrid = (items) => {
    let counter = 0;
    let layoutRow = [];
    const initLayout = [];
    if (items.length) {
      for (const index in items) {
        if (counter < 2) {
          if (items[index].text) layoutRow.push(items[index].text);
          counter++;
        } else {
          if (items[index].text) layoutRow.push(items[index].text);
          if (layoutRow.length) initLayout.push(layoutRow);
          counter = 0;
          layoutRow = [];
        }
      }
    }
    if (layoutRow.length) initLayout.push(layoutRow);
    return initLayout;
  };
  const initLayout = initializeOrderGrid(getExtendedItemArray(tmpEditRecord));

  const loadLayout = (items) => {
    const itemArray = getExtendedItemArray(items);
    const savedEILayout = tmpEditRecord.fieldCustomLayout;
    const originLength = savedEILayout.length;
    const eILayout = [];
    for (const i in savedEILayout) {
      const eILayoutRow = [];
      for (const j in savedEILayout[i]) {
        const index = itemArray.findIndex(
          (item) => item.text === savedEILayout[i][j]
        );
        if (index >= 0) eILayoutRow.push(...itemArray.splice(index, 1));
      }
      if (eILayoutRow.length) eILayout.push(eILayoutRow);
    }
    if (itemArray.length) {
      for (let k = 0; k < itemArray.length; k++) {
        if (itemArray[k]) {
          eILayout.push([itemArray[k]]);
          savedEILayout.push([itemArray[k].text]);
        }
      }
    }
    if (savedEILayout.length !== originLength) {
      onChangeDetailItem(config.key, savedEILayout);
    }
    setEILayout(eILayout);
  };

  useEffect(() => {
    if (tmpEditRecord.fieldCustomLayout) {
      loadLayout(tmpEditRecord);
    } else {
      onChangeDetailItem(config.key, initLayout);
    }
  }, [tmpEditRecord]);

  return (
    <DndContainer disabled={disabled}>
      <DndProvider backend={HTML5Backend}>
        <EIDragAndDrop
          disabled={disabled}
          items={eILayout}
          config={config}
          onChangeDetailItem={onChangeDetailItem}
        />
      </DndProvider>
    </DndContainer>
  );
};

export default EILayoutConfigArea;
