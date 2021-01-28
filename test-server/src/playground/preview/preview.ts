import {bind} from '../../../../src/modules/esl-utils/decorators/bind';
import {ESLPlayground} from '../core/playground';
import {ESLBaseElement} from '../../../../src/modules/esl-base-element/core/esl-base-element';
import {TraversingQuery} from '../../../../src/modules/esl-traversing-query/core/esl-traversing-query';

export class ESLPreview extends ESLBaseElement {
  static is = 'esl-preview';
  protected playground: ESLPlayground;

  protected connectedCallback() {
    super.connectedCallback();
    this.playground = TraversingQuery.first(`::parent(${ESLPlayground.is})`, this) as ESLPlayground;
    if (this.playground) {
      this.playground.subscribe(this.setMarkup);
    }
  }

  @bind
  protected setMarkup(markup: string, source: string): void {
    if (source !== ESLPreview.is) {
      this.innerHTML = markup;
    }
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.playground && this.playground.unsubscribe(this.setMarkup);
  }
}

ESLPreview.register();
