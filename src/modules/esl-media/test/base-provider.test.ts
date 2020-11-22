import {BaseProvider, PlayerStates, ProviderType} from '../core/esl-media-provider';
import {ESLMediaProviderRegistry} from '../core/esl-media-registry';

describe('ESLMedia: BaseProvider tests', () => {
  test('BaseProvider can\'t be registered', () => {
    expect(() => (BaseProvider as ProviderType).register()).toThrowError();
  });

  test('Not provider can\'t be registered', () => {
    expect(() => BaseProvider.register([] as any)).toThrowError();
  });

  test('Provider should have correct name', () => {
    expect(() => TestBaseProvider.register()).toThrowError();
  });

  test('Test provider registered', () => {
    class TestProvider extends TestBaseProvider {
      static readonly providerName = 'test-provider';
    }
    expect(ESLMediaProviderRegistry.instance.has('test-provider')).toBe(false);
    expect(ESLMediaProviderRegistry.instance.getProvider('test-provider')).toBe(null);
    TestProvider.register();
    expect(ESLMediaProviderRegistry.instance.has('test-provider')).toBe(true);
    expect(ESLMediaProviderRegistry.instance.getProvider('test-provider')).toBe(TestProvider);
  });

  test('Test provider registered via decorator', () => {
    @BaseProvider.register
    class TestProvider extends TestBaseProvider {
      static readonly providerName = 'test-provider-2';
    }
    expect(ESLMediaProviderRegistry.instance.has('test-provider-2')).toBe(true);
    expect(ESLMediaProviderRegistry.instance.getProvider('test-provider-2')).toBe(TestProvider);
  });
});

class TestBaseProvider extends BaseProvider {
  public bind(): void {}

  public get duration(): number {
    return 0;
  }
  public get currentTime(): number {
    return 0;
  }
  public get defaultAspectRatio(): number {
    return 0;
  }

  protected pause(): void | Promise<any> {}
  protected play(): void | Promise<any> {}
  protected stop(): void | Promise<any> {}

  protected seekTo(pos?: number): void | Promise<any> {}

  public get state() {
    return PlayerStates.UNINITIALIZED;
  }
}