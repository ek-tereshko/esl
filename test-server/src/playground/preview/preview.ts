import {bind} from '../../../../src/modules/esl-utils/decorators/bind';
import {ESLPlayground} from '../core/playground';
import {ESLBaseElement} from '../../../../src/modules/esl-base-element/core/esl-base-element';

export class ESLPreview extends ESLBaseElement {
  static is = 'esl-preview';
  protected playground: ESLPlayground;

  protected connectedCallback() {
    super.connectedCallback();
    this.playground = this.closest(`${ESLPlayground.is}`) as ESLPlayground;
    if (this.playground) {
      this.playground.addEventListener('state:change', this.setMarkup);
    }
  }

  @bind
  protected setMarkup(e: CustomEvent): void {
    const {markup, source} = e.detail;
    if (source !== ESLPreview.is) {
      this.innerHTML = markup;
    }
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.playground && this.playground.removeEventListener('state:change', this.setMarkup);
  }
}

