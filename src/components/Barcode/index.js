import React from 'react';
import JsBarcode from 'jsbarcode';

export default class Barcode extends React.PureComponent {
  componentDidMount() {
    JsBarcode(this.barcode, this.props.code);
  }
  render() {
    return (
      <svg
        ref={e => {
          this.barcode = e;
        }}
      />
    );
  }
}
