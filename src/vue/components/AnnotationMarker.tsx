import { computed, defineComponent } from 'vue'
import styles from '../../styles/page-toolbar.module.scss'
import type { Annotation } from '../../types'
import { IconXmark, IconEdit } from './icons'

export default defineComponent({
  props: {
    annotation: { type: Object as PropType<Annotation>, required: true },
    globalIndex: { type: Number, required: true },
    index: { type: Number, required: true },
    totalVisible: { type: Number, required: true },
    isHovered: { type: Boolean, required: true },
    isDeleting: { type: Boolean, required: true },
    isEditing: { type: Boolean, required: true },
    markerColor: { type: String, required: true },
    markerClickBehavior: { type: String as PropType<'edit' | 'delete'>, required: true },
    markersExiting: { type: Boolean, required: true },
    isClearing: { type: Boolean, required: true },
    needsEnterAnimation: { type: Boolean, required: true },
    isFixed: { type: Boolean, required: true },
    renumberFrom: { type: Object as PropType<number | null>, required: true },
    isDarkMode: { type: Boolean, required: true }
  },
  emits: ['mouseenter', 'mouseleave', 'click', 'contextmenu'],
  setup(props, { emit }) {
    const showDeleteState = computed(() => (props.isHovered || props.isDeleting) && !props.isEditing)
    const showDeleteHover = computed(() => showDeleteState.value && props.markerClickBehavior === 'delete')

    const animClass = computed(() => {
      if (props.markersExiting) return styles.exit
      if (props.isClearing) return styles.clearing
      if (props.needsEnterAnimation) return styles.enter
      return ''
    })

    const markerClass = computed(() => [
      styles.marker,
      props.isFixed ? styles.fixed : '',
      props.annotation.isMultiSelect ? styles.multiSelect : '',
      animClass.value,
      showDeleteHover.value ? styles.hovered : '',
    ].filter(Boolean).join(' '))

    const animDelay = computed(() => {
      if (props.markersExiting) {
        return `${(props.totalVisible - 1 - props.index) * 20}ms`
      }
      if (props.needsEnterAnimation) {
        return `${props.index * 20}ms`
      }
      return undefined
    })

    const showTooltip = computed(() => props.isHovered && !props.isEditing)

    function getTooltipPosition(): Record<string, string> {
      const tooltipMaxWidth = 200
      const tooltipEstimatedHeight = 80
      const markerSize = 22
      const gap = 10

      const markerX = (props.annotation.x / 100) * window.innerWidth
      const markerY = typeof props.annotation.y === 'string' ? parseFloat(props.annotation.y) : props.annotation.y
      const result: Record<string, string> = {}

      const spaceBelow = window.innerHeight - markerY - markerSize - gap
      if (spaceBelow < tooltipEstimatedHeight) {
        result.top = 'auto'
        result.bottom = `calc(100% + ${gap}px)`
      }

      const centerX = markerX - tooltipMaxWidth / 2
      const edgePadding = 10
      if (centerX < edgePadding) {
        const offset = edgePadding - centerX
        result.left = `calc(50% + ${offset}px)`
      } else if (centerX + tooltipMaxWidth > window.innerWidth - edgePadding) {
        const overflow = centerX + tooltipMaxWidth - (window.innerWidth - edgePadding)
        result.left = `calc(50% - ${overflow}px)`
      }

      return result
    }

    return () => (
      <div data-annotation-marker style={{
            left: `${props.annotation.x}%`,
            top: props.annotation.isFixed ? `${props.annotation.y}px` : props.annotation.y + 'px',
            backgroundColor: showDeleteHover.value ? undefined : props.markerColor,
            animationDelay: animDelay.value,
          }} onMouseenter={() => emit('mouseenter')} onMouseleave={() => emit('mouseleave')} onClick={($event) => { $event.stopPropagation(); emit('click') }} onContextmenu={($event) => emit('contextmenu', $event)} class={markerClass.value}>{showDeleteState.value ? <>{showDeleteHover.value ? <IconXmark size={props.annotation.isMultiSelect ? 18 : 16} /> : <IconEdit size={16} />}</> : <span class={props.renumberFrom !== null && props.globalIndex >= props.renumberFrom ? styles.renumber : undefined}>{props.globalIndex + 1}</span>}{/*  Tooltip  */}{showTooltip.value ? <div style={getTooltipPosition()} class={[
              styles.markerTooltip,
              !props.isDarkMode ? styles.light : '',
              styles.enter,
            ]}><span class={styles.markerQuote}>{props.annotation.element} {props.annotation.selectedText ? <>  "{props.annotation.selectedText.slice(0, 30)}{props.annotation.selectedText.length > 30 ? '...' : ''}" </> : null}</span><span class={styles.markerNote}>{props.annotation.comment}</span></div> : null}</div>
    )
  }
})