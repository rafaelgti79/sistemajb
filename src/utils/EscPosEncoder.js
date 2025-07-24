// Fonte: https://github.com/receipt-print-hq/escpos-encoder/blob/main/src/esc-pos-encoder.js
// Versão simplificada para uso básico com texto
export default class EscPosEncoder {
  constructor() {
    this._buffer = [];
  }

  _encode(string) {
    return new TextEncoder("utf-8").encode(string);
  }

  _add(...data) {
    this._buffer.push(...data);
    return this;
  }

  initialize() {
    return this._add(0x1b, 0x40); // ESC @
  }

  align(align) {
    const codes = { left: 0, center: 1, right: 2 };
    return this._add(0x1b, 0x61, codes[align] ?? 0);
  }

  bold(on = true) {
    return this._add(0x1b, 0x45, on ? 1 : 0);
  }

  line(text = "") {
    const encoded = this._encode(text);
    return this._add(...encoded, 0x0a); // 0x0a = \n
  }

  newline() {
    return this._add(0x0a);
  }

  cut(mode = 'full') {
    return this._add(0x1d, 0x56, mode === 'full' ? 0 : 1);
  }

  encode() {
    return new Uint8Array(this._buffer);
  }
}
