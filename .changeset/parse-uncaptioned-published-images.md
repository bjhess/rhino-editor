---
"rhino-editor": patch
---

Fix pasting a published ActionText image that has no caption. ActionText only renders a `<figcaption>` when an attachment has a caption, so parsing an uncaptioned `<action-text-attachment><figure class="attachment">` threw `Cannot read properties of null (reading 'firstChild')` and the whole paste was lost. The attachment is now inserted with an empty caption. Captioned images keep their caption as before.
