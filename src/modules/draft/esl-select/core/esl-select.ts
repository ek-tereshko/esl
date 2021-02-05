import {attr, boolAttr, ESLBaseElement} from '../../../esl-base-element/core';
import {bind} from '../../../esl-utils/decorators/bind';
import {CSSUtil} from '../../../esl-utils/dom/styles';
import {EventUtils} from '../../../esl-utils/dom/events';

import {ESLSelectText} from './esl-select-text';
import {ESLSelectList} from './esl-select-list';
import {ESLSelectItem} from './esl-select-item';
import {ESLSelectDropdown} from './esl-select-dropdown';

export class ESLSelect extends ESLBaseElement {
  public static readonly is = 'esl-select';

  public static register() {
    ESLSelectItem.register();
    ESLSelectList.register();
    ESLSelectDropdown.register();
    ESLSelectText.register();
    super.register();
  }

  /** Placeholder text property */
  @attr() public emptyText: string;
  /** Classes for filled stated */
  @attr() public hasValueClass: string;
  /** Classes for focused state. Select focused also if dropdown list is opened */
  @attr() public hasFocusClass: string;
  /** Select all text */
  @attr({defaultValue: 'Select All'}) public selectAllLabel: string;
  /** Additional text for field renderer */
  @attr({defaultValue: '+ {rest} more...'}) public moreLabelFormat: string;

  /** Dropdown open marker */
  @boolAttr() public open: boolean;

  protected $text: ESLSelectText;
  protected $select: HTMLSelectElement;
  protected $dropdown: ESLSelectDropdown;

  constructor() {
    super();

    this.$text = document.createElement(ESLSelectText.is) as ESLSelectText;
    this.$dropdown = document.createElement(ESLSelectDropdown.is) as ESLSelectDropdown;
  }

  protected connectedCallback() {
    super.connectedCallback();

    this.$select = this.querySelector('[esl-select-target]') as HTMLSelectElement;
    if (!this.$select) return;

    this.prepare();
    this.bindEvents();
    this._onUpdate();
  }
  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.unbindEvents();
    this.dispose();
  }

  protected bindEvents() {
    this.addEventListener('click', this._onClick);
    this.addEventListener('focusout', this._onUpdate);
    this.$dropdown.addEventListener('esl:show', this._onPopupStateChange);
    this.$dropdown.addEventListener('esl:hide', this._onPopupStateChange);
  }
  protected unbindEvents() {
    this.removeEventListener('click', this._onClick);
    this.removeEventListener('focusout', this._onUpdate);
    this.$dropdown.removeEventListener('esl:show', this._onPopupStateChange);
    this.$dropdown.removeEventListener('esl:hide', this._onPopupStateChange);
  }

  protected prepare() {
    this.$text.model = this;
    this.$text.className = this.$select.className;
    this.$text.emptyText = this.emptyText;
    this.$text.moreLabelFormat = this.moreLabelFormat;
    this.$dropdown.owner = this;
    this.appendChild(this.$text);
  }
  protected dispose() {
    this.$select.className = this.$text.className;
    this.removeChild(this.$text);
  }

  @bind
  protected _onUpdate() {
    const hasValue = this.hasValue;
    this.toggleAttribute('has-value', hasValue);
    CSSUtil.toggleClsTo(this, this.hasValueClass, hasValue);

    const focusEl = document.activeElement;
    const hasFocus = this.open || (focusEl && this.contains(focusEl));
    CSSUtil.toggleClsTo(this, this.hasFocusClass, !!hasFocus);
  }

  @bind
  protected _onClick() {
    this.$dropdown.toggle(!this.$dropdown.open, {
      activator: this,
      initiator: 'select'
    });
  }

  @bind
  protected _onPopupStateChange(e: CustomEvent) {
    if (e.target !== this.$dropdown) return;
    this.open = this.$dropdown.open;
    this._onUpdate();
  }

  @bind
  protected _onChange() {
    this._onUpdate();
    EventUtils.dispatch(this.$select, 'change');
  }

  // Model methods
  /** Get list of options */
  public get options(): HTMLOptionElement[] {
    return this.$select ? Array.from(this.$select.options) : [];
  }
  /** Get list of selected options */
  public get selected(): HTMLOptionElement[] {
    return this.options.filter((item) => item.selected);
  }

  /** Has selected options */
  public get hasValue(): boolean {
    return this.options.some((item) => item.selected);
  }

  /** Get option with passed value */
  public get(value: string): HTMLOptionElement | undefined {
    return this.options.find((item) => item.value === value);
  }
  /** Toggle option with passed value to the state */
  public set(value: string, state: boolean) {
    const option = this.get(value);
    option && (option.selected = state);
    this._onChange();
  }
  /** Check selected state*/
  public isSelected(value: string): boolean {
    const opt = this.get(value);
    return !!opt && opt.selected;
  }

  /** Toggle all options to the state */
  public setAll(state: boolean) {
    this.options.forEach((item) => item.selected = state);
    this._onChange();
  }
}
