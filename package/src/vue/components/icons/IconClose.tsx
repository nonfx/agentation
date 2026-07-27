import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    size: { type: Number, default: 16 }
  },
  setup(props) {

    return () => (
      <svg width={props.size} height={props.size} viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" /></svg>
    )
  }
})