import {ESLBaseElement, attr} from '../../../../src/modules/esl-base-element/core';

export class ESLSnippet extends ESLBaseElement {
  public static is = 'esl-snippet';
  snippetName: string;

  @attr() public name: string;

  protected connectedCallback() {
    super.connectedCallback();
    //this.append(this.name);
  }
}

ESLSnippet.register();
