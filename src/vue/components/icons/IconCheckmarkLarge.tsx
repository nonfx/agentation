import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    size: { type: Number, default: 16 }
  },
  setup(props) {

    return () => (
      <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none"><g clip-path="url(#clip0_2_37)"><path d="M17.5962 7.75L9.42308 16.25L6.15385 12.6538" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></g><defs><clipPath id="clip0_2_37"><rect width="24" height="24" fill="white" /></clipPath></defs></svg>
    )
  }
})