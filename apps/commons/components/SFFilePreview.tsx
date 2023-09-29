import React, { useEffect, useState } from 'react';

import classNames from 'classnames';
import isNull from 'lodash/isNull';
import moment from 'moment';
import momentTz from 'moment-timezone';

import {
  fileDownloadUrl,
  isDOC,
  isPDF,
  isXLS,
  previewUrl,
  SF_PREVIEW_SIZE,
} from '../../domain/models/exp/Receipt';

import DateUtil from '../utils/DateUtil';
import LangUtil from '../utils/LangUtil';

import IconDOC from '../images/icons/doc.svg';
import IconPDF from '../images/icons/pdf.svg';
import IconXLS from '../images/icons/xls.svg';
import msg from '../languages';

import './SFFilePreview.scss';

type Props = {
  fileType?: string;
  receiptFileId: string;
  receiptId: string;
  uploadedDate: string;
  fileName?: string;
  classes?: string;
  selected?: boolean;
  withDownloadLink?: boolean;
  isApexView?: boolean;
};

const ROOT = 'ts-expenses-sf-file-preview';

const maxWaitIme = 60000;
const WAIT_BLOCK = 4000;

const FILE_STATUS = {
  IN_PROGRESS: 'inProgress',
  LOADED: 'loaded',
};
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/*
For files which are not image type (example pdf, doc, xls), salesforce may take upto 15-20 seconds to generate a preview.
This component is used to display a placeholder and wait for preview to be ready
*/
const SFFilePreview = (props: Props) => {
  const [startTime, setStartTime] = useState(0);
  const [status, setStatus] = useState('');
  const [url, setUrl] = useState('');

  const {
    fileType,
    receiptFileId,
    receiptId,
    uploadedDate,
    selected,
    fileName,
    withDownloadLink,
    classes,
  } = props;

  const cacheUrl = !withDownloadLink
    ? previewUrl(receiptFileId, true)
    : previewUrl(receiptFileId, true, SF_PREVIEW_SIZE.LARGE);

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
    const formattedDate = moment(uploadedDate, format).toDate();
    const formattedCurDate = moment(curDate, format).toDate();
    const timeDiff = DateUtil.differenceInMinutes(
      formattedCurDate,
      formattedDate
    );
    const isUploadedRecently = !uploadedDate || timeDiff < 2;

    if (isUploadedRecently) {
      setStatus(FILE_STATUS.IN_PROGRESS);
      setUrl(noCacheUrl);
    } else {
      setStatus(FILE_STATUS.LOADED);
      setUrl(cacheUrl);
    }
    /* eslint-disable react-hooks/rules-of-hooks, react-hooks/exhaustive-deps */
  }, []);

  useEffect(() => {
    setUrl(cacheUrl);
    /* eslint-disable react-hooks/rules-of-hooks, react-hooks/exhaustive-deps */
  }, [receiptFileId]);

  const onLoad = () => {
    if (status !== FILE_STATUS.LOADED) {
      setStatus(FILE_STATUS.LOADED);
    }
  };

  const onError = async () => {
    if (startTime > maxWaitIme) {
      setUrl(null);
      setStatus(FILE_STATUS.LOADED);
    }
    if (status === FILE_STATUS.LOADED) {
      setUrl(null);
    } else {
      setStartTime((prevState) => prevState + WAIT_BLOCK);
      await delay(WAIT_BLOCK);
      setUrl(noCacheUrl);
    }
  };

  const previewClassName = classNames(`${ROOT}__preview-msg`, {
    [`${ROOT}__hide-msg`]: status !== FILE_STATUS.IN_PROGRESS,
    [`${ROOT}__msg-center`]: !withDownloadLink,
    [`${ROOT}__msg-left`]: withDownloadLink,
  });

  const imgClassName = classNames(classes, {
    [`${ROOT}__hide-img`]: status !== FILE_STATUS.LOADED,
    selected,
  });

  const linkObj = props.isApexView
    ? {
        onClick: () => {
          window.open(fileDownloadUrl(receiptId), '_blank');
        },
      }
    : { href: fileDownloadUrl(receiptId) };

  const placeHolder = withDownloadLink ? (
    <div className={previewClassName}>
      <a {...linkObj} download={fileName} className={`${ROOT}__download-link`}>
        {isPDF(fileType) && <IconPDF aria-hidden="true" />}
        {isDOC(fileType) && <IconDOC aria-hidden="true" />}
        {isXLS(fileType) && <IconXLS aria-hidden="true" />}
      </a>
      <div>{msg().Exp_Msg_GeneratingPreview}</div>
    </div>
  ) : (
    <div className={previewClassName}>{msg().Exp_Msg_GeneratingPreview}</div>
  );

  const renderedFile = withDownloadLink ? (
    <a {...linkObj} download={fileName} className={`${ROOT}_preview-link`}>
      {(isNull(url) && (
        <div className={`${ROOT}_large-file-msg-with-link`}>
          <div>{msg().Exp_Msg_CannotLoadPreview}</div>
          <div className={`${ROOT}_large-file-msg-with-link-download`}>
            {msg().Com_Btn_Download}
          </div>
          <div className={`${ROOT}_large-file-msg-with-link-title`}>
            {`${fileName || ''}`}
          </div>
        </div>
      )) || (
        <img
          className={imgClassName}
          src={url}
          alt={fileName}
          onLoad={onLoad}
          onError={onError}
        />
      )}
    </a>
  ) : (
    (isNull(url) && (
      <div className={`${ROOT}_large-file-msg`}>
        {msg().Exp_Msg_CannotLoadPreview}
      </div>
    )) || (
      <img
        className={imgClassName}
        src={url}
        alt={fileName}
        onLoad={onLoad}
        onError={onError}
      />
    )
  );

  const wrapperClass = withDownloadLink ? `${ROOT}_preview-area` : 'hhhh';

  return (
    <>
      <div className={wrapperClass}>
        {placeHolder}
        {renderedFile}
      </div>
    </>
  );
};

export default SFFilePreview;
