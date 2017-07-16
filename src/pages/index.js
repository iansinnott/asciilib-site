import React from "react"
import Link from "gatsby-link"
import Helmet from "react-helmet"
import classnames from 'classnames/bind';
import { lib } from 'asciilib';
import find from 'asciilib/find';
import { Subject } from 'rxjs';
import { AutoSizer, List } from 'react-virtualized';
import 'react-virtualized/styles.css';

import s from './Index.module.styl';
const cx = classnames.bind(s);

const Kaomoji = ({ item }) => (
  <div className={cx('Kaomoji')}>
    <h4 style={{ margin: 0 }}>{item.name}</h4>
    {item.entry}
  </div>
);

class VirtualizedList extends React.Component {
  renderRow = ({ key, index, style }) => (
    <div key={key} style={style}>
      <Kaomoji item={this.props.items[index]} />
    </div>
  );

  render() {
    const { items } = this.props;
    return (
      <AutoSizer>
        {({ width, height }) => (
          <List
            width={width}
            height={height}
            rowCount={items.length}
            rowHeight={60}
            rowRenderer={this.renderRow}
          />
        )}
      </AutoSizer>
    );
  }
}

export default class Index extends React.Component {
  state = {
    items: Object.values(lib),
  };

  handleChange = (e) => {
    console.log(e.target.value);
  }

  render() {
    return (
      <div className={cx('Index')}>
        <h1><strong>Acii</strong>lib Search</h1>
        <input
          placeholder='Search...'
          onChange={this.handleChange}
          className={cx('input')} />
        <div className={cx('flexHeight')}>
          <VirtualizedList items={this.state.items} />
        </div>
      </div>
    )
  }
}
