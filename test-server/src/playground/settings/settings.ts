import {ESLBaseElement} from '../../../../src/modules/esl-base-element/core/esl-base-element';
import {attr} from '../../../../src/modules/esl-base-element/decorators/attr';


export class Settings extends ESLBaseElement {
  public static is = 'esl-settings';
  public static eventNs = 'esl:settings';

  @attr() public markup: string;

  static get observedAttributes() {
    return ['markup'];
  }

  protected connectedCallback() {
    console.log('settings callback');
    super.connectedCallback();
  }

  protected bindEvents() {
    this.addEventListener('esl:setting:onchange', this._onSettingsChanged); //TODO
  }

  private _onSettingsChanged(e: any) {
    const elem = new DOMParser().parseFromString(this.markup, 'text/html').body.firstElementChild;
    const {attrName, attrValue} = e.detail; //check??
    if (elem) {
      elem.setAttribute(attrName, attrValue); // TODO coordinate names
      this.$$fireNs('markupChange', {detail: {markup: elem.outerHTML}});
    }
  }

  protected disconnectedCallback() {
    this.unbindEvents();
    super.disconnectedCallback();
  }

  private attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    if (!this.connected || oldVal === newVal) return;
    if (attrName === 'markup') {
      this.markup = newVal;
      this.parseCode(this.markup);
    }
  }

  //TODO rewrite to actual settings tags
  private get settingsTags(): Element[] {
    return [...this.getElementsByTagName('esl-setting')];
  }

  //TODO refactor this terrible method
  public parseCode(code: string) {
    const elem = new DOMParser().parseFromString(code, 'text/html').body.firstElementChild;
    if (elem) {
      for (let settingTag of this.settingsTags) {
        const attrName = settingTag.getAttribute('name');
        if (attrName) {
          const attrValue = elem.getAttribute(attrName);
          settingTag.setAttribute('value', attrValue || '');  //TODO approve attr name
          console.log(settingTag);
        }
      }
    }
  }

  private unbindEvents() {
    this.removeEventListener(`esl:setting:markupChange`, this._onSettingsChanged); //TODO
  }
}

Settings.register();
