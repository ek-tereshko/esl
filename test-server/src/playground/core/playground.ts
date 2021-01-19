import {ESLBaseElement} from '../../../../src/modules/esl-base-element/core/esl-base-element';
import {PlaygroundObservable} from '../utils/observable';

export class Playground extends ESLBaseElement {
  public static is = 'esl-playground';
  public state: string;

  public stateObservable = new PlaygroundObservable();

  protected connectedCallback() {
    super.connectedCallback();
    this.addEventListener('markupChange', (e: CustomEvent) => {
      this.state = e.detail.markup;
      this.stateObservable.updateMarkup(e);
    });
  }
}

Playground.register();
