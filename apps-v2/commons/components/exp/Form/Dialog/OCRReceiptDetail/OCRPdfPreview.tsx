import React, {
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useSelector } from 'react-redux';

import styled from 'styled-components';

import Button from '@commons/components/buttons/Button';
import Lightbox from '@commons/components/Lightbox';
import Pagination from '@commons/components/Pagination';
import Spinner from '@commons/components/Spinner';
import msg from '@commons/languages';
import { State as CommonExpState } from '@commons/modules/exp';
import { State as UserSettingState } from '@commons/reducers/userSetting';

import {
  OCR_PDF_IMG_TYPE,
  OcrPdfDoc,
  renderPdfPage,
} from '@apps/domain/models/exp/OCR';
import { OcrPage } from '@apps/domain/models/exp/Receipt';

import MetadataDisplay from './MetadataDisplay';

type State = {
  common: {
    app: {
      loadingAreas: string[];
    };
    exp: CommonExpState;
  };
  userSetting: UserSettingState;
};

type Props = {
  isExecutingOcr: boolean;
  pdfContentDocId: string;
  pdfScannedImgList: OcrPage[];
  setIsExecuteOcr: (isExecutingOcr: boolean) => void;
  uploadAndExecuteOcrImg: (
    base64Url: string,
    pageNum: number,
    pdfContentDocId: string
  ) => Promise<void>;
};

const DEFAULT_PAGE_NUM = 1;
const DISPLAY_NUM = 5;
const PAGE_SIZE = 1;
let pageNumPending = null;

const renderPage = async (
  canvasRef: RefObject<HTMLCanvasElement>,
  currentPage: number,
  pdfDoc?: OcrPdfDoc
) => {
  const canvas = canvasRef.current;
  try {
    if (!pdfDoc) return '';

    await renderPdfPage(canvas, currentPage, pdfDoc);
    return canvas.toDataURL(OCR_PDF_IMG_TYPE);
  } catch (err) {
    canvas.remove();
  }
};

const OCRPdfPreview = ({
  isExecutingOcr,
  pdfContentDocId,
  pdfScannedImgList,
  setIsExecuteOcr,
  uploadAndExecuteOcrImg,
}: Props) => {
  const useImageQualityCheck = useSelector(
    (state: State) => state.userSetting.useImageQualityCheck
  );
  const metadataList = useSelector(
    (state: State) => state.common.exp.entities.fileMetadata
  );
  const ocrPdfDocsObj = useSelector(
    (state: State) => state.common.exp.ui.ocrPdfDocs
  );

  const pdfDocObj = ocrPdfDocsObj[pdfContentDocId];
  const scannedPageNumList = pdfScannedImgList.map((img) => img.pdfPageNum);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(true);
  const [base64Url, setBase64Url] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(DEFAULT_PAGE_NUM);
  const imgMetadata = metadataList.find(
    ({ contentDocumentId }) => contentDocumentId === pdfContentDocId
  );

  useEffect(() => {
    // render last scan image in canvas
    renderPage(canvasRef, currentPage, pdfDocObj)
      .then((base64Url) => {
        if (base64Url) setBase64Url(base64Url);
      })
      .finally(() => {
        setIsPreviewLoading(false);
      });
  }, []);

  const queueRenderPage = async (pageNum: number) => {
    if (isPreviewLoading) {
      pageNumPending = pageNum;
    } else {
      try {
        let base64Url = '';
        setIsPreviewLoading(true);
        base64Url = await renderPage(canvasRef, pageNum, pdfDocObj);

        // render pending page
        if (pageNumPending !== null) {
          base64Url = await renderPage(canvasRef, pageNumPending, pdfDocObj);
          pageNumPending = null;
        }
        if (base64Url) setBase64Url(base64Url);
      } finally {
        setIsPreviewLoading(false);
      }
    }
  };

  const onClickScanBtn = async () => {
    setIsExecuteOcr(true);
    try {
      await uploadAndExecuteOcrImg(base64Url, currentPage, pdfContentDocId);
    } finally {
      setIsExecuteOcr(false);
    }
  };

  const onClickPagerLink = useCallback(
    (pageNum: number) => {
      setBase64Url('');
      setCurrentPage(pageNum);
      queueRenderPage(pageNum);
    },
    [isPreviewLoading]
  );

  const pageCount = pdfDocObj ? pdfDocObj.numPages : DEFAULT_PAGE_NUM;
  const isDisableScanBtn =
    !base64Url || isExecutingOcr || scannedPageNumList.includes(currentPage);
  const isLoadPreviewFail = !isPreviewLoading && !base64Url;
  return (
    <>
      <MetadataDisplay
        metadata={imgMetadata}
        useImageQualityCheck={useImageQualityCheck}
      />
      {isPreviewLoading && (
        <SpinnerWrapper>
          <Spinner hintMsg={msg().Exp_Lbl_LoadingPreview} loading />
        </SpinnerWrapper>
      )}
      <PreviewSection>
        <LightboxWrapper>
          <Lightbox modalUrl={base64Url}>
            <CanvasPreview ref={canvasRef} base64Url={base64Url} />
          </Lightbox>
        </LightboxWrapper>
        {isLoadPreviewFail && (
          <NoPreview>{msg().Exp_Msg_CannotLoadPreview}</NoPreview>
        )}
      </PreviewSection>
      <PreviewControl>
        <Pagination
          currentPage={currentPage}
          totalNum={pageCount}
          displayNum={DISPLAY_NUM}
          pageSize={PAGE_SIZE}
          onClickPagerLink={onClickPagerLink}
          maxPageNum={pageCount}
          havePagerInfo={false}
        />
        <Button
          disabled={isDisableScanBtn}
          type="primary"
          onClick={onClickScanBtn}
        >
          {msg().Exp_Lbl_ScanThisPage}
        </Button>
      </PreviewControl>
    </>
  );
};

const SpinnerWrapper = styled.div`
  position: relative;
  top: 33%;

  .commons-spinner {
    position: absolute;
  }
`;

const PreviewSection = styled.div`
  max-height: 100%;
  height: 100%;
  overflow: auto;
`;

const LightboxWrapper = styled.div`
  .lightbox__modal {
    z-index: 6000101; // position element infront of common spinner
  }
`;

const CanvasPreview = styled.canvas<{ base64Url: string }>`
  width: 100%;
  display: ${({ base64Url }) => (base64Url ? 'block' : 'none')};
`;

const NoPreview = styled.div`
  width: 100%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PreviewControl = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 15px 5px 0;
`;

export default OCRPdfPreview;
