import { ref, watch, defineComponent } from 'vue'
import styles from '../../styles/page-toolbar.module.scss'
import { originalSetTimeout } from '../../utils/freeze-animations'
import { OUTPUT_DETAIL_OPTIONS, COLOR_OPTIONS, isValidUrl, ToolbarSettings } from '../composables/useToolbarSettings'
import { IconHelp, IconCheckSmallAnimated, IconSun, IconMoon, IconChevronLeft } from './icons'
import ToolbarTooltip from './ToolbarTooltip'

export default defineComponent({
  props: {
    settings: { type: Object as PropType<ToolbarSettings>, required: true },
    isDarkMode: { type: Boolean, required: true },
    showSettingsVisible: { type: Boolean, required: true },
    toolbarPosition: { type: Object as PropType<{ x: number; y: number } | null>, required: true },
    isLocalhost: { type: Boolean, required: true },
    endpoint: { type: String, required: false },
    connectionStatus: { type: String as PropType<'disconnected' | 'connecting' | 'connected'>, required: true },
    isTransitioning: { type: Boolean, required: true },
    settingsPage: { type: String as PropType<'main' | 'automations'>, required: true }
  },
  emits: ['update:isDarkMode', 'update:settings', 'update:settingsPage', 'hideToolbar'],
  setup(props, { emit }) {
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

    function updateSetting<K extends keyof ToolbarSettings>(key: K, value: ToolbarSettings[K]) {
      emit('update:settings', { [key]: value })
    }

    function cycleOutputDetail() {
      const currentIndex = OUTPUT_DETAIL_OPTIONS.findIndex(
        (opt) => opt.value === props.settings.outputDetail,
      )
      const nextIndex = (currentIndex + 1) % OUTPUT_DETAIL_OPTIONS.length
      updateSetting('outputDetail', OUTPUT_DETAIL_OPTIONS[nextIndex].value)
    }

    return () => (
      <div data-settings-panel onClick={($event) => { $event.stopPropagation() }} style={
            props.toolbarPosition && props.toolbarPosition.y < 230
              ? { bottom: 'auto', top: 'calc(100% + 0.5rem)' }
              : undefined
          } class={[
            styles.settingsPanel,
            props.isDarkMode ? styles.dark : styles.light,
            props.showSettingsVisible ? styles.enter : styles.exit,
          ]}><div class={[
              styles.settingsPanelContainer,
              props.isTransitioning ? styles.transitioning : '',
            ]}>{/*  Main settings page  */}<div class={[
                styles.settingsPage,
                props.settingsPage === 'automations' ? styles.slideLeft : '',
              ]}><div class={styles.settingsHeader}><span class={styles.settingsBrand}><span style={{ color: props.settings.annotationColor, transition: 'color 0.2s ease' }} class={styles.settingsBrandSlash}>/</span> agentation </span><span class={styles.settingsVersion}>v{__VERSION__}</span><button title={props.isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'} onClick={() => emit('update:isDarkMode', !props.isDarkMode)} class={styles.themeToggle}><span class={styles.themeIconWrapper}><span class={styles.themeIcon}>{props.isDarkMode ? <IconSun size={20} /> : <IconMoon size={20} />}</span></span></button></div><div class={styles.settingsSection}><div class={styles.settingsRow}><div class={[styles.settingsLabel, !props.isDarkMode ? styles.light : '']}> Output Detail <ToolbarTooltip content="Controls how much detail is included in the copied output" isTransitioning={props.isTransitioning}><span class={styles.helpIcon}><IconHelp size={20} /></span></ToolbarTooltip></div><button onClick={cycleOutputDetail} class={[styles.cycleButton, !props.isDarkMode ? styles.light : '']}><span class={styles.cycleButtonText}>{OUTPUT_DETAIL_OPTIONS.find((opt) => opt.value === props.settings.outputDetail)?.label}</span><span class={styles.cycleDots}>{_renderList(OUTPUT_DETAIL_OPTIONS, (option) => (<span key={option.value} class={[
                          styles.cycleDot,
                          !props.isDarkMode ? styles.light : '',
                          props.settings.outputDetail === option.value ? styles.active : '',
                        ]} />))}</span></button></div><div class={[
                    styles.settingsRow,
                    styles.settingsRowMarginTop,
                    !props.isLocalhost ? styles.settingsRowDisabled : '',
                  ]}><div class={[styles.settingsLabel, !props.isDarkMode ? styles.light : '']}> Vue Components <ToolbarTooltip content={
                        !props.isLocalhost
                          ? 'Disabled \u2014 production builds strip component names, making detection unreliable. Enable in dev mode.'
                          : 'Include Vue component names in annotations'
                      } isTransitioning={props.isTransitioning}><span class={styles.helpIcon}><IconHelp size={20} /></span></ToolbarTooltip></div><label class={[styles.toggleSwitch, !props.isLocalhost ? styles.disabled : '']}><input type="checkbox" checked={props.isLocalhost && props.settings.reactEnabled} disabled={!props.isLocalhost} onChange={() => updateSetting('reactEnabled', !props.settings.reactEnabled)} /><span class={styles.toggleSlider} /></label></div></div><div class={styles.settingsSection}><div class={[styles.settingsLabel, styles.settingsLabelMarker, !props.isDarkMode ? styles.light : '']}> Marker Colour </div><div class={styles.colorOptions}>{_renderList(COLOR_OPTIONS, (color) => (<div key={color.value} role="button" style={{
                      borderColor: props.settings.annotationColor === color.value ? color.value : 'transparent',
                    }} onClick={() => updateSetting('annotationColor', color.value)} class={[
                      styles.colorOptionRing,
                      props.settings.annotationColor === color.value ? styles.selected : '',
                    ]}><div style={{ backgroundColor: color.value }} title={color.label} class={[
                        styles.colorOption,
                        props.settings.annotationColor === color.value ? styles.selected : '',
                      ]} /></div>))}</div></div><div class={styles.settingsSection}><label class={styles.settingsToggle}><input type="checkbox" id="autoClearAfterCopy" checked={props.settings.autoClearAfterCopy} onChange={() => updateSetting('autoClearAfterCopy', !props.settings.autoClearAfterCopy)} /><label for="autoClearAfterCopy" class={[styles.customCheckbox, props.settings.autoClearAfterCopy ? styles.checked : '']}>{props.settings.autoClearAfterCopy ? <IconCheckSmallAnimated size={14} /> : null}</label><span class={[styles.toggleLabel, !props.isDarkMode ? styles.light : '']}> Clear on copy/send <ToolbarTooltip content="Automatically clear annotations after copying" isTransitioning={props.isTransitioning}><span class={[styles.helpIcon, styles.helpIconNudge2]}><IconHelp size={20} /></span></ToolbarTooltip></span></label><label class={styles.settingsToggle}><input type="checkbox" id="blockInteractions" checked={props.settings.blockInteractions} onChange={() => updateSetting('blockInteractions', !props.settings.blockInteractions)} /><label for="blockInteractions" class={[styles.customCheckbox, props.settings.blockInteractions ? styles.checked : '']}>{props.settings.blockInteractions ? <IconCheckSmallAnimated size={14} /> : null}</label><span class={[styles.toggleLabel, !props.isDarkMode ? styles.light : '']}> Block page interactions </span></label><label class={[styles.settingsToggle, styles.settingsToggleMarginBottom]}><input type="checkbox" id="hideToolbar" checked={false} onChange={() => emit('hideToolbar')} /><label for="hideToolbar" class={styles.customCheckbox} /><span class={[styles.toggleLabel, !props.isDarkMode ? styles.light : '']}> Hide until restart <ToolbarTooltip content="Hide the toolbar for the rest of this browser session. Reload or open a new tab to bring it back." isTransitioning={props.isTransitioning}><span class={[styles.helpIcon, styles.helpIconNudge2]}><IconHelp size={20} /></span></ToolbarTooltip></span></label></div><div class={[styles.settingsSection, styles.settingsSectionExtraPadding]}><button onClick={() => emit('update:settingsPage', 'automations')} class={[styles.settingsNavLink, !props.isDarkMode ? styles.light : '']}><span>Manage MCP &amp; Webhooks</span><span class={styles.settingsNavLinkRight}>{props.endpoint && props.connectionStatus !== 'disconnected' ? <span class={[styles.mcpNavIndicator, styles[props.connectionStatus]]} /> : null}<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 12.5L12 8L7.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg></span></button></div></div>{/*  Automations Page  */}<div class={[
                styles.settingsPage,
                styles.automationsPage,
                props.settingsPage === 'automations' ? styles.slideIn : '',
              ]}><button onClick={() => emit('update:settingsPage', 'main')} class={[styles.settingsBackButton, !props.isDarkMode ? styles.light : '']}><IconChevronLeft size={16} /><span>Manage MCP &amp; Webhooks</span></button>{/*  MCP Connection section  */}<div class={styles.settingsSection}><div class={styles.settingsRow}><span class={[styles.automationHeader, !props.isDarkMode ? styles.light : '']}> MCP Connection <ToolbarTooltip content="Connect via Model Context Protocol to let AI agents like Claude Code receive annotations in real-time." isTransitioning={props.isTransitioning}><span class={[styles.helpIcon, styles.helpIconNudgeDown]}><IconHelp size={20} /></span></ToolbarTooltip></span>{props.endpoint ? <div title={
                      props.connectionStatus === 'connected'
                        ? 'Connected'
                        : props.connectionStatus === 'connecting'
                          ? 'Connecting...'
                          : 'Disconnected'
                    } class={[styles.mcpStatusDot, styles[props.connectionStatus]]} /> : null}</div><p style={{ paddingBottom: '6px' }} class={[styles.automationDescription, !props.isDarkMode ? styles.light : '']}> MCP connection allows agents to receive and act on annotations. <a href="https://agentation.dev/mcp" target="_blank" rel="noopener noreferrer" class={[styles.learnMoreLink, !props.isDarkMode ? styles.light : '']}>Learn more</a></p></div>{/*  Webhooks section  */}<div class={[styles.settingsSection, styles.settingsSectionGrow]}><div class={styles.settingsRow}><span class={[styles.automationHeader, !props.isDarkMode ? styles.light : '']}> Webhooks <ToolbarTooltip content="Send annotation data to any URL endpoint when annotations change. Useful for custom integrations." isTransitioning={props.isTransitioning}><span class={[styles.helpIcon, styles.helpIconNoNudge]}><IconHelp size={20} /></span></ToolbarTooltip></span><div class={styles.autoSendRow}><span class={[
                        styles.autoSendLabel,
                        !props.isDarkMode ? styles.light : '',
                        props.settings.webhooksEnabled ? styles.active : '',
                      ]}>Auto-Send</span><label class={[styles.toggleSwitch, !props.settings.webhookUrl ? styles.disabled : '']}><input type="checkbox" checked={props.settings.webhooksEnabled} disabled={!props.settings.webhookUrl} onChange={() => updateSetting('webhooksEnabled', !props.settings.webhooksEnabled)} /><span class={styles.toggleSlider} /></label></div></div><p class={[styles.automationDescription, !props.isDarkMode ? styles.light : '']}> The webhook URL will receive live annotation changes and annotation data. </p><textarea placeholder="Webhook URL" value={props.settings.webhookUrl} style={{ '--marker-color': props.settings.annotationColor } as any} onInput={($event) => updateSetting('webhookUrl', ($event.target as HTMLTextAreaElement).value)} class={[styles.webhookUrlInput, !props.isDarkMode ? styles.light : '']} /></div></div></div></div>
    )
  }
})