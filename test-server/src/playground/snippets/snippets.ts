import {ESLBaseElement} from '../../../../src/modules/esl-base-element/core';
import {bind} from '../../../../src/modules/esl-utils/decorators/bind';
import {ESLSnippet} from './snippet';
import {ESLPlayground} from '../core/playground';
import {TraversingQuery} from '../../../../modules/esl-traversing-query/core/esl-traversing-query';

export class ESLSnippets extends ESLBaseElement {
  public static is = 'esl-snippets';
  protected playground: ESLPlayground;
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
    this.playground = TraversingQuery.first(`::parent(${ESLPlayground.is})`, this) as ESLPlayground;

    if (!this.activeSnippet) {
      this.activeSnippet = this.querySelectorAll(ESLSnippet.is)[0] as HTMLElement;

      this.sendMarkUp();
      this.addEventListener('click', this.onClick);
    }
  }

  protected sendMarkUp(): void {
    const tmpl = this.activeSnippet?.getElementsByTagName('template')[0];
    if (tmpl && this.playground) {
      this.playground.passMarkup(tmpl.innerHTML, ESLSnippets.is);
    }
  }

  @bind
  protected onClick(event: Event) {
    this.activeSnippet = event.target as HTMLElement;
    this.sendMarkUp();
  }
}

customElements.whenDefined(ESLSnippet.is).then(() => ESLSnippets.register());
