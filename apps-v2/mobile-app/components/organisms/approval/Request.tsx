import React from 'react';

import classNames from 'classnames';

import msg from '../../../../commons/languages';
import ViewItem from '../../molecules/commons/ViewItem';

import { ArrayLabel } from '../../../../domain/models/approval/AttDailyDetail/Base';

// FIXME: Do't use PC's components.
import Comparison from '../../../../approvals-pc/components/DetailParts/Comparison';

import './Request.scss';

const ROOT = 'mobile-app-organisms-approval-request';

export type Props = {
  className?: string;
  employeeName: string;
  delegatedEmployeeName: string | null | undefined;
  detailList: ArrayLabel;
};

export default class Request extends React.PureComponent<Props> {
  render() {
    return (
      <div className={classNames(ROOT, this.props.className)}>
        <ViewItem label={msg().Appr_Lbl_ApplicantName} key={0}>
          {this.props.employeeName}
          {this.props.delegatedEmployeeName
            ? ` (${msg().Appr_Lbl_DelegatedApplicantName}: ${
                this.props.delegatedEmployeeName || ''
              })`
            : null}
        </ViewItem>
        {this.props.detailList.map((item) => (
          <ViewItem label={item.label} key={item.label}>
            {item.valueType ? (
              <Comparison
                new={item.value.toString()}
                old={
                  item.originalValue !== undefined &&
                  item.originalValue !== null
                    ? item.originalValue.toString()
                    : ''
                }
                type={item.valueType || 'date'}
              />
            ) : (
              item.value
            )}
          </ViewItem>
        ))}
      </div>
    );
  }
}
