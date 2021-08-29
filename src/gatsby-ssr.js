import React from 'react';

const GTAG_SRC = `https://www.googletagmanager.com/gtag/js`;

exports.onRenderBody = (
  { setHeadComponents, setPostBodyComponents },
  pluginOptions
) => {
  const isPluginEnabled =
    stringToBool(process.env.GATSBY_GTAG_DEBUG) ||
    process.env.NODE_ENV === 'production';

  if (!pluginOptions.trackingId || !isPluginEnabled) {
    return null;
  }

  const anonymize = pluginOptions.anonymize || false;

  const gtagScript = (
    <script
      async
      key="gatsby-plugin-gtag-gtag-js"
      src={`${GTAG_SRC}?id=${pluginOptions.trackingId}`}
    />
  );

  const scriptStr = `
    window.GATSBY_GTAG_PLUGIN_GA_TRACKING_ID = (
      '${pluginOptions.trackingId}'
    );
    window.GATSBY_GTAG_PLUGIN_ANONYMIZE = ${anonymize};

    var options = {
      send_page_view: true
    };
    if (${anonymize}) {
      options.anonymize_ip = true;
    }

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', '${pluginOptions.trackingId}', options);
  `;
  const trackScript = (
    <script
      key="gatsby-plugin-gtag-inline-script"
      dangerouslySetInnerHTML={{ __html: scriptStr }}
    />
  );

  const setComponents = pluginOptions.head
    ? setHeadComponents
    : setPostBodyComponents;

  return setComponents([gtagScript, trackScript]);
};

function stringToBool(s) {
  if (!s) {
    return false;
  }

  const sNorm = s.trim().toLowerCase();
  if (!sNorm.length) {
    return false;
  }

  return sNorm === 'true' || sNorm === '1';
}
