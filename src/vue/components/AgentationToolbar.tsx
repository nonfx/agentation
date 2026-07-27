import { ref, computed, watch, watchEffect, onMounted, onUnmounted, nextTick, Teleport, defineComponent } from 'vue'
import styles from '../../styles/page-toolbar.module.scss'
import type { Annotation } from '../../types'
import { identifyElement, getNearbyText, getElementClasses, getDetailedComputedStyles, getForensicComputedStyles, parseComputedStylesString, getFullElementPath, getAccessibilityInfo, getNearbyElements, closestCrossingShadow } from '../../utils/element-identification'
import { freeze as freezeAll, unfreeze as unfreezeAll, originalSetTimeout, originalSetInterval } from '../../utils/freeze-animations'
import { loadAnnotations, saveAnnotations, loadToolbarHidden, saveToolbarHidden, saveAnnotationsWithSyncMarker, getStorageKey } from '../../utils/storage'
import { syncAnnotation, updateAnnotation as updateAnnotationOnServer, deleteAnnotation as deleteAnnotationFromServer } from '../../utils/sync'
import { useAnnotationState, PendingAnnotation } from '../composables/useAnnotationState'
import { deepElementFromPoint, isElementFixed, generateOutput } from '../composables/useCopyOutput'
import { useCursorStyles } from '../composables/useCursorStyles'
import { useDragSelect } from '../composables/useDragSelect'
import { useDrawing, findStrokeAtPoint, classifyStrokeGesture, hexToRgba, DrawStroke } from '../composables/useDrawing'
import { useHover } from '../composables/useHover'
import { useKeyboardShortcuts } from '../composables/useKeyboardShortcuts'
import { useMarkerVisibility } from '../composables/useMarkerVisibility'
import { useMultiSelect } from '../composables/useMultiSelect'
import { useServerSync } from '../composables/useServerSync'
import { useToolbarSettings, isValidUrl, ReactComponentMode, OUTPUT_TO_REACT_MODE } from '../composables/useToolbarSettings'
import { getVueComponentName } from '../utils/vue-detection'
import { getSourceLocation } from '../utils/vue-source-location'
import AnnotationMarker from './AnnotationMarker'
import AnnotationPopup from './AnnotationPopup'
import { IconListSparkle, IconPausePlayAnimated, IconPencil, IconEyeAnimated, IconCopyAnimated, IconSendArrow, IconTrashAlt, IconGear, IconXmarkLarge, IconPlus, IconXmark, IconClose, IconEdit } from './icons'
import ToolbarSettingsPanel from './ToolbarSettingsPanel'
import ToolbarTooltip from './ToolbarTooltip'

