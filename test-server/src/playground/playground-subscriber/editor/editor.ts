import * as ace from 'brace';
import 'brace/theme/chrome';
import 'brace/mode/html';
import {debounce} from '../../../../../src/modules/esl-utils/async/debounce';
import stripIndent from 'strip-indent';
import {PlaygroundSubscriber} from '../playground-subscriber';
import {bind} from '../../../../../src/modules/esl-utils/decorators/bind';

export class ESLEditor extends PlaygroundSubscriber {
  public static is = 'esl-editor';
  protected editor: ace.Editor;

  protected connectedCallback(): void {
    super.connectedCallback();
    this.setupPlaygroundConnection();

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

  protected onChange = debounce(() => this.$$fire('markupChange',
    {detail: {markup: this.editor.getValue(), source: ESLEditor.is}}), 1000);

  @bind
  protected setMarkup(markup: string, source: string): void {
    if (source !== ESLEditor.is) {
      this.editor.setValue(stripIndent(markup).trim(), -1);
    }
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.editor.removeListener('markupChange', this.onChange);
    this.removePlaygroundListeners();
  }
}

ESLEditor.register();
