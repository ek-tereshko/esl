import {ESLSetting} from '../setting';

export class ESLCheckSetting extends ESLSetting {
  static is = 'esl-check-setting';

  protected connectedCallback(): void {
    super.connectedCallback();
    this.setStyle();
    this.render();
  }

  protected render() {
  }
}

ESLCheckSetting.register();
