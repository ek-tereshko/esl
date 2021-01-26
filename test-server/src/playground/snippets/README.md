# ESL Snippets, ESL Snippet

ESLSnippets - custom element, container that stores snippets. ESLSnippet - container that stores custom markup.

---

### Notes:

- ESLSnippets:
  - Elements' markup should be placed in template tag.
  - An active element could be chosen by adding class 'active' to snippet, otherwise first snippet becomes 'active'.
- ESLSnippet:
  - ESLSnippet has required attribute 'name'.

---

### Example:

```html
<esl-snippets>
  <esl-snippet name='Image Mode: cover' class='active'>
    <template>
      <div class="img-container img-container-4-3">
        <esl-image mode="cover"
                   data-alt="Alt Text"
                   data-src="img-5-carousel-9-6.jpg"
                   data-src-base="/images/"></esl-image>
      </div>
    </template>
  </esl-snippet>
</esl-snippets>
```
