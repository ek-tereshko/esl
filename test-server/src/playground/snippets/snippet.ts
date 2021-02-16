import {ESLBaseElement, attr} from '../../../../src/modules/esl-base-element/core';

export class UIPSnippet extends ESLBaseElement {
  public static is = 'uip-snippet';
  @attr() public name: string;

  protected connectedCallback() {
    super.connectedCallback();
    this.innerHTML += this.name;
  }
}

