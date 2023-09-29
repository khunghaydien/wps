import useAsync from './useAsync';

export default function useScript(url, id = '') {
  return useAsync(() => {
    if (document.getElementById(id)) return Promise.resolve({ loading: false });
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.id = id;

    return new Promise((resolve, reject) => {
      script.addEventListener('load', resolve);
      script.addEventListener('error', reject);
      document.body.appendChild(script);
    });
  }, [url]);
}
