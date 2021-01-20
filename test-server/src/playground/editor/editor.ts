import * as ace from 'brace';
import 'brace/theme/chrome';
import 'brace/mode/html';
import {debounce} from '../../../../src/modules/esl-utils/async/debounce';
import stripIndent from 'strip-indent';
import {bind} from '../../../../src/modules/esl-utils/decorators/bind';
import {Playground} from '../core/playground';
import {ESLBaseElement} from '../../../../src/modules/esl-base-element/core/esl-base-element';

export class ESLEditor extends ESLBaseElement {
  public static is = 'esl-editor';
  protected editor: ace.Editor;
  protected playground: Playground;

  protected connectedCallback(): void {
    super.connectedCallback();
    this.playground = (document.querySelector('esl-playground') as Playground);
    this.playground.subscribe(this.setMarkup);

    this.editor = ace.edit(this);
    this.setEditorOptions();
    this.editor.on('change', this.onChange);
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

  protected onChange = debounce(() => this.playground.passMarkup(this.editor.getValue(), ESLEditor.is), 1000);

  @bind
  protected setMarkup(markup: string, source: string): void {
    if (source !== ESLEditor.is) {
      this.editor.setValue(stripIndent(markup).trim(), -1);
    }
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.editor.removeListener('change', this.onChange);
    this.playground.unsubscribe(this.setMarkup);
  }
}

ESLEditor.register();
