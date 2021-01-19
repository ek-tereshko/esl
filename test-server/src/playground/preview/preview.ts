import {ESLBaseElement} from '../../../../src/modules/esl-base-element/core/esl-base-element';
import {Playground} from '../core/playground';

export class ESLPreview extends ESLBaseElement {
  static is = 'esl-preview';
  public playground: Playground;

  protected connectedCallback() {
    super.connectedCallback();
    this.playground = (document.querySelector('esl-playground') as Playground);
    customElements.whenDefined(Playground.is).then(() => this.playground.stateObservable.addListener(this.setMarkup));
  }

  protected setMarkup(markup: string, source: string): void {
    if (source !== ESLPreview.is) {
      this.innerHTML = markup;
    }
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.playground.stateObservable.removeListener(this.setMarkup);
  }
}

ESLPreview.register();
