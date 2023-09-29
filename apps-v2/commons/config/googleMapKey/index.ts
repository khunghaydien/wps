export default ((): string => {
  /* eslint-disable global-require */
  if (process.env.SF_ENV === 'vfp') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('./vfp').default;
  } else {
    // storybook で表示できなくなってしまうので
    // 「本番」と「その他」という扱いにしています。
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('./local').default;
  }
  /* eslint-enable global-require */
})();
