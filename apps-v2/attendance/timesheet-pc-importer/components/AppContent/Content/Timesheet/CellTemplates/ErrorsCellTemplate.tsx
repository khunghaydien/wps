import * as React from 'react';

import useId from '@apps/core/hooks/useId';
// FIXME: Console.error が出続けているので別のものに置き換えたい。
import Tooltip from '@commons/components/Tooltip';

import { ErrorsCell } from '../models/Table';

import {
  CellTemplate,
  Compatible,
  getCellProperty,
  UncertainCompatible,
} from '@silevis/reactgrid';

export class ErrorsCellTemplate implements CellTemplate<ErrorsCell> {
  getCompatibleCell(uncertainCell: UncertainCompatible<ErrorsCell>) {
    const errors = getCellProperty(
      uncertainCell,
      'errors',
      'object'
    ) as string[];
    return {
      ...uncertainCell,
      text: (errors || []).join(', '),
      value: null,
    };
  }

  update(cell: Compatible<ErrorsCell>): Compatible<ErrorsCell> {
    return this.getCompatibleCell({
      ...cell,
    });
  }

  getClassName(cell: Compatible<ErrorsCell>): string {
    return cell.className ?? '';
  }

  render(cell): React.ReactNode {
    return <TextArea text={cell.errors} />;
  }
}

const TextArea: React.FC<{
  text: string[];
}> = ({ text }) => {
  const id = useId();
  return (
    <div>
      <Tooltip
        id={`error-text-area-${id}`}
        content={
          <>
            {text?.map((text) => (
              <div key={text}>{text}</div>
            ))}
          </>
        }
        align="left"
      >
        <div>{text?.at(0)}</div>
      </Tooltip>
    </div>
  );
};
