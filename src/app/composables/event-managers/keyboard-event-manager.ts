import { EventHandlerOptions, getModifiers } from './shared';

export interface KeyboardEventHandlerConfig extends EventHandlerOptions {
  key: string;
  modifiers: number;
  handler: (event: KeyboardEvent) => void;
}

export class KeyboardEventManager {
  private handledKeys: KeyboardEventHandlerConfig[] = [];

  private defaultHandlerOptions: EventHandlerOptions;

  constructor(defaultHandlerOptions?: Partial<EventHandlerOptions>) {
    this.defaultHandlerOptions = {
      preventDefault: true,
      stopPropagation: true,
      ...defaultHandlerOptions,
    };
  }

  on(
    modifiers: number,
    key: string,
    handler: (event: KeyboardEvent) => void,
    options?: Partial<EventHandlerOptions>
  ): KeyboardEventManager;
  on(
    key: string,
    handler: (event: KeyboardEvent) => void,
    options?: Partial<EventHandlerOptions>
  ): KeyboardEventManager;
  on(...args: any[]) {
    let modifiers = 0;
    let key: string;
    const first = args.shift();
    if (typeof first === 'number') {
      modifiers = first;
      key = args.shift();
    } else {
      key = first;
    }
    const handler: VoidFunction = args.shift();
    this.handledKeys.push({
      modifiers,
      key,
      handler,
      ...this.defaultHandlerOptions,
      ...args.shift(),
    });
    return this;
  }

  handle(event: KeyboardEvent) {
    for (const {
      key,
      modifiers,
      handler,
      stopPropagation,
      preventDefault,
    } of this.handledKeys) {
      if (key === event.key && modifiers === getModifiers(event)) {
        handler(event);
        if (stopPropagation) {
          event.stopPropagation();
        }
        if (preventDefault) {
          event.preventDefault();
        }
      }
    }
  }
}
