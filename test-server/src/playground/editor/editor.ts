import * as ace from 'brace';
import 'brace/theme/chrome';
import 'brace/mode/html';
import {debounce} from '../../../../src/modules/esl-utils/async/debounce';
import {ESLBaseElement, attr} from '../../../../src/modules/esl-base-element/core';

export class ESLEditor extends ESLBaseElement {
  static is = 'esl-editor';
  protected editor: ace.Editor;

  @attr() public markup: string;

  static get observedAttributes() {
    return ['markup'];
  }

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (!this.connected || oldVal === newVal) return;

    if (attrName === 'markup') {
      this.editor.setValue(newVal);
    }
  }

  protected connectedCallback(): void {
    super.connectedCallback();

    this.render();
    this.editor = ace.edit('editor');
    this.setEditorOptions();
    this.editor.on('change', debounce(this.markupChange.bind(this), 2000));
  }

  protected setEditorOptions(): void {
    this.editor.setOptions({
      theme: 'ace/theme/chrome',
      mode: 'ace/mode/html',
      printMarginColumn: -1
    });
  }

  protected markupChange(): void {
    this.setAttribute('markup', this.editor.getValue());
    this.dispatchEvent(new CustomEvent('codeChange', {
      bubbles: true,
      detail: {markup: this.markup},
      cancelable: true
    }));
  }

  render(): void {
    this.innerHTML = `<div id="editor" style="
    height: 250px; width: 700px"></div>`;
  }
}

ESLEditor.register();
