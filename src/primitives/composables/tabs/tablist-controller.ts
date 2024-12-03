import { KeyboardEventManager } from '../../event-manager/keyboard-event-manager';
import {
  MouseButton,
  MouseEventManager,
} from '../../event-manager/mouse-event-manager';
import { ListNavigationController } from '../navigation/list-navigation-controller';
import { TabState } from './tab-state';
import { TablistState } from './tablist-state';

export class TablistController<T extends TabState> {
  private navigationController: ListNavigationController<T>;

  private readonly keydownManager = new KeyboardEventManager()
    .on('ArrowLeft', () => {
      this.navigationController.navigatePrevious();
    })
    .on('ArrowRight', () => {
      this.navigationController.navigateNext();
    });

  private readonly clickManager = new MouseEventManager().on(
    MouseButton.Main,
    (event) => {
      const index = this.state
        .items()
        .findIndex(
          (o) => o.element.contains(event.target as Node) && !o.disabled(),
        );
      this.navigationController.navigateTo(index);
    },
  );

  constructor(private readonly state: TablistState<T>) {
    this.navigationController = new ListNavigationController(
      state.navigationState,
    );
  }

  handleKeydown(event: KeyboardEvent) {
    this.keydownManager.handle(event);
  }

  handleClick(event: MouseEvent) {
    this.clickManager.handle(event);
  }
}
