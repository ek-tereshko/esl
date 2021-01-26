# ESL Settings, ESL Setting

ESLSettings - custom element that stores ESLSettings. ESLSetting - custom element that changes component's attribute in
the markup.

---

### Notes:

- ESLSettings:
  - This element subscribes to the 'state' of parent [ESL Playground](../core/README.md).
  - ESLSettings parses markup and distributes changes among child settings components and vice versa.
  - Setting applies only to the first matching tag.


- ESLSetting:
  - There are 3 types of settings:
    - input
    - list
    - checkbox
  - ESLSetting has required attribute 'for' that determines to which tag setting should be applied.
  - ESLSetting has required attribute 'name' that refers to attribute name which should be changed.
  - ESLListSetting should contain <esl-list-item>. <esl-list-item> has setting name in text content, while value stores
    in the attribute 'value'.

---

### Example:

```html
<esl-settings>
  <!--  Check Setting-->
  <esl-check-setting name="controls" for="esl-media"></esl-check-setting>
  <!--  Input Setting-->
  <esl-text-setting name="media-id" for="esl-media"></esl-text-setting>
  <!--  List Setting-->
  <esl-list-setting name="fill-mode" for="esl-media">
    <esl-list-item value="auto">Auto mode</esl-list-item>
    <esl-list-item value="cover">Cover mode</esl-list-item>
    <esl-list-item value="inscribe">Inscribe mode</esl-list-item>
  </esl-list-setting>
</esl-settings>
```
