import React from 'react';

import _ from 'lodash';
import uuidV4 from 'uuid/v4';

import displayType from '../../../constants/displayType';
import fieldSize from '../../../constants/fieldSize';
import fieldType from '../../../constants/fieldType';

import AttTimeField from '../../../../commons/components/fields/AttTimeField';
import AttTimeRangeField from '../../../../commons/components/fields/AttTimeRangeField';
import DateField from '../../../../commons/components/fields/DateField';
import Label from '../../../../commons/components/fields/Label';
import RadioGroupField, {
  LAYOUT_TYPE as RADIO_GROUP_FIELD_LAYOUT_TYPE,
} from '../../../../commons/components/fields/RadioGroupField';
import TextAreaField from '../../../../commons/components/fields/TextAreaField';
import TextField from '../../../../commons/components/fields/TextField';
import msg from '../../../../commons/languages';
import TimeUtil from '../../../../commons/utils/TimeUtil';

import * as ConfigUtil from '../../../utils/ConfigUtil';

import AutoSuggestTextField from '../../AutoSuggestTextField';
import Select from './Select';

import './DetailItem.scss';

const ROOT = 'admin-pc-contents-detail-pane__body__item-list';

type Props = {
  config?: any;
  baseValueGetter?: any;
  historyValueGetter?: any;
  getOrganizationSetting?: any;
  onChangeCheckBox?: any;
  onChangeDetailItem?: any;
  sfObjFieldValues?: any;
  tmpEditRecord?: any;
  useFunction?: any;
  disabled?: boolean;
  disabledValidDateTo?: boolean;
  checkboxes?: any;
  tmpEditRecordBase?: any;
  mode?: any;
};
export default class DetailItem extends React.Component<Props> {
  static makeOptions(props) {
    const { config, tmpEditRecord, sfObjFieldValues } = props;
    let options = {};

    if (config.options) {
      options = config.options.map((option) => ({
        text: msg()[option.msgkey],
        value: option.value,
      }));
    } else {
      options = [...(sfObjFieldValues[config.props] || [])]
        .filter((settingItem) => {
          return (
            !config.ignoreItself ||
            (settingItem.value !== tmpEditRecord.id &&
              settingItem.value !== tmpEditRecord.baseId)
          );
        })
        .map((settingItem) => {
          if (config.multiLanguageValue) {
            return {
              text: msg()[settingItem.label],
              value: settingItem.value,
            };
          } else {
            return { text: settingItem.label, value: settingItem.value };
          }
        });
    }

    if (!config.multiple) {
      if (
        !tmpEditRecord[config.key] ||
        !config.isRequired ||
        config.type === fieldType.FIELD_SELECT_WITH_PLACEHOLDER
      ) {
        // @ts-ignore
        const firstOption = _.first(options);
        const selectLabel = msg().Admin_Lbl_PleaseSelect;
        // @ts-ignore
        if (firstOption && firstOption.text !== selectLabel) {
          // @ts-ignore
          options.unshift({ text: selectLabel, value: '' });
        }
      }
    }

    return options;
  }

  static defaultProps = {
    disabled: false,
    getOrganizationSetting: {},
    onChangeCheckBox: () => {},
    sfObjFieldValues: {},
    disabledValidDateTo: false,
  };

  static getDerivedStateFromProps(nextProps, state) {
    return {
      uuid: state.uuidV4,
      options: DetailItem.makeOptions(nextProps),
    };
  }

  constructor(props) {
    super(props);
    this.state = DetailItem.getDerivedStateFromProps(props, { uuid: uuidV4() });
  }

  parseMinute(value) {
    if (value === 0 || value === '0') {
      return 0;
    } else {
      return parseInt(value) || '';
    }
  }

  renderCheckboxMessage(config) {
    if (_.isEmpty(config.label)) {
      return null;
    }

    return (
      <span className={`${ROOT}__item__checkbox-message`}>
        {msg()[config.label]}
      </span>
    );
  }

  renderAttTimeField(key) {
    const { config, onChangeDetailItem, tmpEditRecord, disabled } = this.props;
    const timeValue = this.parseMinute(tmpEditRecord[key]);

    return (
      <AttTimeField
        disabled={disabled}
        onBlur={(value) => {
          onChangeDetailItem(key, String(TimeUtil.toMinutes(value)));
        }}
        value={TimeUtil.toHHmm(timeValue)}
        required={config.isRequired}
      />
    );
  }

  renderAttTimeRangeField(key, subkey) {
    // @ts-ignore
    const { uuid } = this.state;
    const { config, onChangeDetailItem, tmpEditRecord, disabled } = this.props;
    const startTimeValue = this.parseMinute(tmpEditRecord[key]);
    const endTimeValue = this.parseMinute(tmpEditRecord[subkey]);

    return (
      <AttTimeRangeField
        key={`${uuid}${key}`}
        onBlurAtStart={(value) => {
          onChangeDetailItem(key, String(TimeUtil.toMinutes(value)));
        }}
        onBlurAtEnd={(value) => {
          onChangeDetailItem(subkey, String(TimeUtil.toMinutes(value)));
        }}
        startTime={TimeUtil.toHHmm(startTimeValue)}
        endTime={TimeUtil.toHHmm(endTimeValue)}
        required={config.isRequired}
        disabled={disabled}
      />
    );
  }

