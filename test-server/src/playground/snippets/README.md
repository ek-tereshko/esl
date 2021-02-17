# ESL Snippets, ESL Snippet

UIPSnippets - custom element, container that stores snippets. UIPSnippet - container that stores custom markup.

---

### Notes:

- UIPSnippets:
  - Elements' markup should be placed in template tag.
  - An active element could be chosen by adding class 'active' to snippet, otherwise first snippet becomes 'active'.
- UIPSnippet:
  - UIPSnippet has required attribute 'name'.

---

### Example:

```html
<uip-snippets>
  <uip-snippet name='Image Mode: cover' class='active'>
    <template>
      <div class="img-container img-container-4-3">
        <esl-image mode="cover"
                   data-alt="Alt Text"
                   data-src="img-5-carousel-9-6.jpg"
                   data-src-base="/images/"></esl-image>
      </div>
    </template>
  </uip-snippet>
</uip-snippets>
```
