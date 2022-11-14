import React from "react";
import Helmet from "react-helmet";
import classNames from "classnames";

export default class Layout extends React.Component<{ children: React.ReactNode }> {
  render() {
    return (
      <div className={classNames("App")}>
        <Helmet
          title="A library of ascii faces and kaomoji (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧"
          meta={[
            { name: "description", content: "Sample" },
            { name: "keywords", content: "ascii-art, kaomoji" },
          ]}
        />
        {this.props.children}
      </div>
    );
  }
}
