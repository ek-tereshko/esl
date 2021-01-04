import {ESLBaseElement} from '../../../../src/modules/esl-base-element/core';
import {bind} from '../../../../src/modules/esl-utils/decorators/bind';

export class ESLSnippets extends ESLBaseElement {
  public static is = 'esl-snippets';
  public static eventNs = 'esl:snippets';
  activeSnippet: any;

  @bind
  private onClick(event: Event) {
    let target = event.target;
    if (target) {
      this.changeActiveSnippet(target);
      this.sentMarkUp();
    }
  }

  protected connectedCallback() {
    super.connectedCallback();
    if (!this.getActiveSnippet()) {
      this.activeSnippet = document.querySelectorAll('esl-snippet')[0];
      this.activeSnippet.classList.add('active-snippet');
      this.sentMarkUp();
    }
    this.addEventListener('click', this.onClick);
  }

  private getActiveSnippet() {
     if (document.getElementsByClassName('active-snippet').length === 0) return null;
     else return document.getElementsByClassName('active-snippet');
  }

  private changeActiveSnippet(snippet: EventTarget) {
    this.activeSnippet.classList.remove('active-snippet');
    this.activeSnippet = snippet;
    this.activeSnippet.classList.add('active-snippet');
  }

  private sentMarkUp() {
    let tmpl = this.activeSnippet.getElementsByTagName('template')[0];
    this.$$fireNs('snippetChange', {detail: {markup:  tmpl.innerHTML}});
  }
}

ESLSnippets.register();