  renderCheckbox(key, disabled, label) {
    return (
      <label>
        <input
          type="checkbox"
          disabled={disabled}
          onChange={(event) => {
            event.persist();
            return this.props.onChangeCheckBox(event, key);
          }}
          checked={this.props.tmpEditRecord[key] || false}
        />
        {this.renderCheckboxMessage({ label })}
      </label>
    );
  }

  renderDetailItemField() {
    // @ts-ignore
    const { uuid } = this.state;
    const { config, tmpEditRecord, onChangeDetailItem, sfObjFieldValues } =
      this.props;
    switch (config.type) {
      case fieldType.FIELD_AUTOSUGGEST_TEXT:
        const suggestList = (sfObjFieldValues[config.props] || []).map(
          (settingItem) => {
            const suggest = {};
            for (let i = 0; i < config.autoSuggest.suggestionKey.length; i++) {
              const key = config.autoSuggest.suggestionKey[i];
              suggest[key] = settingItem[key];
            }
            return suggest;
          }
        );
        return (
          // @ts-ignore
          <AutoSuggestTextField
            key={`${uuid}${config.key}`}
            onBlur={(e, value) => {
              onChangeDetailItem(config.key, value);
            }}
            disabled={this.props.disabled}
            value={tmpEditRecord[config.key]}
            configKey={config.key}
            required={config.isRequired}
            suggestList={suggestList}
            suggestConfig={config.autoSuggest}
          />
        );
      case fieldType.FIELD_VALID_DATE:
        return (
          // @ts-ignore
          <div required={config.isRequired}>
            <DateField
              key={`${uuid}${config.key}1`}
              className={`${ROOT}__item-date ts-text-field slds-input`}
              disabled={this.props.disabled || config.readOnly}
              onChange={(value) => {
                onChangeDetailItem('validDateFrom', value);
              }}
              value={tmpEditRecord.validDateFrom}
              required={config.isRequired}
            />
            {` – `}
            <DateField
              key={`${uuid}${config.key}2`}
              className={`${ROOT}__item-date ts-text-field slds-input`}
              disabled={
                this.props.disabled ||
                this.props.disabledValidDateTo ||
                config.readOnly
              }
              onChange={(value) => {
                onChangeDetailItem('validDateTo', value);
              }}
              value={tmpEditRecord.validDateTo}
            />
          </div>
        );
      case fieldType.FIELD_USER_NAME:
        return (
          // @ts-ignore
          <div required={config.isRequired}>
            <TextField
              key={`${uuid}${config.key}1`}
              className={`${ROOT}__item-name`}
              disabled={this.props.disabled}
              onChange={(e) => {
                onChangeDetailItem(
                  `lastName_${config.ltype}`,
                  e.target.value,
                  config.charType
                );
              }}
              placeholder={msg().Admin_Lbl_LastName}
              isRequired={config.isRequired}
              value={tmpEditRecord[`lastName_${config.ltype}`]}
            />
            <TextField
              key={`${uuid}${config.key}2`}
              className={`${ROOT}__item-name`}
              disabled={this.props.disabled}
              onChange={(e) => {
                onChangeDetailItem(
                  `firstName_${config.ltype}`,
                  e.target.value,
                  config.charType
                );
              }}
              placeholder={msg().Admin_Lbl_FirstName}
              value={tmpEditRecord[`firstName_${config.ltype}`]}
            />
            <TextField
              key={`${uuid}${config.key}3`}
              className={`${ROOT}__item-name`}
              disabled={this.props.disabled}
              onChange={(e) => {
                onChangeDetailItem(
                  `middleName_${config.ltype}`,
                  e.target.value,
                  config.charType
                );
              }}
              placeholder={msg().Admin_Lbl_MiddleName}
              value={tmpEditRecord[`middleName_${config.ltype}`]}
              isRequired={config.isRequired}
            />
          </div>
        );
      case fieldType.FIELD_TEXT:
        return (
          <TextField
            key={`${uuid}${config.key}`}
            onChange={(e) => {
              onChangeDetailItem(config.key, e.target.value, config.charType);
            }}
            disabled={this.props.disabled || config.readOnly}
            value={tmpEditRecord[config.key]}
            isRequired={config.isRequired}
            maxLength={config.maxLength}
          />
        );
      case fieldType.FIELD_TEXTAREA:
        return (
          <TextAreaField
            key={`${uuid}${config.key}`}
            onChange={(e) => {
              onChangeDetailItem(config.key, e.target.value);
            }}
            disabled={this.props.disabled}
            value={tmpEditRecord[config.key] || ''}
            isRequired={config.isRequired}
            className={`${ROOT}__textarea`}
          />
        );
      case fieldType.FIELD_SELECT:
      case fieldType.FIELD_SELECT_WITH_PLACEHOLDER: {
        const val = _.isInteger(tmpEditRecord[config.key])
          ? tmpEditRecord[config.key].toString()
          : tmpEditRecord[config.key];
        return (
          <Select
            key={`${uuid}${config.key}`}
            onChange={(value) => onChangeDetailItem(config.key, value)}
            disabled={this.props.disabled}
            // @ts-ignore
            options={this.state.options}
            value={val}
            required={config.isRequired}
            multiple={config.multiple}
            disableReset={config.disableReset}
          />
        );
      }
      case fieldType.FIELD_RADIO: {
        const options = (sfObjFieldValues[config.props] || []).map(
          (settingItem) => ({
            text: msg()[settingItem.label],
            value: settingItem.value,
          })
        );
        return (
          <RadioGroupField
            disabled={this.props.disabled}
            key={`${uuid}${config.key}`}
            layout={RADIO_GROUP_FIELD_LAYOUT_TYPE.vertical}
            options={options}
            value={tmpEditRecord[config.key]}
            onChange={(value) => onChangeDetailItem(config.key, value)}
            showSelectedTextOnly={false}
            name={`${uuid}${config.key}`}
          />
        );
      }
      case fieldType.FIELD_DATE:
        return (
          <DateField
            key={`${uuid}${config.key}`}
            className={`${ROOT}__item-date ts-text-field slds-input`}
            disabled={this.props.disabled || config.readOnly}
            onChange={(value) => {
              onChangeDetailItem(config.key, value);
            }}
            value={tmpEditRecord[config.key] || ''}
            required={config.isRequired}
          />
        );
      case fieldType.FIELD_TIME:
        return this.renderAttTimeField(config.key);
      case fieldType.FIELD_TIME_START_END:
        return this.renderAttTimeRangeField(config.key, config.subkey);
      case fieldType.FIELD_CHECKBOX:
        return this.renderCheckbox(
          config.key,
          this.props.disabled,
          config.label
        );
      case fieldType.FIELD_NUMBER:
        return (
          <TextField
            key={`${uuid}${config.key}`}
            type="number"
            min={config.min}
            max={config.max}
            step={config.step}
            value={tmpEditRecord[config.key]}
            disabled={this.props.disabled}
            isRequired={config.isRequired}
            onChange={(e) =>
              onChangeDetailItem(config.key, e.target.value, 'numeric')
            }
          />
        );
      case fieldType.FIELD_CUSTOM:
        return (
          <config.Component
            key={`${uuid}${config.key}`}
            required={this.props.config.isRequired} // Labelコンポーネントから参照される
            {...this.props}
          />
        );
      default:
        return null;
    }
  }

