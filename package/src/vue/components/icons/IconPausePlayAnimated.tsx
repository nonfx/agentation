import { defineComponent } from 'vue'
import './IconPausePlayAnimated.css'

export default defineComponent({
  props: {
    size: { type: Number, default: 24 },
    isPaused: { type: Boolean, default: false }
  },
  setup(props) {

    return () => (
      <svg width={props.size} height={props.size} viewBox="0 0 24 24" fill="none">{/*  Pause bars - visible when not paused  */}<path d="M8 6L8 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" style={{ opacity: props.isPaused ? 0 : 1 }} class="pause-bar" /><path d="M16 18L16 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" style={{ opacity: props.isPaused ? 0 : 1 }} class="pause-bar" />{/*  Play triangle - visible when paused  */}<path d="M17.75 10.701C18.75 11.2783 18.75 12.7217 17.75 13.299L8.75 18.4952C7.75 19.0725 6.5 18.3509 6.5 17.1962L6.5 6.80384C6.5 5.64914 7.75 4.92746 8.75 5.50481L17.75 10.701Z" stroke="currentColor" stroke-width="1.5" style={{ opacity: props.isPaused ? 1 : 0 }} class="play-triangle" /></svg>
    )
  }
})