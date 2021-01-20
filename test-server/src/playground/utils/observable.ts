import {Observable} from '../../../../src/modules/esl-utils/abstract/observable';

export class PlaygroundObservable extends Observable {
  public updateMarkup(markup: string, source: string): void {
    this.fire(markup, source);
  }
}
