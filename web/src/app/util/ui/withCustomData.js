import React from "react";


class WithCustomData extends React.Component {
	onClickEvent = () => {
		const { onClick, data } = this.props;

		onClick(data);
	};

	onChangeEvent = (e) => {
		const { onChange, onChangeDivineValue, data } = this.props;
		console.log('ClickEx - onChangeEvent: ', {data: e.target.value});

		const value = onChangeDivineValue ? onChangeDivineValue(e) : e;

    onChange(value, data);
	};
	

  render() {
		const { onClick, onChange, onChangeDivineValue, children, ...wrappedProps } = this.props;

    if (onClick) {
      wrappedProps.onClick = this.onClickEvent;
    }
    if (onChange) {
      wrappedProps.onChange = this.onChangeEvent;
    }

    console.log("ClickEnhancer - render: ", wrappedProps);
    return children(wrappedProps);
  }
}

export function withCustomData(onChangeDivineValue) {
  return Wrapped => props => {
		const { children, data } = props;
		console.assert(data, "Props don't contain data.")

		const newProps = {...props, onChangeDivineValue}

    return (
      <WithCustomData {...newProps}>
        {wrappedProps => <Wrapped {...wrappedProps}>{children}</Wrapped>}
      </WithCustomData>
    );
  };
}
