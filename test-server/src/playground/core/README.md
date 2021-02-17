# ESL Playground

UIPRoot - state storage.

---

### Notes: 

- Playground stores the 'state'. State - actual markup of the current component.

- Playground implements the observable pattern. It means that you can subscribe/unsubscribe to current state changes.

- Playground contains method for updating current state change.

---

### Example:

```html
<uip-root></uip-root>
```

```typescript
import {UIPRoot} from "./root";

const playground = document.getElementsByTagName('uip-root')[0] as UIPRoot;
playground.subscribe(callback); // callback: (markup: string, source: string) => void
```
