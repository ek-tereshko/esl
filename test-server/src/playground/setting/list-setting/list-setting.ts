import {ESLSetting} from '../setting';

export class ESLListSetting extends ESLSetting {
  static is = 'esl-list-setting';

  protected connectedCallback(): void {
    super.connectedCallback();
    this.setStyle();
    this.render();
  }

  protected render() {
  }
}

ESLListSetting.register();
