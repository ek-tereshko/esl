/**
 * Smart Image
 * @version 1.2.0
 * @author Alexey Stsefanovich (ala'n), Yuliya Adamskaya
 *
 * @description:
 * SmartImage - custom element, that provide flexible abilities to include images on web pages.
 * Originally developed as alternative for picture component, but with more features inside.
 * Supported features:
 * - different render modes: with or without inner img tag; object-fit options emulation like cover, inscribe, etc.
 * - manual loading (start loading image by manually provided marker)
 * - lazy loading (image start loading only if it is visible and in or closer to browser viewport area
 * - SmartQuery (special syntax that allows define different sources for different media queries, also supports shortcuts for media-queries)
 * - flexible class markers. Smart Image can add specific class on any parent element when image is ready,
 * the Smart Image itself also has markers that indicate it state
 * - provides events on state change (also support inline syntax like <smart-image-tag onload="">)
 * - hot changes
 *
 * @attr:
 *  {String} data-src - src paths per queries (watched value)
 *    NOTE: query support shortcuts for
 *     - Breakpoints like @MD, @SM (defined), @+SM (SM and larger), @-LG(LG and smaller)
 *     - Device point resolutions: @1x, @2x, @3x
 *    all conditions must be separated by conjunction ('and')
 *    @example: '@+MD and @2x'
 *  {String} [data-src-base] - base src path for pathes described in data-src
 *
 *  {String} alt | data-alt - alt text (watched value)
 *
 *  {'origin' | 'cover' | 'save-ratio' | 'fit'} mode - rendering mode (default 'save-ratio') (watched value)
 *    WHEN mode is 'origin' - save origin image size
 *                            (use inner img tag for rendering)
 *    WHEN mode is 'fit' - use inner img but not force it width
 *    WHEN mode is 'cover' - didn't have self size use 100% w/h of container
 *                           (use background-image for rendering)
 *    WHEN mode is 'save-ratio' - fill 100% of container width and set self height according to image ratio
 *                                (use background-image for rendering)
 *
 *  {Boolean} [lazy] - enable lazy loading triggered by IntersectionObserver by default
 *                    (image start loading as soon as it becomes visible in visual area)
 *  {Boolean} [lazy-manual] - just says not to load image until lazy-triggered attribute appears
 *
 *  {Boolean} [refresh-on-update] - Always update original image as soon as image source changed
 *
 *  {String}  [container-class] - class that will be added to container when image will be ready
 *  {String}  [container-class-onload] - marks that container-class shouldn't be added if image load ends with exception
 *  {String}  [container-class-target] - target parent selector to add container-class (parentNode by default).
 *
 *  Events html connection points (see @events section)
 *  {Function | Evaluated Expression} onready
 *  {Function | Evaluated Expression} onload
 *  {Function | Evaluated Expression} onerror
 *
 *  @readonly {Boolean} ready - appears once when image first time loaded
 *  @readonly {Boolean} loaded - appears once when image first time loaded
 *  @readonly {Boolean} error - appears when current src isn't load
 *
 *  NOTE: Smart Image supports title attribute as any html element, no additional reflection for that attribute needed
 *  it will work correctly according to HTML5.* REC
 *
 * @param:
 *  {String} src - srcset (see data-src attribute for details)
 *  {String} srcBase - base path (see data-src-base attribute for details)
 *  {String} alt - alt text
 *  {'origin' | 'cover' | 'save-ratio' | 'fit'} mode - mode of image renderer
 *  {Array} srcRules - array of srcRules parsed from src
 *  {Boolean} refreshOnUpdate - see proactive-update attribute
 *
 *  @readonly {Function} triggerLoad - shortcut function for manually adding lazy-triggered marker
 *
 *  @readonly {SmartImageSrcRule} targetRule - satisfied rule that need to be applied in current state
 *  @readonly {Boolean} ready
 *  @readonly {Boolean} loaded
 *  @readonly {Boolean} error
 *
 * @event:
 *  ready - emits when image ready (loaded or load fail)
 *  load - emits every time when image loaded (including on path change)
 *  error - emits every time when current source loading fails.
 *
 * @example:
 *  <smart-image-tag mode="save-ratio"
 *      data-src='..defaultPath [| mediaQuery => src [| ...]]'
 *  ></smart-image-tag>
 *  // also instead of mediaQuery you could use breakpoint shortcut like:
 *  <smart-image-tag mode="save-ratio"
 *      data-src='..defaultPath [| @+MD => src [| ...]]'
 *  ></smart-image-tag>
 *  or
 *  <smart-image-tag mode="save-ratio"
 *      data-src='..defaultPath [| @1x => src [| ...]]'
 *  ></smart-image-tag>
 */
import {attr} from '@helpers/decorators/attr';
import {DeviceDetector} from '@helpers/device-utils';
import {triggerComponentEvent} from '@helpers/component-utils';
import SmartRuleList from '@components/smart-query/ts/smart-rule-list';

