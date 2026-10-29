// @ts-check
import "rhino-editor"
import { assert } from "@open-wc/testing"
import { findChildren } from "@tiptap/core"
import { createEditor } from "./helpers/create-editor.js"

/**
 * Published ActionText HTML only includes a <figcaption> when the image has a caption.
 * @param {string} [caption]
 */
function publishedImage (caption) {
  return `<action-text-attachment sgid="any" previewable="true" content-type="image/jpeg" url="https://example.com/photo.jpg" filename="photo.jpg">
    <figure class="attachment attachment--preview attachment--jpg">
      <img src="https://example.com/photo.jpg">
      ${caption ? `<figcaption class="attachment__caption">${caption}</figcaption>` : ""}
    </figure>
  </action-text-attachment>`
}

/**
 * @param {string} html
 */
async function pasteHTML (html) {
  const { rhinoEditor, tiptap } = await createEditor()
  const editor = rhinoEditor.editor
  if (!editor) throw Error("Editor did not initialize")

  tiptap().focus()

  const clipboardData = new DataTransfer()
  clipboardData.setData("text/html", html)
  const pasteEvent = new ClipboardEvent("paste", { bubbles: true, cancelable: true })
  // Firefox empties a clipboardData passed to the constructor.
  Object.defineProperty(pasteEvent, "clipboardData", { value: clipboardData })
  tiptap().dispatchEvent(pasteEvent)

  return findChildren(editor.state.doc, (node) => node.type.name === "previewable-attachment-figure")
}

test("Pasting a published image without a caption inserts the attachment", async () => {
  const attachments = await pasteHTML(publishedImage())

  assert.equal(attachments.length, 1)
  assert.equal(attachments[0].node.attrs.sgid, "any")
  assert.equal(attachments[0].node.textContent, "")
})

test("Pasting a published image with a caption keeps the caption", async () => {
  const attachments = await pasteHTML(publishedImage("A nice photo"))

  assert.equal(attachments.length, 1)
  assert.equal(attachments[0].node.attrs.sgid, "any")
  assert.equal(attachments[0].node.textContent, "A nice photo")
})
