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
      .mergeMap(x => find(x).toArray())
      .subscribe(items => this.setState({ items }));
  }

  componentWillUnmount() {
    if (this.sub) this.sub.unsubscribe();
  }

  render() {
    return (
      <div className={cx('Index')}>
        <h1><strong>Acii</strong>lib Search</h1>
        <input
          ref={focusElement}
          placeholder='Search...'
          onChange={this.handleChange}
          className={cx('input')}
        />
        <div className={cx('flexHeight')}>
          <VirtualizedList items={this.state.items} />
        </div>
      </div>
    )
  }
}
