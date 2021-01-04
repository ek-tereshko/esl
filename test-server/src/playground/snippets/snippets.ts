// export class Snippets extends HTMLElement {
//
//   private onClick(e: Event) {
//     console.log("click event");
//     this.innerHTML = this.innerHTML + 'click';
//   }
//
//   protected connectedCallback() {
//     this.addEventListener('click', this.onClick.bind(this));
//   }
// }
// customElements.define('snippets-pop', Snippets);

import {ESLBaseElement} from '../../../../src/modules/esl-base-element/core/esl-base-element';
import {bind} from '../../../../src/modules/esl-utils/decorators/bind';

export class ESLSnippets extends ESLBaseElement {
  public static is = 'esl-snippets';
  activeSnippet: any;

  // @bind
  // private onClick(e: Event) {
  //   this.innerHTML = this.innerHTML + 'click';
  // }

  protected connectedCallback() {
    super.connectedCallback();

    if (!this.getActiveSnippet()) {
      this.activeSnippet = document.querySelectorAll('esl-snippet')[0];
      this.activeSnippet.classList.add('active-snippet');
      this.sentMarkUp();
    }
    // this.addEventListener('click', this.onClick);
  }

  private getActiveSnippet() {
     if (document.getElementsByClassName('active-snippet').length === 0) return null;
     else return document.getElementsByClassName('active-snippet');
  }
}

ESLSnippets.register();
