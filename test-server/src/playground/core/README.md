# ESL Playground

ESLPlayground - state storage.

---

### Notes: 

- Playground stores the 'state'. State - actual markup of the current component.

- Playground implements the observable pattern. It means that you can subscribe/unsubscribe to current state changes.

- Playground contains method for updating current state change.

---

### Example:

```html
<esl-playground></esl-playground>
```

```typescript
import {ESLPlayground} from "./playground";

const playground = document.getElementsByTagName('esl-playground')[0] as ESLPlayground;
playground.subscribe(callback); // callback: (markup: string, source: string) => void
```
