const rupture = require('rupture');
module.exports = {
  siteMetadata: {
    title: 'Fun with Ascii and Kaomoji',
  },

  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-stylus',
      options: {
        use: [rupture()],
      },
    },
  ],
}
