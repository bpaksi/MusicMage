import React from "react";

class WithCustomData extends React.Component {
  onClickEvent = () => {
    const { onClick, data } = this.props;

    onClick(data);
  };

  onChangeEvent = e => {
    const { onChange, onChangeDivineValue, data } = this.props;
    const value = onChangeDivineValue ? onChangeDivineValue(e) : e;

    // console.log('WithCustomData - onChangeEvent: ', {data: e.target.value});
    onChange(value, data);
  };

  render() {
    const {
      onClick,
      onChange,
      onChangeDivineValue,
      children,
      ...rest
    } = this.props;

    if (onClick) {
      rest.onClick = this.onClickEvent;
    }
    if (onChange) {
      rest.onChange = this.onChangeEvent;
    }

    return children(rest);
  }
}

export function withCustomData(onChangeDivineValue) {
  return Wrapped => props => {
    const { children, data } = props;
    console.assert(data, "This component requires data to be passed.");

    const newProps = { ...props, onChangeDivineValue };

    return (
      <WithCustomData {...newProps}>
        {wrappedProps => <Wrapped {...wrappedProps}>{children}</Wrapped>}
      </WithCustomData>
    );
  };
}
