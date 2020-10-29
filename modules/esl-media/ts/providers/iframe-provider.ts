/**
 * Simple Basic Iframe provider for {@link ESLMedia}
 * @author Alexey Stsefanovich (ala'n)
 */
import {BaseProvider, PlayerStates} from '../esl-media-provider';
import ESLMediaProviderRegistry from '../esl-media-registry';
import {generateUId} from '../../../esl-utils/misc/uid';

export class IframeBasicProvider extends BaseProvider<HTMLIFrameElement> {
  private _state: PlayerStates = PlayerStates.UNINITIALIZED;

  static get providerName() {
    return 'iframe';
  }

  protected buildIframe() {
    const el = document.createElement('iframe');
    el.id = 'esl-media-iframe-' + generateUId();
    el.className = 'esl-media-inner esl-media-iframe';
    el.title = this.config.title;
    el.setAttribute('aria-label', this.config.title);
    el.setAttribute('frameborder', '0');
    el.setAttribute('tabindex', '0');
    el.setAttribute('allowfullscreen', 'yes');
    el.toggleAttribute('playsinline', this.config.playsinline);
    el.src = this.config.mediaSrc || '';
    return el;
  }

  public bind() {
    if (this._state !== PlayerStates.UNINITIALIZED) return;
    this._ready = new Promise((resolve, reject) => {
      this._el = this.buildIframe();
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
    this._state = PlayerStates.UNINITIALIZED;
    super.unbind();
  }

  public onConfigChange(cfgParam: string, newVal: boolean) {
    console.error('iframe doesn\'t support ' + cfgParam);
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
    console.error('[ESLMedia] Unsupported action: can not execute seekTo on abstract iframe provider');
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

ESLMediaProviderRegistry.register(IframeBasicProvider, IframeBasicProvider.providerName);
