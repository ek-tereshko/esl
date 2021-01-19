import {ESLBaseElement, attr} from '../../../../src/modules/esl-base-element/core';

export class ESLSnippet extends ESLBaseElement {
  public static is = 'esl-snippet';
  @attr() public name: string;

  protected connectedCallback() {
    super.connectedCallback();
    this.innerHTML += this.name;
  }
}

ESLSnippet.register();
