import * as ace from 'brace';
import 'brace/theme/chrome';
import 'brace/mode/html';
import js_beautify from 'js-beautify';

import {debounce} from '../../../../src/modules/esl-utils/async/debounce';
import {bind} from '../../../../src/modules/esl-utils/decorators/bind';
import {ESLPlayground} from '../core/playground';
import {ESLBaseElement} from '../../../../src/modules/esl-base-element/core/esl-base-element';
import {TraversingQuery} from '../../../../src/modules/esl-traversing-query/core';

export class ESLEditor extends ESLBaseElement {
  public static is = 'esl-editor';
  protected editor: ace.Editor;
  protected playground: ESLPlayground;
  protected triggerChanges: boolean;

  protected connectedCallback(): void {
    super.connectedCallback();
    this.playground = TraversingQuery.first(`::parent(${ESLPlayground.is})`, this) as ESLPlayground;
    if (this.playground) {
      this.playground.subscribe(this.setMarkup);
    }

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

    this.editor.session.setWrapLimitRange(120, 120);
  }

  protected onChange = debounce(() => {
    this.triggerChanges && this.playground.passMarkup(this.editor.getValue(), ESLEditor.is);
    this.triggerChanges = true;
  }, 1000);

  @bind
  protected setMarkup(markup: string, source: string): void {
    if (source !== ESLEditor.is) {
      this.triggerChanges = false;
      this.editor.setValue(js_beautify.html(markup), -1);
    }
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.editor.removeListener('change', this.onChange);
    this.playground && this.playground.unsubscribe(this.setMarkup);
  }
}

ESLEditor.register();
