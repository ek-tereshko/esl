import {ESLBaseElement} from '../../../../../modules/esl-base-element/core/esl-base-element';
import {attr} from '../../../../../modules/esl-base-element/decorators/attr';

export class ESLSnippet extends ESLBaseElement {
  public static is = 'esl-snippet';
  snippetName: string;

  @attr() public name: string;

  protected connectedCallback() {
    super.connectedCallback();
    this.snippetName = this.name;
  }
}

ESLSnippet.register();
