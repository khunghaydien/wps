import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';

import styled from 'styled-components';

export const ZOOM_IN_INCREMENT = 1.25;
export const ZOOM_OUT_INCREMENT = 0.8;
export const MAX_ZOOM_SCALE = 6;
export const ORIGINAL_SCALE = 1;
export enum INITIAL_VIEW_OPTIONS {
  FIT_PAGE,
  FIT_WIDTH,
}
export type INITIAL_VIEW =
  | INITIAL_VIEW_OPTIONS.FIT_PAGE
  | INITIAL_VIEW_OPTIONS.FIT_WIDTH;

type ImageViewerRefProps = {
  resetZoom?: () => void;
  zoomIn?: () => void;
};

interface IImageViewerProps {
  imgSrc: string;
  initialView?: INITIAL_VIEW;
  setCurrentScale?: (scale: number) => void;
}

const ImageViewer = forwardRef<ImageViewerRefProps, IImageViewerProps>(
  ({ imgSrc, initialView, setCurrentScale }, ref) => {
    const canvasRef = useRef(null);
    const background = useMemo(() => new Image(), [imgSrc]);
    const getIsAtOriginalScale = () => {
      if (canvasRef.current) {
        const context = canvasRef.current.getContext('2d');
        const { a: currentScale } = context.getTransform();
        // scale factor with decimals close to 1 is considered as original scale
        // e.g. 1.0000123 ~= 1
        return currentScale.toFixed(4) === '1.0000';
      }

      return false;
    };
    const getIsMaxZoomed = () => {
      if (canvasRef.current) {
        const context = canvasRef.current.getContext('2d');
        const { a: currentScale } = context.getTransform();
        // currently max zoom is 8 times
        // by using 1.25 factor of 8 is around 5.96 ~= 6
        return Math.round(currentScale) >= MAX_ZOOM_SCALE;
      }

      return false;
    };

    let isDragStart = false;
    let isDragging = false;
    let dragStartPosition = { x: 0, y: 0 };
    let currentCoordinates = { x: 0, y: 0 };

    useImperativeHandle(ref, () => ({
      zoomIn: () => {
        const { x, y } = getMidPointCoordinates();
        zoomIn(x, y);
      },
      zoomOut: () => {
        const { x, y } = getMidPointCoordinates();
        zoomOut(x, y);
      },
      resetZoom: () => {
        initializeCanvas();
      },
    }));

    const clearCanvas = () => {
      if (canvasRef.current) {
        // Canvas clears when dimension is mutated
        canvasRef.current.width += 0;
        canvasRef.current.height += 0;
      }
    };

    const drawCanvas = () => {
      if (canvasRef.current) {
        const { width, height } = canvasRef.current;
        const context = canvasRef.current.getContext('2d');

        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, width, height);
        context.restore();

        drawImageToCanvas();
      }
    };

    const drawImageToCanvas = () => {
      const { width, height } = background;
      const context = canvasRef.current.getContext('2d');

      const canvas = context.canvas;
      context.clearRect(0, 0, canvas.width, canvas.height);

      if (initialView === INITIAL_VIEW_OPTIONS.FIT_WIDTH) {
        const wrh = width / height;
        let newWidth = canvas.width;
        let newHeight = newWidth / wrh;

        if (newWidth > canvas.width) {
          newWidth = canvas.width;
          newHeight = newWidth * wrh;
        }

        context.drawImage(background, 0, 0, newWidth, newHeight);
      }

      if (initialView === INITIAL_VIEW_OPTIONS.FIT_PAGE || !initialView) {
        const hRatio = canvas.width / width;
        const vRatio = canvas.height / height;
        const ratio = Math.min(hRatio, vRatio);

        const centerShiftX = (canvas.width - width * ratio) / 2;
        const centerShiftY = (canvas.height - height * ratio) / 2;

        context.drawImage(
          background,
          0,
          0,
          width,
          height,
          centerShiftX,
          centerShiftY,
          width * ratio,
          height * ratio
        );
      }
    };

    const initializeCanvas = () => {
      if (canvasRef.current && background) {
        fitCanvasToContainer();

        drawImageToCanvas();
      }
    };

    const fitCanvasToContainer = () => {
      // Make it visually fill the positioned parent
      canvasRef.current.style.width = '100%';
      canvasRef.current.style.height = '100%';
      // ...then set the internal size to match
      canvasRef.current.width = canvasRef.current.offsetWidth;
      canvasRef.current.height = canvasRef.current.offsetHeight;
    };

    const updateCurrentCoordinates = (x, y) => {
      currentCoordinates = getCurrentCoordinates(x, y);
    };

    const zoom = (zoom, x = currentCoordinates.x, y = currentCoordinates.y) => {
      if (canvasRef.current) {
        const context = canvasRef.current.getContext('2d');

        context.translate(x, y);
        context.scale(zoom, zoom);
        context.translate(-x, -y);

        drawCanvas();

        const { a: currentScale } = context.getTransform();

        if (getIsAtOriginalScale()) {
          setCurrentScale(1);
          return;
        }

        setCurrentScale(currentScale);
      }
    };

    const zoomIn = (x = undefined, y = undefined) => {
      if (getIsMaxZoomed()) {
        return;
      }

      zoom(ZOOM_IN_INCREMENT, x, y);
    };

    const zoomOut = (x = undefined, y = undefined) => {
      if (getIsAtOriginalScale()) {
        return;
      }

      zoom(ZOOM_OUT_INCREMENT, x, y);
    };

    const handleWheel = (event) => {
      const { offsetX: x, offsetY: y } = event.nativeEvent;
      updateCurrentCoordinates(x, y);

      if (!isDragStart) {
        if (event.deltaY < 0) {
          zoomIn();
        } else {
          zoomOut();
        }
      }
    };

    const handleMouseDown = (event) => {
      const { button, offsetX, offsetY } = event.nativeEvent;
      const isContextMenuClick = button === 2;

      if (isContextMenuClick) {
        return;
      }

      isDragStart = true;
      dragStartPosition = getCurrentCoordinates(offsetX, offsetY);
    };

    const handleMouseMove = (event) => {
      const { offsetX: x, offsetY: y } = event.nativeEvent;
      updateCurrentCoordinates(x, y);

      if (isDragStart && canvasRef.current) {
        isDragging = true;
        const context = canvasRef.current.getContext('2d');
        context.translate(
          currentCoordinates.x - dragStartPosition.x,
          currentCoordinates.y - dragStartPosition.y
        );

        drawCanvas();
      }
    };

    const handleMouseUp = (event) => {
      const { button } = event.nativeEvent;
      const isContextMenuClick = button === 2;

      if (isContextMenuClick) {
        return;
      }

      isDragStart = false;

      if (!isDragging) {
        handleClick(event);
      }

      isDragging = false;
    };

    const getMidPointCoordinates = () => {
      if (canvasRef.current) {
        return {
          x: canvasRef.current.width / 2,
          y: canvasRef.current.height / 2,
        };
      }
    };

    const getCurrentCoordinates = (x, y) => {
      if (canvasRef.current) {
        const context = canvasRef.current.getContext('2d');
        const originalPoint = new DOMPoint(x, y);

        return context
          .getTransform()
          .invertSelf()
          .transformPoint(originalPoint);
      }
    };

    const handleClick = (event) => {
      if (canvasRef.current) {
        const { offsetX: x, offsetY: y } = event.nativeEvent;
        updateCurrentCoordinates(x, y);
        zoomIn();
      }
    };

    const handleContextMenu = (event) => {
      event.preventDefault();

      const { buttons, offsetX: x, offsetY: y } = event.nativeEvent;

      if (canvasRef.current && buttons === 2) {
        updateCurrentCoordinates(x, y);
        zoomOut();
      }
    };

    useEffect(() => {
      background.src = imgSrc;

      if (canvasRef.current) {
        // Clear canvas before loading new image
        clearCanvas();

        background.onload = () => {
          initializeCanvas();
        };
      }
    }, [background]);

    return (
      <StyledCanvas
        ref={canvasRef}
        onContextMenu={handleContextMenu}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        $isMaxZoomed={getIsMaxZoomed()}
      />
    );
  }
);

export default ImageViewer;

const StyledCanvas = styled.canvas<{
  $isDragging?: boolean;
  $isMaxZoomed?: boolean;
}>`
  :hover {
    cursor: ${({ $isMaxZoomed }) => ($isMaxZoomed ? 'normal' : 'zoom-in')};
  }
`;