// Mods configurations
interface Strategy {
	[mode: string]: {
		useInnerImg?: boolean,
		apply: (img: SmartImage, shadowImg: ShadowImageElement) => void
	}
}

interface ShadowImageElement extends HTMLImageElement {
	dpr?: number
}

const STRATEGIES: Strategy = {
	'cover': {
		useInnerImg: false,
		apply(img, shadowImg) {
			const src = shadowImg.src;
			const isEmpty = !src || SmartImage.isEmptyImage(src);
			img.style.backgroundImage = isEmpty ? null : `url("${src}")`;
			img.style.paddingTop = null;
		}
	},
	'save-ratio': {
		useInnerImg: false,
		apply(img, shadowImg) {
			const src = shadowImg.src;
			const isEmpty = !src || SmartImage.isEmptyImage(src);
			img.style.backgroundImage = isEmpty ? null : `url("${src}")`;
			img.style.paddingTop = isEmpty ? null : `${(shadowImg.height * 100 / shadowImg.width)}%`;
		}
	},
	'fit': {
		useInnerImg: true,
		apply(img, shadowImg) {
			img.style.backgroundImage = null;
			img.style.paddingTop = null;
			img.innerImage.src = shadowImg.src;
		}
	},
	'origin': {
		useInnerImg: true,
		apply(img, shadowImg) {
			img.style.backgroundImage = null;
			img.style.paddingTop = null;
			img.innerImage.src = shadowImg.src;
			img.innerImage.width = shadowImg.width / shadowImg.dpr;
		}
	},
	'inner-svg': {
		useInnerImg: false,
		apply(img, shadowImg) {
			const request = new XMLHttpRequest();
			request.open('GET', shadowImg.src, true);
			request.onreadystatechange = () => {
				if (request.readyState !== 4 || request.status !== 200) return;
				const tmp = document.createElement('div');
				tmp.innerHTML = request.responseText;
				tmp.querySelectorAll('script').forEach((node) => node.remove());
				img.innerHTML = tmp.innerHTML;
			};
			request.send();
		}
	}
};

// Intersection Observer for lazy init functionality
let intersectionObserver: IntersectionObserver;

function getIObserver() {
	if (!intersectionObserver) {
		intersectionObserver = new IntersectionObserver(function intersectionCallback(entries) {
			(entries || []).forEach(function (entry) {
				if ((entry.isIntersecting || entry.intersectionRatio > 0) && entry.target instanceof SmartImage) {
					entry.target.triggerLoad();
				}
			});
		}, {
			threshold: [0.01],
			rootMargin: DeviceDetector.isMobile ? '250px' : '500px'// rootMargin value for IntersectionObserver
		});
	}
	return intersectionObserver;
}

export class SmartImage extends HTMLElement {
	public static get STRATEGIES() {
		return STRATEGIES;
	}

	@attr({dataAttr: true, defaultValue: ''}) private src: string;
	@attr({dataAttr: true, defaultValue: ''}) private srcBase: string;
	@attr({defaultValue: ''}) private alt: string;
	@attr({defaultValue: 'save-ratio'}) private mode: string;
	@attr({conditional: true}) private refreshOnUpdate: boolean;
	@attr({conditional: true, readonly: true}) private lazyManual: boolean;
	@attr({conditional: true, readonly: true}) private lazyTriggered: boolean;
	@attr({conditional: true, readonly: true}) private ready: boolean;
	@attr({conditional: true, readonly: true}) private loaded: boolean;
	@attr({conditional: true, readonly: true}) private error: boolean;

	private _innerImg: HTMLImageElement;
	private _srcRules: SmartRuleList<string>;
	private _currentSrc: string;
	private _detachLazyTrigger: () => void;
	private _shadowImageElement: ShadowImageElement;
	private readonly _onMatchChange: () => void;

	static get EMPTY_IMAGE() {
		return 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
	}

	static get observedAttributes() {
		return ['alt', 'data-alt', 'data-src', 'data-src-base', 'mode', 'lazy-triggered'];
	}

	private static className: string;

	public static register(tagName: string, className: string = tagName) {
		SmartImage.className = className;
		customElements.define(tagName, SmartImage);
	}

	constructor() {
		super();
		this._onLoad = this._onLoad.bind(this);
		this._onError = this._onError.bind(this);
		this._onMatchChange = this.update.bind(this, false);
	}

	get lazy(): boolean {
		return this.hasAttribute('lazy') || this.lazyManual;
	}

	get lazyAuto(): boolean {
		return this.hasAttribute('lazy') && !this.lazyManual;
	}

	get srcRules() {
		if (!this._srcRules) {
			this.srcRules = SmartRuleList.parse<string>(this.src, SmartRuleList.STRING_PARSER);
		}
		return this._srcRules;
	}

	set srcRules(rules: SmartRuleList<string>) {
		if (this._srcRules) {
			this._srcRules.removeListener(this._onMatchChange);
		}
		this._srcRules = rules;
		this._srcRules.addListener(this._onMatchChange);
	}

	get currentSrc() {
		return this._currentSrc;
	}

