/**
 * Simple Basic Iframe provider for {@link SmartMedia}
 * @author Alexey Stsefanovich (ala'n)
 */
import {SmartMedia} from '../smart-media';
import {BaseProvider, PlayerStates} from '../smart-media-provider';
import SmartMediaProviderRegistry from '../smart-media-registry';
import {generateUId} from '../../../smart-utils/misc/uid';

export class IframeBasicProvider extends BaseProvider<HTMLIFrameElement> {
	private _state: PlayerStates = PlayerStates.UNINITIALIZED;

	static get providerName() {
		return 'iframe';
	}

	protected static buildIframe(sm: SmartMedia) {
		const el = document.createElement('iframe');
		el.id = 'smedia-iframe-' + generateUId();
		el.className = 'smedia-inner smedia-iframe';
		el.title = sm.title;
		el.setAttribute('aria-label', sm.title);
		el.setAttribute('frameborder', '0');
		el.setAttribute('tabindex', '0');
		el.setAttribute('allowfullscreen', 'yes');
		el.src = sm.mediaSrc;
		return el;
	}

	public bind() {
		if (this._state !== PlayerStates.UNINITIALIZED) return;
		this._ready = new Promise((resolve, reject) => {
			this._el = IframeBasicProvider.buildIframe(this.component);
			this._el.onload = () => resolve();
			this._el.onerror = (e) => reject(e);
			this._state = PlayerStates.UNSTARTED;
			this.component.appendChild(this._el);
		});
		this._ready.then(() => {
			this._state = PlayerStates.PLAYING;
			this.component._onReady();
			this.component._onPlay();
		});
		this._ready.catch((e) => this.component._onError(e));
	}

	public unbind() {
		this.component._onDetach();
		if (this._el && this._el.parentNode) {
			this._el.parentNode.removeChild(this._el);
		}
		this._state = PlayerStates.UNINITIALIZED;
	}

	get ready() {
		return Promise.resolve();
	}

	public focus() {
		if (this._el && this._el.contentWindow) {
			this._el.contentWindow.focus();
		}
	}

	public get state() {
		return this._state;
	}

	public get duration() {
		return 0;
	}

	public get currentTime() {
		return 0;
	}

    get defaultAspectRatio(): number {
        return 0;
    }

	public seekTo(pos: number) {
		console.error('[SmartMedia] Unsupported action: can not execute seekTo on abstract iframe provider');
	}

	public play() {
		if (this.state === PlayerStates.UNINITIALIZED) {
			this.bind();
		}
	}
	public pause() {
		this.unbind();
	}
	public stop() {
		this.unbind();
	}
}

SmartMediaProviderRegistry.register(IframeBasicProvider, IframeBasicProvider.providerName);