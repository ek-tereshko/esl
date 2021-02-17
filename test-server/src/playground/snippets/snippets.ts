import {ESLBaseElement} from '../../../../src/modules/esl-base-element/core';
import {bind} from '../../../../src/modules/esl-utils/decorators/bind';
import {UIPSnippet} from './snippet';
import {UIPRoot} from '../core/root';
import {EventUtils} from '../../../../src/modules/esl-utils/dom/events';

export class UIPSnippets extends ESLBaseElement {
  public static is = 'uip-snippets';
  protected playground: UIPRoot;
  public static ACTIVE_CLASS = 'active';

  public get activeSnippet(): HTMLElement | null {
    return this.querySelector('.' + UIPSnippets.ACTIVE_CLASS);
  }

  public set activeSnippet(snippet: HTMLElement | null) {
    this.activeSnippet?.classList.remove(UIPSnippets.ACTIVE_CLASS);
    snippet?.classList.add(UIPSnippets.ACTIVE_CLASS);
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this.onClick);
    this.playground = this.closest(`${UIPRoot.is}`) as UIPRoot;

    if (!this.activeSnippet) {
      this.activeSnippet = this.querySelectorAll(UIPSnippet.is)[0] as HTMLElement;
    }
    this.sendMarkUp();
  }

  protected sendMarkUp(): void {
    const tmpl = this.activeSnippet?.getElementsByTagName('template')[0];
    if (tmpl && this.playground) {
      EventUtils.dispatch(this, 'request:change', {detail: {source: UIPSnippets.is, markup: tmpl.innerHTML}});
    }
  }

  @bind
  protected onClick(event: Event) {
    const snippet = event.target as HTMLElement;
    if(!snippet.querySelector('uip-snippet')) {
      this.activeSnippet = snippet;
    } else {
      this.activeSnippet = snippet.querySelector('uip-snippet');
    }
    this.sendMarkUp();
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this.onClick);
  }
}

