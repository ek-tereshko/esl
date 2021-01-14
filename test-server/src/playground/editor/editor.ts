import * as ace from 'brace';
import 'brace/theme/chrome';
import 'brace/mode/html';
import {debounce} from '../../../../src/modules/esl-utils/async/debounce';
import {ESLBaseElement, attr} from '../../../../src/modules/esl-base-element/core';
import {bind} from '../../../../src/modules/esl-utils/decorators/bind';
import stripIndent from 'strip-indent';

export class ESLEditor extends ESLBaseElement {
  public static is = 'esl-editor';
  public static eventNs = 'esl:editor';
  protected editor: ace.Editor;

  @attr() public markup: string;

  static get observedAttributes() {
    return ['markup'];
  }

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (!this.connected || oldVal === newVal) return;

    if (attrName === 'markup' && this.editor.getValue() !== newVal) {
      this.editor.setValue(stripIndent(newVal).trim(), -1);
    }
  }

  protected connectedCallback(): void {
    super.connectedCallback();

    this.editor = ace.edit(this);
    this.setEditorOptions();
    this.editor.on('change', debounce(this.markupChange, 1000));
  }

  protected setEditorOptions(): void {
    this.editor.setOptions({
      theme: 'ace/theme/chrome',
      mode: 'ace/mode/html',
      printMarginColumn: -1,
      wrap: true,
    });

    this.editor.session.setWrapLimitRange(125, 125);
  }

  @bind
  protected markupChange(): void {
    this.markup = this.editor.getValue();
    this.$$fireNs('markupChange', {detail: {markup: this.markup}});
  }
}

ESLEditor.register();
