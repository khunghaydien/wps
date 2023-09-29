import * as React from 'react';

import Label from './Label';

import './Label.scss';

const ROOT = 'mobile-app-atoms-label';

type LabelProps = Readonly<{
  className?: string;
  htmlFor?: string;
  text: string;
  marked?: boolean;
  emphasis?: boolean;
  children?: React.ReactNode;
  hintMsg?: string;
  onClickHint?: () => void;
}>;
type Props = Readonly<
  LabelProps & {
    isShowHint?: boolean;
  }
>;

const LabelWithHint = (props: Props) => {
  const { isShowHint, ...labelProps } = props;
  return (
    <>
      <div className={`${ROOT}__main`}>
        <Label {...labelProps}>{props.children}</Label>
      </div>
      <div className={`${ROOT}__hint-area`}>{isShowHint && props.hintMsg}</div>
    </>
  );
};

export default LabelWithHint;