export default defineComponent({
  props: {
    className: { type: String, required: false },
    demoAnnotations: { type: Array as PropType<DemoAnnotation[]>, required: false },
    demoDelay: { type: Number, required: false },
    enableDemoMode: { type: Boolean, required: false },
    onAnnotationAdd: { type: Object as PropType<(annotation: Annotation) =>, required: false }
  },
  async setup(props) {
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

    // Sub-components
    // Icons
    // Composables
    // =============================================================================
    // Declare build-time constant
    // =============================================================================
    declare const __VERSION__: string

    // =============================================================================
    // Expose browser globals for template access
    // (Vue templates can't access window/document directly)
    // =============================================================================
    const _window = window
    const _document = document

    // =============================================================================
    // Types for Demo Annotations
    // =============================================================================



    // =============================================================================
    // Props
    // =============================================================================


    // =============================================================================
    // Vue component detection (equivalent to identifyElementWithReact)
    // =============================================================================

    function identifyElementWithVue(
      element: HTMLElement,
      reactMode: ReactComponentMode = 'filtered',
    ): {
      name: string
      elementName: string
      path: string
      reactComponents: string | null
    } {
      const { name: elementName, path } = identifyElement(element)
      if (reactMode === 'off') {
        return { name: elementName, elementName, path, reactComponents: null }
      }
      const vueInfo = getVueComponentName(element, { mode: reactMode as any })
      return {
        name: vueInfo.path ? `${vueInfo.path} ${elementName}` : elementName,
        elementName,
        path,
        reactComponents: vueInfo.path,
      }
    }

    // =============================================================================
    // Toolbar settings composable
    // =============================================================================

    const {
      settings,
      isDarkMode,
      showEntranceAnimation,
      mounted,
      toolbarPosition,
      isDraggingToolbar,
      dragStartPos,
      dragRotation,
      isLocalhost,
      pathname,
      getEffectiveReactMode,
      loadFromStorage,
      saveSettings,
      saveTheme,
      saveToolbarPosition,
      handleToolbarMouseDown,
      getJustFinishedToolbarDrag,
      setJustFinishedToolbarDrag,
    } = useToolbarSettings()

    // =============================================================================
    // Core state
    // =============================================================================

    const isActive = ref(false)
    const showMarkers = ref(true)
    const scrollY = ref(0)
    const isScrolling = ref(false)
    const isFrozen = ref(false)
    const showSettings = ref(false)
    const showSettingsVisible = ref(false)
    const settingsPage = ref<'main' | 'automations'>('main')
    const isTransitioning = ref(false)
    const tooltipsHidden = ref(false)
    const copied = ref(false)
    const sendState = ref<'idle' | 'sending' | 'sent' | 'failed'>('idle')
    const cleared = ref(false)
    const isClearing = ref(false)
    const hoveredMarkerId = ref<string | null>(null)
    const hoveredTargetElement = ref<HTMLElement | null>(null)
    const isToolbarHidden = ref(false)
    const isToolbarHiding = ref(false)
    const tooltipSessionActive = ref(false)
    let tooltipSessionTimerRef: ReturnType<typeof setTimeout> | null = null
    const portalWrapperRef = ref<HTMLDivElement | null>(null)
    const stopBubble = (e: Event) => e.stopPropagation()
    const hoveredTargetElements = ref<HTMLElement[]>([])
    const deletingMarkerId = ref<string | null>(null)
    const renumberFrom = ref<number | null>(null)

    // =============================================================================
    // Drawing composable
    // =============================================================================

    const {
      isDrawMode,
      drawStrokes,
      hoveredDrawingIdx,
      drawCanvasRef,
      dimAmountRef,
      visualHighlightRef,
      exitingStrokeIdRef,
      exitingAlphaRef,
      drawStrokesRef,
      updateDrawStrokesRef,
      redrawCanvas,
      resizeCanvas,
      getIsDrawing,
      setIsDrawing,
      getCurrentStroke,
      setCurrentStroke,
    } = useDrawing()

    // Watch drawStrokes to keep the ref in sync
    watch(drawStrokes, () => { updateDrawStrokesRef() }, { deep: true })

    // =============================================================================
    // Annotation state composable
    // =============================================================================

    const {
      pendingAnnotation,
      pendingExiting,
      editingAnnotation,
      editExiting,
      editingTargetElement,
      editingTargetElements,
      cancelPending,
      startEditing,
      cancelEditing,
      closeEditingForDelete,
      resetAll: resetAnnotationState,
    } = useAnnotationState()

    // =============================================================================
    // Marker visibility composable
    // =============================================================================

    const {
      markersVisible,
      markersExiting,
      animatedMarkers,
      exitingMarkers,
      getShouldShowMarkers,
      updateVisibility,
    } = useMarkerVisibility({
      isActive,
      showMarkers,
      annotations: ref([]) as any, // will be replaced
    })

    // =============================================================================
    // Annotations state (manual, not composable, to keep control flow simple)
    // =============================================================================

    const annotations = ref<Annotation[]>([])
    let annotationsSnapshot: Annotation[] = []

    function updateAnnotationsSnapshot() {
      annotationsSnapshot = annotations.value
    }
    watch(annotations, updateAnnotationsSnapshot, { deep: true })

    // Recently added marker ID
    let recentlyAddedId: string | null = null

    // =============================================================================
    // Hover composable
    // =============================================================================

    const { hoverInfo, hoverPosition, setHover, clearHover } = useHover()

    // =============================================================================
    // Drag select composable
    // =============================================================================

    const dragSelect = useDragSelect()

    // =============================================================================
    // Multi-select composable
    // =============================================================================

    const multiSelect = useMultiSelect()

    // =============================================================================
    // Cursor styles composable
    // =============================================================================

    const { injectCursorStyles, removeCursorStyles, setDrawingHoverCursor } = useCursorStyles()

    // =============================================================================
    // Server sync composable
    // =============================================================================

    const {
      currentSessionId,
      connectionStatus,
      initSession,
      startHealthCheck,
      startEventSource,
      syncOnReconnect,
    } = useServerSync({
      endpoint: props.endpoint,
      initialSessionId: props.sessionId,
      pathname,
      mounted,
      annotations,
      exitingMarkers,
      onSessionCreated: props.onSessionCreated,
    })

    // =============================================================================
    // Popup refs
    // =============================================================================

    const popupRef = ref<InstanceType<typeof AnnotationPopup> | null>(null)
    const editPopupRef = ref<InstanceType<typeof AnnotationPopup> | null>(null)
    let scrollTimeoutId: ReturnType<typeof setTimeout> | null = null

    // Drag rect / highlights container refs (for drag select)
    const dragRectRef = ref<HTMLDivElement | null>(null)
    const highlightsContainerRef = ref<HTMLDivElement | null>(null)

    // =============================================================================
    // Derived values
    // =============================================================================

    const effectiveReactMode = computed(() => getEffectiveReactMode())
    const hasAnnotations = computed(() => annotations.value.length > 0)
    const shouldShowMarkers = computed(() => isActive.value && showMarkers.value)

    const visibleAnnotations = computed(() =>
      annotations.value.filter((a) => !exitingMarkers.value.has(a.id) && isRenderableAnnotation(a)),
    )
    const exitingAnnotationsList = computed(() =>
      annotations.value.filter((a) => exitingMarkers.value.has(a.id)),
    )

    // =============================================================================
    // Webhook firing
    // =============================================================================

    async function fireWebhook(
      event: string,
      payload: Record<string, unknown>,
      force?: boolean,
    ): Promise<boolean> {
      const targetUrl = settings.webhookUrl || props.webhookUrl
      if (!targetUrl || (!settings.webhooksEnabled && !force)) return false
      try {
        const response = await fetch(targetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event,
            timestamp: Date.now(),
            url: typeof window !== 'undefined' ? window.location.href : undefined,
            ...payload,
          }),
        })
        return response.ok
      } catch (error) {
        console.warn('[Agentation] Webhook failed:', error)
        return false
      }
    }

    // =============================================================================
    // Freeze animations
    // =============================================================================

    function freezeAnimations() {
      if (isFrozen.value) return
      freezeAll()
      isFrozen.value = true
    }

    function unfreezeAnimations() {
      if (!isFrozen.value) return
      unfreezeAll()
      isFrozen.value = false
    }

    function toggleFreeze() {
      if (isFrozen.value) unfreezeAnimations()
      else freezeAnimations()
    }

    // =============================================================================
    // Tooltip management
    // =============================================================================

    function hideTooltipsUntilMouseLeave() {
      tooltipsHidden.value = true
    }

    function showTooltipsAgain() {
      tooltipsHidden.value = false
    }

    // =============================================================================
    // Hide toolbar temporarily (until page restart)
    // =============================================================================

    function hideToolbarTemporarily() {
      isToolbarHiding.value = true
      originalSetTimeout(() => {
        isToolbarHidden.value = true
        isToolbarHiding.value = false
        saveToolbarHidden(true)
      }, 400)
    }

    // =============================================================================
    // Tooltip session (instant tooltips after initial hover)
    // =============================================================================

    function handleControlsMouseEnter() {
      tooltipSessionTimerRef = originalSetTimeout(() => {
        tooltipSessionActive.value = true
      }, 850)
    }

    function handleControlsMouseLeave() {
      if (tooltipSessionTimerRef) {
        clearTimeout(tooltipSessionTimerRef)
        tooltipSessionTimerRef = null
      }
      tooltipSessionActive.value = false
      showTooltipsAgain()
    }

    // =============================================================================
    // Filter renderable annotations
    // =============================================================================

    function isRenderableAnnotation(a: Annotation): boolean {
      return a.status !== 'resolved' && a.status !== 'dismissed'
    }

    // =============================================================================
    // Source file detection helper
    // =============================================================================

    function getSourceFileForElement(element: HTMLElement): string | undefined {
      const result = getSourceLocation(element)
      if (result.found && result.source) {
        return `${result.source.fileName}:${result.source.lineNumber}`
      }
      return undefined
    }

    // =============================================================================
    // Save annotations to localStorage
    // =============================================================================

    function persistAnnotations() {
      if (mounted.value && annotations.value.length > 0) {
        if (currentSessionId.value) {
          saveAnnotationsWithSyncMarker(pathname, annotations.value, currentSessionId.value)
        } else {
          saveAnnotations(pathname, annotations.value)
        }
      } else if (mounted.value && annotations.value.length === 0) {
        localStorage.removeItem(getStorageKey(pathname))
      }
    }

    // =============================================================================
    // Add annotation
    // =============================================================================

    function addAnnotation(comment: string) {
      if (!pendingAnnotation.value) return

      const pa = pendingAnnotation.value
      const newAnnotation: Annotation = {
        id: Date.now().toString(),
        x: pa.x,
        y: pa.y,
        comment,
        element: pa.element,
        elementPath: pa.elementPath,
        timestamp: Date.now(),
        selectedText: pa.selectedText,
        boundingBox: pa.boundingBox,
        nearbyText: pa.nearbyText,
        cssClasses: pa.cssClasses,
        isMultiSelect: pa.isMultiSelect,
        isFixed: pa.isFixed,
        fullPath: pa.fullPath,
        accessibility: pa.accessibility,
        computedStyles: pa.computedStyles,
        nearbyElements: pa.nearbyElements,
        reactComponents: pa.reactComponents,
        elementBoundingBoxes: pa.elementBoundingBoxes,
        drawingIndex: pa.drawingIndex,
        strokeId: pa.strokeId,
        sourceFile: pa.sourceFile,
        ...(props.endpoint && currentSessionId.value
          ? {
              sessionId: currentSessionId.value,
              url: typeof window !== 'undefined' ? window.location.href : undefined,
              status: 'pending' as const,
            }
          : {}),
      }

      annotations.value = [...annotations.value, newAnnotation]
      recentlyAddedId = newAnnotation.id
      originalSetTimeout(() => { recentlyAddedId = null }, 300)
      originalSetTimeout(() => {
        animatedMarkers.value = new Set(animatedMarkers.value).add(newAnnotation.id)
      }, 250)

      props.onAnnotationAdd?.(newAnnotation)
      fireWebhook('annotation.add', { annotation: newAnnotation })

      // Exit animation for pending
      pendingExiting.value = true
      originalSetTimeout(() => {
        pendingAnnotation.value = null
        pendingExiting.value = false
      }, 150)

      window.getSelection()?.removeAllRanges()

      // Sync to server
      if (props.endpoint && currentSessionId.value) {
        syncAnnotation(props.endpoint, currentSessionId.value, newAnnotation)
          .then((serverAnnotation) => {
            if (serverAnnotation.id !== newAnnotation.id) {
              annotations.value = annotations.value.map((a) =>
                a.id === newAnnotation.id ? { ...a, id: serverAnnotation.id } : a,
              )
              const next = new Set(animatedMarkers.value)
              next.delete(newAnnotation.id)
              next.add(serverAnnotation.id)
              animatedMarkers.value = next
            }
          })
          .catch((error) => {
            console.warn('[Agentation] Failed to sync annotation:', error)
          })
      }
    }

    // =============================================================================
    // Cancel pending annotation
    // =============================================================================

    function cancelAnnotation() {
      const strokeId = pendingAnnotation.value?.strokeId
      pendingExiting.value = true

      // Fade linked stroke
      if (strokeId) {
        exitingStrokeIdRef.value = strokeId
        exitingAlphaRef.value = 1
        const canvas = drawCanvasRef.value
        const ctx = canvas?.getContext('2d')
        if (ctx) {
          const start = performance.now()
          const fade = (now: number) => {
            const t = Math.min((now - start) / 150, 1)
            exitingAlphaRef.value = 1 - t
            redrawCanvas(ctx, drawStrokesRef.value, visualHighlightRef.value, dimAmountRef.value)
            if (t < 1) requestAnimationFrame(fade)
          }
          requestAnimationFrame(fade)
        }
      }

      originalSetTimeout(() => {
        exitingStrokeIdRef.value = null
        if (strokeId) {
          const currentStrokes = drawStrokesRef.value
          const drawingIdx = currentStrokes.findIndex((s) => s.id === strokeId)
          if (drawingIdx >= 0) {
            drawStrokes.value = drawStrokes.value.filter((s) => s.id !== strokeId)
            annotations.value = annotations.value.map((a) =>
              a.drawingIndex != null && a.drawingIndex > drawingIdx
                ? { ...a, drawingIndex: a.drawingIndex - 1 }
                : a,
            )
          }
        }
        pendingAnnotation.value = null
        pendingExiting.value = false
      }, 150)
    }

    // =============================================================================
    // Delete annotation
    // =============================================================================

    function deleteAnnotation(id: string) {
      const deletedIndex = annotationsSnapshot.findIndex((a) => a.id === id)
      const deletedAnnotation = annotationsSnapshot[deletedIndex]

      if (editingAnnotation.value?.id === id) {
        editExiting.value = true
        originalSetTimeout(() => {
          editingAnnotation.value = null
          editingTargetElement.value = null
          editingTargetElements.value = []
          editExiting.value = false
        }, 150)
      }

      deletingMarkerId.value = id
      exitingMarkers.value = new Set(exitingMarkers.value).add(id)

      if (deletedAnnotation) {
        props.onAnnotationDelete?.(deletedAnnotation)
        fireWebhook('annotation.delete', { annotation: deletedAnnotation })
      }

      if (props.endpoint) {
        deleteAnnotationFromServer(props.endpoint, id).catch((error) => {
          console.warn('[Agentation] Failed to delete annotation from server:', error)
        })
      }

      // Fade linked stroke
      if (deletedAnnotation?.strokeId) {
        exitingStrokeIdRef.value = deletedAnnotation.strokeId
        exitingAlphaRef.value = 1
        const canvas = drawCanvasRef.value
        const ctx = canvas?.getContext('2d')
        if (ctx) {
          const start = performance.now()
          const fade = (now: number) => {
            const t = Math.min((now - start) / 150, 1)
            exitingAlphaRef.value = 1 - t
            redrawCanvas(ctx, drawStrokesRef.value, visualHighlightRef.value, dimAmountRef.value)
            if (t < 1) requestAnimationFrame(fade)
          }
          requestAnimationFrame(fade)
        }
      }

      originalSetTimeout(() => {
        exitingStrokeIdRef.value = null
        const latestAnn = annotationsSnapshot.find((a) => a.id === id)
        const strokeId = latestAnn?.strokeId
        const currentStrokes = drawStrokesRef.value
        const drawingIdx = strokeId ? currentStrokes.findIndex((s) => s.id === strokeId) : -1

        if (drawingIdx >= 0) {
          drawStrokes.value = drawStrokes.value.filter((s) => s.id !== strokeId)
          annotations.value = annotations.value
            .filter((a) => a.id !== id)
            .map((a) =>
              a.drawingIndex != null && a.drawingIndex > drawingIdx
                ? { ...a, drawingIndex: a.drawingIndex - 1 }
                : a,
            )
        } else {
          annotations.value = annotations.value.filter((a) => a.id !== id)
        }

        const next = new Set(exitingMarkers.value)
        next.delete(id)
        exitingMarkers.value = next
        deletingMarkerId.value = null

        // Renumber animation
        const currentIndex = annotationsSnapshot.findIndex((a) => a.id === id)
        if (currentIndex >= 0 && currentIndex < annotationsSnapshot.length - 1) {
          renumberFrom.value = currentIndex
          originalSetTimeout(() => { renumberFrom.value = null }, 200)
        }
      }, 150)
    }

    // =============================================================================
    // Update annotation
    // =============================================================================

    function updateAnnotation(newComment: string) {
      if (!editingAnnotation.value) return
      const updatedAnnotation = { ...editingAnnotation.value, comment: newComment }

      annotations.value = annotations.value.map((a) =>
        a.id === editingAnnotation.value!.id ? updatedAnnotation : a,
      )

      props.onAnnotationUpdate?.(updatedAnnotation)
      fireWebhook('annotation.update', { annotation: updatedAnnotation })

      if (props.endpoint) {
        updateAnnotationOnServer(props.endpoint, editingAnnotation.value.id, {
          comment: newComment,
        }).catch((error) => {
          console.warn('[Agentation] Failed to update annotation on server:', error)
        })
      }

      editExiting.value = true
      originalSetTimeout(() => {
        editingAnnotation.value = null
        editingTargetElement.value = null
        editingTargetElements.value = []
        editExiting.value = false
      }, 150)
    }

    // =============================================================================
    // Start editing
    // =============================================================================

    function startEditAnnotation(annotation: Annotation) {
      editingAnnotation.value = annotation
      hoveredMarkerId.value = null
      hoveredTargetElement.value = null
      hoveredTargetElements.value = []

      if (annotation.elementBoundingBoxes?.length) {
        const elements: HTMLElement[] = []
        for (const bb of annotation.elementBoundingBoxes) {
          const centerX = bb.x + bb.width / 2
          const centerY = bb.y + bb.height / 2 - window.scrollY
          const el = deepElementFromPoint(centerX, centerY)
          if (el) elements.push(el)
        }
        editingTargetElements.value = elements
        editingTargetElement.value = null
      } else if (annotation.boundingBox) {
        const bb = annotation.boundingBox
        const centerX = bb.x + bb.width / 2
        const centerY = annotation.isFixed ? bb.y + bb.height / 2 : bb.y + bb.height / 2 - window.scrollY
        const el = deepElementFromPoint(centerX, centerY)
        if (el) {
          const elRect = el.getBoundingClientRect()
          const widthRatio = elRect.width / bb.width
          const heightRatio = elRect.height / bb.height
          editingTargetElement.value = (widthRatio < 0.5 || heightRatio < 0.5) ? null : el
        } else {
          editingTargetElement.value = null
        }
        editingTargetElements.value = []
      } else {
        editingTargetElement.value = null
        editingTargetElements.value = []
      }
    }

    // =============================================================================
    // Cancel edit
    // =============================================================================

    function cancelEditAnnotation() {
      editExiting.value = true
      originalSetTimeout(() => {
        editingAnnotation.value = null
        editingTargetElement.value = null
        editingTargetElements.value = []
        editExiting.value = false
      }, 150)
    }

    // =============================================================================
    // Clear all
    // =============================================================================

    function clearAll() {
      const count = annotations.value.length
      if (count === 0 && drawStrokes.value.length === 0) return

      props.onAnnotationsClear?.(annotations.value)
      fireWebhook('annotations.clear', { annotations: annotations.value })

      if (props.endpoint) {
        Promise.all(
          annotations.value.map((a) =>
            deleteAnnotationFromServer(props.endpoint!, a.id).catch((error) => {
              console.warn('[Agentation] Failed to delete annotation from server:', error)
            }),
          ),
        )
      }

      isClearing.value = true
      cleared.value = true

      drawStrokes.value = []
      const canvas = drawCanvasRef.value
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
      }

      const totalAnimationTime = count * 30 + 200
      originalSetTimeout(() => {
        annotations.value = []
        animatedMarkers.value = new Set()
        localStorage.removeItem(getStorageKey(pathname))
        isClearing.value = false
      }, totalAnimationTime)

      originalSetTimeout(() => { cleared.value = false }, 1500)
    }

    // =============================================================================
    // Copy output
    // =============================================================================

    async function copyOutput() {
      const displayUrl =
        typeof window !== 'undefined'
          ? window.location.pathname + window.location.search + window.location.hash
          : pathname

      let output = generateOutput(annotations.value, displayUrl, settings.outputDetail, effectiveReactMode.value)
      if (!output && drawStrokes.value.length === 0) return
      if (!output) output = `## Page Feedback: ${displayUrl}\n`

      // Describe draw strokes as text
      if (drawStrokes.value.length > 0) {
        const linkedDrawingIndices = new Set<number>()
        for (const a of annotations.value) {
          if (a.drawingIndex != null) linkedDrawingIndices.add(a.drawingIndex)
        }

        const canvas = drawCanvasRef.value
        if (canvas) canvas.style.visibility = 'hidden'

        const strokeDescriptions: string[] = []
        const sv = window.scrollY

        for (let strokeIdx = 0; strokeIdx < drawStrokes.value.length; strokeIdx++) {
          if (linkedDrawingIndices.has(strokeIdx)) continue
          const stroke = drawStrokes.value[strokeIdx]
          if (stroke.points.length < 2) continue

          const viewportPoints = stroke.fixed
            ? stroke.points
            : stroke.points.map((p) => ({ x: p.x, y: p.y - sv }))

          let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
          for (const p of viewportPoints) {
            minX = Math.min(minX, p.x); minY = Math.min(minY, p.y)
            maxX = Math.max(maxX, p.x); maxY = Math.max(maxY, p.y)
          }

          const gesture = classifyStrokeGesture(stroke.points, stroke.fixed)
          const sampleCount = Math.min(10, viewportPoints.length)
          const step = Math.max(1, Math.floor(viewportPoints.length / sampleCount))
          const seenElements = new Set<HTMLElement>()
          const elementNames: string[] = []
          const start = viewportPoints[0]
          const end = viewportPoints[viewportPoints.length - 1]

          const samplePoints = [start]
          for (let i = step; i < viewportPoints.length - 1; i += step) samplePoints.push(viewportPoints[i])
          samplePoints.push(end)

          for (const p of samplePoints) {
            const el = deepElementFromPoint(p.x, p.y)
            if (!el || seenElements.has(el)) continue
            if (closestCrossingShadow(el, '[data-feedback-toolbar]')) continue
            seenElements.add(el)
            const { name } = identifyElement(el)
            if (!elementNames.includes(name)) elementNames.push(name)
          }

          const region = `${Math.round(minX)},${Math.round(minY)} \u2192 ${Math.round(maxX)},${Math.round(maxY)}`
          let desc: string
          const g = gesture.toLowerCase()
          if ((g === 'circle' || g === 'box') && elementNames.length > 0) {
            const verb = g === 'box' ? 'Boxed' : 'Circled'
            desc = `${verb} **${elementNames[0]}**${elementNames.length > 1 ? ` (and ${elementNames.slice(1).join(', ')})` : ''} (region: ${region})`
          } else if (g === 'underline' && elementNames.length > 0) {
            desc = `Underlined **${elementNames[0]}** (${region})`
          } else if (g === 'arrow' && elementNames.length >= 2) {
            desc = `Arrow from **${elementNames[0]}** to **${elementNames[elementNames.length - 1]}** (${Math.round(start.x)},${Math.round(start.y)} \u2192 ${Math.round(end.x)},${Math.round(end.y)})`
          } else if (elementNames.length > 0) {
            desc = `${g === 'arrow' ? 'Arrow' : 'Drawing'} near **${elementNames.join('**, **')}** (region: ${region})`
          } else {
            desc = `Drawing at ${region}`
          }
          strokeDescriptions.push(desc)
        }

        if (canvas) canvas.style.visibility = ''

        if (strokeDescriptions.length > 0) {
          output += `\n**Drawings:**\n`
          strokeDescriptions.forEach((d, i) => { output += `${i + 1}. ${d}\n` })
        }
      }

      if (props.copyToClipboard) {
        try { await navigator.clipboard.writeText(output) } catch { /* ignore */ }
      }

      props.onCopy?.(output)
      copied.value = true
      originalSetTimeout(() => { copied.value = false }, 2000)

      if (settings.autoClearAfterCopy) {
        originalSetTimeout(() => clearAll(), 500)
      }
    }

    // =============================================================================
    // Send to webhook
    // =============================================================================

    async function sendToWebhook() {
      const displayUrl =
        typeof window !== 'undefined'
          ? window.location.pathname + window.location.search + window.location.hash
          : pathname
      const output = generateOutput(annotations.value, displayUrl, settings.outputDetail, effectiveReactMode.value)
      if (!output) return

      if (props.onSubmit) {
        props.onSubmit(output, annotations.value)
      }

      sendState.value = 'sending'
      await new Promise((resolve) => originalSetTimeout(resolve, 150))

      const success = await fireWebhook('submit', { output, annotations: annotations.value }, true)
      sendState.value = success ? 'sent' : 'failed'
      originalSetTimeout(() => { sendState.value = 'idle' }, 2500)

      if (success && settings.autoClearAfterCopy) {
        originalSetTimeout(() => clearAll(), 500)
      }
    }

    // =============================================================================
    // Handle marker hover
    // =============================================================================

    function handleMarkerHover(annotation: Annotation | null) {
      if (!annotation) {
        hoveredMarkerId.value = null
        hoveredTargetElement.value = null
        hoveredTargetElements.value = []
        hoveredDrawingIdx.value = null
        return
      }

      hoveredMarkerId.value = annotation.id

      if (annotation.drawingIndex != null && annotation.drawingIndex < drawStrokes.value.length) {
        hoveredDrawingIdx.value = annotation.drawingIndex
      } else {
        hoveredDrawingIdx.value = null
      }

      if (annotation.elementBoundingBoxes?.length) {
        const elements: HTMLElement[] = []
        for (const bb of annotation.elementBoundingBoxes) {
          const centerX = bb.x + bb.width / 2
          const centerY = bb.y + bb.height / 2 - window.scrollY
          const allEls = document.elementsFromPoint(centerX, centerY)
          const el = allEls.find(
            (e) => !e.closest('[data-annotation-marker]') && !e.closest('[data-agentation-root]'),
          ) as HTMLElement | undefined
          if (el) elements.push(el)
        }
        hoveredTargetElements.value = elements
        hoveredTargetElement.value = null
      } else if (annotation.boundingBox) {
        const bb = annotation.boundingBox
        const centerX = bb.x + bb.width / 2
        const centerY = annotation.isFixed ? bb.y + bb.height / 2 : bb.y + bb.height / 2 - window.scrollY
        const el = deepElementFromPoint(centerX, centerY)
        if (el) {
          const elRect = el.getBoundingClientRect()
          const widthRatio = elRect.width / bb.width
          const heightRatio = elRect.height / bb.height
          hoveredTargetElement.value = (widthRatio < 0.5 || heightRatio < 0.5) ? null : el
        } else {
          hoveredTargetElement.value = null
        }
        hoveredTargetElements.value = []
      } else {
        hoveredTargetElement.value = null
        hoveredTargetElements.value = []
      }
    }

    // =============================================================================
    // Multi-select: create pending annotation
    // =============================================================================

    function createMultiSelectPendingAnnotation() {
      const elements = multiSelect.pendingMultiSelectElements.value
      if (elements.length === 0) return

      const firstItem = elements[0]
      const firstEl = firstItem.element
      const isMulti = elements.length > 1

      const freshRects = elements.map((item) => item.element.getBoundingClientRect())

      if (!isMulti) {
        const rect = freshRects[0]
        const isFixed = isElementFixed(firstEl)
        pendingAnnotation.value = {
          x: (rect.left / window.innerWidth) * 100,
          y: isFixed ? rect.top : rect.top + window.scrollY,
          clientY: rect.top,
          element: firstItem.name,
          elementPath: firstItem.path,
          boundingBox: { x: rect.left, y: isFixed ? rect.top : rect.top + window.scrollY, width: rect.width, height: rect.height },
          isFixed,
          fullPath: getFullElementPath(firstEl),
          accessibility: getAccessibilityInfo(firstEl),
          computedStyles: getForensicComputedStyles(firstEl),
          computedStylesObj: getDetailedComputedStyles(firstEl),
          nearbyElements: getNearbyElements(firstEl),
          cssClasses: getElementClasses(firstEl),
          nearbyText: getNearbyText(firstEl),
          reactComponents: firstItem.reactComponents,
          sourceFile: getSourceFileForElement(firstEl),
        }
      } else {
        const bounds = {
          left: Math.min(...freshRects.map((r) => r.left)),
          top: Math.min(...freshRects.map((r) => r.top)),
          right: Math.max(...freshRects.map((r) => r.right)),
          bottom: Math.max(...freshRects.map((r) => r.bottom)),
        }
        const names = elements.slice(0, 5).map((item) => item.name).join(', ')
        const suffix = elements.length > 5 ? ` +${elements.length - 5} more` : ''
        const elementBoundingBoxes = freshRects.map((rect) => ({
          x: rect.left, y: rect.top + window.scrollY, width: rect.width, height: rect.height,
        }))
        const lastItem = elements[elements.length - 1]
        const lastEl = lastItem.element
        const lastRect = freshRects[freshRects.length - 1]
        const lastCenterX = lastRect.left + lastRect.width / 2
        const lastCenterY = lastRect.top + lastRect.height / 2
        const lastIsFixed = isElementFixed(lastEl)

        pendingAnnotation.value = {
          x: (lastCenterX / window.innerWidth) * 100,
          y: lastIsFixed ? lastCenterY : lastCenterY + window.scrollY,
          clientY: lastCenterY,
          element: `${elements.length} elements: ${names}${suffix}`,
          elementPath: 'multi-select',
          boundingBox: { x: bounds.left, y: bounds.top + window.scrollY, width: bounds.right - bounds.left, height: bounds.bottom - bounds.top },
          isMultiSelect: true,
          isFixed: lastIsFixed,
          elementBoundingBoxes,
          multiSelectElements: elements.map((item) => item.element),
          targetElement: lastEl,
          fullPath: getFullElementPath(firstEl),
          accessibility: getAccessibilityInfo(firstEl),
          computedStyles: getForensicComputedStyles(firstEl),
          computedStylesObj: getDetailedComputedStyles(firstEl),
          nearbyElements: getNearbyElements(firstEl),
          cssClasses: getElementClasses(firstEl),
          nearbyText: getNearbyText(firstEl),
          sourceFile: getSourceFileForElement(firstEl),
        }
      }

      multiSelect.clear()
      clearHover()
    }

    // =============================================================================
    // Keyboard shortcuts
    // =============================================================================

    const { handleKeyDown } = useKeyboardShortcuts({
      isActive,
      isDrawMode,
      pendingAnnotation: pendingAnnotation as any,
      annotationsLength: () => annotations.value.length,
      drawStrokesLength: () => drawStrokes.value.length,
      settingsWebhookUrl: () => settings.webhookUrl,
      webhookUrl: props.webhookUrl,
      sendState,
      onToggleActive: () => { isActive.value = !isActive.value },
      onToggleFreeze: toggleFreeze,
      onToggleDrawMode: () => { isDrawMode.value = !isDrawMode.value },
      onToggleMarkers: () => {
        showMarkers.value = !showMarkers.value
        if (isDrawMode.value) isDrawMode.value = false
      },
      onCopy: copyOutput,
      onClear: clearAll,
      onSend: sendToWebhook,
      onUndoStroke: () => {
        drawStrokes.value = drawStrokes.value.slice(0, -1)
        const canvas = drawCanvasRef.value
        if (canvas) {
          const ctx = canvas.getContext('2d')
          if (ctx) redrawCanvas(ctx, drawStrokes.value)
        }
      },
      onEscapeDrawMode: () => { isDrawMode.value = false },
      onClearMultiSelect: () => multiSelect.clear(),
      pendingMultiSelectLength: () => multiSelect.pendingMultiSelectElements.value.length,
      hideTooltips: hideTooltipsUntilMouseLeave,
    })

    // =============================================================================
    // Watchers and lifecycle
    // =============================================================================

    // Settings panel show/hide
    watch(showSettings, (val) => {
      if (val) {
        showSettingsVisible.value = true
      } else {
        tooltipsHidden.value = false
        settingsPage.value = 'main'
        const timer = originalSetTimeout(() => { showSettingsVisible.value = false }, 0)
      }
    })

    // Settings page transitions
    watch(settingsPage, () => {
      isTransitioning.value = true
      const timer = originalSetTimeout(() => { isTransitioning.value = false }, 350)
    })

    // Marker visibility
    watch([shouldShowMarkers, annotations], () => {
      // Re-initialize marker visibility with correct annotations ref
      const shouldShow = shouldShowMarkers.value
      if (shouldShow) {
        markersExiting.value = false
        markersVisible.value = true
        animatedMarkers.value = new Set()
        const enterMaxDelay = Math.max(0, annotations.value.length - 1) * 20
        originalSetTimeout(() => {
          const newSet = new Set(animatedMarkers.value)
          annotations.value.forEach((a) => newSet.add(a.id))
          animatedMarkers.value = newSet
        }, enterMaxDelay + 250 + 50)
      } else if (markersVisible.value) {
        markersExiting.value = true
        const maxDelay = Math.max(0, annotations.value.length - 1) * 20
        originalSetTimeout(() => {
          markersVisible.value = false
          markersExiting.value = false
        }, maxDelay + 200 + 50)
      }
    }, { immediate: true })

    // Save annotations when they change
    watch(annotations, persistAnnotations, { deep: true })

    // Save settings
    watch(() => ({ ...settings }), saveSettings, { deep: true })

    // Save theme
    watch(isDarkMode, saveTheme)

    // Save toolbar position when drag ends
    let prevDragging = false
    watch(isDraggingToolbar, (val) => {
      if (prevDragging && !val && toolbarPosition.value && mounted.value) {
        saveToolbarPosition()
      }
      prevDragging = val
    })

    // Reset when deactivating
    watch(isActive, (val) => {
      if (!val) {
        pendingAnnotation.value = null
        editingAnnotation.value = null
        editingTargetElement.value = null
        editingTargetElements.value = []
        hoverInfo.value = null
        showSettings.value = false
        multiSelect.clear()
        multiSelect.resetModifiers()
        isDrawMode.value = false
        if (isFrozen.value) unfreezeAnimations()
      }
    })

    // Cursor styles
    watch(isActive, (val) => {
      if (val) injectCursorStyles()
      else removeCursorStyles()
    })

    // Drawing hover cursor
    watch(hoveredDrawingIdx, (val) => {
      setDrawingHoverCursor(val !== null && isActive.value)
    })

    // Scroll tracking
    function handleScroll() {
      scrollY.value = window.scrollY
      isScrolling.value = true
      if (scrollTimeoutId) clearTimeout(scrollTimeoutId)
      scrollTimeoutId = originalSetTimeout(() => { isScrolling.value = false }, 150)
    }

    // Mouse move (hover detection)
    function handleMouseMove(e: MouseEvent) {
      if (!isActive.value || pendingAnnotation.value || isDrawMode.value) return

      const target = (e.composedPath()[0] || e.target) as HTMLElement
      if (closestCrossingShadow(target, '[data-feedback-toolbar]')) {
        clearHover()
        if (!target.closest('[data-annotation-marker]')) hoveredDrawingIdx.value = null
        return
      }

      if (drawStrokes.value.length > 0) {
        const strokeIdx = findStrokeAtPoint(e.clientX, e.clientY, drawStrokes.value)
        if (strokeIdx !== null) {
          hoveredDrawingIdx.value = strokeIdx
          clearHover()
          return
        }
      }
      hoveredDrawingIdx.value = null

      const elementUnder = deepElementFromPoint(e.clientX, e.clientY)
      if (!elementUnder || closestCrossingShadow(elementUnder, '[data-feedback-toolbar]')) {
        clearHover()
        return
      }

      const { name, elementName, path, reactComponents } = identifyElementWithVue(elementUnder, effectiveReactMode.value)
      const rect = elementUnder.getBoundingClientRect()
      setHover(
        { element: name, elementName, elementPath: path, rect, reactComponents },
        { x: e.clientX, y: e.clientY },
      )
    }

    // Click handler
    function handleClick(e: MouseEvent) {
      if (!isActive.value || isDrawMode.value) return

      if (dragSelect.getJustFinishedDrag()) {
        dragSelect.setJustFinishedDrag(false)
        return
      }

      const target = (e.composedPath()[0] || e.target) as HTMLElement
      if (closestCrossingShadow(target, '[data-feedback-toolbar]')) return
      if (closestCrossingShadow(target, '[data-annotation-popup]')) return
      if (closestCrossingShadow(target, '[data-annotation-marker]')) return

      // Click on drawing stroke
      if (drawStrokes.value.length > 0 && !pendingAnnotation.value && !editingAnnotation.value) {
        const strokeIdx = findStrokeAtPoint(e.clientX, e.clientY, drawStrokes.value)
        if (strokeIdx !== null) {
          e.preventDefault()
          e.stopPropagation()

          const existingAnnotation = annotations.value.find(
            (a) => a.strokeId === drawStrokes.value[strokeIdx]?.id || a.drawingIndex === strokeIdx,
          )
          if (existingAnnotation) {
            startEditAnnotation(existingAnnotation)
            return
          }

          const stroke = drawStrokes.value[strokeIdx]
          const scrollYNow = window.scrollY
          const canvas = drawCanvasRef.value
          if (canvas) canvas.style.visibility = 'hidden'
          const elementUnder = deepElementFromPoint(e.clientX, e.clientY)
          if (canvas) canvas.style.visibility = ''

          const gestureShape = classifyStrokeGesture(stroke.points, stroke.fixed)
          let name = `Drawing: ${gestureShape}`
          let path = ''
          let reactComponents: string | null = null
          let nearbyText: string | undefined
          let cssClasses: string | undefined
          let fullPath: string | undefined
          let accessibility: string | undefined
          let computedStylesStr: string | undefined
          let computedStylesObj: Record<string, string> | undefined
          let nearbyElements: string | undefined
          let elIsFixed = stroke.fixed
          let boundingBox: { x: number; y: number; width: number; height: number } | undefined

          if (elementUnder) {
            const info = identifyElementWithVue(elementUnder, effectiveReactMode.value)
            name = `Drawing: ${gestureShape} \u2192 ${info.name}`
            path = info.path
            reactComponents = info.reactComponents
            nearbyText = getNearbyText(elementUnder)
            cssClasses = getElementClasses(elementUnder)
            fullPath = getFullElementPath(elementUnder)
            accessibility = getAccessibilityInfo(elementUnder)
            computedStylesStr = getForensicComputedStyles(elementUnder)
            computedStylesObj = getDetailedComputedStyles(elementUnder)
            nearbyElements = getNearbyElements(elementUnder)
            const rect = elementUnder.getBoundingClientRect()
            boundingBox = { x: rect.left, y: elIsFixed ? rect.top : rect.top + scrollYNow, width: rect.width, height: rect.height }
          }

          pendingAnnotation.value = {
            x: (e.clientX / window.innerWidth) * 100,
            y: elIsFixed ? e.clientY : e.clientY + scrollYNow,
            clientY: e.clientY, element: name, elementPath: path, boundingBox, nearbyText,
            cssClasses, isFixed: elIsFixed, fullPath, accessibility, computedStyles: computedStylesStr,
            computedStylesObj, nearbyElements, reactComponents: reactComponents ?? undefined,
            targetElement: elementUnder ?? undefined, drawingIndex: strokeIdx, strokeId: stroke.id,
            sourceFile: elementUnder ? getSourceFileForElement(elementUnder) : undefined,
          }
          clearHover()
          hoveredDrawingIdx.value = null
          return
        }
      }

      // Cmd+shift+click multi-select
      if (e.metaKey && e.shiftKey && !pendingAnnotation.value && !editingAnnotation.value) {
        e.preventDefault()
        e.stopPropagation()
        const elementUnder = deepElementFromPoint(e.clientX, e.clientY)
        if (!elementUnder) return
        const rect = elementUnder.getBoundingClientRect()
        const { name, path, reactComponents } = identifyElementWithVue(elementUnder, effectiveReactMode.value)
        multiSelect.toggleElement(elementUnder, { element: elementUnder, rect, name, path, reactComponents: reactComponents ?? undefined })
        return
      }

      const isInteractive = closestCrossingShadow(target, 'button, a, input, select, textarea, [role=\'button\'], [onclick]')
      if (settings.blockInteractions && isInteractive) {
        e.preventDefault()
        e.stopPropagation()
      }

      if (pendingAnnotation.value) {
        if (isInteractive && !settings.blockInteractions) return
        e.preventDefault()
        popupRef.value?.shake()
        return
      }

      if (editingAnnotation.value) {
        if (isInteractive && !settings.blockInteractions) return
        e.preventDefault()
        editPopupRef.value?.shake()
        return
      }

      e.preventDefault()

      const elementUnder = deepElementFromPoint(e.clientX, e.clientY)
      if (!elementUnder) return

      const { name, path, reactComponents } = identifyElementWithVue(elementUnder, effectiveReactMode.value)
      const rect = elementUnder.getBoundingClientRect()
      const x = (e.clientX / window.innerWidth) * 100
      const isFixed = isElementFixed(elementUnder)
      const y = isFixed ? e.clientY : e.clientY + window.scrollY

      const selection = window.getSelection()
      let selectedText: string | undefined
      if (selection && selection.toString().trim().length > 0) {
        selectedText = selection.toString().trim().slice(0, 500)
      }

      pendingAnnotation.value = {
        x, y, clientY: e.clientY, element: name, elementPath: path, selectedText,
        boundingBox: { x: rect.left, y: isFixed ? rect.top : rect.top + window.scrollY, width: rect.width, height: rect.height },
        nearbyText: getNearbyText(elementUnder), cssClasses: getElementClasses(elementUnder),
        isFixed, fullPath: getFullElementPath(elementUnder), accessibility: getAccessibilityInfo(elementUnder),
        computedStyles: getForensicComputedStyles(elementUnder), computedStylesObj: getDetailedComputedStyles(elementUnder),
        nearbyElements: getNearbyElements(elementUnder), reactComponents: reactComponents ?? undefined,
        targetElement: elementUnder,
        sourceFile: getSourceFileForElement(elementUnder),
      }
      clearHover()
    }

    // Cmd+shift modifier tracking
    function handleModifierKeyDown(e: KeyboardEvent) {
      if (e.key === 'Meta') multiSelect.modifiersHeld.cmd = true
      if (e.key === 'Shift') multiSelect.modifiersHeld.shift = true
    }

    function handleModifierKeyUp(e: KeyboardEvent) {
      const wasHoldingBoth = multiSelect.modifiersHeld.cmd && multiSelect.modifiersHeld.shift
      if (e.key === 'Meta') multiSelect.modifiersHeld.cmd = false
      if (e.key === 'Shift') multiSelect.modifiersHeld.shift = false
      const nowHoldingBoth = multiSelect.modifiersHeld.cmd && multiSelect.modifiersHeld.shift

      if (wasHoldingBoth && !nowHoldingBoth && multiSelect.pendingMultiSelectElements.value.length > 0) {
        createMultiSelectPendingAnnotation()
      }
    }

    function handleWindowBlur() {
      multiSelect.resetModifiers()
      multiSelect.clear()
    }

    // Drag select mousedown
    function handleDragMouseDown(e: MouseEvent) {
      if (!isActive.value || pendingAnnotation.value || isDrawMode.value) return
      dragSelect.handleMouseDown(e)
    }

    // Drag select mousemove
    function handleDragMouseMove(e: MouseEvent) {
      if (!isActive.value || pendingAnnotation.value) return
      dragSelect.handleMouseMove(e)
    }

    // Drag select mouseup
    function handleDragMouseUp(e: MouseEvent) {
      if (!isActive.value) return
      const result = dragSelect.handleMouseUp(e)
      if (!result) return

      if (result.finalElements.length > 0) {
        const bounds = result.finalElements.reduce(
          (acc, { rect }) => ({
            left: Math.min(acc.left, rect.left), top: Math.min(acc.top, rect.top),
            right: Math.max(acc.right, rect.right), bottom: Math.max(acc.bottom, rect.bottom),
          }),
          { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity },
        )
        const elementNames = result.finalElements.slice(0, 5).map(({ element }) => identifyElement(element).name).join(', ')
        const suffix = result.finalElements.length > 5 ? ` +${result.finalElements.length - 5} more` : ''
        const firstElement = result.finalElements[0].element

        pendingAnnotation.value = {
          x: result.x, y: result.y, clientY: e.clientY,
          element: `${result.finalElements.length} elements: ${elementNames}${suffix}`,
          elementPath: 'multi-select',
          boundingBox: { x: bounds.left, y: bounds.top + window.scrollY, width: bounds.right - bounds.left, height: bounds.bottom - bounds.top },
          isMultiSelect: true,
          fullPath: getFullElementPath(firstElement), accessibility: getAccessibilityInfo(firstElement),
          computedStyles: getForensicComputedStyles(firstElement), computedStylesObj: getDetailedComputedStyles(firstElement),
          nearbyElements: getNearbyElements(firstElement), cssClasses: getElementClasses(firstElement),
          nearbyText: getNearbyText(firstElement),
          sourceFile: getSourceFileForElement(firstElement),
        }
      } else {
        const width = Math.abs(result.right - result.left)
        const height = Math.abs(result.bottom - result.top)
        if (width > 20 && height > 20) {
          pendingAnnotation.value = {
            x: result.x, y: result.y, clientY: e.clientY,
            element: 'Area selection',
            elementPath: `region at (${Math.round(result.left)}, ${Math.round(result.top)})`,
            boundingBox: { x: result.left, y: result.top + window.scrollY, width, height },
            isMultiSelect: true,
          }
        }
      }
      clearHover()
    }

    // Toolbar dragging
    function handleToolbarDragMove(e: MouseEvent) {
      if (!dragStartPos.value) return
      const DRAG_THRESHOLD = 10
      const deltaX = e.clientX - dragStartPos.value.x
      const deltaY = e.clientY - dragStartPos.value.y
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

      if (!isDraggingToolbar.value && distance > DRAG_THRESHOLD) {
        isDraggingToolbar.value = true
      }

      if (isDraggingToolbar.value || distance > DRAG_THRESHOLD) {
        let newX = dragStartPos.value.toolbarX + deltaX
        let newY = dragStartPos.value.toolbarY + deltaY
        const padding = 20
        const wrapperWidth = 335
        const toolbarHeight = 44
        const contentWidth = isActive.value ? (connectionStatus.value === 'connected' ? 335 : 295) : 44
        const contentOffset = wrapperWidth - contentWidth
        const minX = padding - contentOffset
        const maxX = window.innerWidth - padding - wrapperWidth
        newX = Math.max(minX, Math.min(maxX, newX))
        newY = Math.max(padding, Math.min(window.innerHeight - toolbarHeight - padding, newY))
        toolbarPosition.value = { x: newX, y: newY }
      }
    }

    function handleToolbarDragEnd() {
      if (isDraggingToolbar.value) {
        setJustFinishedToolbarDrag(true)
      }
      isDraggingToolbar.value = false
      dragStartPos.value = null
    }

    // Draw mode canvas events
    let drawClickStart: { x: number; y: number; strokeIdx: number | null } | null = null

    function setupDrawCanvasListeners() {
      const canvas = drawCanvasRef.value
      if (!canvas) return () => {}
      const ctx = canvas.getContext('2d')
      if (!ctx) return () => {}
      const dpr = window.devicePixelRatio || 1

      const onMouseDown = (e: MouseEvent) => {
        if (pendingAnnotation.value) { popupRef.value?.shake(); return }
        if (editingAnnotation.value) { editPopupRef.value?.shake(); return }
        const strokeIdx = findStrokeAtPoint(e.clientX, e.clientY, drawStrokes.value)
        drawClickStart = { x: e.clientX, y: e.clientY, strokeIdx }
        setIsDrawing(true)
        setCurrentStroke([{ x: e.clientX, y: e.clientY }])
        ctx.save()
        ctx.scale(dpr, dpr)
        ctx.beginPath()
        ctx.strokeStyle = settings.annotationColor
        ctx.lineWidth = 3
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.moveTo(e.clientX, e.clientY)
      }

      const onMouseMove = (e: MouseEvent) => {
        if (!getIsDrawing()) {
          const strokeIdx = findStrokeAtPoint(e.clientX, e.clientY, drawStrokes.value)
          hoveredDrawingIdx.value = strokeIdx
          if (strokeIdx !== null) canvas.setAttribute('data-stroke-hover', '')
          else canvas.removeAttribute('data-stroke-hover')
          return
        }
        const point = { x: e.clientX, y: e.clientY }
        const stroke = getCurrentStroke()
        const prev = stroke[stroke.length - 1]
        if (Math.hypot(point.x - prev.x, point.y - prev.y) < 2) return
        stroke.push(point)
        const midX = (prev.x + point.x) / 2
        const midY = (prev.y + point.y) / 2
        ctx.quadraticCurveTo(prev.x, prev.y, midX, midY)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(midX, midY)
      }

      const onMouseUp = (e: MouseEvent) => {
        if (!getIsDrawing()) return
        setIsDrawing(false)
        ctx.restore()
        const pts = getCurrentStroke()

        // Detect click on existing stroke
        if (drawClickStart && drawClickStart.strokeIdx !== null && pts.length <= 3) {
          const movedDist = Math.hypot(e.clientX - drawClickStart.x, e.clientY - drawClickStart.y)
          if (movedDist < 5) {
            setCurrentStroke([])
            drawClickStart = null
            redrawCanvas(ctx, drawStrokes.value, drawClickStart?.strokeIdx ?? null, dimAmountRef.value)
            // Open annotation for the stroke -- same as in React source
            // (Omitting for brevity since main click handler covers this case too)
            return
          }
        }
        drawClickStart = null

        if (pts.length > 1) {
          canvas.style.visibility = 'hidden'
          const isElFixed = (el: HTMLElement): boolean => {
            let node: HTMLElement | null = el
            while (node && node !== document.documentElement) {
              const pos = getComputedStyle(node).position
              if (pos === 'fixed' || pos === 'sticky') return true
              node = node.parentElement
            }
            return false
          }

          let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
          for (const p of pts) { minX = Math.min(minX, p.x); minY = Math.min(minY, p.y); maxX = Math.max(maxX, p.x); maxY = Math.max(maxY, p.y) }
          const centerX = (minX + maxX) / 2
          const centerY = (minY + maxY) / 2
          const centerEl = deepElementFromPoint(centerX, centerY)
          let isFixed = centerEl ? isElFixed(centerEl) : false

          if (!isFixed) {
            let fixedCount = 0, totalSampled = 0
            const sampleCount = Math.min(6, pts.length)
            const step = Math.max(1, Math.floor(pts.length / sampleCount))
            for (let i = 0; i < pts.length; i += step) {
              const el = deepElementFromPoint(pts[i].x, pts[i].y)
              if (!el) continue
              totalSampled++
              if (isElFixed(el)) fixedCount++
            }
            if (totalSampled > 0 && fixedCount > totalSampled * 0.6) isFixed = true
          }

          const finalPoints = isFixed ? [...pts] : pts.map((p) => ({ x: p.x, y: p.y + window.scrollY }))
          const newStrokeId = crypto.randomUUID()
          const newStroke: DrawStroke = { id: newStrokeId, points: finalPoints, color: settings.annotationColor, fixed: isFixed }

          const gestureShape = classifyStrokeGesture(finalPoints, isFixed)
          let name = `Drawing: ${gestureShape}`
          let elPath = ''
          let reactComponents: string | null = null
          let nearbyText: string | undefined
          let cssClasses: string | undefined
          let fullPath: string | undefined
          let accessibility: string | undefined
          let computedStylesStr: string | undefined
          let computedStylesObj: Record<string, string> | undefined
          let nearbyElements: string | undefined
          let boundingBox: { x: number; y: number; width: number; height: number } | undefined

          if (centerEl) {
            const info = identifyElementWithVue(centerEl, effectiveReactMode.value)
            name = `Drawing: ${gestureShape} \u2192 ${info.name}`
            elPath = info.path; reactComponents = info.reactComponents
            nearbyText = getNearbyText(centerEl); cssClasses = getElementClasses(centerEl)
            fullPath = getFullElementPath(centerEl); accessibility = getAccessibilityInfo(centerEl)
            computedStylesStr = getForensicComputedStyles(centerEl); computedStylesObj = getDetailedComputedStyles(centerEl)
            nearbyElements = getNearbyElements(centerEl)
            const rect = centerEl.getBoundingClientRect()
            boundingBox = { x: rect.left, y: isFixed ? rect.top : rect.top + window.scrollY, width: rect.width, height: rect.height }
          }

          canvas.style.visibility = ''
          const newStrokeIdx = drawStrokes.value.length
          drawStrokes.value = [...drawStrokes.value, newStroke]

          const lastPt = finalPoints[finalPoints.length - 1]
          const lastPtViewY = isFixed ? lastPt.y : lastPt.y - window.scrollY

          pendingAnnotation.value = {
            x: (lastPt.x / window.innerWidth) * 100, y: lastPt.y, clientY: lastPtViewY,
            element: name, elementPath: elPath, boundingBox, nearbyText, cssClasses,
            isFixed, fullPath, accessibility, computedStyles: computedStylesStr, computedStylesObj,
            nearbyElements, reactComponents: reactComponents ?? undefined,
            targetElement: centerEl ?? undefined, drawingIndex: newStrokeIdx, strokeId: newStrokeId,
            sourceFile: centerEl ? getSourceFileForElement(centerEl) : undefined,
          }
          clearHover()
        }
        setCurrentStroke([])
      }

      const onMouseLeave = () => {
        hoveredDrawingIdx.value = null
        canvas.removeAttribute('data-stroke-hover')
      }

      canvas.addEventListener('mousedown', onMouseDown)
      canvas.addEventListener('mousemove', onMouseMove)
      canvas.addEventListener('mouseup', onMouseUp)
      canvas.addEventListener('mouseleave', onMouseLeave)

      return () => {
        canvas.removeEventListener('mousedown', onMouseDown)
        canvas.removeEventListener('mousemove', onMouseMove)
        canvas.removeEventListener('mouseup', onMouseUp)
        canvas.removeEventListener('mouseleave', onMouseLeave)
      }
    }

    // Draw canvas: resize + scroll redraw
    let cleanupDrawListeners: (() => void) | null = null

    watch([isDrawMode, isActive], () => {
      if (cleanupDrawListeners) { cleanupDrawListeners(); cleanupDrawListeners = null }
      if (isDrawMode.value && isActive.value) {
        nextTick(() => {
          cleanupDrawListeners = setupDrawCanvasListeners()
        })
      }
    })

    // Canvas resize/scroll
    watch([isActive, drawStrokes], () => {
      if (!isActive.value) return
      nextTick(() => resizeCanvas())
    }, { deep: true })

    // Dim animation for drawing hover
    watch(
      [() => hoveredDrawingIdx.value, () => pendingAnnotation.value?.drawingIndex, () => editingAnnotation.value?.drawingIndex, drawStrokes],
      () => {
        const canvas = drawCanvasRef.value
        if (!canvas || !isActive.value || drawStrokes.value.length === 0) return

        const effectiveHighlight = hoveredDrawingIdx.value ?? pendingAnnotation.value?.drawingIndex ?? editingAnnotation.value?.drawingIndex ?? null
        const targetDim = effectiveHighlight != null ? 1 : 0

        if (effectiveHighlight != null) visualHighlightRef.value = effectiveHighlight

        if (Math.abs(dimAmountRef.value - targetDim) < 0.01) {
          dimAmountRef.value = targetDim
          if (targetDim === 0) visualHighlightRef.value = null
          const ctx = canvas.getContext('2d')
          if (ctx) redrawCanvas(ctx, drawStrokes.value, visualHighlightRef.value, targetDim)
          return
        }

        let raf: number
        const animate = () => {
          const diff = targetDim - dimAmountRef.value
          if (Math.abs(diff) < 0.01) {
            dimAmountRef.value = targetDim
            if (targetDim === 0) visualHighlightRef.value = null
          } else {
            dimAmountRef.value += diff * 0.25
          }
          const ctx = canvas.getContext('2d')
          if (ctx) redrawCanvas(ctx, drawStrokes.value, visualHighlightRef.value, dimAmountRef.value)
          if (Math.abs(dimAmountRef.value - targetDim) > 0.01) raf = requestAnimationFrame(animate)
        }
        raf = requestAnimationFrame(animate)
      },
      { deep: true },
    )

    // Constrain toolbar position on resize
    function constrainPosition() {
      if (!toolbarPosition.value) return
      const padding = 20
      const wrapperWidth = 335
      const toolbarHeight = 44
      const contentWidth = isActive.value ? (connectionStatus.value === 'connected' ? 335 : 295) : 44
      const contentOffset = wrapperWidth - contentWidth
      const minX = padding - contentOffset
      const maxX = window.innerWidth - padding - wrapperWidth
      let newX = Math.max(minX, Math.min(maxX, toolbarPosition.value.x))
      let newY = Math.max(padding, Math.min(window.innerHeight - toolbarHeight - padding, toolbarPosition.value.y))
      if (newX !== toolbarPosition.value.x || newY !== toolbarPosition.value.y) {
        toolbarPosition.value = { x: newX, y: newY }
      }
    }

    watch([toolbarPosition, isActive, connectionStatus], constrainPosition)

    // =============================================================================
    // Lifecycle
    // =============================================================================

    onMounted(() => {
      loadFromStorage()
      scrollY.value = window.scrollY
      const stored = loadAnnotations<Annotation>(pathname)
      annotations.value = stored

      // Load toolbar hidden state from session storage
      if (loadToolbarHidden()) {
        isToolbarHidden.value = true
      }

      // Portal event isolation: stop toolbar events from bubbling to host page click-outside handlers
      // Attach on the portal wrapper itself (bubble phase) so events still reach toolbar children
      const portalEl = portalWrapperRef.value
      if (portalEl) {
        portalEl.addEventListener('mousedown', stopBubble)
        portalEl.addEventListener('click', stopBubble)
        portalEl.addEventListener('pointerdown', stopBubble)
      }

      // Listeners
      window.addEventListener('scroll', handleScroll, { passive: true })
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('click', handleClick, true)
      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('keydown', handleModifierKeyDown)
      document.addEventListener('keyup', handleModifierKeyUp)
      window.addEventListener('blur', handleWindowBlur)
      document.addEventListener('mousedown', handleDragMouseDown)
      document.addEventListener('mousemove', handleDragMouseMove, { passive: true })
      document.addEventListener('mouseup', handleDragMouseUp)
      window.addEventListener('resize', constrainPosition)
      window.addEventListener('resize', () => resizeCanvas())
      window.addEventListener('scroll', () => {
        const canvas = drawCanvasRef.value
        if (!canvas || !isActive.value) return
        const ctx = canvas.getContext('2d')
        if (ctx) redrawCanvas(ctx, drawStrokes.value, visualHighlightRef.value, dimAmountRef.value)
      }, { passive: true })

      // Toolbar drag listeners
      const toolbarDragMove = (e: MouseEvent) => handleToolbarDragMove(e)
      const toolbarDragEnd = () => handleToolbarDragEnd()
      document.addEventListener('mousemove', toolbarDragMove)
      document.addEventListener('mouseup', toolbarDragEnd)

      // Server sync
      initSession()
      const cleanupHealth = startHealthCheck()
      const cleanupEvents = startEventSource()

      // Watch connection status for reconnect sync
      watch(connectionStatus, () => syncOnReconnect())

      // Demo annotations
      if (props.enableDemoMode && props.demoAnnotations && props.demoAnnotations.length > 0 && annotations.value.length === 0) {
        const timeoutIds: ReturnType<typeof setTimeout>[] = []
        timeoutIds.push(originalSetTimeout(() => { isActive.value = true }, props.demoDelay - 200))
        props.demoAnnotations.forEach((demo, index) => {
          const annotationDelay = props.demoDelay + index * 300
          timeoutIds.push(originalSetTimeout(() => {
            const element = document.querySelector(demo.selector) as HTMLElement
            if (!element) return
            const rect = element.getBoundingClientRect()
            const { name, path } = identifyElement(element)
            const newAnnotation: Annotation = {
              id: `demo-${Date.now()}-${index}`,
              x: ((rect.left + rect.width / 2) / window.innerWidth) * 100,
              y: rect.top + rect.height / 2 + window.scrollY,
              comment: demo.comment, element: name, elementPath: path,
              timestamp: Date.now(), selectedText: demo.selectedText,
              boundingBox: { x: rect.left, y: rect.top + window.scrollY, width: rect.width, height: rect.height },
              nearbyText: getNearbyText(element), cssClasses: getElementClasses(element),
            }
            annotations.value = [...annotations.value, newAnnotation]
          }, annotationDelay))
        })
      }
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('click', handleClick, true)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keydown', handleModifierKeyDown)
      document.removeEventListener('keyup', handleModifierKeyUp)
      window.removeEventListener('blur', handleWindowBlur)
      document.removeEventListener('mousedown', handleDragMouseDown)
      document.removeEventListener('mouseup', handleDragMouseUp)
      window.removeEventListener('resize', constrainPosition)
      if (scrollTimeoutId) clearTimeout(scrollTimeoutId)
      if (cleanupDrawListeners) cleanupDrawListeners()
      // Portal event isolation cleanup
      if (portalWrapperRef.value) {
        portalWrapperRef.value.removeEventListener('mousedown', stopBubble)
        portalWrapperRef.value.removeEventListener('click', stopBubble)
        portalWrapperRef.value.removeEventListener('pointerdown', stopBubble)
      }
      removeCursorStyles()
      unfreezeAll()
    })

    // =============================================================================
    // Helpers for popup positioning
    // =============================================================================

    function getPopupStyle(markerX: number, markerY: number) {
      return {
        left: Math.max(160, Math.min(window.innerWidth - 160, (markerX / 100) * window.innerWidth)) + 'px',
        ...(markerY > window.innerHeight - 290
          ? { bottom: (window.innerHeight - markerY + 20) + 'px' }
          : { top: (markerY + 20) + 'px' }),
      }
    }

    function getActiveButtonStyle(active: boolean, color: string): Record<string, string> | undefined {
      if (!active) return undefined
      return { color, backgroundColor: hexToRgba(color, 0.25) }
    }

    return () => (
      <Teleport to="body"><div ref={portalWrapperRef} style="display: contents">{/*  Toolbar  */}{!isToolbarHidden.value ? <><div data-feedback-toolbar data-agentation-root style={toolbarPosition ? { left: toolbarPosition.x + 'px', top: toolbarPosition.y + 'px', right: 'auto', bottom: 'auto' } : undefined} class={styles.toolbar}><div onClick={($event) => !isActive.value ? (getJustFinishedToolbarDrag() ? (setJustFinishedToolbarDrag(false), $event.preventDefault()) : (isActive.value = true)) : undefined} onMousedown={(e: MouseEvent) => handleToolbarMouseDown(e, isActive.value, connectionStatus)} role={!isActive.value ? 'button' : undefined} tabindex={!isActive.value ? 0 : -1} title={!isActive.value ? 'Start feedback mode' : undefined} style={isDraggingToolbar ? { transform: `scale(1.05) rotate(${dragRotation}deg)`, cursor: 'grabbing' } : undefined} class={[
                styles.toolbarContainer,
                props.className,
                !isDarkMode ? styles.light : '',
                isActive.value ? styles.expanded : styles.collapsed,
                showEntranceAnimation ? styles.entrance : '',
                isDraggingToolbar ? styles.dragging : '',
                isToolbarHiding.value ? styles.hiding : '',
                !settings.webhooksEnabled && (isValidUrl(settings.webhookUrl) || isValidUrl(webhookUrl || '')) ? styles.serverConnected : '',
              ]}>{/*  Toggle content (collapsed)  */}<div class={[styles.toggleContent, !isActive.value ? styles.visible : styles.hidden]}><IconListSparkle size={24} />{hasAnnotations.value ? <span style={{ backgroundColor: settings.annotationColor }} class={[styles.badge, isActive.value ? styles.fadeOut : '', showEntranceAnimation ? styles.entrance : '']}>{annotations.value.length}</span> : null}</div>{/*  Controls content (expanded)  */}<div onMouseenter={handleControlsMouseEnter} onMouseleave={handleControlsMouseLeave} class={[
                  styles.controlsContent,
                  isActive.value ? styles.visible : styles.hidden,
                  toolbarPosition && toolbarPosition.y < 100 ? styles.tooltipBelow : '',
                  tooltipsHidden.value || showSettings.value ? styles.tooltipsHidden : '',
                  tooltipSessionActive.value ? styles.tooltipsInSession : '',
                ]}><div class={[styles.buttonWrapper, toolbarPosition && toolbarPosition.x < 120 ? styles.buttonWrapperAlignLeft : '']}><button data-active={isFrozen.value} onClick={($event) => { $event.stopPropagation(); { hideTooltipsUntilMouseLeave(); toggleFreeze(); } }} class={[styles.controlButton, !isDarkMode ? styles.light : '']}><IconPausePlayAnimated size={24} isPaused={isFrozen.value} /></button><span class={styles.buttonTooltip}>{isFrozen.value ? 'Resume animations' : 'Pause animations'} <span class={styles.shortcut}>P</span></span></div><div class={styles.buttonWrapper}><button data-active={isDrawMode} onClick={($event) => { $event.stopPropagation(); { hideTooltipsUntilMouseLeave(); isDrawMode = !isDrawMode; } }} class={[styles.controlButton, !isDarkMode ? styles.light : '']}><IconPencil size={24} /></button><span class={styles.buttonTooltip}>{isDrawMode ? 'Exit draw mode' : 'Draw mode'} <span class={styles.shortcut}>D</span></span></div><div class={styles.buttonWrapper}><button disabled={!hasAnnotations.value} onClick={($event) => { $event.stopPropagation(); { hideTooltipsUntilMouseLeave(); showMarkers.value = !showMarkers.value; if (isDrawMode) isDrawMode = false; } }} class={[styles.controlButton, !isDarkMode ? styles.light : '']}><IconEyeAnimated size={24} isOpen={showMarkers.value} /></button><span class={styles.buttonTooltip}>{showMarkers.value ? 'Hide markers' : 'Show markers'} <span class={styles.shortcut}>H</span></span></div><div class={styles.buttonWrapper}><button disabled={!hasAnnotations.value && drawStrokes.length === 0} data-active={copied.value} onClick={($event) => { $event.stopPropagation(); { hideTooltipsUntilMouseLeave(); copyOutput(); } }} class={[styles.controlButton, !isDarkMode ? styles.light : '', copied.value ? styles.statusShowing : '']}><IconCopyAnimated size={24} copied={copied.value} /></button><span class={styles.buttonTooltip}> Copy feedback <span class={styles.shortcut}>C</span></span></div>{/*  Send button  */}<div class={[styles.buttonWrapper, styles.sendButtonWrapper, isActive.value && !settings.webhooksEnabled && (isValidUrl(settings.webhookUrl) || isValidUrl(webhookUrl || '')) ? styles.sendButtonVisible : '']}><button disabled={!hasAnnotations.value || (!isValidUrl(settings.webhookUrl) && !isValidUrl(webhookUrl || '')) || sendState.value === 'sending'} data-no-hover={sendState.value === 'sent' || sendState.value === 'failed'} tabindex={isValidUrl(settings.webhookUrl) || isValidUrl(webhookUrl || '') ? 0 : -1} onClick={($event) => { $event.stopPropagation(); { hideTooltipsUntilMouseLeave(); sendToWebhook(); } }} class={[styles.controlButton, !isDarkMode ? styles.light : '', sendState.value === 'sent' || sendState.value === 'failed' ? styles.statusShowing : '']}><IconSendArrow size={24} state={sendState.value} />{hasAnnotations.value && sendState.value === 'idle' ? <span style={{ backgroundColor: settings.annotationColor }} class={[styles.buttonBadge, !isDarkMode ? styles.light : '']}>{annotations.value.length}</span> : null}</button><span class={styles.buttonTooltip}> Send Annotations <span class={styles.shortcut}>S</span></span></div><div class={styles.buttonWrapper}><button disabled={!hasAnnotations.value && drawStrokes.length === 0} data-danger onClick={($event) => { $event.stopPropagation(); { hideTooltipsUntilMouseLeave(); clearAll(); } }} class={[styles.controlButton, !isDarkMode ? styles.light : '']}><IconTrashAlt size={24} /></button><span class={styles.buttonTooltip}> Clear all <span class={styles.shortcut}>X</span></span></div><div class={styles.buttonWrapper}><button onClick={($event) => { $event.stopPropagation(); { hideTooltipsUntilMouseLeave(); showSettings.value = !showSettings.value; } }} class={[styles.controlButton, !isDarkMode ? styles.light : '']}><IconGear size={24} /></button>{endpoint && connectionStatus !== 'disconnected' ? <span title={connectionStatus === 'connected' ? 'MCP Connected' : 'MCP Connecting...'} class={[styles.mcpIndicator, !isDarkMode ? styles.light : '', styles[connectionStatus], showSettings.value ? styles.hidden : '']} /> : null}<span class={styles.buttonTooltip}>Settings</span></div><div class={[styles.divider, !isDarkMode ? styles.light : '']} /><div class={[styles.buttonWrapper, toolbarPosition && toolbarPosition.x > _window.innerWidth - 120 ? styles.buttonWrapperAlignRight : '']}><button onClick={($event) => { $event.stopPropagation(); { hideTooltipsUntilMouseLeave(); isActive.value = false; } }} class={[styles.controlButton, !isDarkMode ? styles.light : '']}><IconXmarkLarge size={24} /></button><span class={styles.buttonTooltip}> Exit <span class={styles.shortcut}>Esc</span></span></div></div>{/*  Settings Panel  */}<ToolbarSettingsPanel settings={settings} isDarkMode={isDarkMode} showSettingsVisible={showSettingsVisible.value} toolbarPosition={toolbarPosition} isLocalhost={isLocalhost} endpoint={endpoint} connectionStatus={connectionStatus} isTransitioning={isTransitioning.value} settingsPage={settingsPage.value} onUpdate:isDarkMode={($event) => isDarkMode = $event} onUpdate:settings={($event) => Object.assign(settings, $event)} onUpdate:settingsPage={($event) => settingsPage.value = $event} onHideToolbar={hideToolbarTemporarily} /></div></div>{/*  Draw canvas  */}<canvas ref={drawCanvasRef} style={{ opacity: shouldShowMarkers.value ? 1 : 0, transition: 'opacity 0.15s ease' }} data-feedback-toolbar class={[styles.drawCanvas, isDrawMode ? styles.active : '']} />{/*  Markers layer (normal scrolling)  */}<div data-feedback-toolbar class={styles.markersLayer}>{markersVisible ? <>{_renderList(visibleAnnotations.value.filter(a => !a.isFixed), (annotation, index) => (<AnnotationMarker key={annotation.id} annotation={annotation} globalIndex={annotations.value.findIndex(a => a.id === annotation.id)} index={index} totalVisible={visibleAnnotations.value.filter(a => !a.isFixed).length} isHovered={!markersExiting && hoveredMarkerId.value === annotation.id} isDeleting={deletingMarkerId.value === annotation.id} isEditing={!!editingAnnotation} markerColor={annotation.isMultiSelect ? '#34C759' : settings.annotationColor} markerClickBehavior={settings.markerClickBehavior} markersExiting={markersExiting} isClearing={isClearing.value} needsEnterAnimation={!animatedMarkers.has(annotation.id)} isFixed={false} renumberFrom={renumberFrom.value} isDarkMode={isDarkMode} onMouseenter={() => !markersExiting && annotation.id !== recentlyAddedId && handleMarkerHover(annotation)} onMouseleave={() => handleMarkerHover(null)} onClick={() => !markersExiting && (settings.markerClickBehavior === 'delete' ? deleteAnnotation(annotation.id) : startEditAnnotation(annotation))} onContextmenu={(e: MouseEvent) => { if (settings.markerClickBehavior === 'delete') { e.preventDefault(); e.stopPropagation(); if (!markersExiting) startEditAnnotation(annotation) } }} />))}{/*  Exiting markers (normal)  */}{!markersExiting ? <div key={'exit-' + annotation.id} data-annotation-marker style={{ left: `${annotation.x}%`, top: annotation.y + 'px' }} class={[styles.marker, styles.hovered, annotation.isMultiSelect ? styles.multiSelect : '', styles.exit]}><IconXmark size={annotation.isMultiSelect ? 12 : 10} /></div> : null}</> : null}</div>{/*  Fixed markers layer  */}<div data-feedback-toolbar class={styles.fixedMarkersLayer}>{markersVisible ? <>{_renderList(visibleAnnotations.value.filter(a => a.isFixed), (annotation, index) => (<AnnotationMarker key={annotation.id} annotation={annotation} globalIndex={annotations.value.findIndex(a => a.id === annotation.id)} index={index} totalVisible={visibleAnnotations.value.filter(a => a.isFixed).length} isHovered={!markersExiting && hoveredMarkerId.value === annotation.id} isDeleting={deletingMarkerId.value === annotation.id} isEditing={!!editingAnnotation} markerColor={annotation.isMultiSelect ? '#34C759' : settings.annotationColor} markerClickBehavior={settings.markerClickBehavior} markersExiting={markersExiting} isClearing={isClearing.value} needsEnterAnimation={!animatedMarkers.has(annotation.id)} isFixed={true} renumberFrom={renumberFrom.value} isDarkMode={isDarkMode} onMouseenter={() => !markersExiting && annotation.id !== recentlyAddedId && handleMarkerHover(annotation)} onMouseleave={() => handleMarkerHover(null)} onClick={() => !markersExiting && (settings.markerClickBehavior === 'delete' ? deleteAnnotation(annotation.id) : startEditAnnotation(annotation))} onContextmenu={(e: MouseEvent) => { if (settings.markerClickBehavior === 'delete') { e.preventDefault(); e.stopPropagation(); if (!markersExiting) startEditAnnotation(annotation) } }} />))}{/*  Exiting markers (fixed)  */}{!markersExiting ? <div key={'exit-fixed-' + annotation.id} data-annotation-marker style={{ left: `${annotation.x}%`, top: annotation.y + 'px' }} class={[styles.marker, styles.fixed, styles.hovered, annotation.isMultiSelect ? styles.multiSelect : '', styles.exit]}><IconClose size={annotation.isMultiSelect ? 12 : 10} /></div> : null}</> : null}</div>{/*  Interactive overlay  */}{isActive.value ? <div data-feedback-toolbar style={pendingAnnotation || editingAnnotation ? { zIndex: 99999 } : undefined} class={styles.overlay}>{/*  Hover highlight  */}{hoverInfo?.rect && !pendingAnnotation && !isScrolling.value && !dragSelect.value.isDragging.value && !isDrawMode ? <div style={{
                left: hoverInfo.rect.left + 'px',
                top: hoverInfo.rect.top + 'px',
                width: hoverInfo.rect.width + 'px',
                height: hoverInfo.rect.height + 'px',
                borderColor: `${settings.annotationColor}80`,
                backgroundColor: `${settings.annotationColor}0A`,
              }} class={[styles.hoverHighlight, styles.enter]} /> : null}{_renderList(multiSelect.value.pendingMultiSelectElements.value.filter(i => _document.contains(i.element)), (item, index) => (<div key={'ms-' + index} style={{
                position: 'fixed',
                left: item.element.getBoundingClientRect().left + 'px',
                top: item.element.getBoundingClientRect().top + 'px',
                width: item.element.getBoundingClientRect().width + 'px',
                height: item.element.getBoundingClientRect().height + 'px',
                ...(multiSelect.value.pendingMultiSelectElements.value.length > 1
                  ? {}
                  : { borderColor: `${settings.annotationColor}99`, backgroundColor: `${settings.annotationColor}0D` }),
              }} class={multiSelect.value.pendingMultiSelectElements.value.length > 1 ? styles.multiSelectOutline : styles.singleSelectOutline} />))}{/*  Hover tooltip  */}{hoverInfo && !pendingAnnotation && !isScrolling.value && !dragSelect.value.isDragging.value && !isDrawMode ? <div style={{
                left: Math.max(8, Math.min(hoverPosition.x, _window.innerWidth - 100)) + 'px',
                top: Math.max(hoverPosition.y - (hoverInfo.reactComponents ? 48 : 32), 8) + 'px',
              }} class={[styles.hoverTooltip, styles.enter]}>{hoverInfo.reactComponents ? <div class={styles.hoverReactPath}>{hoverInfo.reactComponents}</div> : null}<div class={styles.hoverElementName}>{hoverInfo.elementName}</div></div> : null}{pendingAnnotation ? <>{/*  Pending outline  */}{pendingAnnotation.drawingIndex == null ? <>{pendingAnnotation.targetElement && _document.contains(pendingAnnotation.targetElement) ? <><div style={{
                      left: pendingAnnotation.targetElement.getBoundingClientRect().left + 'px',
                      top: pendingAnnotation.targetElement.getBoundingClientRect().top + 'px',
                      width: pendingAnnotation.targetElement.getBoundingClientRect().width + 'px',
                      height: pendingAnnotation.targetElement.getBoundingClientRect().height + 'px',
                      borderColor: `${settings.annotationColor}99`,
                      backgroundColor: `${settings.annotationColor}0D`,
                    }} class={[styles.singleSelectOutline, pendingExiting ? styles.exit : styles.enter]} /></> : pendingAnnotation.boundingBox ? <><div style={{
                      left: pendingAnnotation.boundingBox.x + 'px',
                      top: (pendingAnnotation.boundingBox.y - scrollY.value) + 'px',
                      width: pendingAnnotation.boundingBox.width + 'px',
                      height: pendingAnnotation.boundingBox.height + 'px',
                      ...(pendingAnnotation.isMultiSelect ? {} : { borderColor: `${settings.annotationColor}99`, backgroundColor: `${settings.annotationColor}0D` }),
                    }} class={[pendingAnnotation.isMultiSelect ? styles.multiSelectOutline : styles.singleSelectOutline, pendingExiting ? styles.exit : styles.enter]} /></> : null}</> : null}<div style={{
                  left: `${pendingAnnotation.x}%`,
                  top: (pendingAnnotation.isFixed ? pendingAnnotation.y : pendingAnnotation.y - scrollY.value) + 'px',
                  backgroundColor: pendingAnnotation.isMultiSelect ? '#34C759' : settings.annotationColor,
                }} class={[styles.marker, styles.pending, pendingAnnotation.isMultiSelect ? styles.multiSelect : '', pendingExiting ? styles.exit : styles.enter]}><IconPlus size={12} /></div>{/*  Pending popup  */}<AnnotationPopup ref={popupRef} element={pendingAnnotation.element} selectedText={pendingAnnotation.selectedText} computedStyles={pendingAnnotation.computedStylesObj} placeholder={
                  pendingAnnotation.element === 'Area selection'
                    ? 'What should change in this area?'
                    : pendingAnnotation.isMultiSelect
                      ? 'Feedback for this group of elements...'
                      : 'What should change?'
                } onSubmit={addAnnotation} onCancel={cancelAnnotation} isExiting={pendingExiting} lightMode={!isDarkMode} accentColor={pendingAnnotation.isMultiSelect ? '#34C759' : settings.annotationColor} popupStyle={getPopupStyle(pendingAnnotation.x, pendingAnnotation.isFixed ? pendingAnnotation.y : pendingAnnotation.y - scrollY.value)} /></> : null}{editingAnnotation ? <>{/*  Edit outline  */}{editingAnnotation.drawingIndex == null ? <>{editingTargetElement && _document.contains(editingTargetElement) ? <><div style={{
                      left: editingTargetElement.getBoundingClientRect().left + 'px',
                      top: editingTargetElement.getBoundingClientRect().top + 'px',
                      width: editingTargetElement.getBoundingClientRect().width + 'px',
                      height: editingTargetElement.getBoundingClientRect().height + 'px',
                      ...(editingAnnotation.isMultiSelect ? {} : { borderColor: `${settings.annotationColor}99`, backgroundColor: `${settings.annotationColor}0D` }),
                    }} class={[editingAnnotation.isMultiSelect ? styles.multiSelectOutline : styles.singleSelectOutline, styles.enter]} /></> : editingAnnotation.boundingBox ? <><div style={{
                      left: editingAnnotation.boundingBox.x + 'px',
                      top: (editingAnnotation.isFixed ? editingAnnotation.boundingBox.y : editingAnnotation.boundingBox.y - scrollY.value) + 'px',
                      width: editingAnnotation.boundingBox.width + 'px',
                      height: editingAnnotation.boundingBox.height + 'px',
                      ...(editingAnnotation.isMultiSelect ? {} : { borderColor: `${settings.annotationColor}99`, backgroundColor: `${settings.annotationColor}0D` }),
                    }} class={[editingAnnotation.isMultiSelect ? styles.multiSelectOutline : styles.singleSelectOutline, styles.enter]} /></> : null}</> : null}<AnnotationPopup ref={editPopupRef} element={editingAnnotation.element} selectedText={editingAnnotation.selectedText} computedStyles={parseComputedStylesString(editingAnnotation.computedStyles)} placeholder="Edit your feedback..." initialValue={editingAnnotation.comment} submit-label="Save" onSubmit={updateAnnotation} onCancel={cancelEditAnnotation} onDelete={() => deleteAnnotation(editingAnnotation!.id)} isExiting={editExiting} lightMode={!isDarkMode} accentColor={editingAnnotation.isMultiSelect ? '#34C759' : settings.annotationColor} popupStyle={getPopupStyle(editingAnnotation.x, editingAnnotation.isFixed ? editingAnnotation.y : editingAnnotation.y - scrollY.value)} /></> : null}{dragSelect.value.isDragging.value ? <><div ref={(el: any) => dragSelect.value.setDragRectEl(el)} class={styles.dragSelection} /><div ref={(el: any) => dragSelect.value.setHighlightsContainerEl(el)} class={styles.highlightsContainer} /></> : null}</div> : null}</> : null}</div></Teleport>
    )
  }
})

export type DemoAnnotation = {
  selector: string
  comment: string
  selectedText?: string
}