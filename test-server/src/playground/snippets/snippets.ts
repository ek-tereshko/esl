import {ESLBaseElement} from '../../../../src/modules/esl-base-element/core';
import {bind} from '../../../../src/modules/esl-utils/decorators/bind';
import {ESLSnippet} from './snippet';

export class ESLSnippets extends ESLBaseElement {
  public static is = 'esl-snippets';
  public static eventNs = 'esl:snippets';
  public static ACTIVE_CLASS = 'active';

  public get activeSnippet(): HTMLElement | null {
    return this.querySelector('.' + ESLSnippets.ACTIVE_CLASS) || null;
  }
  public set activeSnippet(snippet: HTMLElement | null) {
    this.activeSnippet?.classList.remove(ESLSnippets.ACTIVE_CLASS);
    snippet?.classList.add(ESLSnippets.ACTIVE_CLASS);
  }

  protected connectedCallback() {
    super.connectedCallback();
    if (!this.activeSnippet) {
      this.activeSnippet = this.querySelectorAll(ESLSnippet.is)[0] as HTMLElement;
    }

    setTimeout(() => this.sendMarkUp());
    this.addEventListener('click', this.onClick);
  }

  // TODO: change event name
  protected sendMarkUp() {
    const tmpl = this.activeSnippet?.getElementsByTagName('template')[0];
    this.$$fireNs('snippetChange', {detail: {markup: tmpl?.innerHTML}});
  }

  @bind
  protected onClick(event: Event) {
    const target = event.target as HTMLElement;
    this.activeSnippet = target;
    this.sendMarkUp();
  }
}

customElements.whenDefined(ESLSnippet.is).then(() => ESLSnippets.register());
