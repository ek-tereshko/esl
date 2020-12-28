import * as ace from 'brace';
import 'brace/theme/monokai';
import 'brace/mode/html';
import {debounce} from '../../../../modules/esl-utils/async/debounce';

export class PlaygroundEditor extends HTMLElement {
  protected editor: ace.Editor;

  constructor() {
    super();
  }

  set markup(val: string) {
    this.editor.setValue(val);
  }

  get markup() {
    return this.editor.getValue();
  }

  protected connectedCallback() {
    this.render();
    this.editor = ace.edit('editor');
    this.setEditorOptions();
    this.editor.on('change', debounce(this.changeCallback.bind(this), 2000));
  }

  protected setEditorOptions() {
    this.editor.setOptions({
      theme: 'ace/theme/monokai',
      mode: 'ace/mode/html',
      printMarginColumn: -1
    });
  }

  protected changeCallback() {
    this.dispatchEvent(new CustomEvent('codeChange', {
      bubbles: true,
      detail: {markup: this.markup},
      cancelable: true
    }));
  }

  render() {
    this.innerHTML = `<div id="editor" style="
    height: 250px; width: 700px">hello world</div>`;
  }
}
