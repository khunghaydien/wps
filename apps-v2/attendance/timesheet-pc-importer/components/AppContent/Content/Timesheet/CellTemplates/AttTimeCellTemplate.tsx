import * as React from 'react';

import TimeUtil from '@apps/commons/utils/TimeUtil';

import { AttTimeCell } from '../models/Table';

import * as helper from '@attendance/ui/helpers/dailyRecord';
import {
  CellTemplate,
  Compatible,
  getCellProperty,
  getCharFromKeyCode,
  isAlphaNumericKey,
  isNavigationKey,
  keyCodes,
  UncertainCompatible,
} from '@silevis/reactgrid';

export class AttTimeCellTemplate implements CellTemplate<AttTimeCell> {
  getCompatibleCell(uncertainCell: UncertainCompatible<AttTimeCell>) {
    const text = getCellProperty(uncertainCell, 'text', 'string');
    if (text === '') {
      return {
        ...uncertainCell,
        text,
        value: null,
      };
    } else {
      // trim() は module の不具合対策
      const formattedValue = TimeUtil.supportFormat(text.trim());
      const value =
        formattedValue !== ''
          ? helper.time.toNumberOrNull(formattedValue)
          : uncertainCell.value;
      return {
        ...uncertainCell,
        text,
        value,
      };
    }
  }

  update(
    cell: Compatible<AttTimeCell>,
    cellToMerge: UncertainCompatible<AttTimeCell>
  ): Compatible<AttTimeCell> {
    return this.getCompatibleCell({
      ...cell,
      text: cellToMerge.text,
    });
  }

  handleKeyDown(
    cell: Compatible<AttTimeCell>,
    keyCode: number,
    ctrl: boolean,
    shift: boolean,
    alt: boolean
  ): { cell: Compatible<AttTimeCell>; enableEditMode: boolean } {
    const char = getCharFromKeyCode(keyCode, shift);
    if (
      !ctrl &&
      !alt &&
      isAlphaNumericKey(keyCode) &&
      !(shift && keyCode === keyCodes.SPACE)
    )
      return {
        cell: this.getCompatibleCell({
          ...cell,
          text: shift ? char : char.toLowerCase(),
        }),
        enableEditMode: true,
      };
    return {
      cell,
      enableEditMode:
        keyCode === keyCodes.POINTER || keyCode === keyCodes.ENTER,
    };
  }

  getClassName(cell: Compatible<AttTimeCell>): string {
    const className = cell.className ? cell.className : '';
    return `${cell.text === '' ? 'placeholder' : ''} ${className}`;
  }

  render(cell, isInEditMode, onCellChanged): React.ReactNode {
    if (!isInEditMode) {
      return cell.text;
    }

    return (
      <input
        ref={(input) => {
          if (input) {
            // @ts-ignore
            input.focus();
            // @ts-ignore
            input.setSelectionRange(input.value.length, input.value.length);
          }
        }}
        defaultValue={cell.text}
        onChange={(e) =>
          onCellChanged(
            this.getCompatibleCell({ ...cell, text: e.currentTarget.value }),
            false
          )
        }
        onBlur={(e) =>
          onCellChanged(
            this.getCompatibleCell({ ...cell, text: e.currentTarget.value }),
            (e as any).view?.event?.keyCode !== keyCodes.ESCAPE
          )
        }
        onCopy={(e) => e.stopPropagation()}
        onCut={(e) => e.stopPropagation()}
        onPaste={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        placeholder={`(00:00)`}
        onKeyDown={(e) => {
          if (isAlphaNumericKey(e.keyCode) || isNavigationKey(e.keyCode))
            e.stopPropagation();
        }}
      />
    );
  }
}
