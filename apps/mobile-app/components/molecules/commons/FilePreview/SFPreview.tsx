import React, { useEffect, useState } from 'react';

import classNames from 'classnames';
import isNull from 'lodash/isNull';
import moment from 'moment';
import momentTz from 'moment-timezone';

import IconDOC from '../../../../../commons/images/icons/doc.svg';
import IconPDF from '../../../../../commons/images/icons/pdf.svg';
import IconXLS from '../../../../../commons/images/icons/xls.svg';
import msg from '../../../../../commons/languages';
import DateUtil from '../../../../../commons/utils/DateUtil';
import LangUtil from '../../../../../commons/utils/LangUtil';

import {
  fileDownloadUrl,
  isDOC,
  isPDF,
  isXLS,
  previewUrl,
  SF_PREVIEW_SIZE,
} from '../../../../../domain/models/exp/Receipt';

import { Props } from './index';

import './SFPreview.scss';

const maxWaitIme = 60000;
const WAIT_BLOCK = 4000;

const STATUS = {
  IN_PROGRESS: 'inProgress',
  LOADED: 'loaded',
};
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const SFPreview = (props: Props) => {
  const [startTime, setStartTime] = useState(0);
  const [status, setStatus] = useState('');
  const [url, setUrl] = useState('');

  const {
    dataType,
    fileId,
    id,
    title,
    uploadedDate,
    onClickImage = () => {},
    openExternal,
    fullScreenPreview,
  } = props;

  const cacheUrl = previewUrl(fileId, true, SF_PREVIEW_SIZE.LARGE);
  const noCacheUrl = `${cacheUrl}&${Math.random()}`;
  useEffect(() => {
    const lang = LangUtil.getLang();
    const format =
      lang === 'ja' ? 'YYYY-MM-DD HH:mm:ss' : 'DD-MM-YYYY HH:mm:ss';

    const curDate = momentTz(new Date())
      .tz(DateUtil.getEmpTimeZone())
      .format(format);
    // If receipt uploaded within last 1 minute, call preview url till the time preview is ready
    // Salesforce takes around 20 sec to generate preview
    const formattedDate = moment(uploadedDate || '', format).toDate();
    const formattedCurDate = moment(curDate, format).toDate();
    const timeDiff = DateUtil.differenceInMinutes(
      formattedCurDate,
      formattedDate || new Date()
    );
    const isUploadedRecently = !uploadedDate || timeDiff < 2;

    if (isUploadedRecently) {
      setStatus(STATUS.IN_PROGRESS);
      setUrl(noCacheUrl);
    } else {
      setStatus(STATUS.LOADED);
      setUrl(cacheUrl);
    }
    /* eslint-disable react-hooks/rules-of-hooks, react-hooks/exhaustive-deps */
  }, [uploadedDate]);

  useEffect(() => {
    setUrl(cacheUrl);
    /* eslint-disable react-hooks/rules-of-hooks, react-hooks/exhaustive-deps */
  }, [fileId]);

  const fileDUrl = fileDownloadUrl(id);

  const ROOT = 'mobile-app-molecules-commons-file-sf-preview';

  const onLoad = () => {
    if (status !== STATUS.LOADED) {
      setStatus(STATUS.LOADED);
    }
  };

  const onError = async () => {
    if (startTime > maxWaitIme) {
      setUrl(null);
      setStatus(STATUS.LOADED);
    }
    if (status === STATUS.LOADED) {
      setUrl(null);
    } else {
      setStartTime((prevState) => prevState + WAIT_BLOCK);
      await delay(WAIT_BLOCK);
      setUrl(noCacheUrl);
    }
  };

  const renderImg = (isNull(url) && (
    <span className={`${ROOT}_large-file-msg-with-link`} onClick={onClickImage}>
      <span>{msg().Exp_Msg_CannotLoadPreview}</span>
      {(openExternal || fullScreenPreview) && (
        <span className={`${ROOT}_large-file-msg-with-link-title`}>
          {title}
        </span>
      )}
    </span>
  )) || (
    <img
      src={url}
      alt={msg().Exp_Lbl_Receipt}
      onLoad={onLoad}
      onError={onError}
      onClick={onClickImage}
    />
  );

  const renderPlaceHolderIcon = () => (
    <span onClick={onClickImage} className={`${ROOT}__placeholder-icon`}>
      {isPDF(dataType) && <IconPDF aria-hidden="true" />}
      {isDOC(dataType) && <IconDOC aria-hidden="true" />}
      {isXLS(dataType) && <IconXLS aria-hidden="true" />}
    </span>
  );

  const renderWithLink = (html) => (
    <a href={fileDUrl} download={title}>
      {html}
    </a>
  );

  const renderMsg = (classes: string) => (
    <div className={`${ROOT}__msg ${classes}`}>
      {msg().Exp_Msg_GeneratingPreview}
    </div>
  );

  const placeHolderIcon = renderPlaceHolderIcon();

  const renderFIleWithFullScreenView = () => {
    const previewClassName = classNames(`${ROOT}__area`, {
      [`${ROOT}__expand`]: fullScreenPreview,
    });

    const placeHolderClassName = classNames({
      [`${ROOT}__placeholder`]: status !== STATUS.IN_PROGRESS,
    });

    const imgClassName = classNames({
      [`${ROOT}__image`]: status !== STATUS.LOADED,
    });

    const placeHolder = (
      <div className={placeHolderClassName}>
        <div className={`${ROOT}__thumbnail`}>{placeHolderIcon}</div>
        {renderMsg(`${ROOT}__msg-center`)}
      </div>
    );

    const renderedFILE = <div className={imgClassName}>{renderImg}</div>;

    const html = (
      <div className={previewClassName}>
        {placeHolder}
        {renderedFILE}
      </div>
    );
    return fullScreenPreview ? renderWithLink(html) : html;
  };

  const renderFIleWithExternalLink = () => {
    const placeHolderClassName = classNames(ROOT, {
      [`${ROOT}__placeholder`]: status !== STATUS.IN_PROGRESS,
    });

    const imgClassName = classNames(ROOT, {
      [`${ROOT}__image`]: status !== STATUS.LOADED,
    });

    const placeHolder = (
      <div className={placeHolderClassName}>
        {renderWithLink(placeHolderIcon)}
        {renderMsg(`${ROOT}__msg-ext`)}
      </div>
    );

    const renderedFILE = (
      <div className={imgClassName}>{renderWithLink(renderImg)}</div>
    );

    return (
      <div className={`${ROOT}__area`}>
        {placeHolder}
        {renderedFILE}
      </div>
    );
  };

  return openExternal
    ? renderFIleWithExternalLink()
    : renderFIleWithFullScreenView();
};

export default SFPreview;
