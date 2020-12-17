// export class Snippets extends HTMLElement {
//
//   private onClick(e: Event) {
//     console.log("click event");
//     this.innerHTML = this.innerHTML + 'cloick';
//   }
//
//   protected connectedCallback() {
//     this.addEventListener('click', this.onClick.bind(this));
//   }
// }
//
//
// customElements.define('snippets-pop', Snippets);


import {ESLBaseElement} from '../../../../src/modules/esl-base-element/core/esl-base-element';
import {bind} from '../../../../src/modules/esl-utils/decorators/bind';


export class Snippets extends ESLBaseElement {
  static is = 'snippets-pop';
  @bind
  private onClick(e: Event) {
    this.innerHTML = this.innerHTML + 'click';
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this.onClick);
  }
}

Snippets.register();
