import * as ace from 'brace';
import 'brace/theme/monokai';
import 'brace/mode/html';

export class PlaygroundEditor extends HTMLElement {
  editor: ace.Editor;

  constructor() {
    super();
  }

  protected connectedCallback() {
    this.render();
    this.editor = ace.edit('editor');
    this.setEditorOptions();
  }

  protected setEditorOptions() {
    this.editor.setOptions({
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: false,
      theme: 'ace/theme/twilight',
      mode: 'ace/mode/html',
      printMarginColumn: -1
    });
  }

  render() {
    this.innerHTML = `<div id="editor" style="
    height: 250px; width: 700px">hello world</div>`;
  }
}
