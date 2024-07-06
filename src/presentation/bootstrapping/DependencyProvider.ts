import { type InjectionKey, provide, inject } from 'vue';
import { useCollectionState } from '@/presentation/components/Shared/Hooks/UseCollectionState';
import { useApplication } from '@/presentation/components/Shared/Hooks/UseApplication';
import { useAutoUnsubscribedEvents } from '@/presentation/components/Shared/Hooks/UseAutoUnsubscribedEvents';
import { useClipboard } from '@/presentation/components/Shared/Hooks/Clipboard/UseClipboard';
import { useCurrentCode } from '@/presentation/components/Shared/Hooks/UseCurrentCode';
import type { IApplicationContext } from '@/application/Context/IApplicationContext';
import {
  type AnyLifetimeInjectionKey, type InjectionKeySelector, InjectionKeys, type SingletonKey,
  type TransientKey, injectKey,
} from '@/presentation/injectionSymbols';
import type { PropertyKeys } from '@/TypeHelpers';
import { useUserSelectionState } from '@/presentation/components/Shared/Hooks/UseUserSelectionState';
import { useLogger } from '@/presentation/components/Shared/Hooks/Log/UseLogger';
import { useCodeRunner } from '@/presentation/components/Shared/Hooks/UseCodeRunner';
import { CurrentEnvironment } from '@/infrastructure/RuntimeEnvironment/RuntimeEnvironmentFactory';
import { useDialog } from '@/presentation/components/Shared/Hooks/Dialog/UseDialog';
import { useScriptDiagnosticsCollector } from '@/presentation/components/Shared/Hooks/UseScriptDiagnosticsCollector';
import { useAutoUnsubscribedEventListener } from '@/presentation/components/Shared/Hooks/UseAutoUnsubscribedEventListener';

export function provideDependencies(
  context: IApplicationContext,
  api: VueDependencyInjectionApi = { provide, inject },
) {
  const resolvers: Record<PropertyKeys<typeof InjectionKeys>, (di: DependencyRegistrar) => void> = {
    useCollectionState: (di) => di.provide(
      InjectionKeys.useCollectionState,
      () => {
        const { events } = di.injectKey((keys) => keys.useAutoUnsubscribedEvents);
        return useCollectionState(context, events);
      },
    ),
    useApplication: (di) => di.provide(
      InjectionKeys.useApplication,
      useApplication(context.app),
    ),
    useRuntimeEnvironment: (di) => di.provide(
      InjectionKeys.useRuntimeEnvironment,
      CurrentEnvironment,
    ),
    useAutoUnsubscribedEvents: (di) => di.provide(
      InjectionKeys.useAutoUnsubscribedEvents,
      useAutoUnsubscribedEvents,
    ),
    useClipboard: (di) => di.provide(
      InjectionKeys.useClipboard,
      useClipboard,
    ),
    useCurrentCode: (di) => di.provide(
      InjectionKeys.useCurrentCode,
      () => {
        const { events } = di.injectKey((keys) => keys.useAutoUnsubscribedEvents);
        const state = di.injectKey((keys) => keys.useCollectionState);
        return useCurrentCode(state, events);
      },
    ),
    useUserSelectionState: (di) => di.provide(
      InjectionKeys.useUserSelectionState,
      () => {
        const events = di.injectKey((keys) => keys.useAutoUnsubscribedEvents);
        const state = di.injectKey((keys) => keys.useCollectionState);
        return useUserSelectionState(state, events);
      },
    ),
    useLogger: (di) => di.provide(
      InjectionKeys.useLogger,
      useLogger,
    ),
    useCodeRunner: (di) => di.provide(
      InjectionKeys.useCodeRunner,
      useCodeRunner,
    ),
    useDialog: (di) => di.provide(
      InjectionKeys.useDialog,
      useDialog,
    ),
    useScriptDiagnosticsCollector: (di) => di.provide(
      InjectionKeys.useScriptDiagnosticsCollector,
      useScriptDiagnosticsCollector,
    ),
    useAutoUnsubscribedEventListener: (di) => di.provide(
      InjectionKeys.useAutoUnsubscribedEventListener,
      useAutoUnsubscribedEventListener,
    ),
  };
  registerAll(Object.values(resolvers), api);
}

function registerAll(
  registrations: ReadonlyArray<(di: DependencyRegistrar) => void>,
  api: VueDependencyInjectionApi,
) {
  const registrar = new DependencyRegistrar(api);
  Object.values(registrations).forEach((register) => register(registrar));
}

export interface VueDependencyInjectionApi {
  provide<T>(key: InjectionKey<T>, value: T): void;
  inject<T>(key: InjectionKey<T>): T;
}

class DependencyRegistrar {
  constructor(private api: VueDependencyInjectionApi) {}

  public provide<T>(
    key: TransientKey<T>,
    resolver: () => T,
  ): void;
  public provide<T>(
    key: SingletonKey<T>,
    resolver: T,
  ): void;
  public provide<T>(
    key: AnyLifetimeInjectionKey<T>,
    resolver: T | (() => T),
  ): void {
    this.api.provide(key.key, resolver);
  }

  public injectKey<T>(key: InjectionKeySelector<T>): T {
    const injector = this.api.inject.bind(this.api);
    return injectKey(key, injector);
  }
}
