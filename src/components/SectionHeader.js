import React, {PureComponent} from 'react';
import {node} from 'prop-types';

export default class SectionHeader extends PureComponent {
  static propTypes = {
    children: node,
  };

  render() {
    return (
      <section className="hero">
        <div className="hero-body">
          <div className="container">{this.props.children}</div>
        </div>
      </section>
    );
  }
}
