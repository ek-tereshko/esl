import * as ace from 'brace';
import 'brace/theme/chrome';
import 'brace/mode/html';
import {debounce} from '../../../../src/modules/esl-utils/async/debounce';
import {ESLBaseElement} from '../../../../src/modules/esl-base-element/core';
import stripIndent from 'strip-indent';
import {Playground} from '../core/playground';

export class ESLEditor extends ESLBaseElement {
  public static is = 'esl-editor';
  protected editor: ace.Editor;
  protected playground: Playground;

  protected connectedCallback(): void {
    super.connectedCallback();

    this.playground = (document.querySelector('esl-playground') as Playground);
    customElements.whenDefined(Playground.is).then(() => this.playground.stateObservable.addListener(this.setMarkup));

    this.editor = ace.edit(this);
    this.setEditorOptions();
    this.editor.on('change', debounce(() => this.$$fire('markupChange',
      {detail: {markup: this.editor.getValue(), source: ESLEditor.is}}), 1000));
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

  protected setMarkup(markup: string, source: string): void {
    if (source !== ESLEditor.is) {
      this.editor.setValue(stripIndent(markup).trim(), -1);
    }
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.playground.stateObservable.removeListener(this.setMarkup);
  }
}

ESLEditor.register();
