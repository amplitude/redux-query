amplitude.init('ee635703b34b79df955b8420d8f1c57f', null, { includeReferrer: true });
amplitude.getInstance().logEvent('view page', {
  path: location.pathname,
});
