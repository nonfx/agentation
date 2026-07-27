import { ref, watch, onMounted, onUnmounted, defineComponent, computed } from 'vue'
import styles from '../../styles/annotation-popup.module.scss'
import { originalSetTimeout } from '../../utils/freeze-animations'

export default defineComponent({
  props: {
    element: { type: String, required: true },
    timestamp: { type: String, required: false },
    selectedText: { type: String, required: false },
    placeholder: { type: String, required: false },
    initialValue: { type: String, default: '' },
    submitLabel: { type: String, default: 'Add' },
    onSubmit: { type: Object as PropType<(text: string) =>, required: true }
  },
  setup(props, { expose }) {
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

    // =============================================================================
    // Props
    // =============================================================================


    // =============================================================================
    // State
    // =============================================================================

    const text = ref(props.initialValue)
    const isShaking = ref(false)
    const animState = ref<'initial' | 'enter' | 'entered' | 'exit'>('initial')
    const isFocused = ref(false)
    const isStylesExpanded = ref(false)

    const textareaRef = ref<HTMLTextAreaElement | null>(null)
    const popupRef = ref<HTMLDivElement | null>(null)

    let cancelTimer: ReturnType<typeof setTimeout> | null = null
    let shakeTimer: ReturnType<typeof setTimeout> | null = null

    // =============================================================================
    // Sync with parent exit state
    // =============================================================================

    watch(() => props.isExiting, (exiting) => {
      if (exiting && animState.value !== 'exit') {
        animState.value = 'exit'
      }
    })

    // =============================================================================
    // Mount animation + focus
    // =============================================================================

    onMounted(() => {
      originalSetTimeout(() => {
        animState.value = 'enter'
      }, 0)
      const enterTimer = originalSetTimeout(() => {
        animState.value = 'entered'
      }, 200)
      const focusTimer = originalSetTimeout(() => {
        const textarea = textareaRef.value
        if (textarea) {
          textarea.focus()
          textarea.selectionStart = textarea.selectionEnd = textarea.value.length
          textarea.scrollTop = textarea.scrollHeight
        }
      }, 50)

      onUnmounted(() => {
        clearTimeout(enterTimer)
        clearTimeout(focusTimer)
        if (cancelTimer) clearTimeout(cancelTimer)
        if (shakeTimer) clearTimeout(shakeTimer)
      })
    })

    // =============================================================================
    // Methods
    // =============================================================================

    function shake() {
      if (shakeTimer) clearTimeout(shakeTimer)
      isShaking.value = true
      shakeTimer = originalSetTimeout(() => {
        isShaking.value = false
        textareaRef.value?.focus()
      }, 250)
    }

    function handleCancel() {
      animState.value = 'exit'
      cancelTimer = originalSetTimeout(() => {
        props.onCancel()
      }, 150)
    }

    function handleSubmit() {
      if (!text.value.trim()) return
      props.onSubmit(text.value.trim())
    }

    function handleKeyDown(e: KeyboardEvent) {
      if ((e as any).isComposing) return
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSubmit()
      }
      if (e.key === 'Escape') {
        handleCancel()
      }
    }

    function toggleStyles() {
      const wasExpanded = isStylesExpanded.value
      isStylesExpanded.value = !isStylesExpanded.value
      if (wasExpanded) {
        originalSetTimeout(() => textareaRef.value?.focus(), 0)
      }
    }

    // =============================================================================
    // Expose
    // =============================================================================


    // =============================================================================
    // Computed class
    // =============================================================================

    function popupClassName() {
      return [
        styles.popup,
        props.lightMode ? styles.light : '',
        animState.value === 'enter' ? styles.enter : '',
        animState.value === 'entered' ? styles.entered : '',
        animState.value === 'exit' ? styles.exit : '',
        isShaking.value ? styles.shake : '',
      ].filter(Boolean).join(' ')
    }

    function kebab(str: string) {
      return str.replace(/([A-Z])/g, '-$1').toLowerCase()
    }

    expose({ shake })

    return () => (
      <div ref={popupRef} data-annotation-popup style={popupStyle} onClick={($event) => { $event.stopPropagation() }} class={popupClassName()}><div class={styles.header}>{computedStyles && Object.keys(computedStyles).length > 0 ? <button type="button" onClick={toggleStyles} class={styles.headerToggle}><svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" class={[styles.chevron, isStylesExpanded.value ? styles.expanded : '']}><path d="M5.5 10.25L9 7.25L5.75 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg><span class={styles.element}>{props.element}</span></button> : <span class={styles.element}>{props.element}</span>}{props.timestamp ? <span class={styles.timestamp}>{props.timestamp}</span> : null}</div>{/*  Collapsible computed styles section  */}{computedStyles && Object.keys(computedStyles).length > 0 ? <div class={[styles.stylesWrapper, isStylesExpanded.value ? styles.expanded : '']}><div class={styles.stylesInner}><div class={styles.stylesBlock}>{_renderList(computedStyles, (value, key) => (<div key={key} class={styles.styleLine}><span class={styles.styleProperty}>{kebab(String(key))}</span> : <span class={styles.styleValue}>{value}</span>; </div>))}</div></div></div> : null}{props.selectedText ? <div class={styles.quote}> “{props.selectedText.slice(0, 80)}{props.selectedText.length > 80 ? '...' : ''}” </div> : null}<textarea ref={textareaRef} style={{ borderColor: isFocused.value ? accentColor : undefined }} placeholder={props.placeholder} value={text.value} rows={2} onInput={($event) => text.value = ($event.target as HTMLTextAreaElement).value} onFocus={() => isFocused.value = true} onBlur={() => isFocused.value = false} onKeydown={handleKeyDown} class={styles.textarea} /><div class={styles.actions}>{onDelete ? <div class={styles.deleteWrapper}><button type="button" onClick={onDelete} class={styles.deleteButton}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg></button></div> : null}<button onClick={handleCancel} class={styles.cancel}>Cancel</button><button style={{
                backgroundColor: accentColor,
                opacity: text.value.trim() ? 1 : 0.4,
              }} disabled={!text.value.trim()} onClick={handleSubmit} class={styles.submit}>{props.submitLabel}</button></div></div>
    )
  }
})