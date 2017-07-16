import React from 'react';
import PropTypes from 'prop-types';
import Link from 'gatsby-link';
import Helmet from 'react-helmet';
import classnames from 'classnames/bind';

import '../css/typography.css';
import s from './App.module.styl';
const cx = classnames.bind(s);
import exposeGlobals from '../lib/exposeGlobals.js';

if (process.env.NODE_ENV === 'development') {
  exposeGlobals(window);
}

export default class Template extends React.Component {
  static propTypes = {
    children: PropTypes.func,
  };

  render() {
    return (
      <div className={cx('App')}>
        <Helmet
          title='A library of ascii faces and kaomoji (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧'
          meta={[
            { name: 'description', content: 'Sample' },
            { name: 'keywords', content: 'ascii-art, kaomoji' },
          ]}
        />
        {this.props.children()}
      </div>
    );
  }
}
