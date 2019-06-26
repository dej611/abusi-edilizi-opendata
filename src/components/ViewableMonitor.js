import React, {Component} from 'react';
import {func, node} from 'prop-types';
import Observer from '@researchgate/react-intersection-observer';

export default class ViewableMonitor extends Component {
  static propTypes = {
    tag: node,
    children: func.isRequired,
  };

  static defaultProps = {
    tag: 'div',
  };

  state = {
    isIntersecting: false,
  };

  handleChange = ({isIntersecting}) => {
    this.setState({isIntersecting});
  };

  render() {
    const {tag: Tag, children, ...rest} = this.props;

    return (
      <Observer {...rest} onChange={this.handleChange}>
        <Tag>{children(this.state.isIntersecting)}</Tag>
      </Observer>
    );
  }
}
