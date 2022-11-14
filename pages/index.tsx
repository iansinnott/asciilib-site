import type { NextPage } from "next";
import React from "react";
import classnames from "classnames";
import { lib } from "asciilib";
import find from "asciilib/find";
import { Subject, Observable, Subscription } from "rxjs";
import { AutoSizer, List } from "react-virtualized";
import "react-virtualized/styles.css";
import Clipboard from "clipboard";

/**
 * Will not throw if passed void.
 */
const toLower = (x: string | null | undefined) => (x ? x.toLowerCase() : "");

class Kaomoji extends React.Component {
  state = {
    justClicked: false,
  };

  sub: Subscription | null = null;

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
    /* @ts-ignore */
    const { item } = this.props;
    return (
      <div className={classnames("Kaomoji")}>
        <h4 style={{ margin: 0 }}>{item.name}</h4>
        <p className={classnames("clippable")}>{item.entry}</p>
        <button
          onClick={this.handleClick}
          className={classnames("copyToClick flex", {
            anime: this.state.justClicked,
          })}
          data-clipboard-text={item.entry}
        >
          <ClipboardIcon style={{ marginRight: 10 }} />
          Copy
        </button>
      </div>
    );
  }
}

class VirtualizedList extends React.Component {
  clipboard: Clipboard | null = null;

  renderRow = ({ key, index, style }) => (
    <div key={key} style={style}>
      {/* @ts-ignore */}
      <Kaomoji item={this.props.items[index]} />
    </div>
  );

  componentDidMount() {
    this.clipboard = new Clipboard("." + classnames("copyToClick"));
  }

  componentWillUnmount() {
    this.clipboard?.destroy();
  }

  render() {
    // @ts-ignore
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

const focusElement = (el) => el && el.focus();

class Index extends React.Component<Awaited<ReturnType<typeof getStaticProps>>["props"]> {
  state = {
    items: Object.values(lib),
  };

  searchTerm$: Subject<string | null | undefined> = new Subject();

  sub: Subscription | null = null;

  handleChange = (e) => {
    this.searchTerm$.next(e.target.value);
  };

  componentDidMount() {
    this.sub = this.searchTerm$
      .debounceTime(50)
      .map(toLower)
      .mergeMap((x) => find(x).toArray())
      .subscribe((items) => this.setState({ items }));
  }

  componentWillUnmount() {
    if (this.sub) this.sub.unsubscribe();
  }

  render() {
    return (
      <div className={classnames("Index")}>
        <h1 style={{ marginBottom: 0 }}>
          <strong>Acii</strong>lib Search
        </h1>
        <small className={classnames("poweredBy")}>
          Powered by{" "}
          <a className="link" href="https://github.com/iansinnott/asciilib">
            asciilib@{this.props.asciilibVersion}
          </a>
        </small>
        <input
          ref={focusElement}
          placeholder="Search..."
          onChange={this.handleChange}
          className={classnames("input rounded-full")}
        />
        <div className={classnames("flexHeight")}>
          {/* @ts-ignore */}
          <VirtualizedList items={this.state.items} />
        </div>
        <a className={classnames("fork")} href="https://github.com/iansinnott/asciilib">
          <img
            src="https://camo.githubusercontent.com/38ef81f8aca64bb9a64448d0d70f1308ef5341ab/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6461726b626c75655f3132313632312e706e67"
            alt="Fork me on GitHub"
            data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png"
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              border: 0,
            }}
          />
        </a>
      </div>
    );
  }
}

export default Index;

export const getStaticProps = async () => {
  return {
    props: {
      asciilibVersion: require("asciilib/package.json").version,
    },
  };
};

interface IClipboardIcon extends React.ComponentProps<"svg"> {}
export const ClipboardIcon = ({ className, ...props }: IClipboardIcon) => {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 16 16"
        data-test-id="ClipboardIcon"
        className={classnames("", className)}
        {...props}
      >
        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"></path>
        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"></path>
      </svg>
    </div>
  );
};
