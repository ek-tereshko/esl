import {ISmartTrigger} from "../smart-trigger/smart-triger-interface";

export enum STATES { CLOSE, OPEN }

export interface ISmartPopupActionParams {
    trigger?: ISmartTrigger
}

export interface ISmartPopup {
    isOpen: boolean;

    show(params?: ISmartPopupActionParams): this;

    hide(params?: ISmartPopupActionParams): this;

    toggle(newState?: STATES): this;

    lazyInit?(): Promise<boolean> | void;
}

class SmartPopup extends HTMLElement implements ISmartPopup {

    static readonly is: string = 'smart-popup';

    static observedAttributes: Array<string> = ['class'];

    attributeChangedCallback(attr: string, prevValue: string, value: string) {
        switch (attr) {
            case 'class':
                if (prevValue !== value) {
                    if (this.isOpen && prevValue.split(' ').indexOf(this.activeClass) === -1) {

                    }
                    console.log(this.classList.contains(this.activeClass), prevValue, '~~~~~~~~~~~~', value);
                }
        }
    }

    get activeClass(): string {
        return this.getAttribute('active-class') || 'opened';
    }

    get isOpen(): boolean {
        return this.classList.contains(this.activeClass);
    }

    get state(): STATES {
        return this.isOpen ? STATES.OPEN : STATES.CLOSE;
    }

    get newState(): STATES {
        return this.isOpen ? STATES.CLOSE : STATES.OPEN;
    }

    show(params: ISmartPopupActionParams = {}) {
        this.classList.add(this.activeClass);
        return this;
    }

    hide(params: ISmartPopupActionParams = {}) {
        this.classList.remove(this.activeClass);
        return this;
    }

    toggle(newState: STATES = this.newState, params?: ISmartPopupActionParams) {
        switch (newState) {
            case STATES.OPEN:
                this.show(params);
                break;
            case STATES.CLOSE:
                this.hide(params);
                break;
        }
        return this;
    }

}

customElements.define(SmartPopup.is, SmartPopup);

export default SmartPopup;