import {ESLBaseElement} from '../../../../src/modules/esl-base-element/core/esl-base-element';
import {PlaygroundObservable} from '../utils/observable';

export class ESLPlayground extends ESLBaseElement {
  public static is = 'esl-playground';
  public state: string;
  protected stateObservable = new PlaygroundObservable();

  /**
   * @param markup
   * @param source: name of the tag from which changes were received
   */
  public passMarkup(markup: string, source: string): void {
    this.state = markup;
    this.stateObservable.updateMarkup(markup, source);
  }

  public subscribe(callback: (markup: string, source: string) => void): void {
    this.stateObservable.addListener(callback);
  }

  public unsubscribe(callback: (markup: string, source: string) => void): void {
    this.stateObservable.removeListener(callback);
  }
}

ESLPlayground.register();