	get empty() {
		return !this._currentSrc || SmartImage.isEmptyImage(this._currentSrc);
	}

	public triggerLoad() {
		this.setAttribute('lazy-triggered', '');
	}

	protected changeMode(oldVal: string, newVal: string) {
		oldVal = oldVal || 'save-ratio';
		newVal = newVal || 'save-ratio';
		if (oldVal !== newVal) {
			if (!STRATEGIES[newVal]) {
				throw new Error('Smart Image: Unsupported mode: ' + newVal);
			}
			if (this.mode !== newVal) {
				this.mode = newVal;
			}
			if (!STRATEGIES[this.mode].useInnerImg && this._innerImg) {
				this.removeChild(this._innerImg);
				this._innerImg = null;
			}
			this.update(true);
		}
	}

	protected update(force: boolean = false) {
		if (this.lazy && !this.lazyTriggered) {
			return;
		}

		const rule = this.srcRules.active;
		const src = this.getPath(rule.payload);
		const dpr = rule.DPR;

		if (this._currentSrc !== src || force) {
			this._currentSrc = src;
			this._shadowImg.src = src;
			this._shadowImg.dpr = dpr;

			if (this.refreshOnUpdate || !this.ready) {
				this.syncImage();
			}
		}

		this._detachLazyTrigger && this._detachLazyTrigger();
    }

	protected getPath(src: string) {
		if (!src || src === '0' || src === 'none') {
			return SmartImage.EMPTY_IMAGE;
		}
		return this.srcBase + src;
	}

	public refresh() {
		this.removeAttribute('loaded');
		this.removeAttribute('ready');
		this.style.paddingTop = null;
		this.style.background = null;
		this.update(true);
	}

	private syncImage() {
		const strategy = STRATEGIES[this.mode];
		if (!strategy) return;
		strategy.apply(this, this._shadowImg);
	}

	protected connectedCallback() {
		if ((this.constructor as typeof SmartImage).className) {
			this.classList.add((this.constructor as typeof SmartImage).className);
		}
		this.alt = this.alt || this.getAttribute('data-alt') || '';
		if (!this.hasAttribute('role')) {
			this.setAttribute('role', 'img');
		}
		this.update(true);
		if (this.lazyAuto && !this.lazyTriggered) {
			getIObserver().observe(this);
			this._detachLazyTrigger = function () {
				getIObserver().unobserve(this);
				this._detachLazyTrigger = null;
			};
		}
	}

	protected disconnectedCallback() {
		this.removeAttribute('lazy-triggered');
		this._detachLazyTrigger && this._detachLazyTrigger();
		if (this._srcRules) {
			this._srcRules.removeListener(this._onMatchChange);
		}
	}

	protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
		switch (attrName) {
			case 'data-alt':
				this.alt = this.alt || this.getAttribute('data-alt') || '';
				break;
			case 'alt':
				this._innerImg && (this._innerImg.alt = this.alt);
				break;
			case 'data-src':
				this.srcRules = SmartRuleList.parse<string>(newVal, SmartRuleList.STRING_PARSER);
				this.refresh();
				break;
			case 'data-src-base':
				this.refresh();
				break;
			case 'mode':
				this.changeMode(oldVal, newVal);
				break;
			case 'lazy-triggered':
				this.update(true);
				break;
		}
	}

	public get innerImage() {
		if (!this._innerImg) {
			this._innerImg = this.querySelector('img');
			if (!this._innerImg) {
				this._innerImg = document.createElement('img');
				this.appendChild(this._innerImg);
			}
			this._innerImg.className = 'inner-image';
			this._innerImg.alt = this.alt;
		}
		return this._innerImg;
	}

	protected get _shadowImg() {
		if (!this._shadowImageElement) {
			this._shadowImageElement = new Image();
			this._shadowImageElement.onload = this._onLoad;
			this._shadowImageElement.onerror = this._onError;
		}
		return this._shadowImageElement;
	}

	private _onLoad() {
		this.syncImage();
		this.removeAttribute('error');
		this.setAttribute('loaded', '');
		triggerComponentEvent(this, 'load');
		this._onReady();
	}

	private _onError() {
		this.setAttribute('error', '');
		triggerComponentEvent(this, 'error');
		this._onReady();
	}

	private _onReady() {
		if (!this.ready) {
			this.setAttribute('ready', '');
			triggerComponentEvent(this, 'ready');
			if (this.hasAttribute('container-class') || this.hasAttribute('container-class-target')) {
				if (this.hasAttribute('container-class-onload') && this.error) return;
				const containerCls = this.getAttribute('container-class') || 'img-container-loaded';
				const target = this.getAttribute('container-class-target');
				const targetEl = target ? this.closest(target) : this.parentNode;
				(targetEl) && (targetEl as HTMLElement).classList.add(containerCls);
			}
		}
	}

	public static isEmptyImage(src: string) {
		return src === SmartImage.EMPTY_IMAGE;
	}
}

export default SmartImage;
