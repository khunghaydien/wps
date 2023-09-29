import * as React from 'react';
import ReactDOM from 'react-dom';

const usePortal = (id: string, elm: React.ReactNode): React.ReactPortal => {
  const dest = React.useRef(document.createElement('div'));
  dest.current.setAttribute('id', id);

  React.useEffect(() => {
    if (document.body) {
      document.body.appendChild(dest.current);
    }
    return (): void => {
      if (document.body) {
        document.body.removeChild(dest.current);
      }
    };
  }, [elm]);

  return ReactDOM.createPortal(elm, dest.current);
};

export default usePortal;
