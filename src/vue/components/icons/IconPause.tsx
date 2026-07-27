import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    size: { type: Number, default: 24 }
  },
  setup(props) {

    return () => (
      <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none"><path d="M8 6L8 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" /><path d="M16 18L16 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" /></svg>
    )
  }
})