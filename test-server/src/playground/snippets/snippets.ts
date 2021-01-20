import {ESLBaseElement} from '../../../../src/modules/esl-base-element/core';
import {bind} from '../../../../src/modules/esl-utils/decorators/bind';
import {Playground} from '../core/playground';

export class ESLSnippets extends ESLBaseElement {
  public static is = 'esl-snippets';
  activeSnippet: any;
  protected playground: Playground;

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
    this.playground = (document.querySelector('esl-playground') as Playground);

    if (!ESLSnippets.getActiveSnippet()) {
      this.activeSnippet = document.querySelectorAll('esl-snippet')[0];
      this.activeSnippet.classList.add('active-snippet');
    } else {
      this.activeSnippet = ESLSnippets.getActiveSnippet();
    }
    this.sendMarkUp();
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
    this.playground.passMarkup(tmpl.innerHTML, ESLSnippets.is);
  }
}

ESLSnippets.register();
