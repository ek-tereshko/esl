import {ESLBaseElement} from '../../../../src/modules/esl-base-element/core';
import {bind} from '../../../../src/modules/esl-utils/decorators/bind';

export class ESLSnippets extends ESLBaseElement {
  public static is = 'esl-snippets';
  public static eventNs = 'esl:snippets';
  activeSnippet: any;

  @bind
  private onClick(event: Event) {
    const target = event.target;
    if (target) {
      this.changeActiveSnippet(target);
      this.sendMarkUp();
    }
  }

  protected connectedCallback() {
    super.connectedCallback();
    if (!ESLSnippets.getActiveSnippet()) {
      this.activeSnippet = document.querySelectorAll('esl-snippet')[0];
      this.activeSnippet.classList.add('active-snippet');
    } else {
      this.activeSnippet = ESLSnippets.getActiveSnippet();
    }
    setTimeout(() => this.sendMarkUp());
    this.addEventListener('click', this.onClick);
  }

  private static getActiveSnippet() {
     if (document.getElementsByClassName('active-snippet').length === 0) return null;
     else return document.getElementsByClassName('active-snippet')[0];
  }

  private changeActiveSnippet(snippet: EventTarget) {
    this.activeSnippet.classList.remove('active-snippet');
    this.activeSnippet = snippet;
    this.activeSnippet.classList.add('active-snippet');
  }

  private sendMarkUp() {
    const tmpl = this.activeSnippet.getElementsByTagName('template')[0];
    this.$$fireNs('snippetChange', {detail: {markup:  tmpl.innerHTML}});
  }
}

ESLSnippets.register();
