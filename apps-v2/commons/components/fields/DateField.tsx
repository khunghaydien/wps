import React from 'react';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';

import classNames from 'classnames';
import moment, { Moment } from 'moment';

import msg from '@apps/commons/languages/index';

import DateUtil from '../../utils/DateUtil';

import 'react-datepicker/dist/react-datepicker.css';
import './DateField.scss';

const ROOT = 'commons-fields-date-field';

export type Props = {
  value: string; // YYYY-MM-DD
  selected?: string; // YYYY-MM-DD
  minDays?: number;
  maxDays?: number;
  minDate?: Moment; // YYYY-MM-DD
  maxDate?: Moment; // YYYY-MM-DD
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  checkDateFormat?: boolean;
  onChange?: Function;
  className?: string;
  required?: boolean;
  dateFormat?: string;
  popperClassName?: string;
  popperContainer?(props: { children: React.ReactNode[] }): React.ReactNode;
  popperModifiers?: ReactDatePickerProps['popperModifiers'];
  customInput?: any;
  'data-testid'?: string;
  fixedHeight?: boolean;
  disableManualEnter?: boolean;
};

type State = {
  value: string;
};

/**
 * 日付項目
 * NOTE: 現在内部的に使用している react-datepicker は moment オブジェクトでやり取りするが、
 * このコンポーネントの I/F は YYYY-MM-DD 形式の文字列になっている。
 * （props に渡す値も、onChange で返される値も YYYY-MM-DD）
 * <input type="date"> と揃えたというのと、
 * react-lightning-design-system への置き換えも検討しているのが理由。
 */
export default class DateField extends React.Component<Props, State> {
  static get defaultProps() {
    return {
      value: '',
      selected: null,
      minDays: null,
      maxDays: null,
      minDate: null,
      maxDate: null,
      placeholder: '',
      customInput: null,
      disabled: false,
      readOnly: false,
      className: '',
      required: false,
      dateFormat: 'L',
      'data-testid': '',
      disableManualEnter: false,
    };
  }

  constructor(props) {
    super(props);
    this.state = { value: this.convertToFormattedStr(props.value) };
    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onChangeRaw = this.onChangeRaw.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const formattedValue = this.convertToFormattedStr(nextProps.value);
    this.setState({ value: formattedValue });
  }

  onChange(momentObj) {
    // stateのvalueはinputにセットされるため空文字を設定
    const value = momentObj ? momentObj.format('YYYY-MM-DD') : '';

    // 渡される値はYYYY-MM-DDのString
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }

  onBlur(e) {
    const value = e.target.value;
    const momentObj = this.convertToMomentObj(value);
    // only trigger onChange when momentObj is valid
    if (momentObj || value === '') {
      this.onChange(momentObj);
    } else if (this.props.checkDateFormat && value === '') {
      // update values even if value is empty
      this.onChange(value);
    } else if (momentObj === null && this.props.checkDateFormat) {
      this.props.onChange(msg().Admin_Lbl_InvalidDate);
    }
  }

  // 内部inputのchangeイベント
  // value propを利用するようにしたため、自前で更新する必要がでてきた
  onChangeRaw(e) {
    this.setState({ value: e.target.value });
  }

  convertToMomentObj(dateStr): any {
    return moment(
      dateStr,
      ['YYYY-MM-DD', 'YYYY/M/D', 'L', 'MM/DD/YYYY'],
      true
    ).isValid()
      ? moment(dateStr, ['YYYY-MM-DD', 'YYYY/M/D', 'L', 'MM/DD/YYYY'])
      : null;
  }

  convertToFormattedStr(dateStr) {
    const momentObj = this.convertToMomentObj(dateStr);
    if (this.props.checkDateFormat) {
      if (momentObj === null) {
        return dateStr;
      } else {
        return momentObj.format(this.props.dateFormat);
      }
    } else {
      if (momentObj === null) {
        return '';
      } else {
        return momentObj.format(this.props.dateFormat);
      }
    }
  }

  render() {
    const cssClass = classNames(this.props.className, 'slds-input');

    // NOTE: showYearDropdown, dateFormatCalendar は
    // locale を日本語にしたときに "7月 2017" と表示されるのを防ぐためにセットしている
    const props: ReactDatePickerProps = {
      className: cssClass,
      // ts-ignore
      selected: this.state.value
        ? this.convertToMomentObj(this.state.value)
        : this.convertToMomentObj(this.props.selected),
      value: this.state.value,
      placeholderText: this.props.placeholder,
      disabled: this.props.disabled,
      readOnly: this.props.readOnly,
      onChange: this.onChange,
      onBlur: this.onBlur,
      onChangeRaw: this.onChangeRaw,
      showYearDropdown: true,
      dateFormatCalendar: 'MMMM',
      required: this.props.required,
      popperContainer: this.props.popperContainer,
      popperClassName: this.props.popperClassName || '',
      customInput: this.props.customInput,
      locale: DateUtil.currentLang(),
      fixedHeight: this.props.fixedHeight,
      onKeyDown: this.props.disableManualEnter
        ? (e) => {
            e.preventDefault();
          }
        : () => {},
      popperModifiers: this.props.popperModifiers,
    };

    // minDays, maxDaysにnullを通してしまうとキーボード操作時にエラーとなる
    // (PropTypesはObject)
    // なので項目自体を必要なときのみ生成する
    if (this.props.minDate !== null) {
      props.minDate = this.convertToMomentObj(this.props.minDate);
    } else if (this.props.minDays !== null) {
      // TODO: 範囲の基準がクライアント環境の「当日」に固定されている点に、そのような用途があるか懸念がある
      props.minDate = moment().add(this.props.minDays, 'days') as any;
    }
    if (this.props.maxDate !== null) {
      props.maxDate = this.convertToMomentObj(this.props.maxDate);
    } else if (this.props.maxDays !== null) {
      // TODO: 範囲の基準がクライアント環境の「当日」に固定されている点に、そのような用途があるか懸念がある
      props.maxDate = moment().add(this.props.maxDays, 'days') as any;
    }

    return (
      <div className={`${ROOT}`} data-testid={this.props['data-testid']}>
        <DatePicker {...props} />
      </div>
    );
  }
}
