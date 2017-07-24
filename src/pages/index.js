import React from "react"
import Link from "gatsby-link"
import Helmet from "react-helmet"
import classnames from 'classnames/bind';
import { lib } from 'asciilib';
import find from 'asciilib/find';
import { Subject, Observable } from 'rxjs';
import { AutoSizer, List } from 'react-virtualized';
import 'react-virtualized/styles.css';
import Clipboard from 'clipboard';

import s from './Index.module.styl';
const cx = classnames.bind(s);

/**
 * Will not throw if passed void.
 */
const toLower = x => x ? x.toLowerCase() : '';

class Kaomoji extends React.Component {
  state = {
    justClicked: false,
  };

  handleClick = () => {
    this.cleanup();
    this.setState({ justClicked: true });
    this.sub = Observable.timer(700).subscribe(() => this.setState({ justClicked: false }));
  };

  cleanup = () => {
    if (this.sub) this.sub.unsubscribe();
  };

  componentWillUnmount() {
    this.cleanup();
  }

  render() {
    const { item } = this.props;
    return (
      <div className={cx('Kaomoji')}>
        <h4 style={{ margin: 0 }}>{item.name}</h4>
        <p className={cx('clippable')}>
          {item.entry}
        </p>
        <button
          onClick={this.handleClick}
          className={cx('copyToClick', {
            anime: this.state.justClicked,
          })}
          data-clipboard-text={item.entry}>
          <i style={{ marginRight: 10 }} className='fa fa-clipboard'></i>
          Copy
        </button>
      </div>
    );
  }
}

class VirtualizedList extends React.Component {
  renderRow = ({ key, index, style }) => (
    <div key={key} style={style}>
      <Kaomoji item={this.props.items[index]} />
    </div>
  );

  componentDidMount() {
    this.clipboard = new Clipboard('.' + cx('copyToClick'));
  }

  componentWillUnmount() {
    this.clipboard.destroy();
  }

  render() {
    const { items } = this.props;
    return (
      <AutoSizer>
        {({ width, height }) => (
          <List
            width={width}
            height={height}
            rowCount={items.length}
            rowHeight={73}
            rowRenderer={this.renderRow}
          />
        )}
      </AutoSizer>
    );
  }
}

const focusElement = el => el && el.focus();

export default class Index extends React.Component {
  state = {
    items: Object.values(lib),
  };

  searchTerm$ = new Subject();

  handleChange = (e) => {
    this.searchTerm$.next(e.target.value);
  };

  componentDidMount() {
    this.sub = this.searchTerm$
      .debounceTime(50)
      .map(toLower)
      .mergeMap(x => find(x).toArray())
      .subscribe(items => this.setState({ items }));
  }

  componentWillUnmount() {
    if (this.sub) this.sub.unsubscribe();
  }

  render() {
    return (
      <div className={cx('Index')}>
        <h1 style={{ marginBottom: 0 }}><strong>Acii</strong>lib Search</h1>
        <small className={cx('poweredBy')}>
          Powered by <a href='https://github.com/iansinnott/asciilib'>asciilib</a>
        </small>
        <input
          ref={focusElement}
          placeholder='Search...'
          onChange={this.handleChange}
          className={cx('input')}
        />
        <div className={cx('flexHeight')}>
          <VirtualizedList items={this.state.items} />
        </div>
        <a className={cx('fork')} href='https://github.com/iansinnott/asciilib-site'>
          <img
            src='https://camo.githubusercontent.com/38ef81f8aca64bb9a64448d0d70f1308ef5341ab/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6461726b626c75655f3132313632312e706e67' alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png"
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              border: 0,
            }}
          />
        </a>
      </div>
    )
  }
}
