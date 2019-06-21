/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

// List of projects/orgs using your project for the users page.
const users = [
  {
    caption: 'Amplitude',
    // You will need to prepend the image path with your baseUrl
    // if it is not '/', like: '/test-site/img/image.jpg'.
    image: '/redux-query/img/amplitude-logo.svg',
    infoLink: 'https://amplitude.com',
    pinned: true,
  },
];

const siteConfig = {
  title: 'redux-query', // Title for your website.
  tagline: 'A library for managing network state in Redux',
  url: 'https://amplitude.github.io', // Your website URL
  baseUrl: '/redux-query/', // Base URL for your project */
  // For github.io type URLs, you would set the url and baseUrl like:
  //   url: 'https://facebook.github.io',
  //   baseUrl: '/test-site/',

  // Used for publishing and more
  projectName: 'redux-query',
  organizationName: 'amplitude',
  // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    { doc: 'getting-started', label: 'Docs' },
    { href: 'https://github.com/amplitude/redux-query', label: 'GitHub' },
  ],

  // If you have users set above, you add it here:
  users,

  /* path to images for header/footer */
  // headerIcon: 'img/redux-query-white.png',
  // footerIcon: 'img/redux-query-white.png',
  // favicon: 'img/favicon.ico',

  /* Colors for website */
  colors: {
    primaryColor: '#914187',
    secondaryColor: '#5d1d53',
  },

  /* Custom fonts for website */
  /*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright © ${new Date().getFullYear()} Amplitude`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'default',
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: [
    'https://buttons.github.io/buttons.js',
    'https://cdn.amplitude.com/libs/amplitude-5.2.2-min.gz.js',
    '/redux-query/js/analytics.js',
  ],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,

  algolia: {
    apiKey: '9bcd3f8820b12f68241d561c58d31fa2',
    indexName: 'amplitude-redux-query',
    algoliaOptions: {},
  },

  // Open Graph and Twitter card images.
  // ogImage: 'img/undraw_online.svg',
  // twitterImage: 'img/undraw_tweetstorm.svg',

  // Show documentation's last contributor's name.
  // enableUpdateBy: true,

  // Show documentation's last update time.
  // enableUpdateTime: true,

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  repoUrl: 'https://github.com/amplitude/redux-query',
};

module.exports = siteConfig;
