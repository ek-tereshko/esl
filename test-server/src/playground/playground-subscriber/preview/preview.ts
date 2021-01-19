import {PlaygroundSubscriber} from '../playground-subscriber';
import {bind} from '../../../../../src/modules/esl-utils/decorators/bind';

export class ESLPreview extends PlaygroundSubscriber {
  static is = 'esl-preview';

  protected connectedCallback() {
    super.connectedCallback();
    this.setupPlaygroundConnection();
  }

  @bind
  protected setMarkup(markup: string, source: string): void {
    if (source !== ESLPreview.is) {
      this.innerHTML = markup;
    }
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.removePlaygroundListeners();
  }
}

ESLPreview.register();
