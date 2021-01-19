import {Observable} from '../../../../src/modules/esl-utils/abstract/observable';

export class PlaygroundObservable extends Observable {
  public updateMarkup(e: CustomEvent): void {
    this.fire(e.detail.markup, e.detail.source);
  }
}
