import React from 'react';

import IconDOC from '@commons/images/icons/doc.svg';
import IconIMG from '@commons/images/icons/image.svg';
import IconPDF from '@commons/images/icons/pdf.svg';
import IconXLS from '@commons/images/icons/xls.svg';

import { isDOC, isPDF, isXLS } from '@apps/domain/models/exp/Receipt';

export type Props = {
  attachedFileDataType: string;
};

const FileTypeIcon = ({ attachedFileDataType }: Props) => {
  if (isDOC(attachedFileDataType)) {
    return <IconDOC />;
  } else if (isXLS(attachedFileDataType)) {
    return <IconXLS />;
  } else if (isPDF(attachedFileDataType)) {
    return <IconPDF />;
  } else {
    return <IconIMG />;
  }
};

export default FileTypeIcon;
