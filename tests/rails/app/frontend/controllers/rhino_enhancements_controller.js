import { Controller } from "@hotwired/stimulus"

export default class RhinoEnhancementsController extends Controller {
  alignLeft() {
    this.element.editor.chain().focus().setTextAlign('left').run()
    this.updateAlignmentButtons()
  }

  alignCenter() {
    this.element.editor.chain().focus().setTextAlign('center').run()
    this.updateAlignmentButtons()
  }

  alignRight() {
    this.element.editor.chain().focus().setTextAlign('right').run()
    this.updateAlignmentButtons()
  }

  updateAlignmentButtons() {
    const editor = this.element.editor
    const alignments = ['left', 'center', 'right']
    alignments.forEach(alignment => {
      const button = this.element.querySelector(`rhino-editor button[data-align="${alignment}"]`)
      if (button) {
        button.classList.toggle('toolbar__button--active', editor.isActive({ textAlign: alignment }))
      }
    })
  }
}
