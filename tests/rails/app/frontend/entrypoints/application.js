import "@hotwired/turbo"
import * as ActiveStorage from '@rails/activestorage'
import "@rails/actiontext"
import * as Trix from "trix"
import "rhino-editor"
import "rhino-editor/exports/styles/trix.css";
import Youtube from "@tiptap/extension-youtube"
import {common, createLowlight} from 'lowlight'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import {toHtml} from 'hast-util-to-html'
import "trix/dist/trix.css";
import { Application } from "@hotwired/stimulus"
import EmbedController from "../controllers/embed_controller.js"
import TipTapMirrorController from "../controllers/tip_tap_mirror_controller.js"
window.Stimulus = Application.start()
window.Stimulus.debug = true
Stimulus.register("embed", EmbedController)
Stimulus.register("tip-tap-mirror", TipTapMirrorController)

ActiveStorage.start()

const lowlight = createLowlight(common)
const syntaxHighlight = CodeBlockLowlight.configure({
  lowlight,
})

function extendRhinoEditor (event) {
  const rhinoEditor = event.target

  if (rhinoEditor == null) return

  rhinoEditor.starterKitOptions = {
    ...rhinoEditor.starterKitOptions,
    // We disable codeBlock from the starterkit to be able to use CodeBlockLowlight's extension.
    codeBlock: false
  }

  rhinoEditor.extensions = [syntaxHighlight]

  rhinoEditor.rebuildEditor()
}

document.addEventListener("rhino-before-initialize", extendRhinoEditor)

document.addEventListener("rhino-initialize", (e) => {
  const rhinoEditor = e.target
  rhinoEditor.addExtensions(Youtube)

  const content = `<pre><code class="language-javascript"><span class="hljs-keyword">if</span> (<span class="hljs-literal">true</span>) {
  <span class="hljs-comment">// Always do this thing</span>
  <span class="hljs-comment">// Because true is always true</span>
  <span class="hljs-number">1</span> + <span class="hljs-number">1</span>
  <span class="hljs-keyword">const</span> result = <span class="hljs-number">3</span>
}</code></pre>`
  setTimeout(() => {
    rhinoEditor.editor.chain().focus().setContent(content).run()
  }, 0)
})


// Import all channels.
// const channels = import.meta.globEager('./**/*_channel.js')

;(async function () {
  const Prism = (await import("https://cdn.skypack.dev/prismjs")).default
  await window.customElements.whenDefined("rhino-editor");

  const tipTapInput = document.querySelector("#y")
  const tipTapHtmlMirror = document.querySelector("#tip-tap-mirrored-html")

  const trixInput = document.querySelector("#x")
  const trixHtmlMirror = document.querySelector("#trix-mirrored-html")

  if (trixHtmlMirror) Prism.highlightElement(trixHtmlMirror)
  if (tipTapHtmlMirror) Prism.highlightElement(tipTapHtmlMirror)

  const escapeHTML = (str) => {
    const p = document.createElement("p");
    p.appendChild(document.createTextNode(str));
    return p.innerHTML;
  }

  if (tipTapInput && tipTapHtmlMirror) {
    replaceWithWrapper(tipTapInput, "value", function(obj, property, value) {
      const html = escapeHTML(value.replace(/<p>/g, "\n<p>").replace(/<blockquote>/g, "\n<blockquote>").replace(/<\/blockquote>/g, "\n</blockquote>"))

      tipTapHtmlMirror.innerHTML = html
      Prism.highlightElement(tipTapHtmlMirror)
      obj.setAttribute(property, value)
    });
  }

  if (trixInput && trixHtmlMirror) {
    replaceWithWrapper(trixInput, "value", function(obj, property, value) {
      const html = escapeHTML(value.replace(/<p>/g, "\n<p>").replace(/<blockquote>/g, "\n<blockquote>").replace(/<\/blockquote>/g, "\n</blockquote>"))

      trixHtmlMirror.innerHTML = html
      Prism.highlightElement(trixHtmlMirror)
      obj.setAttribute(property, value)
    });
  }

  function replaceWithWrapper(obj, property, callback) {
    Object.defineProperty(obj, property, new function() {
      var _value = obj[property];
      return {
        set: function(value) {
          _value = value;
          callback(obj, property, value)
        },
        get: function() {
          return _value;
        }
      }
    });
  }
})()

