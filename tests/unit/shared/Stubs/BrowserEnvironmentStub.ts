import type { BrowserEnvironment } from '@/infrastructure/RuntimeEnvironment/Browser/BrowserOs/BrowserOsDetector';

export class BrowserEnvironmentStub implements BrowserEnvironment {
  public isTouchSupported = false;

  public userAgent = `[${BrowserEnvironmentStub.name}] User-Agent`;

  public withIsTouchSupported(isTouchSupported: boolean): this {
    this.isTouchSupported = isTouchSupported;
    return this;
  }

  public withUserAgent(userAgent: string): this {
    this.userAgent = userAgent;
    return this;
  }
}
