import {ExportNs} from '../../esl-utils/environment/export-ns';
import {ESLBaseElement, attr, boolAttr} from '../../esl-base-element/core';
import {rafDecorator} from '../../esl-utils/async/raf';
import {bind} from '../../esl-utils/decorators/bind';
import {ESLTab} from './esl-tab';
import {RTLUtils} from '../../esl-utils/dom/rtl';
import {debounce} from '../../esl-utils/async/debounce';

/**
 * ESlTabs component
 * @author Julia Murashko
 *
 * Tabs container component for Tabs trigger group.
 * Uses {@link ESLTab} as an item.
 * Each individual {@link ESLTab} can control {@link ESLToggleable} or, usually, {@link ESLPanel}
 */
@ExportNs('Tabs')
export class ESLTabs extends ESLBaseElement {
  public static is = 'esl-tabs';

  /** Marker to enable scrollable mode */
  @boolAttr() public scrollable: boolean;

  /** Inner element to contain {@link ESLTab} collection. Will be scrolled in a scrollable mode */
  @attr({defaultValue: '.esl-tab-container'}) public scrollableTarget: string;

  protected connectedCallback() {
    super.connectedCallback();
    this.bindScrollableEvents();

    this.updateScroll();
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.unbindScrollableEvents();
  }

  protected bindScrollableEvents() {
    this.addEventListener('esl:change:active', this._onTriggerStateChange);
    this.addEventListener('click', this._onClick, false);
    this.addEventListener('focusin', this._onFocus);
    this.$scrollableTarget?.addEventListener('scroll', this._onScroll, {passive: true});

    window.addEventListener('resize', this._onResize);
  }
  protected unbindScrollableEvents() {
    this.removeEventListener('esl:change:active', this._onTriggerStateChange);
    this.removeEventListener('click', this._onClick, false);
    this.removeEventListener('focusin', this._onFocus);
    this.$scrollableTarget?.removeEventListener('scroll', this._onScroll);

    window.removeEventListener('resize', this._onResize);
  }

  protected updateScroll() {
    this.updateArrows();
    this._deferredFitToViewport(this.$current, 'auto');
  }

  /** Collection of inner {@link ESLTab} items */
  public get $tabs(): ESLTab[] {
    const els = this.querySelectorAll(ESLTab.is);
    return els ? Array.from(els) as ESLTab[] : [];
  }

  /** Active {@link ESLTab} item */
  public get $current(): ESLTab | null {
    return this.$tabs.find((el) => el.active) || null;
  }

  /** Container element to scroll */
  public get $scrollableTarget(): HTMLElement | null {
    return this.querySelector(this.scrollableTarget);
  }

  /** Move scroll to the next/previous item */
  public moveTo(direction: string, behavior: ScrollBehavior = 'smooth') {
    const $scrollableTarget = this.$scrollableTarget;
    if (!$scrollableTarget) return;
    let left = $scrollableTarget.offsetWidth;
    left = RTLUtils.isRtl(this) && RTLUtils.scrollType !== 'reverse' ? -left : left;
    left = direction === 'left' ? -left : left;

    $scrollableTarget.scrollBy({left, behavior});
  }

  /** Scroll tab to the view */
  protected fitToViewport($trigger?: ESLTab, behavior: ScrollBehavior = 'smooth'): void {
    const $scrollableTarget = this.$scrollableTarget;
    if (!$scrollableTarget || !$trigger) return;

    const areaRect = $scrollableTarget.getBoundingClientRect();
    const itemRect = $trigger.getBoundingClientRect();

    let shift = 0;

    // item is out of area from the right side
    // else item out is of area from the left side
    if (itemRect.right > areaRect.right) {
      shift = RTLUtils.isRtl(this) && RTLUtils.scrollType === 'reverse' ?
        Math.floor(areaRect.right - itemRect.right) :
        Math.ceil(itemRect.right - areaRect.right);
    } else if (itemRect.left < areaRect.left) {
      shift = RTLUtils.isRtl(this) && RTLUtils.scrollType === 'reverse' ?
        Math.ceil(areaRect.left - itemRect.left) :
        Math.floor(itemRect.left - areaRect.left);
    }

    $scrollableTarget.scrollBy({
      left: shift,
      behavior
    });

    this.updateArrows();
  }

  protected updateArrows() {
    const $scrollableTarget = this.$scrollableTarget;
    if (!$scrollableTarget) return;

    const hasScroll = $scrollableTarget.scrollWidth > this.clientWidth;
    const swapSides = RTLUtils.isRtl(this) && RTLUtils.scrollType === 'default';
    const scrollStart = Math.abs($scrollableTarget.scrollLeft) > 1;
    const scrollEnd = Math.abs($scrollableTarget.scrollLeft) + $scrollableTarget.clientWidth + 1 < $scrollableTarget.scrollWidth;

    const $rightArrow = this.querySelector('[data-tab-direction="right"]');
    const $leftArrow = this.querySelector('[data-tab-direction="left"]');

    this.toggleAttribute('has-scroll', hasScroll);
    $leftArrow && $leftArrow.toggleAttribute('disabled', !(swapSides ? scrollEnd : scrollStart));
    $rightArrow && $rightArrow.toggleAttribute('disabled', !(swapSides ? scrollStart : scrollEnd));
  }

  protected _deferredUpdateArrows = debounce(this.updateArrows.bind(this), 50);
  protected _deferredFitToViewport = debounce(this.fitToViewport.bind(this), 50);

  @bind
  protected _onTriggerStateChange() {
    this._deferredFitToViewport(this.$current);
  }

  @bind
  protected _onClick(event: Event) {
    const eventTarget: HTMLElement = event.target as HTMLElement;
    const target: HTMLElement | null = eventTarget.closest('[data-tab-direction]');
    const direction = target && target.dataset.tabDirection;

    if (!direction) return;
    this.moveTo(direction);
  }

  @bind
  protected _onFocus(e: FocusEvent) {
    const target = e.target;
    if (target instanceof ESLTab) this._deferredFitToViewport(target);
  }

  @bind
  protected _onScroll() {
    this._deferredUpdateArrows();
  }

  // TODO: is the raf decorator needed?
  protected _onResize = rafDecorator(() => {
    this._deferredFitToViewport(this.$current, 'auto');
  });
}