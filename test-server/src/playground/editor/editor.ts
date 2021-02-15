import * as ace from 'brace';
import 'brace/theme/chrome';
import 'brace/mode/html';
import js_beautify from 'js-beautify';

import {debounce} from '../../../../src/modules/esl-utils/async/debounce';
import {bind} from '../../../../src/modules/esl-utils/decorators/bind';
import {ESLPlayground} from '../core/playground';
import {ESLBaseElement, jsonAttr} from '../../../../src/modules/esl-base-element/core';
import {EventUtils} from '../../../../src/modules/esl-utils/dom/events';

interface EditorConfig {
  theme: string;
  mode: string;
  printMarginColumn: number;
  wrap: number;
}

export class ESLEditor extends ESLBaseElement {
  public static is = 'esl-editor';
  public static defaultOptions = {
    theme: 'ace/theme/chrome',
    mode: 'ace/mode/html',
    printMarginColumn: -1,
    wrap: 120,
  };
  @jsonAttr()
  public editorConfig: EditorConfig;

  protected editor: ace.Editor;
  protected playground: ESLPlayground;

  protected connectedCallback(): void {
    super.connectedCallback();
    this.playground = this.closest(`${ESLPlayground.is}`) as ESLPlayground;

    if (!this.playground) return;

    this.playground.addEventListener('state:change', this.setMarkup);

    this.editor = ace.edit(this);
    this.initEditorOptions();

    this.editor.$blockScrolling = Infinity;
    this.editor.addEventListener('change', this.onChange);
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.editor.removeEventListener('change', this.onChange);
    this.playground && this.playground.removeEventListener('state:change', this.setMarkup);
  }

  protected get mergedEditorConfig() {
    const type = (this.constructor as typeof ESLEditor);
    return Object.assign({}, type.defaultOptions, this.editorConfig || {});
  }

  protected initEditorOptions(): void {
    this.editor.setOptions(this.mergedEditorConfig);
  }

  protected onChange = debounce(() => {
    EventUtils.dispatch(this, 'request:change', {detail: {source: ESLEditor.is, markup: this.editor.getValue()}});
  }, 1000);

  @bind
  protected setMarkup(e: CustomEvent): void {
    const {markup, source} = e.detail;
    if (source !== ESLEditor.is) {
      this.setEditorValue(markup);
    }
  }

  protected setEditorValue(value: string): void {
    this.editor.removeEventListener('change', this.onChange);
    this.editor.setValue(js_beautify.html(value), -1);
    this.editor.addEventListener('change', this.onChange);
  }
}

