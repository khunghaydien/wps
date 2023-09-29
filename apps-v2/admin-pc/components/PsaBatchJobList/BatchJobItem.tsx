import React, { useEffect, useState } from 'react';

import moment from 'moment';

import Button from '@apps/commons/components/buttons/Button';
import DateField from '@apps/commons/components/fields/DateField';
import TextField from '@apps/commons/components/fields/TextField';
import Tooltip from '@commons/components/Tooltip';
import msg from '@commons/languages';

import {
  AdditionalParam,
  AdditionalParamType,
  BatchJob,
} from '@apps/admin-pc/models/psaBatchJob/PsaBatchJob';

import './BatchJobItem.scss';

const ROOT = 'psa-batch-job-item';

type Props = {
  companyId: string;
  item: BatchJob;
  actions: any;
};
const BatchJobItem = (props: Props) => {
  const { companyId, item, actions } = props;
  const PARAM_INTEGER_MIN = 0;

  const [lastExecutedTime, setLastExecutedTime] = useState(
    item.lastStartAt ? item.lastStartAt : '-'
  );

  const [additionalParam, setAdditionalParam] = useState({});
  const [paramValue, setParamValue] = useState({});

  const executeBatchJob = () => {
    actions.runPsaBatchJob({
      companyId,
      firstJobCode: item.firstJobCode,
      additionalParam,
    });
    setLastExecutedTime(msg().Admin_Lbl_PsaBatchJobInProgress);
  };

  const onChangeAdditionalParam = (paramName, value) => {
    const param = { [paramName]: value === '' ? null : value };

    if (paramValue[paramName] !== value) {
      setAdditionalParam(param);
      setParamValue(param);
    }
  };

  useEffect(() => {
    item.additionalParam?.forEach((additionalParam) => {
      const param = {
        [additionalParam.paramName]: additionalParam.paramDefaultValue,
      };

      setParamValue(param);
      setAdditionalParam(param);
    });
  }, [item.additionalParam]);

  const renderAdditionalParam = (param: AdditionalParam) => {
    switch (param.paramType) {
      case AdditionalParamType.PARAM_INTEGER:
        return (
          <div className={`${ROOT}__integer-param-div`}>
            <div className={`${ROOT}__param-label`}>
              {param.paramLabel}
              {param.paramDescription ? (
                <Tooltip
                  align="top left"
                  content={param.paramDescription}
                  className={`${ROOT}__icon-help`}
                >
                  <div aria-label={item.batchJobDescription}>&nbsp;</div>
                </Tooltip>
              ) : null}{' '}
              :{' '}
            </div>
            <TextField
              key={param.paramName}
              className={`${ROOT}__param-value-integer`}
              type="number"
              min={PARAM_INTEGER_MIN}
              max={param.paramMaxValue}
              value={paramValue[param.paramName] ?? 0}
              onChange={(e) =>
                onChangeAdditionalParam(param.paramName, e.target.value)
              }
              isRequired={param.paramRequired}
            />
          </div>
        );
      case AdditionalParamType.PARAM_STRING:
        return (
          <div>
            <div className={`${ROOT}__param-label`}>
              {param.paramLabel}
              {param.paramDescription ? (
                <Tooltip
                  align="top left"
                  content={param.paramDescription}
                  className={`${ROOT}__icon-help`}
                >
                  <div aria-label={item.batchJobDescription}>&nbsp;</div>
                </Tooltip>
              ) : null}{' '}
              :{' '}
            </div>
            <TextField
              key={param.paramName}
              className={`${ROOT}__param-value-string`}
              onChange={(e) => {
                onChangeAdditionalParam(param.paramName, e.target.value);
              }}
              value={paramValue[param.paramName]}
              maxLength={Number(param.paramMaxValue)}
              isRequired={param.paramRequired}
            />
          </div>
        );
      case AdditionalParamType.PARAM_DATE:
        return (
          <div>
            <div className={`${ROOT}__param-label`}>
              {param.paramLabel}
              {param.paramDescription ? (
                <Tooltip
                  align="top left"
                  content={param.paramDescription}
                  className={`${ROOT}__icon-help`}
                >
                  <div aria-label={item.batchJobDescription}>&nbsp;</div>
                </Tooltip>
              ) : null}{' '}
              :{' '}
            </div>
            <DateField
              key={param.paramName}
              className={`${ROOT}__param-value-date`}
              onChange={(value) => {
                onChangeAdditionalParam(param.paramName, value);
              }}
              value={paramValue[param.paramName]}
              maxDate={moment(param.paramMaxValue)}
              required={param.paramRequired}
            />
          </div>
        );
      case AdditionalParamType.PARAM_BOOLEAN:
        return (
          <div className={`${ROOT}__boolean-param-div`}>
            <div className={`${ROOT}__param-label`}>
              {param.paramLabel}
              {param.paramDescription ? (
                <Tooltip
                  align="top left"
                  content={param.paramDescription}
                  className={`${ROOT}__icon-help`}
                >
                  <div aria-label={item.batchJobDescription}>&nbsp;</div>
                </Tooltip>
              ) : null}{' '}
              :{' '}
            </div>
            <input
              className={`${ROOT}__param-value-boolean`}
              type="checkbox"
              onChange={(e) => {
                onChangeAdditionalParam(param.paramName, e.target.checked);
              }}
            />
          </div>
        );
      default:
        break;
    }
  };

  const activateButton =
    lastExecutedTime === msg().Admin_Lbl_PsaBatchJobInProgress;

  return (
    <div className={ROOT}>
      <div className={`${ROOT}__label-container`}>
        <div className={`${ROOT}__label-area`}>
          <p>{item.batchJobName}</p>
          <div className={`${ROOT}__time-container`}>
            <p>
              {msg().Admin_Lbl_LastExecutedTime}: {lastExecutedTime}
            </p>
          </div>
        </div>
        <Tooltip
          align="top left"
          content={item.batchJobDescription}
          className={`${ROOT}__icon-help`}
        >
          <div aria-label={item.batchJobDescription}>&nbsp;</div>
        </Tooltip>
      </div>
      <div className={`${ROOT}__button-container`}>
        <Button
          className={`${ROOT}__new-button`}
          type="secondary"
          disabled={activateButton}
          onClick={executeBatchJob}
        >
          {msg().Com_Btn_Execute}
        </Button>
      </div>
      <div className={`${ROOT}__info-container`}>
        <div className={`${ROOT}__params-container`}>
          {item.additionalParam?.map((additionalParam) =>
            renderAdditionalParam(additionalParam)
          )}
        </div>
      </div>
    </div>
  );
};

export default BatchJobItem;
