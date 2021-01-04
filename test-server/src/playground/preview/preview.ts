import {ESLBaseElement} from '../../../../src/modules/esl-base-element/core/esl-base-element';
import {attr} from '../../../../src/modules/esl-base-element/decorators/attr';

export class ESLPreview extends ESLBaseElement {
  static is = 'esl-preview';

  @attr() public markup: string;

  private shadow: ShadowRoot;

  static get observedAttributes() {
    return ['markup'];
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.shadow = this.attachShadow({mode: 'closed'});
    this.shadow.innerHTML = this.markup;
  }

  private attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    if (!this.connected || oldVal === newVal) return;
    if (attrName === 'markup') {
      this.shadow.innerHTML = newVal;
    }
  }
}

ESLPreview.register();
