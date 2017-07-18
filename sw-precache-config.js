module.exports = {
  navigateFallback: '/index.html',
  stripPrefix: 'public',
  replacePrefix:'angular-stock-table',
  handleFetch: true,
  skipWaiting: true,
  root: 'public/',
  staticFileGlobs: [
    'public/index.html',
    'public/assets/**.png'
  ]
};