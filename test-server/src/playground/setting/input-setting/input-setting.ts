import {ESLSetting} from '../setting';

export abstract class ESLInputSetting extends ESLSetting {
  protected input: HTMLInputElement;

  protected abstract render(): void;

  protected renderInput(inputType: string): void {
    this.input = document.createElement('input');
    this.input.type = inputType;
    this.input.id = this.name;
    this.appendChild(this.input);
  }
}