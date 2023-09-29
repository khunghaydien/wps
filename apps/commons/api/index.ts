export default (() => {
  /* eslint-disable global-require */
  if (process.env.SF_ENV === 'local') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('./local').default;
  }
  if (process.env.SF_ENV === 'vfp') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('./vfp').default;
  }

  /* eslint-enable global-require */

  const msg = [
    `%c【未知のAPI接続環境指定です】`,
    `    process.env.SF_ENV = ${process.env.SF_ENV}`,
    `※ commons/api ディレクトリに目的環境用のアダプタを設置してください。`,
  ];
  console.error(
    msg.join(`\n`),
    'color:#f00;font-size:xx-large;margin: 1em 0.5em'
  );

  return {};
})();

export const NAMESPACE_PREFIX = '__SF_NAMESPACE__'.replace('.', '__');
