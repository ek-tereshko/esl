import {bind} from '../../../../src/modules/esl-utils/decorators/bind';
import {Playground} from '../core/playground';
import {ESLBaseElement} from '../../../../src/modules/esl-base-element/core/esl-base-element';
import {TraversingQuery} from '../../../../src/modules/esl-traversing-query/core/esl-traversing-query';

export class ESLPreview extends ESLBaseElement {
  static is = 'esl-preview';
  protected playground: Playground;

  protected connectedCallback() {
    super.connectedCallback();
    this.playground = TraversingQuery.first(`::parent(${Playground.is})`, this) as Playground;
    this.playground.subscribe(this.setMarkup);
  }

  @bind
  protected setMarkup(markup: string, source: string): void {
    if (source !== ESLPreview.is) {
      this.innerHTML = markup;
    }
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.playground.unsubscribe(this.setMarkup);
  }
}

ESLPreview.register();
