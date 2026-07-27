import { defineComponent } from 'vue'
import './IconCheckSmallAnimated.css'

export default defineComponent({
  props: {
    size: { type: Number, default: 14 }
  },
  setup(props) {

    return () => (
      <svg width={props.size} height={props.size} viewBox="0 0 14 14" fill="none"><path d="M3.9375 7L6.125 9.1875L10.5 4.8125" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="check-path-animated" /></svg>
    )
  }
})