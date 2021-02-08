import {ESLListSetting} from '../list-setting';

export class ESLClassSetting extends ESLListSetting {
  public static is = 'esl-class-setting';

  protected onValueChange(e: Event) {
    e.preventDefault();
    const prevValue = this.value;
    this.value = this.targetValue(e);
    this.$$fire('classChange', {detail: {value: this.value, selector: this.selector, prevValue}});
  }
}