  render() {
    // FIXME リファクタリング対象
    const { config } = this.props;

    if (
      !ConfigUtil.isSatisfiedCondition(
        config,
        this.props.baseValueGetter,
        this.props.historyValueGetter
      )
    ) {
      return null;
    }

    if (
      config.type === fieldType.FIELD_HIDDEN ||
      config.display === displayType.DISPLAY_LIST ||
      !ConfigUtil.isAllowedFunction(config, this.props.useFunction)
    ) {
      return null;
    }
    let name = msg()[config.msgkey] || '';
    if (config.key.match(/_L0$/)) {
      if (!this.props.getOrganizationSetting.language0) {
        return null;
      }
      const lang0 = _.find(this.props.sfObjFieldValues.language, (o) => {
        return o.value === this.props.getOrganizationSetting.language0;
      });
      name += `(${lang0.label})`;
    } else if (config.key.match(/_L1$/)) {
      const lang1 = _.find(this.props.sfObjFieldValues.language, (o) => {
        return o.value === this.props.getOrganizationSetting.language1;
      });
      if (!this.props.getOrganizationSetting.language1) {
        return null;
      }
      name += `(${lang1.label})`;
    } else if (config.key.match(/_L2$/)) {
      if (!this.props.getOrganizationSetting.language2) {
        return null;
      }
      const lang2 = _.find(this.props.sfObjFieldValues.language, (o) => {
        return o.value === this.props.getOrganizationSetting.language2;
      });
      name += `(${lang2.label})`;
    }

    let className = `${ROOT}__item`;

    const helpMsg = config.help ? msg()[config.help] : '';

    if (config.title) {
      className += ` ${ROOT}__item--has-title`;
    }

    if (config.class) {
      className += ` ${config.class}`;
    }

    return (
      // @ts-ignore
      <li key={this.state.uuid} className={className}>
        {this.props.config.noLabel && this.renderDetailItemField()}
        {!this.props.config.noLabel && (
          <Label
            text={name}
            childCols={config.size || fieldSize.SIZE_MEDIUM}
            labelCols={config.labelSize}
            helpMsg={helpMsg}
          >
            {this.renderDetailItemField()}
          </Label>
        )}
      </li>
    );
  }
}
