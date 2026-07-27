import { defineComponent } from 'vue'
import './App.css'
import { Agentation } from 'agentation/vue'

export default defineComponent({
  setup() {
    function _renderList<T>(source: T[], renderItem: (item: T, index: number) => unknown): unknown[]
    function _renderList(source: number, renderItem: (value: number, index: number) => unknown): unknown[]
    function _renderList<T extends object>(source: T, renderItem: (value: T[keyof T], key: string, index: number) => unknown): unknown[]
    function _renderList(
      source: unknown,
      renderItem: (...args: Array<unknown>) => unknown
    ): Array<unknown> {
      if (Array.isArray(source)) {
        return source.map((item, index) => renderItem(item, index, source))
      }
      if (typeof source === 'number') {
        return Array.from({ length: source }, (_, i) =>
          (renderItem as (...args: Array<unknown>) => unknown)(i + 1, i)
        )
      }
      if (typeof source === 'object' && source) {
        return Object.keys(source).map((key, index) =>
          renderItem((source as Record<string, unknown>)[key], key, index)
        )
      }
      return []
    }


    return () => (
      <div id="page"><Agentation /><header><h1>Agentation Vue 3 Test</h1><p>Click elements on this page to annotate them. Use the floating toolbar to manage annotations.</p></header><main><section class="card"><h2>Feature Card</h2><p>This is a sample card component. Try clicking it to create an annotation.</p><button class="btn primary">Primary Action</button><button class="btn secondary">Secondary Action</button></section><section class="card"><h2>Navigation Example</h2><nav><a href="#">Home</a><a href="#">About</a><a href="#">Features</a><a href="#">Pricing</a><a href="#">Contact</a></nav></section><section class="card"><h2>Form Elements</h2><div class="form-group"><label for="name">Name</label><input id="name" type="text" placeholder="Enter your name" /></div><div class="form-group"><label for="email">Email</label><input id="email" type="email" placeholder="you@example.com" /></div><div class="form-group"><label for="message">Message</label><textarea id="message" rows="3" placeholder="Write something..." /></div><button class="btn primary">Submit</button></section><section class="card"><h2>Content Block</h2><p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. </p><ul><li>First list item</li><li>Second list item</li><li>Third list item with <strong>bold text</strong></li></ul></section><section class="grid">{_renderList(6, (i) => (<div key={i} class="grid-item"><div class="grid-icon">{['📦', '🎨', '⚡', '🔧', '📊', '🚀'][i - 1]}</div><h3>Item {i}</h3><p>Grid item description</p></div>))}</section></main><footer><p>Agentation Vue 3 Test App</p></footer></div>
    )
  }
})