import {Ace, edit} from 'ace-builds';
import {themesByName} from 'ace-builds/src-noconflict/ext-themelist';
import Editor = Ace.Editor;

export class PlaygroundEditor extends HTMLElement {
  editor: Editor;

  constructor() {
    super();
  }

  protected connectedCallback() {
    this.render();
    this.editor = edit('editor');
    this.setEditorOptions();

    this.classList.add('same');
  }

  private setEditorOptions() {
    console.log(themesByName.monokai);
  }

  render() {
    this.innerHTML = '<div id="editor">hello world</div>';
  }
}
