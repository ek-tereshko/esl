import {ESLBaseElement} from '../../../../src/modules/esl-base-element/core/esl-base-element';
import {bind} from '../../../../src/modules/esl-utils/decorators/bind';
import {ESLEditor} from '../editor/editor';
import {ESLPreview} from '../preview/preview';

export class Playground extends ESLBaseElement {
  public static is = 'esl-playground';

  private _state: string;

  protected connectedCallback() {
    super.connectedCallback();
    this.bindEvents();
  }

  private get preview() {
    return this.querySelector(ESLPreview.is);
  }

  private get editor() {
    return this.querySelector(ESLEditor.is);
  }

  private get settings() {
    return this.querySelector('settings');
  }

  private bindEvents() {
    this.addEventListener(`${ESLEditor.eventNs}:markupChange`, this._onEditorMarkupChange);
    this.addEventListener(`esl:snippets:markupChange`, this._onSnippetChange);
    this.addEventListener(`esl:settings:markupChange`, this._onSettingsMarkupChange);
  }

  @bind
  protected _onEditorMarkupChange(e: CustomEvent) {
    this.setMarkup(this.preview, e.detail.markup);
    this.setMarkup(this.settings, e.detail.markup);
  }

  @bind
  protected _onSettingsMarkupChange(e: CustomEvent) {
    this.setMarkup(this.preview, e.detail.markup);
    this.setMarkup(this.editor, e.detail.markup);
  }

  @bind
  protected _onSnippetChange(e: CustomEvent) {
    this._state = e.detail.markup;   // some check?
    this.setMarkup(this.preview, this._state);
    this.setMarkup(this.editor, this._state);
  }

  private setMarkup(elem: Element | null, markup: string) {
    if (elem) elem.setAttribute('markup', markup);
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.unbindEvents();
  }

  private unbindEvents() {
    this.removeEventListener(`${ESLEditor.eventNs}:markupChange`, this._onEditorMarkupChange);
    this.removeEventListener(`esl:snippets:markupChange`, this._onSnippetChange);
    this.removeEventListener(`esl:settings:markupChange`, this._onSettingsMarkupChange);
  }
}

Playground.register();
