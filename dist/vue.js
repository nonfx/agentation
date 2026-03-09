"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/vue.ts
var vue_exports = {};
__export(vue_exports, {
  Agentation: () => AgentationToolbar_default,
  AgentationToolbar: () => AgentationToolbar_default,
  AnimatedBunny: () => AnimatedBunny_default,
  AnnotationPopup: () => AnnotationPopup_default,
  IconChatEllipsis: () => IconChatEllipsis_default,
  IconCheck: () => IconCheck_default,
  IconCheckSmall: () => IconCheckSmall_default,
  IconCheckSmallAnimated: () => IconCheckSmallAnimated_default,
  IconCheckmark: () => IconCheckmark_default,
  IconCheckmarkCircle: () => IconCheckmarkCircle_default,
  IconCheckmarkLarge: () => IconCheckmarkLarge_default,
  IconChevronLeft: () => IconChevronLeft_default,
  IconChevronRight: () => IconChevronRight_default,
  IconClose: () => IconClose_default,
  IconCopyAlt: () => IconCopyAlt_default,
  IconCopyAnimated: () => IconCopyAnimated_default,
  IconEdit: () => IconEdit_default,
  IconEye: () => IconEye_default,
  IconEyeAlt: () => IconEyeAlt_default,
  IconEyeAnimated: () => IconEyeAnimated_default,
  IconEyeClosed: () => IconEyeClosed_default,
  IconEyeMinus: () => IconEyeMinus_default,
  IconGear: () => IconGear_default,
  IconHelp: () => IconHelp_default,
  IconListSparkle: () => IconListSparkle_default,
  IconMoon: () => IconMoon_default,
  IconPause: () => IconPause_default,
  IconPauseAlt: () => IconPauseAlt_default,
  IconPausePlayAnimated: () => IconPausePlayAnimated_default,
  IconPencil: () => IconPencil_default,
  IconPlayAlt: () => IconPlayAlt_default,
  IconPlus: () => IconPlus_default,
  IconSendAnimated: () => IconSendAnimated_default,
  IconSendArrow: () => IconSendArrow_default,
  IconSun: () => IconSun_default,
  IconTrash: () => IconTrash_default,
  IconTrashAlt: () => IconTrashAlt_default,
  IconXmark: () => IconXmark_default,
  IconXmarkLarge: () => IconXmarkLarge_default,
  closestCrossingShadow: () => closestCrossingShadow,
  getElementClasses: () => getElementClasses,
  getElementPath: () => getElementPath,
  getNearbyText: () => getNearbyText,
  getShadowHost: () => getShadowHost,
  getStorageKey: () => getStorageKey,
  identifyAnimationElement: () => identifyAnimationElement,
  identifyElement: () => identifyElement,
  isInShadowDOM: () => isInShadowDOM,
  loadAnnotations: () => loadAnnotations,
  saveAnnotations: () => saveAnnotations
});
module.exports = __toCommonJS(vue_exports);

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/AgentationToolbar.vue
var import_vue93 = require("vue");
var import_vue94 = require("vue");

// src/core/utils/element-identification.ts
function getParentElement(element) {
  if (element.parentElement) {
    return element.parentElement;
  }
  const root = element.getRootNode();
  if (root instanceof ShadowRoot) {
    return root.host;
  }
  return null;
}
function closestCrossingShadow(element, selector) {
  let current = element;
  while (current) {
    if (current.matches(selector)) return current;
    current = getParentElement(current);
  }
  return null;
}
function isInShadowDOM(element) {
  return element.getRootNode() instanceof ShadowRoot;
}
function getShadowHost(element) {
  const root = element.getRootNode();
  if (root instanceof ShadowRoot) {
    return root.host;
  }
  return null;
}
function getElementPath(target, maxDepth = 4) {
  const parts = [];
  let current = target;
  let depth = 0;
  while (current && depth < maxDepth) {
    const tag = current.tagName.toLowerCase();
    if (tag === "html" || tag === "body") break;
    let identifier = tag;
    if (current.id) {
      identifier = `#${current.id}`;
    } else if (current.className && typeof current.className === "string") {
      const meaningfulClass = current.className.split(/\s+/).find((c) => c.length > 2 && !c.match(/^[a-z]{1,2}$/) && !c.match(/[A-Z0-9]{5,}/));
      if (meaningfulClass) {
        identifier = `.${meaningfulClass.split("_")[0]}`;
      }
    }
    const nextParent = getParentElement(current);
    if (!current.parentElement && nextParent) {
      identifier = `\u27E8shadow\u27E9 ${identifier}`;
    }
    parts.unshift(identifier);
    current = nextParent;
    depth++;
  }
  return parts.join(" > ");
}
function identifyElement(target) {
  const path = getElementPath(target);
  if (target.dataset.element) {
    return { name: target.dataset.element, path };
  }
  const tag = target.tagName.toLowerCase();
  if (["path", "circle", "rect", "line", "g"].includes(tag)) {
    const svg = closestCrossingShadow(target, "svg");
    if (svg) {
      const parent = getParentElement(svg);
      if (parent instanceof HTMLElement) {
        const parentName = identifyElement(parent).name;
        return { name: `graphic in ${parentName}`, path };
      }
    }
    return { name: "graphic element", path };
  }
  if (tag === "svg") {
    const parent = getParentElement(target);
    if (parent?.tagName.toLowerCase() === "button") {
      const btnText = parent.textContent?.trim();
      return { name: btnText ? `icon in "${btnText}" button` : "button icon", path };
    }
    return { name: "icon", path };
  }
  if (tag === "button") {
    const text = target.textContent?.trim();
    const ariaLabel = target.getAttribute("aria-label");
    if (ariaLabel) return { name: `button [${ariaLabel}]`, path };
    return { name: text ? `button "${text.slice(0, 25)}"` : "button", path };
  }
  if (tag === "a") {
    const text = target.textContent?.trim();
    const href = target.getAttribute("href");
    if (text) return { name: `link "${text.slice(0, 25)}"`, path };
    if (href) return { name: `link to ${href.slice(0, 30)}`, path };
    return { name: "link", path };
  }
  if (tag === "input") {
    const type = target.getAttribute("type") || "text";
    const placeholder = target.getAttribute("placeholder");
    const name = target.getAttribute("name");
    if (placeholder) return { name: `input "${placeholder}"`, path };
    if (name) return { name: `input [${name}]`, path };
    return { name: `${type} input`, path };
  }
  if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(tag)) {
    const text = target.textContent?.trim();
    return { name: text ? `${tag} "${text.slice(0, 35)}"` : tag, path };
  }
  if (tag === "p") {
    const text = target.textContent?.trim();
    if (text) return { name: `paragraph: "${text.slice(0, 40)}${text.length > 40 ? "..." : ""}"`, path };
    return { name: "paragraph", path };
  }
  if (tag === "span" || tag === "label") {
    const text = target.textContent?.trim();
    if (text && text.length < 40) return { name: `"${text}"`, path };
    return { name: tag, path };
  }
  if (tag === "li") {
    const text = target.textContent?.trim();
    if (text && text.length < 40) return { name: `list item: "${text.slice(0, 35)}"`, path };
    return { name: "list item", path };
  }
  if (tag === "blockquote") return { name: "blockquote", path };
  if (tag === "code") {
    const text = target.textContent?.trim();
    if (text && text.length < 30) return { name: `code: \`${text}\``, path };
    return { name: "code", path };
  }
  if (tag === "pre") return { name: "code block", path };
  if (tag === "img") {
    const alt = target.getAttribute("alt");
    return { name: alt ? `image "${alt.slice(0, 30)}"` : "image", path };
  }
  if (tag === "video") return { name: "video", path };
  if (["div", "section", "article", "nav", "header", "footer", "aside", "main"].includes(tag)) {
    const className = target.className;
    const role = target.getAttribute("role");
    const ariaLabel = target.getAttribute("aria-label");
    if (ariaLabel) return { name: `${tag} [${ariaLabel}]`, path };
    if (role) return { name: `${role}`, path };
    if (typeof className === "string" && className) {
      const words = className.split(/[\s_-]+/).map((c) => c.replace(/[A-Z0-9]{5,}.*$/, "")).filter((c) => c.length > 2 && !/^[a-z]{1,2}$/.test(c)).slice(0, 2);
      if (words.length > 0) return { name: words.join(" "), path };
    }
    return { name: tag === "div" ? "container" : tag, path };
  }
  return { name: tag, path };
}
function getNearbyText(element) {
  const texts = [];
  const ownText = element.textContent?.trim();
  if (ownText && ownText.length < 100) {
    texts.push(ownText);
  }
  const prev = element.previousElementSibling;
  if (prev) {
    const prevText = prev.textContent?.trim();
    if (prevText && prevText.length < 50) {
      texts.unshift(`[before: "${prevText.slice(0, 40)}"]`);
    }
  }
  const next = element.nextElementSibling;
  if (next) {
    const nextText = next.textContent?.trim();
    if (nextText && nextText.length < 50) {
      texts.push(`[after: "${nextText.slice(0, 40)}"]`);
    }
  }
  return texts.join(" ");
}
function identifyAnimationElement(target) {
  if (target.dataset.element) return target.dataset.element;
  const tag = target.tagName.toLowerCase();
  if (tag === "path") return "path";
  if (tag === "circle") return "circle";
  if (tag === "rect") return "rectangle";
  if (tag === "line") return "line";
  if (tag === "ellipse") return "ellipse";
  if (tag === "polygon") return "polygon";
  if (tag === "g") return "group";
  if (tag === "svg") return "svg";
  if (tag === "button") {
    const text = target.textContent?.trim();
    return text ? `button "${text}"` : "button";
  }
  if (tag === "input") {
    const type = target.getAttribute("type") || "text";
    return `input (${type})`;
  }
  if (tag === "span" || tag === "p" || tag === "label") {
    const text = target.textContent?.trim();
    if (text && text.length < 30) return `"${text}"`;
    return "text";
  }
  if (tag === "div") {
    const className = target.className;
    if (typeof className === "string" && className) {
      const words = className.split(/[\s_-]+/).map((c) => c.replace(/[A-Z0-9]{5,}.*$/, "")).filter((c) => c.length > 2 && !/^[a-z]{1,2}$/.test(c)).slice(0, 2);
      if (words.length > 0) {
        return words.join(" ");
      }
    }
    return "container";
  }
  return tag;
}
function getNearbyElements(element) {
  const parent = getParentElement(element);
  if (!parent) return "";
  const elementRoot = element.getRootNode();
  const children = elementRoot instanceof ShadowRoot && element.parentElement ? Array.from(element.parentElement.children) : Array.from(parent.children);
  const siblings = children.filter(
    (child) => child !== element && child instanceof HTMLElement
  );
  if (siblings.length === 0) return "";
  const siblingIds = siblings.slice(0, 4).map((sib) => {
    const tag = sib.tagName.toLowerCase();
    const className = sib.className;
    let cls = "";
    if (typeof className === "string" && className) {
      const meaningful = className.split(/\s+/).map((c) => c.replace(/[_][a-zA-Z0-9]{5,}.*$/, "")).find((c) => c.length > 2 && !/^[a-z]{1,2}$/.test(c));
      if (meaningful) cls = `.${meaningful}`;
    }
    if (tag === "button" || tag === "a") {
      const text = sib.textContent?.trim().slice(0, 15);
      if (text) return `${tag}${cls} "${text}"`;
    }
    return `${tag}${cls}`;
  });
  const parentTag = parent.tagName.toLowerCase();
  let parentId = parentTag;
  if (typeof parent.className === "string" && parent.className) {
    const parentCls = parent.className.split(/\s+/).map((c) => c.replace(/[_][a-zA-Z0-9]{5,}.*$/, "")).find((c) => c.length > 2 && !/^[a-z]{1,2}$/.test(c));
    if (parentCls) parentId = `.${parentCls}`;
  }
  const total = parent.children.length;
  const suffix = total > siblingIds.length + 1 ? ` (${total} total in ${parentId})` : "";
  return siblingIds.join(", ") + suffix;
}
function getElementClasses(target) {
  const className = target.className;
  if (typeof className !== "string" || !className) return "";
  const classes = className.split(/\s+/).filter((c) => c.length > 0).map((c) => {
    const match = c.match(/^([a-zA-Z][a-zA-Z0-9_-]*?)(?:_[a-zA-Z0-9]{5,})?$/);
    return match ? match[1] : c;
  }).filter((c, i, arr) => arr.indexOf(c) === i);
  return classes.join(", ");
}
var DEFAULT_STYLE_VALUES = /* @__PURE__ */ new Set([
  "none",
  "normal",
  "auto",
  "0px",
  "rgba(0, 0, 0, 0)",
  "transparent",
  "static",
  "visible"
]);
var TEXT_ELEMENTS = /* @__PURE__ */ new Set([
  "p",
  "span",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "label",
  "li",
  "td",
  "th",
  "blockquote",
  "figcaption",
  "caption",
  "legend",
  "dt",
  "dd",
  "pre",
  "code",
  "em",
  "strong",
  "b",
  "i",
  "a",
  "time",
  "cite",
  "q"
]);
var FORM_INPUT_ELEMENTS = /* @__PURE__ */ new Set(["input", "textarea", "select"]);
var MEDIA_ELEMENTS = /* @__PURE__ */ new Set(["img", "video", "canvas", "svg"]);
var CONTAINER_ELEMENTS = /* @__PURE__ */ new Set([
  "div",
  "section",
  "article",
  "nav",
  "header",
  "footer",
  "aside",
  "main",
  "ul",
  "ol",
  "form",
  "fieldset"
]);
function getDetailedComputedStyles(target) {
  if (typeof window === "undefined") return {};
  const styles = window.getComputedStyle(target);
  const result = {};
  const tag = target.tagName.toLowerCase();
  let properties;
  if (TEXT_ELEMENTS.has(tag)) {
    properties = ["color", "fontSize", "fontWeight", "fontFamily", "lineHeight"];
  } else if (tag === "button" || tag === "a" && target.getAttribute("role") === "button") {
    properties = ["backgroundColor", "color", "padding", "borderRadius", "fontSize"];
  } else if (FORM_INPUT_ELEMENTS.has(tag)) {
    properties = ["backgroundColor", "color", "padding", "borderRadius", "fontSize"];
  } else if (MEDIA_ELEMENTS.has(tag)) {
    properties = ["width", "height", "objectFit", "borderRadius"];
  } else if (CONTAINER_ELEMENTS.has(tag)) {
    properties = ["display", "padding", "margin", "gap", "backgroundColor"];
  } else {
    properties = ["color", "fontSize", "margin", "padding", "backgroundColor"];
  }
  for (const prop of properties) {
    const cssPropertyName = prop.replace(/([A-Z])/g, "-$1").toLowerCase();
    const value = styles.getPropertyValue(cssPropertyName);
    if (value && !DEFAULT_STYLE_VALUES.has(value)) {
      result[prop] = value;
    }
  }
  return result;
}
var FORENSIC_PROPERTIES = [
  // Colors
  "color",
  "backgroundColor",
  "borderColor",
  // Typography
  "fontSize",
  "fontWeight",
  "fontFamily",
  "lineHeight",
  "letterSpacing",
  "textAlign",
  // Box model
  "width",
  "height",
  "padding",
  "margin",
  "border",
  "borderRadius",
  // Layout & positioning
  "display",
  "position",
  "top",
  "right",
  "bottom",
  "left",
  "zIndex",
  "flexDirection",
  "justifyContent",
  "alignItems",
  "gap",
  // Visual effects
  "opacity",
  "visibility",
  "overflow",
  "boxShadow",
  // Transform
  "transform"
];
function getForensicComputedStyles(target) {
  if (typeof window === "undefined") return "";
  const styles = window.getComputedStyle(target);
  const parts = [];
  for (const prop of FORENSIC_PROPERTIES) {
    const cssPropertyName = prop.replace(/([A-Z])/g, "-$1").toLowerCase();
    const value = styles.getPropertyValue(cssPropertyName);
    if (value && !DEFAULT_STYLE_VALUES.has(value)) {
      parts.push(`${cssPropertyName}: ${value}`);
    }
  }
  return parts.join("; ");
}
function parseComputedStylesString(stylesStr) {
  if (!stylesStr) return void 0;
  const result = {};
  const parts = stylesStr.split(";").map((p) => p.trim()).filter(Boolean);
  for (const part of parts) {
    const colonIndex = part.indexOf(":");
    if (colonIndex > 0) {
      const key = part.slice(0, colonIndex).trim();
      const value = part.slice(colonIndex + 1).trim();
      if (key && value) {
        result[key] = value;
      }
    }
  }
  return Object.keys(result).length > 0 ? result : void 0;
}
function getAccessibilityInfo(target) {
  const parts = [];
  const role = target.getAttribute("role");
  const ariaLabel = target.getAttribute("aria-label");
  const ariaDescribedBy = target.getAttribute("aria-describedby");
  const tabIndex = target.getAttribute("tabindex");
  const ariaHidden = target.getAttribute("aria-hidden");
  if (role) parts.push(`role="${role}"`);
  if (ariaLabel) parts.push(`aria-label="${ariaLabel}"`);
  if (ariaDescribedBy) parts.push(`aria-describedby="${ariaDescribedBy}"`);
  if (tabIndex) parts.push(`tabindex=${tabIndex}`);
  if (ariaHidden === "true") parts.push("aria-hidden");
  const focusable = target.matches("a, button, input, select, textarea, [tabindex]");
  if (focusable) parts.push("focusable");
  return parts.join(", ");
}
function getFullElementPath(target) {
  const parts = [];
  let current = target;
  while (current && current.tagName.toLowerCase() !== "html") {
    const tag = current.tagName.toLowerCase();
    let identifier = tag;
    if (current.id) {
      identifier = `${tag}#${current.id}`;
    } else if (current.className && typeof current.className === "string") {
      const cls = current.className.split(/\s+/).map((c) => c.replace(/[_][a-zA-Z0-9]{5,}.*$/, "")).find((c) => c.length > 2);
      if (cls) identifier = `${tag}.${cls}`;
    }
    const nextParent = getParentElement(current);
    if (!current.parentElement && nextParent) {
      identifier = `\u27E8shadow\u27E9 ${identifier}`;
    }
    parts.unshift(identifier);
    current = nextParent;
  }
  return parts.join(" > ");
}

// src/core/utils/storage.ts
var STORAGE_PREFIX = "feedback-annotations-";
var DEFAULT_RETENTION_DAYS = 7;
function getStorageKey(pathname) {
  return `${STORAGE_PREFIX}${pathname}`;
}
function loadAnnotations(pathname) {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(getStorageKey(pathname));
    if (!stored) return [];
    const data = JSON.parse(stored);
    const cutoff = Date.now() - DEFAULT_RETENTION_DAYS * 24 * 60 * 60 * 1e3;
    return data.filter((a) => !a.timestamp || a.timestamp > cutoff);
  } catch {
    return [];
  }
}
function saveAnnotations(pathname, annotations) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(getStorageKey(pathname), JSON.stringify(annotations));
  } catch {
  }
}
function loadAllAnnotations() {
  const result = /* @__PURE__ */ new Map();
  if (typeof window === "undefined") return result;
  try {
    const cutoff = Date.now() - DEFAULT_RETENTION_DAYS * 24 * 60 * 60 * 1e3;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_PREFIX)) {
        const pathname = key.slice(STORAGE_PREFIX.length);
        const stored = localStorage.getItem(key);
        if (stored) {
          const data = JSON.parse(stored);
          const filtered = data.filter(
            (a) => !a.timestamp || a.timestamp > cutoff
          );
          if (filtered.length > 0) {
            result.set(pathname, filtered);
          }
        }
      }
    }
  } catch {
  }
  return result;
}
function saveAnnotationsWithSyncMarker(pathname, annotations, sessionId) {
  const marked = annotations.map((annotation) => ({
    ...annotation,
    _syncedTo: sessionId
  }));
  saveAnnotations(pathname, marked);
}
var SESSION_PREFIX = "agentation-session-";
function getSessionStorageKey(pathname) {
  return `${SESSION_PREFIX}${pathname}`;
}
function loadSessionId(pathname) {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(getSessionStorageKey(pathname));
  } catch {
    return null;
  }
}
function saveSessionId(pathname, sessionId) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(getSessionStorageKey(pathname), sessionId);
  } catch {
  }
}
function clearSessionId(pathname) {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(getSessionStorageKey(pathname));
  } catch {
  }
}
var TOOLBAR_HIDDEN_SESSION_KEY = `${SESSION_PREFIX}toolbar-hidden`;
function loadToolbarHidden() {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(TOOLBAR_HIDDEN_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}
function saveToolbarHidden(hidden) {
  if (typeof window === "undefined") return;
  try {
    if (hidden) sessionStorage.setItem(TOOLBAR_HIDDEN_SESSION_KEY, "1");
    else sessionStorage.removeItem(TOOLBAR_HIDDEN_SESSION_KEY);
  } catch {
  }
}

// src/core/utils/freeze-animations.ts
var EXCLUDE_ATTRS = [
  "data-feedback-toolbar",
  "data-annotation-popup",
  "data-annotation-marker"
];
var NOT_SELECTORS = EXCLUDE_ATTRS.flatMap((a) => [`:not([${a}])`, `:not([${a}] *)`]).join("");
var STYLE_ID = "feedback-freeze-styles";
var STATE_KEY = "__agentation_freeze";
function getState() {
  if (typeof window === "undefined") {
    return {
      frozen: false,
      installed: true,
      // prevent patching on server
      origSetTimeout: setTimeout,
      origSetInterval: setInterval,
      origRAF: (cb) => 0,
      pausedAnimations: [],
      frozenTimeoutQueue: [],
      frozenRAFQueue: []
    };
  }
  const w = window;
  if (!w[STATE_KEY]) {
    w[STATE_KEY] = {
      frozen: false,
      installed: false,
      origSetTimeout: null,
      origSetInterval: null,
      origRAF: null,
      pausedAnimations: [],
      frozenTimeoutQueue: [],
      frozenRAFQueue: []
    };
  }
  return w[STATE_KEY];
}
var _s = getState();
if (typeof window !== "undefined" && !_s.installed) {
  _s.origSetTimeout = window.setTimeout.bind(window);
  _s.origSetInterval = window.setInterval.bind(window);
  _s.origRAF = window.requestAnimationFrame.bind(window);
  window.setTimeout = (handler, timeout, ...args) => {
    if (typeof handler === "string") {
      return _s.origSetTimeout(handler, timeout);
    }
    return _s.origSetTimeout(
      (...a) => {
        if (_s.frozen) {
          _s.frozenTimeoutQueue.push(() => handler(...a));
        } else {
          handler(...a);
        }
      },
      timeout,
      ...args
    );
  };
  window.setInterval = (handler, timeout, ...args) => {
    if (typeof handler === "string") {
      return _s.origSetInterval(handler, timeout);
    }
    return _s.origSetInterval(
      (...a) => {
        if (!_s.frozen) handler(...a);
      },
      timeout,
      ...args
    );
  };
  window.requestAnimationFrame = (callback) => {
    return _s.origRAF((timestamp) => {
      if (_s.frozen) {
        _s.frozenRAFQueue.push(callback);
      } else {
        callback(timestamp);
      }
    });
  };
  _s.installed = true;
}
var originalSetTimeout = _s.origSetTimeout;
var originalSetInterval = _s.origSetInterval;
function isAgentationElement(el) {
  if (!el) return false;
  return EXCLUDE_ATTRS.some((attr) => !!el.closest?.(`[${attr}]`));
}
function freeze() {
  if (typeof document === "undefined") return;
  if (_s.frozen) return;
  _s.frozen = true;
  _s.frozenTimeoutQueue = [];
  _s.frozenRAFQueue = [];
  let style = document.getElementById(STYLE_ID);
  if (!style) {
    style = document.createElement("style");
    style.id = STYLE_ID;
  }
  style.textContent = `
    *${NOT_SELECTORS},
    *${NOT_SELECTORS}::before,
    *${NOT_SELECTORS}::after {
      animation-play-state: paused !important;
      transition: none !important;
    }
  `;
  document.head.appendChild(style);
  _s.pausedAnimations = [];
  try {
    document.getAnimations().forEach((anim) => {
      if (anim.playState !== "running") return;
      const target = anim.effect?.target;
      if (!isAgentationElement(target)) {
        anim.pause();
        _s.pausedAnimations.push(anim);
      }
    });
  } catch {
  }
  document.querySelectorAll("video").forEach((video) => {
    if (!video.paused) {
      video.dataset.wasPaused = "false";
      video.pause();
    }
  });
}
function unfreeze() {
  if (typeof document === "undefined") return;
  if (!_s.frozen) return;
  _s.frozen = false;
  const timeoutQueue = _s.frozenTimeoutQueue;
  _s.frozenTimeoutQueue = [];
  for (const cb of timeoutQueue) {
    _s.origSetTimeout(() => {
      if (_s.frozen) {
        _s.frozenTimeoutQueue.push(cb);
        return;
      }
      try {
        cb();
      } catch (e) {
        console.warn("[agentation] Error replaying queued timeout:", e);
      }
    }, 0);
  }
  const rafQueue = _s.frozenRAFQueue;
  _s.frozenRAFQueue = [];
  for (const cb of rafQueue) {
    _s.origRAF((ts) => {
      if (_s.frozen) {
        _s.frozenRAFQueue.push(cb);
        return;
      }
      cb(ts);
    });
  }
  for (const anim of _s.pausedAnimations) {
    try {
      anim.play();
    } catch (e) {
      console.warn("[agentation] Error resuming animation:", e);
    }
  }
  _s.pausedAnimations = [];
  document.getElementById(STYLE_ID)?.remove();
  document.querySelectorAll("video").forEach((video) => {
    if (video.dataset.wasPaused === "false") {
      video.play().catch(() => {
      });
      delete video.dataset.wasPaused;
    }
  });
}

// src/vue/utils/vue-detection.ts
var DEFAULT_SKIP_EXACT = /* @__PURE__ */ new Set([
  // Vue built-in components
  "RouterView",
  "RouterLink",
  "Transition",
  "TransitionGroup",
  "KeepAlive",
  "Suspense",
  "Teleport",
  "Fragment",
  "BaseTransition",
  // Internal components
  "Component",
  "Root",
  "App",
  // Nuxt internals
  "NuxtRoot",
  "NuxtPage",
  "NuxtLayout",
  "NuxtLoadingIndicator",
  "NuxtErrorBoundary",
  "ClientOnly",
  "ServerPlaceholder",
  // DevTools
  "HotReload",
  "Hot"
]);
var DEFAULT_SKIP_PATTERNS = [
  /Provider$/,
  // ThemeProvider, etc.
  /Router$/,
  // AppRouter, VueRouter internal
  /^(Inner|Outer)/,
  // InnerLayoutRouter, etc.
  /^Anonymous/,
  // Anonymous components
  /Context$/,
  // Context-like wrappers
  /^Hot(Reload)?$/,
  // HotReload
  /^(Dev|Vue)(Overlay|Tools|Root)/,
  // DevTools, VueDevOverlay
  /Overlay$/,
  // DevOverlay, ErrorOverlay
  /Handler$/,
  // ErrorHandler
  /^With[A-Z]/,
  // withAuth, withRouter (HOCs)
  /Wrapper$/,
  // Generic wrappers
  /^Root$/,
  // Generic Root component
  /Boundary$/,
  // ErrorBoundary
  /^__/
  // Double-underscore internal components
];
var DEFAULT_USER_PATTERNS = [
  /Page$/,
  // HomePage, InstallPage
  /View$/,
  // ListView, DetailView
  /Screen$/,
  // HomeScreen
  /Section$/,
  // HeroSection
  /Card$/,
  // ProductCard
  /List$/,
  // UserList
  /Item$/,
  // ListItem, MenuItem
  /Form$/,
  // LoginForm
  /Modal$/,
  // ConfirmModal
  /Dialog$/,
  // AlertDialog
  /Button$/,
  // SubmitButton
  /Nav$/,
  // SideNav, TopNav
  /Header$/,
  // PageHeader
  /Footer$/,
  // PageFooter
  /Layout$/,
  // MainLayout
  /Panel$/,
  // SidePanel
  /Tab$/,
  // SettingsTab
  /Menu$/
  // DropdownMenu
];
function resolveConfig(config) {
  const mode = config?.mode ?? "filtered";
  let skipExact = DEFAULT_SKIP_EXACT;
  if (config?.skipExact) {
    const additional = config.skipExact instanceof Set ? config.skipExact : new Set(config.skipExact);
    skipExact = /* @__PURE__ */ new Set([...DEFAULT_SKIP_EXACT, ...additional]);
  }
  return {
    maxComponents: config?.maxComponents ?? 6,
    maxDepth: config?.maxDepth ?? 30,
    mode,
    skipExact,
    skipPatterns: config?.skipPatterns ? [...DEFAULT_SKIP_PATTERNS, ...config.skipPatterns] : DEFAULT_SKIP_PATTERNS,
    userPatterns: config?.userPatterns ?? DEFAULT_USER_PATTERNS,
    filter: config?.filter
  };
}
function normalizeComponentName(name) {
  return name.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/([A-Z])([A-Z][a-z])/g, "$1-$2").toLowerCase();
}
function getAncestorClasses(element, maxDepth = 10) {
  const classes = /* @__PURE__ */ new Set();
  let current = element;
  let depth = 0;
  while (current && depth < maxDepth) {
    if (current.className && typeof current.className === "string") {
      current.className.split(/\s+/).forEach((cls) => {
        if (cls.length > 1) {
          const normalized = cls.replace(/[_][a-zA-Z0-9]{5,}.*$/, "").toLowerCase();
          if (normalized.length > 1) {
            classes.add(normalized);
          }
        }
      });
    }
    current = current.parentElement;
    depth++;
  }
  return classes;
}
function componentCorrelatesWithDOM(componentName, domClasses) {
  const normalized = normalizeComponentName(componentName);
  for (const cls of domClasses) {
    if (cls === normalized) return true;
    const componentWords = normalized.split("-").filter((w) => w.length > 2);
    const classWords = cls.split("-").filter((w) => w.length > 2);
    for (const cWord of componentWords) {
      for (const dWord of classWords) {
        if (cWord === dWord || cWord.includes(dWord) || dWord.includes(cWord)) {
          return true;
        }
      }
    }
  }
  return false;
}
function shouldIncludeComponent(name, depth, config, domClasses) {
  if (config.filter) {
    return config.filter(name, depth);
  }
  switch (config.mode) {
    case "all":
      return true;
    case "filtered":
      if (config.skipExact.has(name)) {
        return false;
      }
      if (config.skipPatterns.some((p) => p.test(name))) {
        return false;
      }
      return true;
    case "smart":
      if (config.skipExact.has(name)) {
        return false;
      }
      if (config.skipPatterns.some((p) => p.test(name))) {
        return false;
      }
      if (domClasses && componentCorrelatesWithDOM(name, domClasses)) {
        return true;
      }
      if (config.userPatterns.some((p) => p.test(name))) {
        return true;
      }
      return false;
    default:
      return true;
  }
}
var vueDetectionCache = null;
var componentCacheAll = /* @__PURE__ */ new WeakMap();
var componentCacheAllRef = { map: componentCacheAll };
function hasVueInstance(element) {
  return "__vueParentComponent" in element || "__vue_app__" in element;
}
function isVuePage() {
  if (vueDetectionCache !== null) {
    return vueDetectionCache;
  }
  if (typeof document === "undefined") {
    return false;
  }
  if (typeof window !== "undefined" && window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
    vueDetectionCache = true;
    return true;
  }
  if (document.body && hasVueInstance(document.body)) {
    vueDetectionCache = true;
    return true;
  }
  const commonRoots = ["#app", "#root", "[data-v-app]", "[data-server-rendered]"];
  for (const selector of commonRoots) {
    const el = document.querySelector(selector);
    if (el && (hasVueInstance(el) || "__vue_app__" in el)) {
      vueDetectionCache = true;
      return true;
    }
  }
  if (document.body) {
    for (const child of document.body.children) {
      if (hasVueInstance(child)) {
        vueDetectionCache = true;
        return true;
      }
    }
  }
  vueDetectionCache = false;
  return false;
}
function getVueInstance(element) {
  const instance = element.__vueParentComponent;
  return instance ?? null;
}
function findNearestVueInstance(element, maxDomDepth = 15) {
  let current = element;
  let depth = 0;
  while (current && depth < maxDomDepth) {
    const instance = getVueInstance(current);
    if (instance) {
      return instance;
    }
    current = current.parentElement;
    depth++;
  }
  return null;
}
function getComponentNameFromInstance(instance) {
  const type = instance.type;
  if (!type) return null;
  if (type.__name) return type.__name;
  if (type.name) return type.name;
  if (type.displayName) return type.displayName;
  if (type.__file) {
    return deriveNameFromFile(type.__file);
  }
  return null;
}
function deriveNameFromFile(filePath) {
  const parts = filePath.replace(/\\/g, "/").split("/");
  const fileName = parts[parts.length - 1];
  if (!fileName) return null;
  const name = fileName.replace(/\.\w+$/, "");
  if (name === "index" || name === "Index") {
    if (parts.length >= 2) {
      const dirName = parts[parts.length - 2];
      if (dirName && dirName !== "src" && dirName !== "components") {
        return dirName;
      }
    }
    return null;
  }
  return name || null;
}
function isMinifiedName(name) {
  if (name.length <= 2) return true;
  if (name.length <= 3 && name === name.toLowerCase()) return true;
  if (name === "_sfc_main" || name === "_sfc_render") return true;
  if (name.startsWith("_sfc_")) return true;
  if (name.startsWith("__default")) return true;
  return false;
}
function getVueComponentName(element, config) {
  const resolved = resolveConfig(config);
  const useCache = resolved.mode === "all";
  if (useCache) {
    const cached = componentCacheAllRef.map.get(element);
    if (cached !== void 0) {
      return cached;
    }
  }
  if (!isVuePage()) {
    const result2 = { path: null, components: [] };
    if (useCache) {
      componentCacheAllRef.map.set(element, result2);
    }
    return result2;
  }
  const domClasses = resolved.mode === "smart" ? getAncestorClasses(element) : void 0;
  const components = [];
  try {
    let instance = findNearestVueInstance(element);
    let depth = 0;
    while (instance && depth < resolved.maxDepth && components.length < resolved.maxComponents) {
      const name = getComponentNameFromInstance(instance);
      if (name && !isMinifiedName(name) && shouldIncludeComponent(name, depth, resolved, domClasses)) {
        components.push(name);
      }
      instance = instance.parent;
      depth++;
    }
  } catch {
    const result2 = { path: null, components: [] };
    if (useCache) {
      componentCacheAllRef.map.set(element, result2);
    }
    return result2;
  }
  if (components.length === 0) {
    const result2 = { path: null, components: [] };
    if (useCache) {
      componentCacheAllRef.map.set(element, result2);
    }
    return result2;
  }
  const path = components.slice().reverse().map((c) => `<${c}>`).join(" ");
  const result = { path, components };
  if (useCache) {
    componentCacheAllRef.map.set(element, result);
  }
  return result;
}

// src/vue/utils/vue-source-location.ts
function detectVueApp() {
  if (typeof window === "undefined") {
    return { isVue: false, isProduction: true };
  }
  const devToolsHook = window.__VUE_DEVTOOLS_GLOBAL_HOOK__;
  if (devToolsHook && typeof devToolsHook === "object") {
    const hook = devToolsHook;
    const apps = hook.apps;
    const hasApps = apps && apps.size > 0;
    const vueVersion = hook.Vue ? hook.Vue.version : void 0;
    const isProd = typeof window.__VUE_PROD_DEVTOOLS__ === "undefined";
    if (hasApps || vueVersion) {
      return {
        isVue: true,
        version: vueVersion || "3.x",
        isProduction: false
        // DevTools hook with apps means dev mode
      };
    }
  }
  const commonRoots = ["#app", "#root", "[data-v-app]"];
  for (const selector of commonRoots) {
    const el = document.querySelector(selector);
    if (el && "__vue_app__" in el) {
      const vueApp = el.__vue_app__;
      const version = vueApp?.version;
      return {
        isVue: true,
        version: version || "3.x",
        // If __vue_app__ exists but no devtools hook, likely production
        isProduction: !devToolsHook
      };
    }
  }
  if (document.body) {
    for (const child of document.body.children) {
      if ("__vueParentComponent" in child) {
        return {
          isVue: true,
          version: "3.x",
          isProduction: !devToolsHook
        };
      }
    }
  }
  return { isVue: false, isProduction: true };
}
function getInstanceFromElement(element) {
  const instance = element.__vueParentComponent;
  return instance ?? null;
}
function findNearestInstance(element, maxDomDepth = 15) {
  let current = element;
  let depth = 0;
  while (current && depth < maxDomDepth) {
    const instance = getInstanceFromElement(current);
    if (instance) {
      return instance;
    }
    current = current.parentElement;
    depth++;
  }
  return null;
}
function getComponentName(instance) {
  if (!instance.type) return null;
  return instance.type.__name || instance.type.name || instance.type.displayName || null;
}
function findFileSource(instance, maxDepth = 50) {
  let current = instance;
  let depth = 0;
  while (current && depth < maxDepth) {
    if (current.type?.__file) {
      return {
        fileName: current.type.__file,
        componentName: getComponentName(current)
      };
    }
    current = current.parent;
    depth++;
  }
  return null;
}
function getSourceLocation(element) {
  const vueInfo = detectVueApp();
  if (!vueInfo.isVue) {
    return {
      found: false,
      reason: "not-vue-app",
      isVueApp: false,
      isProduction: true
    };
  }
  if (vueInfo.isProduction) {
    return {
      found: false,
      reason: "production-build",
      isVueApp: true,
      isProduction: true
    };
  }
  const instance = findNearestInstance(element);
  if (!instance) {
    return {
      found: false,
      reason: "no-instance",
      isVueApp: true,
      isProduction: false
    };
  }
  const fileInfo = findFileSource(instance);
  if (!fileInfo) {
    return {
      found: false,
      reason: "no-file-info",
      isVueApp: true,
      isProduction: false
    };
  }
  return {
    found: true,
    source: {
      fileName: fileInfo.fileName,
      // Vue does not expose line numbers at the DOM level
      lineNumber: 1,
      columnNumber: void 0,
      componentName: fileInfo.componentName || void 0,
      vueVersion: vueInfo.version
    },
    isVueApp: true,
    isProduction: false
  };
}

// src/core/styles/page-toolbar.module.scss
var css = 'svg[fill=none] {\n  fill: none !important;\n}\n\n.page-toolbar-module__toolbar___sBwIb :where(button, input, select, textarea, label) {\n  background: unset;\n  border: unset;\n  border-radius: unset;\n  padding: unset;\n  margin: unset;\n  color: unset;\n  font: unset;\n  letter-spacing: unset;\n  text-transform: unset;\n  text-decoration: unset;\n  box-shadow: unset;\n  outline: unset;\n}\n\n@keyframes page-toolbar-module__toolbarEnter___-WEE5 {\n  from {\n    opacity: 0;\n    transform: scale(0.5) rotate(90deg);\n  }\n  to {\n    opacity: 1;\n    transform: scale(1) rotate(0deg);\n  }\n}\n@keyframes page-toolbar-module__badgeEnter___tPtKD {\n  from {\n    opacity: 0;\n    transform: scale(0);\n  }\n  to {\n    opacity: 1;\n    transform: scale(1);\n  }\n}\n@keyframes page-toolbar-module__scaleIn___7i9nB {\n  from {\n    opacity: 0;\n    transform: scale(0.85);\n  }\n  to {\n    opacity: 1;\n    transform: scale(1);\n  }\n}\n@keyframes page-toolbar-module__scaleOut___Y1Ztx {\n  from {\n    opacity: 1;\n    transform: scale(1);\n  }\n  to {\n    opacity: 0;\n    transform: scale(0.85);\n  }\n}\n@keyframes page-toolbar-module__slideUp___496yM {\n  from {\n    opacity: 0;\n    transform: scale(0.85) translateY(8px);\n  }\n  to {\n    opacity: 1;\n    transform: scale(1) translateY(0);\n  }\n}\n@keyframes page-toolbar-module__slideDown___PRK4O {\n  from {\n    opacity: 1;\n    transform: scale(1) translateY(0);\n  }\n  to {\n    opacity: 0;\n    transform: scale(0.85) translateY(8px);\n  }\n}\n@keyframes page-toolbar-module__markerIn___A1Wxv {\n  0% {\n    opacity: 0;\n    transform: translate(-50%, -50%) scale(0.3);\n  }\n  100% {\n    opacity: 1;\n    transform: translate(-50%, -50%) scale(1);\n  }\n}\n@keyframes page-toolbar-module__markerOut___h-kr9 {\n  0% {\n    opacity: 1;\n    transform: translate(-50%, -50%) scale(1);\n  }\n  100% {\n    opacity: 0;\n    transform: translate(-50%, -50%) scale(0.3);\n  }\n}\n@keyframes page-toolbar-module__fadeIn___RJvi3 {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes page-toolbar-module__fadeOut___dAA6W {\n  from {\n    opacity: 1;\n  }\n  to {\n    opacity: 0;\n  }\n}\n@keyframes page-toolbar-module__tooltipIn___jMmfJ {\n  from {\n    opacity: 0;\n    transform: translateX(-50%) translateY(2px) scale(0.891);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(-50%) translateY(0) scale(0.909);\n  }\n}\n@keyframes page-toolbar-module__hoverHighlightIn___f6l-B {\n  from {\n    opacity: 0;\n    transform: scale(0.98);\n  }\n  to {\n    opacity: 1;\n    transform: scale(1);\n  }\n}\n@keyframes page-toolbar-module__hoverTooltipIn___d-9u5 {\n  from {\n    opacity: 0;\n    transform: scale(0.95) translateY(4px);\n  }\n  to {\n    opacity: 1;\n    transform: scale(1) translateY(0);\n  }\n}\n@keyframes page-toolbar-module__settingsPanelIn___YMAX5 {\n  from {\n    opacity: 0;\n    transform: translateY(10px) scale(0.95);\n    filter: blur(5px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0) scale(1);\n    filter: blur(0px);\n  }\n}\n@keyframes page-toolbar-module__settingsPanelOut___fv1FI {\n  from {\n    opacity: 1;\n    transform: translateY(0) scale(1);\n    filter: blur(0px);\n  }\n  to {\n    opacity: 0;\n    transform: translateY(20px) scale(0.95);\n    filter: blur(5px);\n  }\n}\n@keyframes page-toolbar-module__toolbarHide___Uhyz- {\n  from {\n    opacity: 1;\n    transform: scale(1);\n  }\n  to {\n    opacity: 0;\n    transform: scale(0.8);\n  }\n}\n.page-toolbar-module__toolbar___sBwIb {\n  position: fixed;\n  bottom: 1.25rem;\n  right: 1.25rem;\n  width: 297px;\n  z-index: 100000;\n  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n  pointer-events: none;\n  transition: left 0s, top 0s, right 0s, bottom 0s;\n}\n\n.page-toolbar-module__toolbarContainer___x5R-d {\n  user-select: none;\n  margin-left: auto;\n  align-self: flex-end;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: #1a1a1a;\n  color: #fff;\n  border: none;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.1);\n  pointer-events: auto;\n  cursor: grab;\n  transition: width 0.4s cubic-bezier(0.19, 1, 0.22, 1), transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);\n}\n.page-toolbar-module__toolbarContainer___x5R-d.page-toolbar-module__dragging___UIy-x {\n  transition: width 0.4s cubic-bezier(0.19, 1, 0.22, 1);\n  cursor: grabbing;\n}\n.page-toolbar-module__toolbarContainer___x5R-d.page-toolbar-module__entrance___gAJff {\n  animation: page-toolbar-module__toolbarEnter___-WEE5 0.5s cubic-bezier(0.34, 1.2, 0.64, 1) forwards;\n}\n.page-toolbar-module__toolbarContainer___x5R-d.page-toolbar-module__hiding___mdJIe {\n  animation: page-toolbar-module__toolbarHide___Uhyz- 0.4s cubic-bezier(0.4, 0, 1, 1) forwards;\n  pointer-events: none;\n}\n.page-toolbar-module__toolbarContainer___x5R-d.page-toolbar-module__collapsed___Ep0vF {\n  width: 44px;\n  height: 44px;\n  border-radius: 22px;\n  padding: 0;\n  cursor: pointer;\n}\n.page-toolbar-module__toolbarContainer___x5R-d.page-toolbar-module__collapsed___Ep0vF svg {\n  margin-top: -1px;\n}\n.page-toolbar-module__toolbarContainer___x5R-d.page-toolbar-module__collapsed___Ep0vF:hover {\n  background: #2a2a2a;\n}\n.page-toolbar-module__toolbarContainer___x5R-d.page-toolbar-module__collapsed___Ep0vF:active {\n  transform: scale(0.95);\n}\n.page-toolbar-module__toolbarContainer___x5R-d.page-toolbar-module__expanded___HKRxf {\n  height: 44px;\n  border-radius: 1.5rem;\n  padding: 0.375rem;\n  width: 257px;\n}\n.page-toolbar-module__toolbarContainer___x5R-d.page-toolbar-module__expanded___HKRxf.page-toolbar-module__serverConnected___AgpbE {\n  width: 297px;\n}\n\n.page-toolbar-module__toggleContent___uFPh5 {\n  position: absolute;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: opacity 0.1s cubic-bezier(0.19, 1, 0.22, 1);\n}\n.page-toolbar-module__toggleContent___uFPh5.page-toolbar-module__visible___0P5dl {\n  opacity: 1;\n  visibility: visible;\n  pointer-events: auto;\n}\n.page-toolbar-module__toggleContent___uFPh5.page-toolbar-module__hidden___rLRX- {\n  opacity: 0;\n  pointer-events: none;\n}\n\n.page-toolbar-module__controlsContent___3c09P {\n  display: flex;\n  align-items: center;\n  gap: 0.375rem;\n  transition: filter 0.8s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.8s cubic-bezier(0.19, 1, 0.22, 1), transform 0.6s cubic-bezier(0.19, 1, 0.22, 1);\n}\n.page-toolbar-module__controlsContent___3c09P.page-toolbar-module__visible___0P5dl {\n  opacity: 1;\n  filter: blur(0px);\n  transform: scale(1);\n  visibility: visible;\n  pointer-events: auto;\n}\n.page-toolbar-module__controlsContent___3c09P.page-toolbar-module__hidden___rLRX- {\n  pointer-events: none;\n  opacity: 0;\n  filter: blur(10px);\n  transform: scale(0.4);\n}\n\n.page-toolbar-module__badge___d2Sgd {\n  position: absolute;\n  top: -13px;\n  right: -13px;\n  user-select: none;\n  min-width: 18px;\n  height: 18px;\n  padding: 0 5px;\n  border-radius: 9px;\n  background: #3c82f7;\n  color: white;\n  font-size: 0.625rem;\n  font-weight: 600;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.04);\n  opacity: 1;\n  transition: transform 0.3s ease, opacity 0.2s ease;\n  transform: scale(1);\n}\n.page-toolbar-module__badge___d2Sgd.page-toolbar-module__fadeOut___dAA6W {\n  opacity: 0;\n  transform: scale(0);\n  pointer-events: none;\n}\n.page-toolbar-module__badge___d2Sgd.page-toolbar-module__entrance___gAJff {\n  animation: page-toolbar-module__badgeEnter___tPtKD 0.3s cubic-bezier(0.34, 1.2, 0.64, 1) 0.4s both;\n}\n\n.page-toolbar-module__controlButton___ppLrv {\n  position: relative;\n  cursor: pointer !important;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 34px;\n  height: 34px;\n  border-radius: 50%;\n  border: none;\n  background: transparent;\n  color: rgba(255, 255, 255, 0.85);\n  transition: background-color 0.15s ease, color 0.15s ease, transform 0.1s ease, opacity 0.2s ease;\n}\n.page-toolbar-module__controlButton___ppLrv:hover:not(:disabled):not([data-active=true]):not([data-failed=true]):not([data-auto-sync=true]):not([data-error=true]):not([data-no-hover=true]) {\n  background: rgba(255, 255, 255, 0.12);\n  color: #fff;\n}\n.page-toolbar-module__controlButton___ppLrv:active:not(:disabled) {\n  transform: scale(0.92);\n}\n.page-toolbar-module__controlButton___ppLrv:disabled {\n  opacity: 0.35;\n  cursor: not-allowed;\n}\n.page-toolbar-module__controlButton___ppLrv[data-active=true] {\n  color: #3c82f7;\n  background: rgba(60, 130, 247, 0.25);\n}\n.page-toolbar-module__controlButton___ppLrv[data-error=true] {\n  color: #ff3b30;\n  background: rgba(255, 59, 48, 0.25);\n}\n.page-toolbar-module__controlButton___ppLrv[data-danger]:hover:not(:disabled):not([data-active=true]):not([data-failed=true]) {\n  background: rgba(255, 59, 48, 0.25);\n  color: #ff3b30;\n}\n.page-toolbar-module__controlButton___ppLrv[data-no-hover=true], .page-toolbar-module__controlButton___ppLrv.page-toolbar-module__statusShowing___F-Tku {\n  cursor: default !important;\n  pointer-events: none;\n  background: transparent !important;\n}\n.page-toolbar-module__controlButton___ppLrv[data-auto-sync=true] {\n  color: #34c759;\n  background: transparent;\n  cursor: default;\n}\n.page-toolbar-module__controlButton___ppLrv[data-failed=true] {\n  color: #ff3b30;\n  background: rgba(255, 59, 48, 0.25);\n}\n\n.page-toolbar-module__buttonBadge___ID4id {\n  position: absolute;\n  top: 0px;\n  right: 0px;\n  min-width: 16px;\n  height: 16px;\n  padding: 0 4px;\n  border-radius: 8px;\n  background: #3c82f7;\n  color: white;\n  font-size: 0.625rem;\n  font-weight: 600;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  box-shadow: 0 0 0 2px #1a1a1a, 0 1px 3px rgba(0, 0, 0, 0.2);\n  pointer-events: none;\n}\n.page-toolbar-module__buttonBadge___ID4id.page-toolbar-module__light___OkEHy {\n  box-shadow: 0 0 0 2px #fff, 0 1px 3px rgba(0, 0, 0, 0.2);\n}\n\n@keyframes page-toolbar-module__mcpIndicatorPulseConnected___0ghgC {\n  0%, 100% {\n    box-shadow: 0 0 0 0 rgba(52, 199, 89, 0.5);\n  }\n  50% {\n    box-shadow: 0 0 0 5px rgba(52, 199, 89, 0);\n  }\n}\n@keyframes page-toolbar-module__mcpIndicatorPulseConnecting___kYfpu {\n  0%, 100% {\n    box-shadow: 0 0 0 0 rgba(245, 166, 35, 0.5);\n  }\n  50% {\n    box-shadow: 0 0 0 5px rgba(245, 166, 35, 0);\n  }\n}\n.page-toolbar-module__mcpIndicator___KqlFK {\n  position: absolute;\n  top: 3px;\n  right: 3px;\n  width: 6px;\n  height: 6px;\n  border-radius: 50%;\n  pointer-events: none;\n  transition: background 0.3s ease, opacity 0.15s ease, transform 0.15s ease;\n  opacity: 1;\n  transform: scale(1);\n}\n.page-toolbar-module__mcpIndicator___KqlFK.page-toolbar-module__connected___bd4g7 {\n  background: #34c759;\n  animation: page-toolbar-module__mcpIndicatorPulseConnected___0ghgC 2.5s ease-in-out infinite;\n}\n.page-toolbar-module__mcpIndicator___KqlFK.page-toolbar-module__connecting___l9kzm {\n  background: #f5a623;\n  animation: page-toolbar-module__mcpIndicatorPulseConnecting___kYfpu 1.5s ease-in-out infinite;\n}\n.page-toolbar-module__mcpIndicator___KqlFK.page-toolbar-module__hidden___rLRX- {\n  opacity: 0;\n  transform: scale(0);\n  animation: none;\n}\n\n@keyframes page-toolbar-module__connectionPulse___Mb8JU {\n  0%, 100% {\n    opacity: 1;\n    transform: scale(1);\n  }\n  50% {\n    opacity: 0.6;\n    transform: scale(0.9);\n  }\n}\n.page-toolbar-module__connectionIndicatorWrapper___xmyKM {\n  width: 8px;\n  height: 34px;\n  margin-left: 6px;\n  margin-right: 6px;\n}\n\n.page-toolbar-module__connectionIndicator___0gwMz {\n  position: relative;\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  opacity: 0;\n  transition: opacity 0.3s ease, background 0.3s ease;\n  cursor: default;\n}\n\n.page-toolbar-module__connectionIndicatorVisible___L-bAC {\n  opacity: 1;\n}\n\n.page-toolbar-module__connectionIndicatorConnected___I2ODc {\n  background: #34c759;\n  animation: page-toolbar-module__connectionPulse___Mb8JU 2.5s ease-in-out infinite;\n}\n\n.page-toolbar-module__connectionIndicatorDisconnected___s2kSH {\n  background: #ff3b30;\n  animation: none;\n}\n\n.page-toolbar-module__connectionIndicatorConnecting___IjG3P {\n  background: #f59e0b;\n  animation: page-toolbar-module__connectionPulse___Mb8JU 1s ease-in-out infinite;\n}\n\n.page-toolbar-module__buttonWrapper___Z2afJ {\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.page-toolbar-module__buttonWrapper___Z2afJ:hover .page-toolbar-module__buttonTooltip___AetOW {\n  opacity: 1;\n  visibility: visible;\n  transform: translateX(-50%) scale(1);\n  transition-delay: 0.85s;\n}\n.page-toolbar-module__buttonWrapper___Z2afJ:has(.page-toolbar-module__controlButton___ppLrv:disabled):hover .page-toolbar-module__buttonTooltip___AetOW {\n  opacity: 0;\n  visibility: hidden;\n}\n\n.page-toolbar-module__tooltipsInSession___DbxC9 .page-toolbar-module__buttonWrapper___Z2afJ:hover .page-toolbar-module__buttonTooltip___AetOW {\n  transition-delay: 0s;\n}\n\n.page-toolbar-module__sendButtonWrapper___naR5s {\n  width: 0;\n  opacity: 0;\n  overflow: hidden;\n  pointer-events: none;\n  margin-left: -0.375rem;\n  transition: width 0.4s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.3s cubic-bezier(0.19, 1, 0.22, 1), margin 0.4s cubic-bezier(0.19, 1, 0.22, 1);\n}\n.page-toolbar-module__sendButtonWrapper___naR5s .page-toolbar-module__controlButton___ppLrv {\n  transform: scale(0.8);\n  transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);\n}\n.page-toolbar-module__sendButtonWrapper___naR5s.page-toolbar-module__sendButtonVisible___3ItIp {\n  width: 34px;\n  opacity: 1;\n  overflow: visible;\n  pointer-events: auto;\n  margin-left: 0;\n}\n.page-toolbar-module__sendButtonWrapper___naR5s.page-toolbar-module__sendButtonVisible___3ItIp .page-toolbar-module__controlButton___ppLrv {\n  transform: scale(1);\n}\n\n.page-toolbar-module__buttonTooltip___AetOW {\n  position: absolute;\n  bottom: calc(100% + 14px);\n  left: 50%;\n  transform: translateX(-50%) scale(0.95);\n  padding: 6px 10px;\n  background: #1a1a1a;\n  color: rgba(255, 255, 255, 0.9);\n  font-size: 12px;\n  font-weight: 500;\n  border-radius: 8px;\n  white-space: nowrap;\n  opacity: 0;\n  visibility: hidden;\n  pointer-events: none;\n  z-index: 100001;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);\n  transition: opacity 0.135s ease, transform 0.135s ease, visibility 0.135s ease;\n}\n.page-toolbar-module__buttonTooltip___AetOW::after {\n  content: "";\n  position: absolute;\n  top: calc(100% - 4px);\n  left: 50%;\n  transform: translateX(-50%) rotate(45deg);\n  width: 8px;\n  height: 8px;\n  background: #1a1a1a;\n  border-radius: 0 0 2px 0;\n}\n\n.page-toolbar-module__shortcut___dVvrO {\n  margin-left: 4px;\n  opacity: 0.5;\n}\n\n.page-toolbar-module__tooltipBelow___4zzOD .page-toolbar-module__buttonTooltip___AetOW {\n  bottom: auto;\n  top: calc(100% + 14px);\n  transform: translateX(-50%) scale(0.95);\n}\n.page-toolbar-module__tooltipBelow___4zzOD .page-toolbar-module__buttonTooltip___AetOW::after {\n  top: -4px;\n  bottom: auto;\n  border-radius: 2px 0 0 0;\n}\n\n.page-toolbar-module__tooltipBelow___4zzOD .page-toolbar-module__buttonWrapper___Z2afJ:hover .page-toolbar-module__buttonTooltip___AetOW {\n  transform: translateX(-50%) scale(1);\n}\n\n.page-toolbar-module__tooltipsHidden___1NAj0 .page-toolbar-module__buttonTooltip___AetOW {\n  opacity: 0 !important;\n  visibility: hidden !important;\n  transition: none !important;\n}\n\n.page-toolbar-module__tooltipVisible___Z9IMh,\n.page-toolbar-module__tooltipsHidden___1NAj0 .page-toolbar-module__tooltipVisible___Z9IMh {\n  opacity: 1 !important;\n  visibility: visible !important;\n  transform: translateX(-50%) scale(1) !important;\n  transition-delay: 0s !important;\n}\n\n.page-toolbar-module__buttonWrapperAlignLeft___fQ8G3 .page-toolbar-module__buttonTooltip___AetOW {\n  left: 50%;\n  transform: translateX(-12px) scale(0.95);\n}\n.page-toolbar-module__buttonWrapperAlignLeft___fQ8G3 .page-toolbar-module__buttonTooltip___AetOW::after {\n  left: 16px;\n}\n.page-toolbar-module__buttonWrapperAlignLeft___fQ8G3:hover .page-toolbar-module__buttonTooltip___AetOW {\n  transform: translateX(-12px) scale(1);\n}\n\n.page-toolbar-module__tooltipBelow___4zzOD .page-toolbar-module__buttonWrapperAlignLeft___fQ8G3 .page-toolbar-module__buttonTooltip___AetOW {\n  transform: translateX(-12px) scale(0.95);\n}\n.page-toolbar-module__tooltipBelow___4zzOD .page-toolbar-module__buttonWrapperAlignLeft___fQ8G3:hover .page-toolbar-module__buttonTooltip___AetOW {\n  transform: translateX(-12px) scale(1);\n}\n\n.page-toolbar-module__buttonWrapperAlignRight___mSVi3 .page-toolbar-module__buttonTooltip___AetOW {\n  left: 50%;\n  transform: translateX(calc(-100% + 12px)) scale(0.95);\n}\n.page-toolbar-module__buttonWrapperAlignRight___mSVi3 .page-toolbar-module__buttonTooltip___AetOW::after {\n  left: auto;\n  right: 8px;\n}\n.page-toolbar-module__buttonWrapperAlignRight___mSVi3:hover .page-toolbar-module__buttonTooltip___AetOW {\n  transform: translateX(calc(-100% + 12px)) scale(1);\n}\n\n.page-toolbar-module__tooltipBelow___4zzOD .page-toolbar-module__buttonWrapperAlignRight___mSVi3 .page-toolbar-module__buttonTooltip___AetOW {\n  transform: translateX(calc(-100% + 12px)) scale(0.95);\n}\n.page-toolbar-module__tooltipBelow___4zzOD .page-toolbar-module__buttonWrapperAlignRight___mSVi3:hover .page-toolbar-module__buttonTooltip___AetOW {\n  transform: translateX(calc(-100% + 12px)) scale(1);\n}\n\n.page-toolbar-module__divider___cL2DV {\n  width: 1px;\n  height: 12px;\n  background: rgba(255, 255, 255, 0.15);\n  margin: 0 0.125rem;\n}\n\n.page-toolbar-module__overlay___Zg2Lx {\n  position: fixed;\n  inset: 0;\n  z-index: 99997;\n  pointer-events: none;\n}\n.page-toolbar-module__overlay___Zg2Lx > * {\n  pointer-events: auto;\n}\n\n.page-toolbar-module__hoverHighlight___x-hcw {\n  position: fixed;\n  border: 2px solid rgba(60, 130, 247, 0.5);\n  border-radius: 4px;\n  pointer-events: none !important;\n  background: rgba(60, 130, 247, 0.04);\n  box-sizing: border-box;\n  will-change: opacity;\n  contain: layout style;\n}\n.page-toolbar-module__hoverHighlight___x-hcw.page-toolbar-module__enter___MokYX {\n  animation: page-toolbar-module__hoverHighlightIn___f6l-B 0.12s ease-out forwards;\n}\n\n.page-toolbar-module__multiSelectOutline___GtfT4 {\n  position: fixed;\n  border: 2px dashed rgba(52, 199, 89, 0.6);\n  border-radius: 4px;\n  pointer-events: none !important;\n  background: rgba(52, 199, 89, 0.05);\n  box-sizing: border-box;\n  will-change: opacity;\n}\n.page-toolbar-module__multiSelectOutline___GtfT4.page-toolbar-module__enter___MokYX {\n  animation: page-toolbar-module__fadeIn___RJvi3 0.15s ease-out forwards;\n}\n.page-toolbar-module__multiSelectOutline___GtfT4.page-toolbar-module__exit___6NIVt {\n  animation: page-toolbar-module__fadeOut___dAA6W 0.15s ease-out forwards;\n}\n\n.page-toolbar-module__singleSelectOutline___lDMOt {\n  position: fixed;\n  border: 2px solid rgba(60, 130, 247, 0.6);\n  border-radius: 4px;\n  pointer-events: none !important;\n  background: rgba(60, 130, 247, 0.05);\n  box-sizing: border-box;\n  will-change: opacity;\n}\n.page-toolbar-module__singleSelectOutline___lDMOt.page-toolbar-module__enter___MokYX {\n  animation: page-toolbar-module__fadeIn___RJvi3 0.15s ease-out forwards;\n}\n.page-toolbar-module__singleSelectOutline___lDMOt.page-toolbar-module__exit___6NIVt {\n  animation: page-toolbar-module__fadeOut___dAA6W 0.15s ease-out forwards;\n}\n\n.page-toolbar-module__hoverTooltip___YHQxN {\n  position: fixed;\n  font-size: 0.6875rem;\n  font-weight: 500;\n  color: #fff;\n  background: rgba(0, 0, 0, 0.85);\n  padding: 0.35rem 0.6rem;\n  border-radius: 0.375rem;\n  pointer-events: none !important;\n  white-space: nowrap;\n  max-width: 280px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.page-toolbar-module__hoverTooltip___YHQxN.page-toolbar-module__enter___MokYX {\n  animation: page-toolbar-module__hoverTooltipIn___d-9u5 0.1s ease-out forwards;\n}\n\n.page-toolbar-module__hoverReactPath___gsH0- {\n  font-size: 0.625rem;\n  color: rgba(255, 255, 255, 0.6);\n  margin-bottom: 0.15rem;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.page-toolbar-module__hoverElementName___9Wxnf {\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.page-toolbar-module__markersLayer___hXKyR {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 0;\n  z-index: 99998;\n  pointer-events: none;\n}\n.page-toolbar-module__markersLayer___hXKyR > * {\n  pointer-events: auto;\n}\n\n.page-toolbar-module__fixedMarkersLayer___0QARr {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 99998;\n  pointer-events: none;\n}\n.page-toolbar-module__fixedMarkersLayer___0QARr > * {\n  pointer-events: auto;\n}\n\n.page-toolbar-module__marker___c0doQ {\n  position: absolute;\n  width: 22px;\n  height: 22px;\n  background: #3c82f7;\n  color: white;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 0.6875rem;\n  font-weight: 600;\n  transform: translate(-50%, -50%) scale(1);\n  opacity: 1;\n  cursor: pointer;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(0, 0, 0, 0.04);\n  user-select: none;\n  will-change: transform, opacity;\n  contain: layout style;\n  z-index: 1;\n}\n.page-toolbar-module__marker___c0doQ:hover {\n  z-index: 2;\n}\n.page-toolbar-module__marker___c0doQ:not(.page-toolbar-module__enter___MokYX):not(.page-toolbar-module__exit___6NIVt):not(.page-toolbar-module__clearing___aXE1v) {\n  transition: background-color 0.15s ease, transform 0.1s ease;\n}\n.page-toolbar-module__marker___c0doQ.page-toolbar-module__enter___MokYX {\n  animation: page-toolbar-module__markerIn___A1Wxv 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;\n}\n.page-toolbar-module__marker___c0doQ.page-toolbar-module__exit___6NIVt {\n  animation: page-toolbar-module__markerOut___h-kr9 0.2s ease-out both;\n  pointer-events: none;\n}\n.page-toolbar-module__marker___c0doQ.page-toolbar-module__clearing___aXE1v {\n  animation: page-toolbar-module__markerOut___h-kr9 0.15s ease-out both;\n  pointer-events: none;\n}\n.page-toolbar-module__marker___c0doQ:not(.page-toolbar-module__enter___MokYX):not(.page-toolbar-module__exit___6NIVt):not(.page-toolbar-module__clearing___aXE1v):hover {\n  transform: translate(-50%, -50%) scale(1.1);\n}\n.page-toolbar-module__marker___c0doQ.page-toolbar-module__pending___Ln-lV {\n  position: fixed;\n  background: #3c82f7;\n}\n.page-toolbar-module__marker___c0doQ.page-toolbar-module__fixed___U4mr3 {\n  position: fixed;\n}\n.page-toolbar-module__marker___c0doQ.page-toolbar-module__multiSelect___Z-PYZ {\n  background: #34c759;\n  width: 26px;\n  height: 26px;\n  border-radius: 6px;\n  font-size: 0.75rem;\n}\n.page-toolbar-module__marker___c0doQ.page-toolbar-module__multiSelect___Z-PYZ.page-toolbar-module__pending___Ln-lV {\n  background: #34c759;\n}\n.page-toolbar-module__marker___c0doQ.page-toolbar-module__hovered___2HwnW {\n  background: #ff3b30;\n}\n\n.page-toolbar-module__renumber___rVqlG {\n  display: block;\n  animation: page-toolbar-module__renumberRoll___zbFKe 0.2s ease-out;\n}\n\n@keyframes page-toolbar-module__renumberRoll___zbFKe {\n  0% {\n    transform: translateX(-40%);\n    opacity: 0;\n  }\n  100% {\n    transform: translateX(0);\n    opacity: 1;\n  }\n}\n.page-toolbar-module__markerTooltip___oBqwC {\n  position: absolute;\n  top: calc(100% + 10px);\n  left: 50%;\n  transform: translateX(-50%) scale(0.909);\n  z-index: 100002;\n  background: #1a1a1a;\n  padding: 8px 0.75rem;\n  border-radius: 0.75rem;\n  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n  font-weight: 400;\n  color: #fff;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08);\n  min-width: 120px;\n  max-width: 200px;\n  pointer-events: none;\n  cursor: default;\n}\n.page-toolbar-module__markerTooltip___oBqwC.page-toolbar-module__enter___MokYX {\n  animation: page-toolbar-module__tooltipIn___jMmfJ 0.1s ease-out forwards;\n}\n\n.page-toolbar-module__markerQuote___9Qfoa {\n  display: block;\n  font-size: 12px;\n  font-style: italic;\n  color: rgba(255, 255, 255, 0.6);\n  margin-bottom: 0.3125rem;\n  line-height: 1.4;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.page-toolbar-module__markerNote___HOmyF {\n  display: block;\n  font-size: 13px;\n  font-weight: 400;\n  line-height: 1.4;\n  color: #fff;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  padding-bottom: 2px;\n}\n\n.page-toolbar-module__markerHint___rUwXR {\n  display: block;\n  font-size: 0.625rem;\n  font-weight: 400;\n  color: rgba(255, 255, 255, 0.6);\n  margin-top: 0.375rem;\n  white-space: nowrap;\n}\n\n.page-toolbar-module__settingsPanel___C28ZP {\n  position: absolute;\n  right: 5px;\n  bottom: calc(100% + 0.5rem);\n  z-index: 1;\n  overflow: hidden;\n  background: #1c1c1c;\n  border-radius: 1rem;\n  padding: 13px 0 16px;\n  min-width: 205px;\n  cursor: default;\n  opacity: 1;\n  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.04);\n  transition: background 0.25s ease, box-shadow 0.25s ease;\n}\n.page-toolbar-module__settingsPanel___C28ZP::before, .page-toolbar-module__settingsPanel___C28ZP::after {\n  content: "";\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  width: 16px;\n  z-index: 2;\n  pointer-events: none;\n}\n.page-toolbar-module__settingsPanel___C28ZP::before {\n  left: 0;\n  background: linear-gradient(to right, #1c1c1c 0%, transparent 100%);\n}\n.page-toolbar-module__settingsPanel___C28ZP::after {\n  right: 0;\n  background: linear-gradient(to left, #1c1c1c 0%, transparent 100%);\n}\n.page-toolbar-module__settingsPanel___C28ZP .page-toolbar-module__settingsHeader___Vu98j,\n.page-toolbar-module__settingsPanel___C28ZP .page-toolbar-module__settingsBrand___euQq5,\n.page-toolbar-module__settingsPanel___C28ZP .page-toolbar-module__settingsBrandSlash___RxG4a,\n.page-toolbar-module__settingsPanel___C28ZP .page-toolbar-module__settingsVersion___N-GPL,\n.page-toolbar-module__settingsPanel___C28ZP .page-toolbar-module__settingsSection___kh4vw,\n.page-toolbar-module__settingsPanel___C28ZP .page-toolbar-module__settingsLabel___Ai4Q-,\n.page-toolbar-module__settingsPanel___C28ZP .page-toolbar-module__cycleButton___uS15m,\n.page-toolbar-module__settingsPanel___C28ZP .page-toolbar-module__cycleDot___CW1tR,\n.page-toolbar-module__settingsPanel___C28ZP .page-toolbar-module__dropdownButton___qTm2f,\n.page-toolbar-module__settingsPanel___C28ZP .page-toolbar-module__toggleLabel___f3w7K,\n.page-toolbar-module__settingsPanel___C28ZP .page-toolbar-module__customCheckbox___X5b-y,\n.page-toolbar-module__settingsPanel___C28ZP .page-toolbar-module__sliderLabel___qK6W0,\n.page-toolbar-module__settingsPanel___C28ZP .page-toolbar-module__slider___XkOCz,\n.page-toolbar-module__settingsPanel___C28ZP .page-toolbar-module__helpIcon___PGlAb,\n.page-toolbar-module__settingsPanel___C28ZP .page-toolbar-module__themeToggle___vLtgF {\n  transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease;\n}\n.page-toolbar-module__settingsPanel___C28ZP.page-toolbar-module__enter___MokYX {\n  opacity: 1;\n  transform: translateY(0) scale(1);\n  filter: blur(0px);\n  transition: opacity 0.2s ease, transform 0.2s ease, filter 0.2s ease;\n}\n.page-toolbar-module__settingsPanel___C28ZP.page-toolbar-module__exit___6NIVt {\n  opacity: 0;\n  transform: translateY(8px) scale(0.95);\n  filter: blur(5px);\n  pointer-events: none;\n  transition: opacity 0.1s ease, transform 0.1s ease, filter 0.1s ease;\n}\n.page-toolbar-module__settingsPanel___C28ZP.page-toolbar-module__dark___fp8IT {\n  background: #1a1a1a;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08);\n}\n.page-toolbar-module__settingsPanel___C28ZP.page-toolbar-module__dark___fp8IT .page-toolbar-module__settingsLabel___Ai4Q- {\n  color: rgba(255, 255, 255, 0.6);\n}\n.page-toolbar-module__settingsPanel___C28ZP.page-toolbar-module__dark___fp8IT .page-toolbar-module__settingsOption___X1xKK {\n  color: rgba(255, 255, 255, 0.85);\n}\n.page-toolbar-module__settingsPanel___C28ZP.page-toolbar-module__dark___fp8IT .page-toolbar-module__settingsOption___X1xKK:hover {\n  background: rgba(255, 255, 255, 0.1);\n}\n.page-toolbar-module__settingsPanel___C28ZP.page-toolbar-module__dark___fp8IT .page-toolbar-module__settingsOption___X1xKK.page-toolbar-module__selected___MO3j6 {\n  background: rgba(255, 255, 255, 0.15);\n  color: #fff;\n}\n.page-toolbar-module__settingsPanel___C28ZP.page-toolbar-module__dark___fp8IT .page-toolbar-module__toggleLabel___f3w7K {\n  color: rgba(255, 255, 255, 0.85);\n}\n\n.page-toolbar-module__settingsPanelContainer___mjMeX {\n  overflow: visible;\n  position: relative;\n  display: flex;\n  padding: 0 1rem;\n}\n.page-toolbar-module__settingsPanelContainer___mjMeX.page-toolbar-module__transitioning___tljBd {\n  overflow-x: clip;\n  overflow-y: visible;\n}\n\n.page-toolbar-module__settingsPage___D45Js {\n  min-width: 100%;\n  flex-shrink: 0;\n  transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.2s ease-out;\n  opacity: 1;\n}\n\n.page-toolbar-module__settingsPage___D45Js.page-toolbar-module__slideLeft___Tz-ss {\n  transform: translateX(-100%);\n  opacity: 0;\n}\n\n.page-toolbar-module__automationsPage___Qf3xs {\n  position: absolute;\n  top: 0;\n  left: 100%;\n  width: 100%;\n  height: 100%;\n  padding: 3px 1rem 0;\n  box-sizing: border-box;\n  display: flex;\n  flex-direction: column;\n  transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.25s ease-out 0.1s;\n  opacity: 0;\n}\n\n.page-toolbar-module__automationsPage___Qf3xs.page-toolbar-module__slideIn___Fhz3M {\n  transform: translateX(-100%);\n  opacity: 1;\n}\n\n.page-toolbar-module__settingsNavLink___QulVN {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  width: 100%;\n  padding: 0;\n  border: none;\n  background: transparent;\n  font-family: inherit;\n  font-size: 0.8125rem;\n  font-weight: 400;\n  color: rgba(255, 255, 255, 0.5);\n  cursor: pointer;\n  transition: color 0.15s ease;\n}\n.page-toolbar-module__settingsNavLink___QulVN:hover {\n  color: rgba(255, 255, 255, 0.9);\n}\n.page-toolbar-module__settingsNavLink___QulVN.page-toolbar-module__light___OkEHy {\n  color: rgba(0, 0, 0, 0.5);\n}\n.page-toolbar-module__settingsNavLink___QulVN.page-toolbar-module__light___OkEHy:hover {\n  color: rgba(0, 0, 0, 0.8);\n}\n.page-toolbar-module__settingsNavLink___QulVN svg {\n  color: rgba(255, 255, 255, 0.4);\n  transition: color 0.15s ease;\n}\n.page-toolbar-module__settingsNavLink___QulVN:hover svg {\n  color: #fff;\n}\n.page-toolbar-module__settingsNavLink___QulVN.page-toolbar-module__light___OkEHy svg {\n  color: rgba(0, 0, 0, 0.25);\n}\n.page-toolbar-module__settingsNavLink___QulVN.page-toolbar-module__light___OkEHy:hover svg {\n  color: rgba(0, 0, 0, 0.8);\n}\n\n.page-toolbar-module__settingsNavLinkRight___2sIrs {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n}\n\n.page-toolbar-module__mcpNavIndicator___nHMuu {\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  flex-shrink: 0;\n}\n.page-toolbar-module__mcpNavIndicator___nHMuu.page-toolbar-module__connected___bd4g7 {\n  background: #34c759;\n  animation: page-toolbar-module__mcpPulse___JirbR 2.5s ease-in-out infinite;\n}\n.page-toolbar-module__mcpNavIndicator___nHMuu.page-toolbar-module__connecting___l9kzm {\n  background: #f5a623;\n  animation: page-toolbar-module__mcpPulse___JirbR 1.5s ease-in-out infinite;\n}\n\n.page-toolbar-module__settingsBackButton___f3AO8 {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  padding: 6px 0 12px 0;\n  margin: -6px 0 0.5rem 0;\n  border: none;\n  border-bottom: 1px solid rgba(255, 255, 255, 0.07);\n  border-radius: 0;\n  background: transparent;\n  font-family: inherit;\n  font-size: 0.8125rem;\n  font-weight: 500;\n  letter-spacing: -0.15px;\n  color: #fff;\n  cursor: pointer;\n  transition: transform 0.12s cubic-bezier(0.32, 0.72, 0, 1);\n}\n.page-toolbar-module__settingsBackButton___f3AO8 svg {\n  opacity: 0.4;\n  flex-shrink: 0;\n  transition: opacity 0.15s ease, transform 0.18s cubic-bezier(0.32, 0.72, 0, 1);\n}\n.page-toolbar-module__settingsBackButton___f3AO8:hover svg {\n  opacity: 1;\n}\n.page-toolbar-module__settingsBackButton___f3AO8.page-toolbar-module__light___OkEHy {\n  color: rgba(0, 0, 0, 0.85);\n  border-bottom-color: rgba(0, 0, 0, 0.08);\n}\n\n.page-toolbar-module__automationHeader___A77vC {\n  display: flex;\n  align-items: center;\n  gap: 0.125rem;\n  font-size: 0.8125rem;\n  font-weight: 400;\n  color: #fff;\n}\n.page-toolbar-module__automationHeader___A77vC .page-toolbar-module__helpIcon___PGlAb svg {\n  transform: none;\n}\n.page-toolbar-module__automationHeader___A77vC.page-toolbar-module__light___OkEHy {\n  color: rgba(0, 0, 0, 0.85);\n}\n\n.page-toolbar-module__automationDescription___0scee {\n  font-size: 0.6875rem;\n  font-weight: 300;\n  color: rgba(255, 255, 255, 0.5);\n  margin-top: 2px;\n  line-height: 14px;\n}\n.page-toolbar-module__automationDescription___0scee.page-toolbar-module__light___OkEHy {\n  color: rgba(0, 0, 0, 0.5);\n}\n\n.page-toolbar-module__learnMoreLink___PkVsi {\n  color: rgba(255, 255, 255, 0.8);\n  text-decoration: underline dotted;\n  text-decoration-color: rgba(255, 255, 255, 0.2);\n  text-underline-offset: 2px;\n  transition: color 0.15s ease;\n}\n.page-toolbar-module__learnMoreLink___PkVsi:hover {\n  color: #fff;\n}\n.page-toolbar-module__learnMoreLink___PkVsi.page-toolbar-module__light___OkEHy {\n  color: rgba(0, 0, 0, 0.6);\n  text-decoration-color: rgba(0, 0, 0, 0.2);\n}\n.page-toolbar-module__learnMoreLink___PkVsi.page-toolbar-module__light___OkEHy:hover {\n  color: rgba(0, 0, 0, 0.85);\n}\n\n.page-toolbar-module__autoSendRow___er1rz {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n\n.page-toolbar-module__autoSendLabel___JilZW {\n  font-size: 0.6875rem;\n  font-weight: 400;\n  color: rgba(255, 255, 255, 0.4);\n  transition: color 0.15s ease;\n}\n.page-toolbar-module__autoSendLabel___JilZW.page-toolbar-module__active___eCNCs {\n  color: #66b8ff;\n}\n.page-toolbar-module__autoSendLabel___JilZW.page-toolbar-module__light___OkEHy {\n  color: rgba(0, 0, 0, 0.4);\n}\n.page-toolbar-module__autoSendLabel___JilZW.page-toolbar-module__light___OkEHy.page-toolbar-module__active___eCNCs {\n  color: #3c82f7;\n}\n\n.page-toolbar-module__webhookUrlInput___QcPU3 {\n  display: block;\n  width: 100%;\n  flex: 1;\n  min-height: 60px;\n  box-sizing: border-box;\n  margin-top: 11px;\n  padding: 8px 10px;\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  border-radius: 6px;\n  background: rgba(255, 255, 255, 0.03);\n  font-family: inherit;\n  font-size: 0.75rem;\n  font-weight: 400;\n  color: #fff;\n  outline: none;\n  resize: none;\n  cursor: text !important;\n  user-select: text;\n  transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;\n}\n.page-toolbar-module__webhookUrlInput___QcPU3::placeholder {\n  color: rgba(255, 255, 255, 0.3);\n}\n.page-toolbar-module__webhookUrlInput___QcPU3:focus {\n  border-color: rgba(255, 255, 255, 0.3);\n  background: rgba(255, 255, 255, 0.08);\n}\n.page-toolbar-module__webhookUrlInput___QcPU3.page-toolbar-module__light___OkEHy {\n  border-color: rgba(0, 0, 0, 0.1);\n  background: rgba(0, 0, 0, 0.03);\n  color: rgba(0, 0, 0, 0.85);\n}\n.page-toolbar-module__webhookUrlInput___QcPU3.page-toolbar-module__light___OkEHy::placeholder {\n  color: rgba(0, 0, 0, 0.3);\n}\n.page-toolbar-module__webhookUrlInput___QcPU3.page-toolbar-module__light___OkEHy:focus {\n  border-color: rgba(0, 0, 0, 0.25);\n  background: rgba(0, 0, 0, 0.05);\n}\n\n.page-toolbar-module__settingsHeader___Vu98j {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  min-height: 24px;\n  margin-bottom: 0.5rem;\n  padding-bottom: 9px;\n  border-bottom: 1px solid rgba(255, 255, 255, 0.07);\n}\n\n.page-toolbar-module__settingsBrand___euQq5 {\n  font-size: 0.8125rem;\n  font-weight: 600;\n  letter-spacing: -0.0094em;\n  color: #fff;\n}\n\n.page-toolbar-module__settingsBrandSlash___RxG4a {\n  color: rgba(255, 255, 255, 0.5);\n}\n\n.page-toolbar-module__settingsVersion___N-GPL {\n  font-size: 11px;\n  font-weight: 400;\n  color: rgba(255, 255, 255, 0.4);\n  margin-left: auto;\n  letter-spacing: -0.0094em;\n}\n\n.page-toolbar-module__settingsSection___kh4vw + .page-toolbar-module__settingsSection___kh4vw {\n  margin-top: 0.5rem;\n  padding-top: 0.5rem;\n  border-top: 1px solid rgba(255, 255, 255, 0.07);\n}\n.page-toolbar-module__settingsSection___kh4vw.page-toolbar-module__settingsSectionExtraPadding___ti6XY {\n  padding-top: calc(0.5rem + 4px);\n}\n\n.page-toolbar-module__settingsSectionGrow___kVkby {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n}\n\n.page-toolbar-module__settingsRow___li31L {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  min-height: 24px;\n}\n.page-toolbar-module__settingsRow___li31L.page-toolbar-module__settingsRowMarginTop___Nk3bS {\n  margin-top: 8px;\n}\n\n.page-toolbar-module__dropdownContainer___FBf2c {\n  position: relative;\n}\n\n.page-toolbar-module__dropdownButton___qTm2f {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 0.25rem 0.5rem;\n  border: none;\n  border-radius: 0.375rem;\n  background: transparent;\n  font-size: 0.8125rem;\n  font-weight: 600;\n  color: #fff;\n  cursor: pointer;\n  transition: background-color 0.15s ease, color 0.15s ease;\n  letter-spacing: -0.0094em;\n}\n.page-toolbar-module__dropdownButton___qTm2f:hover {\n  background: rgba(255, 255, 255, 0.08);\n}\n.page-toolbar-module__dropdownButton___qTm2f svg {\n  opacity: 0.6;\n}\n\n.page-toolbar-module__cycleButton___uS15m {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 0;\n  border: none;\n  background: transparent;\n  font-size: 0.8125rem;\n  font-weight: 500;\n  color: #fff;\n  cursor: pointer;\n  letter-spacing: -0.0094em;\n}\n.page-toolbar-module__cycleButton___uS15m.page-toolbar-module__light___OkEHy {\n  color: rgba(0, 0, 0, 0.85);\n}\n.page-toolbar-module__cycleButton___uS15m:disabled {\n  opacity: 0.35;\n  cursor: not-allowed;\n}\n\n.page-toolbar-module__settingsRowDisabled___c4jKo .page-toolbar-module__settingsLabel___Ai4Q- {\n  color: rgba(255, 255, 255, 0.2);\n}\n.page-toolbar-module__settingsRowDisabled___c4jKo .page-toolbar-module__settingsLabel___Ai4Q-.page-toolbar-module__light___OkEHy {\n  color: rgba(0, 0, 0, 0.2);\n}\n.page-toolbar-module__settingsRowDisabled___c4jKo .page-toolbar-module__toggleSwitch___TTjxl {\n  opacity: 0.4;\n  cursor: not-allowed;\n}\n\n@keyframes page-toolbar-module__cycleTextIn___0H9ys {\n  0% {\n    opacity: 0;\n    transform: translateY(-6px);\n  }\n  100% {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.page-toolbar-module__cycleButtonText___EmmsR {\n  display: inline-block;\n  animation: page-toolbar-module__cycleTextIn___0H9ys 0.2s ease-out;\n}\n\n.page-toolbar-module__cycleDots___PXV30 {\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n}\n\n.page-toolbar-module__cycleDot___CW1tR {\n  width: 3px;\n  height: 3px;\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.3);\n  transform: scale(0.667);\n  transition: background-color 0.25s ease-out, transform 0.25s ease-out;\n}\n.page-toolbar-module__cycleDot___CW1tR.page-toolbar-module__active___eCNCs {\n  background: #fff;\n  transform: scale(1);\n}\n.page-toolbar-module__cycleDot___CW1tR.page-toolbar-module__light___OkEHy {\n  background: rgba(0, 0, 0, 0.2);\n}\n.page-toolbar-module__cycleDot___CW1tR.page-toolbar-module__light___OkEHy.page-toolbar-module__active___eCNCs {\n  background: rgba(0, 0, 0, 0.7);\n}\n\n.page-toolbar-module__dropdownMenu___rHVad {\n  position: absolute;\n  right: 0;\n  top: calc(100% + 0.25rem);\n  background: #1a1a1a;\n  border-radius: 0.5rem;\n  padding: 0.25rem;\n  min-width: 120px;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1);\n  z-index: 10;\n  animation: page-toolbar-module__scaleIn___7i9nB 0.15s ease-out;\n}\n\n.page-toolbar-module__dropdownItem___a0PQp {\n  width: 100%;\n  display: flex;\n  align-items: center;\n  padding: 0.5rem 0.625rem;\n  border: none;\n  border-radius: 0.375rem;\n  background: transparent;\n  font-size: 0.8125rem;\n  font-weight: 500;\n  color: rgba(255, 255, 255, 0.85);\n  cursor: pointer;\n  text-align: left;\n  transition: background-color 0.15s ease, color 0.15s ease;\n  letter-spacing: -0.0094em;\n}\n.page-toolbar-module__dropdownItem___a0PQp:hover {\n  background: rgba(255, 255, 255, 0.08);\n}\n.page-toolbar-module__dropdownItem___a0PQp.page-toolbar-module__selected___MO3j6 {\n  background: rgba(255, 255, 255, 0.12);\n  color: #fff;\n  font-weight: 600;\n}\n\n.page-toolbar-module__settingsLabel___Ai4Q- {\n  font-size: 0.8125rem;\n  font-weight: 400;\n  letter-spacing: -0.0094em;\n  color: rgba(255, 255, 255, 0.5);\n  display: flex;\n  align-items: center;\n  gap: 0.125rem;\n}\n.page-toolbar-module__settingsLabel___Ai4Q-.page-toolbar-module__light___OkEHy {\n  color: rgba(0, 0, 0, 0.5);\n}\n\n.page-toolbar-module__settingsLabelMarker___ZbvBg {\n  padding-top: 3px;\n  margin-bottom: 10px;\n}\n\n.page-toolbar-module__settingsOptions___EZdOQ {\n  display: flex;\n  gap: 0.25rem;\n}\n\n.page-toolbar-module__settingsOption___X1xKK {\n  flex: 1;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.25rem;\n  padding: 0.375rem 0.5rem;\n  border: none;\n  border-radius: 0.375rem;\n  background: transparent;\n  font-size: 0.6875rem;\n  font-weight: 500;\n  color: rgba(0, 0, 0, 0.7);\n  cursor: pointer;\n  transition: background-color 0.15s ease, color 0.15s ease;\n}\n.page-toolbar-module__settingsOption___X1xKK:hover {\n  background: rgba(0, 0, 0, 0.05);\n}\n.page-toolbar-module__settingsOption___X1xKK.page-toolbar-module__selected___MO3j6 {\n  background: rgba(60, 130, 247, 0.15);\n  color: #3c82f7;\n}\n\n.page-toolbar-module__sliderContainer___HYHEn {\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n}\n\n.page-toolbar-module__slider___XkOCz {\n  -webkit-appearance: none;\n  appearance: none;\n  width: 100%;\n  height: 4px;\n  background: rgba(255, 255, 255, 0.15);\n  border-radius: 2px;\n  outline: none;\n  cursor: pointer;\n}\n.page-toolbar-module__slider___XkOCz::-webkit-slider-thumb {\n  -webkit-appearance: none;\n  appearance: none;\n  width: 14px;\n  height: 14px;\n  background: white;\n  border-radius: 50%;\n  cursor: pointer;\n  transition: transform 0.15s ease, box-shadow 0.15s ease;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);\n}\n.page-toolbar-module__slider___XkOCz::-moz-range-thumb {\n  width: 14px;\n  height: 14px;\n  background: white;\n  border: none;\n  border-radius: 50%;\n  cursor: pointer;\n  transition: transform 0.15s ease, box-shadow 0.15s ease;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);\n}\n.page-toolbar-module__slider___XkOCz:hover::-webkit-slider-thumb {\n  transform: scale(1.15);\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);\n}\n.page-toolbar-module__slider___XkOCz:hover::-moz-range-thumb {\n  transform: scale(1.15);\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);\n}\n\n.page-toolbar-module__sliderLabels___J4-mc {\n  display: flex;\n  justify-content: space-between;\n}\n\n.page-toolbar-module__sliderLabel___qK6W0 {\n  font-size: 0.625rem;\n  font-weight: 500;\n  color: rgba(255, 255, 255, 0.4);\n  cursor: pointer;\n  transition: color 0.15s ease;\n}\n.page-toolbar-module__sliderLabel___qK6W0:hover {\n  color: rgba(255, 255, 255, 0.7);\n}\n.page-toolbar-module__sliderLabel___qK6W0.page-toolbar-module__active___eCNCs {\n  color: rgba(255, 255, 255, 0.9);\n}\n\n.page-toolbar-module__colorOptions___2P2Dw {\n  display: flex;\n  gap: 0.5rem;\n  margin-top: 0.375rem;\n  margin-bottom: 1px;\n}\n\n.page-toolbar-module__colorOption___oAKqy {\n  display: block;\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  border: 2px solid transparent;\n  cursor: pointer;\n  transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1);\n}\n.page-toolbar-module__colorOption___oAKqy:hover {\n  transform: scale(1.15);\n}\n.page-toolbar-module__colorOption___oAKqy.page-toolbar-module__selected___MO3j6 {\n  transform: scale(0.83);\n}\n\n.page-toolbar-module__colorOptionRing___-Fehe {\n  display: flex;\n  width: 24px;\n  height: 24px;\n  border: 2px solid transparent;\n  border-radius: 50%;\n  transition: border-color 0.3s ease;\n}\n.page-toolbar-module__settingsToggle___X2LSX {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  cursor: pointer;\n}\n.page-toolbar-module__settingsToggle___X2LSX + .page-toolbar-module__settingsToggle___X2LSX {\n  margin-top: calc(0.5rem + 6px);\n}\n.page-toolbar-module__settingsToggle___X2LSX input[type=checkbox] {\n  position: absolute;\n  opacity: 0;\n  width: 0;\n  height: 0;\n}\n.page-toolbar-module__settingsToggle___X2LSX.page-toolbar-module__settingsToggleMarginBottom___z9mxi {\n  margin-bottom: calc(0.5rem + 6px);\n}\n\n.page-toolbar-module__customCheckbox___X5b-y {\n  position: relative;\n  width: 14px;\n  height: 14px;\n  border: 1px solid rgba(255, 255, 255, 0.2);\n  border-radius: 4px;\n  background: rgba(255, 255, 255, 0.05);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n  transition: background 0.25s ease, border-color 0.25s ease;\n}\n.page-toolbar-module__customCheckbox___X5b-y svg {\n  color: #1a1a1a;\n  opacity: 1;\n  transition: opacity 0.15s ease;\n}\ninput[type=checkbox]:checked + .page-toolbar-module__customCheckbox___X5b-y {\n  border-color: rgba(255, 255, 255, 0.3);\n  background: rgb(255, 255, 255);\n}\n.page-toolbar-module__customCheckbox___X5b-y.page-toolbar-module__light___OkEHy {\n  border: 1px solid rgba(0, 0, 0, 0.15);\n  background: #fff;\n}\n.page-toolbar-module__customCheckbox___X5b-y.page-toolbar-module__light___OkEHy.page-toolbar-module__checked___ey1iv {\n  border-color: #1a1a1a;\n  background: #1a1a1a;\n}\n.page-toolbar-module__customCheckbox___X5b-y.page-toolbar-module__light___OkEHy.page-toolbar-module__checked___ey1iv svg {\n  color: #fff;\n}\n\n.page-toolbar-module__toggleLabel___f3w7K {\n  font-size: 0.8125rem;\n  font-weight: 400;\n  color: rgba(255, 255, 255, 0.5);\n  letter-spacing: -0.0094em;\n  display: flex;\n  align-items: center;\n  gap: 0.25rem;\n}\n.page-toolbar-module__toggleLabel___f3w7K.page-toolbar-module__light___OkEHy {\n  color: rgba(0, 0, 0, 0.5);\n}\n\n.page-toolbar-module__toggleSwitch___TTjxl {\n  position: relative;\n  display: inline-block;\n  width: 24px;\n  height: 16px;\n  flex-shrink: 0;\n  cursor: pointer;\n  transition: opacity 0.15s ease;\n}\n.page-toolbar-module__toggleSwitch___TTjxl input {\n  opacity: 0;\n  width: 0;\n  height: 0;\n}\n.page-toolbar-module__toggleSwitch___TTjxl input:checked + .page-toolbar-module__toggleSlider___YnDma {\n  background: #3c82f7;\n}\n.page-toolbar-module__toggleSwitch___TTjxl input:checked + .page-toolbar-module__toggleSlider___YnDma::before {\n  transform: translateX(8px);\n}\n.page-toolbar-module__toggleSwitch___TTjxl.page-toolbar-module__disabled___jwPry {\n  opacity: 0.4;\n  pointer-events: none;\n}\n.page-toolbar-module__toggleSwitch___TTjxl.page-toolbar-module__disabled___jwPry .page-toolbar-module__toggleSlider___YnDma {\n  cursor: not-allowed;\n}\n\n.page-toolbar-module__toggleSlider___YnDma {\n  position: absolute;\n  cursor: pointer;\n  inset: 0;\n  border-radius: 16px;\n  background: #484848;\n}\n.page-toolbar-module__light___OkEHy .page-toolbar-module__toggleSlider___YnDma {\n  background: #dddddd;\n}\n.page-toolbar-module__toggleSlider___YnDma::before {\n  content: "";\n  position: absolute;\n  height: 12px;\n  width: 12px;\n  left: 2px;\n  bottom: 2px;\n  background: white;\n  border-radius: 50%;\n  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);\n  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);\n}\n\n@keyframes page-toolbar-module__mcpPulse___JirbR {\n  0% {\n    box-shadow: 0 0 0 0 rgba(52, 199, 89, 0.5);\n  }\n  70% {\n    box-shadow: 0 0 0 6px rgba(52, 199, 89, 0);\n  }\n  100% {\n    box-shadow: 0 0 0 0 rgba(52, 199, 89, 0);\n  }\n}\n@keyframes page-toolbar-module__mcpPulseError___BWrat {\n  0% {\n    box-shadow: 0 0 0 0 rgba(255, 59, 48, 0.5);\n  }\n  70% {\n    box-shadow: 0 0 0 6px rgba(255, 59, 48, 0);\n  }\n  100% {\n    box-shadow: 0 0 0 0 rgba(255, 59, 48, 0);\n  }\n}\n.page-toolbar-module__mcpStatusDot___Lwqmi {\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  flex-shrink: 0;\n}\n.page-toolbar-module__mcpStatusDot___Lwqmi.page-toolbar-module__connecting___l9kzm {\n  background: #f5a623;\n  animation: page-toolbar-module__mcpPulse___JirbR 1.5s infinite;\n}\n.page-toolbar-module__mcpStatusDot___Lwqmi.page-toolbar-module__connected___bd4g7 {\n  background: #34c759;\n  animation: page-toolbar-module__mcpPulse___JirbR 2.5s ease-in-out infinite;\n}\n.page-toolbar-module__mcpStatusDot___Lwqmi.page-toolbar-module__disconnected___yfvyJ {\n  background: #ff3b30;\n  animation: page-toolbar-module__mcpPulseError___BWrat 2s infinite;\n}\n\n.page-toolbar-module__helpIcon___PGlAb {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: help;\n  margin-left: 0;\n}\n.page-toolbar-module__helpIcon___PGlAb svg {\n  display: block;\n  transform: translateY(1px);\n  color: rgba(255, 255, 255, 0.2);\n  transition: color 0.15s ease;\n}\n.page-toolbar-module__helpIcon___PGlAb:hover svg {\n  color: rgba(255, 255, 255, 0.5);\n}\n.page-toolbar-module__helpIcon___PGlAb.page-toolbar-module__helpIconNudgeDown___p8D9P svg {\n  transform: translateY(1px);\n}\n.page-toolbar-module__helpIcon___PGlAb.page-toolbar-module__helpIconNoNudge___j8dJo svg {\n  transform: translateY(0.5px);\n}\n.page-toolbar-module__helpIcon___PGlAb.page-toolbar-module__helpIconNudge1-5___0zgUD svg {\n  transform: translateY(1.5px);\n}\n.page-toolbar-module__helpIcon___PGlAb.page-toolbar-module__helpIconNudge2___-J3Fk svg {\n  transform: translateY(2px);\n}\n\n.page-toolbar-module__drawCanvas___D4ZkJ {\n  position: fixed;\n  inset: 0;\n  z-index: 99996;\n  pointer-events: none !important;\n}\n.page-toolbar-module__drawCanvas___D4ZkJ.page-toolbar-module__active___eCNCs {\n  pointer-events: auto !important;\n  cursor: crosshair !important;\n}\n.page-toolbar-module__drawCanvas___D4ZkJ.page-toolbar-module__active___eCNCs[data-stroke-hover] {\n  cursor: pointer !important;\n}\n\n.page-toolbar-module__dragSelection___FICBI {\n  position: fixed;\n  top: 0;\n  left: 0;\n  border: 2px solid rgba(52, 199, 89, 0.6);\n  border-radius: 4px;\n  background: rgba(52, 199, 89, 0.08);\n  pointer-events: none;\n  z-index: 99997;\n  will-change: transform, width, height;\n  contain: layout style;\n}\n\n.page-toolbar-module__dragCount___k23a6 {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  background: #34c759;\n  color: white;\n  font-size: 0.875rem;\n  font-weight: 600;\n  padding: 0.25rem 0.5rem;\n  border-radius: 1rem;\n  min-width: 1.5rem;\n  text-align: center;\n}\n\n.page-toolbar-module__highlightsContainer___Dtrkr {\n  position: fixed;\n  top: 0;\n  left: 0;\n  pointer-events: none;\n  z-index: 99996;\n}\n\n.page-toolbar-module__selectedElementHighlight___6tZvS {\n  position: fixed;\n  top: 0;\n  left: 0;\n  border: 2px solid rgba(52, 199, 89, 0.5);\n  border-radius: 4px;\n  background: rgba(52, 199, 89, 0.06);\n  pointer-events: none;\n  will-change: transform, width, height;\n  contain: layout style;\n}\n\n.page-toolbar-module__light___OkEHy.page-toolbar-module__toolbarContainer___x5R-d {\n  background: #fff;\n  color: rgba(0, 0, 0, 0.85);\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04);\n}\n.page-toolbar-module__light___OkEHy.page-toolbar-module__toolbarContainer___x5R-d.page-toolbar-module__collapsed___Ep0vF:hover {\n  background: #f5f5f5;\n}\n.page-toolbar-module__light___OkEHy.page-toolbar-module__controlButton___ppLrv {\n  color: rgba(0, 0, 0, 0.5);\n}\n.page-toolbar-module__light___OkEHy.page-toolbar-module__controlButton___ppLrv:hover:not(:disabled):not([data-active=true]):not([data-failed=true]):not([data-auto-sync=true]):not([data-error=true]):not([data-no-hover=true]) {\n  background: rgba(0, 0, 0, 0.06);\n  color: rgba(0, 0, 0, 0.85);\n}\n.page-toolbar-module__light___OkEHy.page-toolbar-module__controlButton___ppLrv[data-active=true] {\n  color: #3c82f7;\n  background: rgba(60, 130, 247, 0.15);\n}\n.page-toolbar-module__light___OkEHy.page-toolbar-module__controlButton___ppLrv[data-error=true] {\n  color: #ff3b30;\n  background: rgba(255, 59, 48, 0.15);\n}\n.page-toolbar-module__light___OkEHy.page-toolbar-module__controlButton___ppLrv[data-danger]:hover:not(:disabled):not([data-active=true]):not([data-failed=true]) {\n  background: rgba(255, 59, 48, 0.15);\n  color: #ff3b30;\n}\n.page-toolbar-module__light___OkEHy.page-toolbar-module__controlButton___ppLrv[data-auto-sync=true] {\n  color: #34c759;\n  background: transparent;\n}\n.page-toolbar-module__light___OkEHy.page-toolbar-module__controlButton___ppLrv[data-failed=true] {\n  color: #ff3b30;\n  background: rgba(255, 59, 48, 0.15);\n}\n.page-toolbar-module__light___OkEHy.page-toolbar-module__buttonTooltip___AetOW {\n  background: #fff;\n  color: rgba(0, 0, 0, 0.85);\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04);\n}\n.page-toolbar-module__light___OkEHy.page-toolbar-module__buttonTooltip___AetOW::after {\n  background: #fff;\n}\n.page-toolbar-module__light___OkEHy.page-toolbar-module__divider___cL2DV {\n  background: rgba(0, 0, 0, 0.1);\n}\n.page-toolbar-module__light___OkEHy.page-toolbar-module__markerTooltip___oBqwC {\n  background: #fff;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.06);\n}\n.page-toolbar-module__light___OkEHy.page-toolbar-module__markerTooltip___oBqwC .page-toolbar-module__markerQuote___9Qfoa {\n  color: rgba(0, 0, 0, 0.5);\n}\n.page-toolbar-module__light___OkEHy.page-toolbar-module__markerTooltip___oBqwC .page-toolbar-module__markerNote___HOmyF {\n  color: rgba(0, 0, 0, 0.85);\n}\n.page-toolbar-module__light___OkEHy.page-toolbar-module__markerTooltip___oBqwC .page-toolbar-module__markerHint___rUwXR {\n  color: rgba(0, 0, 0, 0.35);\n}\n.page-toolbar-module__light___OkEHy.page-toolbar-module__settingsPanel___C28ZP {\n  background: #fff;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04);\n}\n.page-toolbar-module__light___OkEHy.page-toolbar-module__settingsPanel___C28ZP::before {\n  background: linear-gradient(to right, #fff 0%, transparent 100%);\n}\n.page-toolbar-module__light___OkEHy.page-toolbar-module__settingsPanel___C28ZP::after {\n  background: linear-gradient(to left, #fff 0%, transparent 100%);\n}\n.page-toolbar-module__light___OkEHy.page-toolbar-module__settingsPanel___C28ZP .page-toolbar-module__settingsHeader___Vu98j {\n  border-bottom-color: rgba(0, 0, 0, 0.08);\n}\n.page-toolbar-module__light___OkEHy.page-toolbar-module__settingsPanel___C28ZP .page-toolbar-module__settingsBrand___euQq5 {\n  color: rgba(0, 0, 0, 0.85);\n}\n.page-toolbar-module__light___OkEHy.page-toolbar-module__settingsPanel___C28ZP .page-toolbar-module__settingsBrandSlash___RxG4a {\n  color: rgba(0, 0, 0, 0.4);\n}\n.page-toolbar-module__light___OkEHy.page-toolbar-module__settingsPanel___C28ZP .page-toolbar-module__settingsVersion___N-GPL {\n  color: rgba(0, 0, 0, 0.4);\n}\n.page-toolbar-module__light___OkEHy.page-toolbar-module__settingsPanel___C28ZP .page-toolbar-module__settingsSection___kh4vw {\n  border-top-color: rgba(0, 0, 0, 0.08);\n}\n.page-toolbar-module__light___OkEHy.page-toolbar-module__settingsPanel___C28ZP .page-toolbar-module__settingsLabel___Ai4Q- {\n  color: rgba(0, 0, 0, 0.5);\n}\n.page-toolbar-module__light___OkEHy.page-toolbar-module__settingsPanel___C28ZP .page-toolbar-module__cycleButton___uS15m {\n  color: rgba(0, 0, 0, 0.85);\n}\n.page-toolbar-module__light___OkEHy.page-toolbar-module__settingsPanel___C28ZP .page-toolbar-module__cycleDot___CW1tR {\n  background: rgba(0, 0, 0, 0.2);\n}\n.page-toolbar-module__light___OkEHy.page-toolbar-module__settingsPanel___C28ZP .page-toolbar-module__cycleDot___CW1tR.page-toolbar-module__active___eCNCs {\n  background: rgba(0, 0, 0, 0.7);\n}\n.page-toolbar-module__light___OkEHy.page-toolbar-module__settingsPanel___C28ZP .page-toolbar-module__dropdownButton___qTm2f {\n  color: rgba(0, 0, 0, 0.85);\n}\n.page-toolbar-module__light___OkEHy.page-toolbar-module__settingsPanel___C28ZP .page-toolbar-module__dropdownButton___qTm2f:hover {\n  background: rgba(0, 0, 0, 0.05);\n}\n.page-toolbar-module__light___OkEHy.page-toolbar-module__settingsPanel___C28ZP .page-toolbar-module__toggleLabel___f3w7K {\n  color: rgba(0, 0, 0, 0.5);\n}\n.page-toolbar-module__light___OkEHy.page-toolbar-module__settingsPanel___C28ZP .page-toolbar-module__customCheckbox___X5b-y {\n  border: 1px solid rgba(0, 0, 0, 0.15);\n  background: #fff;\n}\n.page-toolbar-module__light___OkEHy.page-toolbar-module__settingsPanel___C28ZP .page-toolbar-module__customCheckbox___X5b-y.page-toolbar-module__checked___ey1iv {\n  border-color: #1a1a1a;\n  background: #1a1a1a;\n}\n.page-toolbar-module__light___OkEHy.page-toolbar-module__settingsPanel___C28ZP .page-toolbar-module__customCheckbox___X5b-y.page-toolbar-module__checked___ey1iv svg {\n  color: #fff;\n}\n.page-toolbar-module__light___OkEHy.page-toolbar-module__settingsPanel___C28ZP .page-toolbar-module__sliderLabel___qK6W0 {\n  color: rgba(0, 0, 0, 0.4);\n}\n.page-toolbar-module__light___OkEHy.page-toolbar-module__settingsPanel___C28ZP .page-toolbar-module__sliderLabel___qK6W0:hover {\n  color: rgba(0, 0, 0, 0.7);\n}\n.page-toolbar-module__light___OkEHy.page-toolbar-module__settingsPanel___C28ZP .page-toolbar-module__sliderLabel___qK6W0.page-toolbar-module__active___eCNCs {\n  color: rgba(0, 0, 0, 0.9);\n}\n.page-toolbar-module__light___OkEHy.page-toolbar-module__settingsPanel___C28ZP .page-toolbar-module__slider___XkOCz {\n  background: rgba(0, 0, 0, 0.1);\n}\n.page-toolbar-module__light___OkEHy.page-toolbar-module__settingsPanel___C28ZP .page-toolbar-module__slider___XkOCz::-webkit-slider-thumb {\n  background: #1a1a1a;\n}\n.page-toolbar-module__light___OkEHy.page-toolbar-module__settingsPanel___C28ZP .page-toolbar-module__slider___XkOCz::-moz-range-thumb {\n  background: #1a1a1a;\n}\n.page-toolbar-module__light___OkEHy.page-toolbar-module__settingsPanel___C28ZP .page-toolbar-module__helpIcon___PGlAb svg {\n  color: rgba(0, 0, 0, 0.2);\n}\n.page-toolbar-module__light___OkEHy.page-toolbar-module__settingsPanel___C28ZP .page-toolbar-module__helpIcon___PGlAb:hover svg {\n  color: rgba(0, 0, 0, 0.5);\n}\n\n.page-toolbar-module__themeToggle___vLtgF {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 22px;\n  height: 22px;\n  margin-left: 0.5rem;\n  border: none;\n  border-radius: 6px;\n  background: transparent;\n  color: rgba(255, 255, 255, 0.4);\n  cursor: pointer;\n  transition: background-color 0.15s ease, color 0.15s ease;\n}\n.page-toolbar-module__themeToggle___vLtgF:hover {\n  background: rgba(255, 255, 255, 0.1);\n  color: rgba(255, 255, 255, 0.8);\n}\n.page-toolbar-module__light___OkEHy .page-toolbar-module__themeToggle___vLtgF {\n  color: rgba(0, 0, 0, 0.4);\n}\n.page-toolbar-module__light___OkEHy .page-toolbar-module__themeToggle___vLtgF:hover {\n  background: rgba(0, 0, 0, 0.06);\n  color: rgba(0, 0, 0, 0.7);\n}\n\n.page-toolbar-module__themeIconWrapper___9EVcM {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  position: relative;\n  width: 20px;\n  height: 20px;\n}\n\n.page-toolbar-module__themeIcon___xi-Ah {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  animation: page-toolbar-module__themeIconIn___pKRY4 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;\n}\n\n@keyframes page-toolbar-module__themeIconIn___pKRY4 {\n  0% {\n    opacity: 0;\n    transform: scale(0.8) rotate(-30deg);\n  }\n  100% {\n    opacity: 1;\n    transform: scale(1) rotate(0deg);\n  }\n}';
var classNames = { "toolbar": "page-toolbar-module__toolbar___sBwIb", "toolbarContainer": "page-toolbar-module__toolbarContainer___x5R-d", "dragging": "page-toolbar-module__dragging___UIy-x", "entrance": "page-toolbar-module__entrance___gAJff", "toolbarEnter": "page-toolbar-module__toolbarEnter___-WEE5", "hiding": "page-toolbar-module__hiding___mdJIe", "toolbarHide": "page-toolbar-module__toolbarHide___Uhyz-", "collapsed": "page-toolbar-module__collapsed___Ep0vF", "expanded": "page-toolbar-module__expanded___HKRxf", "serverConnected": "page-toolbar-module__serverConnected___AgpbE", "toggleContent": "page-toolbar-module__toggleContent___uFPh5", "visible": "page-toolbar-module__visible___0P5dl", "hidden": "page-toolbar-module__hidden___rLRX-", "controlsContent": "page-toolbar-module__controlsContent___3c09P", "badge": "page-toolbar-module__badge___d2Sgd", "fadeOut": "page-toolbar-module__fadeOut___dAA6W", "badgeEnter": "page-toolbar-module__badgeEnter___tPtKD", "controlButton": "page-toolbar-module__controlButton___ppLrv", "statusShowing": "page-toolbar-module__statusShowing___F-Tku", "buttonBadge": "page-toolbar-module__buttonBadge___ID4id", "light": "page-toolbar-module__light___OkEHy", "mcpIndicator": "page-toolbar-module__mcpIndicator___KqlFK", "connected": "page-toolbar-module__connected___bd4g7", "mcpIndicatorPulseConnected": "page-toolbar-module__mcpIndicatorPulseConnected___0ghgC", "connecting": "page-toolbar-module__connecting___l9kzm", "mcpIndicatorPulseConnecting": "page-toolbar-module__mcpIndicatorPulseConnecting___kYfpu", "connectionIndicatorWrapper": "page-toolbar-module__connectionIndicatorWrapper___xmyKM", "connectionIndicator": "page-toolbar-module__connectionIndicator___0gwMz", "connectionIndicatorVisible": "page-toolbar-module__connectionIndicatorVisible___L-bAC", "connectionIndicatorConnected": "page-toolbar-module__connectionIndicatorConnected___I2ODc", "connectionPulse": "page-toolbar-module__connectionPulse___Mb8JU", "connectionIndicatorDisconnected": "page-toolbar-module__connectionIndicatorDisconnected___s2kSH", "connectionIndicatorConnecting": "page-toolbar-module__connectionIndicatorConnecting___IjG3P", "buttonWrapper": "page-toolbar-module__buttonWrapper___Z2afJ", "buttonTooltip": "page-toolbar-module__buttonTooltip___AetOW", "tooltipsInSession": "page-toolbar-module__tooltipsInSession___DbxC9", "sendButtonWrapper": "page-toolbar-module__sendButtonWrapper___naR5s", "sendButtonVisible": "page-toolbar-module__sendButtonVisible___3ItIp", "shortcut": "page-toolbar-module__shortcut___dVvrO", "tooltipBelow": "page-toolbar-module__tooltipBelow___4zzOD", "tooltipsHidden": "page-toolbar-module__tooltipsHidden___1NAj0", "tooltipVisible": "page-toolbar-module__tooltipVisible___Z9IMh", "buttonWrapperAlignLeft": "page-toolbar-module__buttonWrapperAlignLeft___fQ8G3", "buttonWrapperAlignRight": "page-toolbar-module__buttonWrapperAlignRight___mSVi3", "divider": "page-toolbar-module__divider___cL2DV", "overlay": "page-toolbar-module__overlay___Zg2Lx", "hoverHighlight": "page-toolbar-module__hoverHighlight___x-hcw", "enter": "page-toolbar-module__enter___MokYX", "hoverHighlightIn": "page-toolbar-module__hoverHighlightIn___f6l-B", "multiSelectOutline": "page-toolbar-module__multiSelectOutline___GtfT4", "fadeIn": "page-toolbar-module__fadeIn___RJvi3", "exit": "page-toolbar-module__exit___6NIVt", "singleSelectOutline": "page-toolbar-module__singleSelectOutline___lDMOt", "hoverTooltip": "page-toolbar-module__hoverTooltip___YHQxN", "hoverTooltipIn": "page-toolbar-module__hoverTooltipIn___d-9u5", "hoverReactPath": "page-toolbar-module__hoverReactPath___gsH0-", "hoverElementName": "page-toolbar-module__hoverElementName___9Wxnf", "markersLayer": "page-toolbar-module__markersLayer___hXKyR", "fixedMarkersLayer": "page-toolbar-module__fixedMarkersLayer___0QARr", "marker": "page-toolbar-module__marker___c0doQ", "clearing": "page-toolbar-module__clearing___aXE1v", "markerIn": "page-toolbar-module__markerIn___A1Wxv", "markerOut": "page-toolbar-module__markerOut___h-kr9", "pending": "page-toolbar-module__pending___Ln-lV", "fixed": "page-toolbar-module__fixed___U4mr3", "multiSelect": "page-toolbar-module__multiSelect___Z-PYZ", "hovered": "page-toolbar-module__hovered___2HwnW", "renumber": "page-toolbar-module__renumber___rVqlG", "renumberRoll": "page-toolbar-module__renumberRoll___zbFKe", "markerTooltip": "page-toolbar-module__markerTooltip___oBqwC", "tooltipIn": "page-toolbar-module__tooltipIn___jMmfJ", "markerQuote": "page-toolbar-module__markerQuote___9Qfoa", "markerNote": "page-toolbar-module__markerNote___HOmyF", "markerHint": "page-toolbar-module__markerHint___rUwXR", "settingsPanel": "page-toolbar-module__settingsPanel___C28ZP", "settingsHeader": "page-toolbar-module__settingsHeader___Vu98j", "settingsBrand": "page-toolbar-module__settingsBrand___euQq5", "settingsBrandSlash": "page-toolbar-module__settingsBrandSlash___RxG4a", "settingsVersion": "page-toolbar-module__settingsVersion___N-GPL", "settingsSection": "page-toolbar-module__settingsSection___kh4vw", "settingsLabel": "page-toolbar-module__settingsLabel___Ai4Q-", "cycleButton": "page-toolbar-module__cycleButton___uS15m", "cycleDot": "page-toolbar-module__cycleDot___CW1tR", "dropdownButton": "page-toolbar-module__dropdownButton___qTm2f", "toggleLabel": "page-toolbar-module__toggleLabel___f3w7K", "customCheckbox": "page-toolbar-module__customCheckbox___X5b-y", "sliderLabel": "page-toolbar-module__sliderLabel___qK6W0", "slider": "page-toolbar-module__slider___XkOCz", "helpIcon": "page-toolbar-module__helpIcon___PGlAb", "themeToggle": "page-toolbar-module__themeToggle___vLtgF", "dark": "page-toolbar-module__dark___fp8IT", "settingsOption": "page-toolbar-module__settingsOption___X1xKK", "selected": "page-toolbar-module__selected___MO3j6", "settingsPanelContainer": "page-toolbar-module__settingsPanelContainer___mjMeX", "transitioning": "page-toolbar-module__transitioning___tljBd", "settingsPage": "page-toolbar-module__settingsPage___D45Js", "slideLeft": "page-toolbar-module__slideLeft___Tz-ss", "automationsPage": "page-toolbar-module__automationsPage___Qf3xs", "slideIn": "page-toolbar-module__slideIn___Fhz3M", "settingsNavLink": "page-toolbar-module__settingsNavLink___QulVN", "settingsNavLinkRight": "page-toolbar-module__settingsNavLinkRight___2sIrs", "mcpNavIndicator": "page-toolbar-module__mcpNavIndicator___nHMuu", "mcpPulse": "page-toolbar-module__mcpPulse___JirbR", "settingsBackButton": "page-toolbar-module__settingsBackButton___f3AO8", "automationHeader": "page-toolbar-module__automationHeader___A77vC", "automationDescription": "page-toolbar-module__automationDescription___0scee", "learnMoreLink": "page-toolbar-module__learnMoreLink___PkVsi", "autoSendRow": "page-toolbar-module__autoSendRow___er1rz", "autoSendLabel": "page-toolbar-module__autoSendLabel___JilZW", "active": "page-toolbar-module__active___eCNCs", "webhookUrlInput": "page-toolbar-module__webhookUrlInput___QcPU3", "settingsSectionExtraPadding": "page-toolbar-module__settingsSectionExtraPadding___ti6XY", "settingsSectionGrow": "page-toolbar-module__settingsSectionGrow___kVkby", "settingsRow": "page-toolbar-module__settingsRow___li31L", "settingsRowMarginTop": "page-toolbar-module__settingsRowMarginTop___Nk3bS", "dropdownContainer": "page-toolbar-module__dropdownContainer___FBf2c", "settingsRowDisabled": "page-toolbar-module__settingsRowDisabled___c4jKo", "toggleSwitch": "page-toolbar-module__toggleSwitch___TTjxl", "cycleButtonText": "page-toolbar-module__cycleButtonText___EmmsR", "cycleTextIn": "page-toolbar-module__cycleTextIn___0H9ys", "cycleDots": "page-toolbar-module__cycleDots___PXV30", "dropdownMenu": "page-toolbar-module__dropdownMenu___rHVad", "scaleIn": "page-toolbar-module__scaleIn___7i9nB", "dropdownItem": "page-toolbar-module__dropdownItem___a0PQp", "settingsLabelMarker": "page-toolbar-module__settingsLabelMarker___ZbvBg", "settingsOptions": "page-toolbar-module__settingsOptions___EZdOQ", "sliderContainer": "page-toolbar-module__sliderContainer___HYHEn", "sliderLabels": "page-toolbar-module__sliderLabels___J4-mc", "colorOptions": "page-toolbar-module__colorOptions___2P2Dw", "colorOption": "page-toolbar-module__colorOption___oAKqy", "colorOptionRing": "page-toolbar-module__colorOptionRing___-Fehe", "settingsToggle": "page-toolbar-module__settingsToggle___X2LSX", "settingsToggleMarginBottom": "page-toolbar-module__settingsToggleMarginBottom___z9mxi", "checked": "page-toolbar-module__checked___ey1iv", "toggleSlider": "page-toolbar-module__toggleSlider___YnDma", "disabled": "page-toolbar-module__disabled___jwPry", "mcpStatusDot": "page-toolbar-module__mcpStatusDot___Lwqmi", "disconnected": "page-toolbar-module__disconnected___yfvyJ", "mcpPulseError": "page-toolbar-module__mcpPulseError___BWrat", "helpIconNudgeDown": "page-toolbar-module__helpIconNudgeDown___p8D9P", "helpIconNoNudge": "page-toolbar-module__helpIconNoNudge___j8dJo", "helpIconNudge1-5": "page-toolbar-module__helpIconNudge1-5___0zgUD", "helpIconNudge2": "page-toolbar-module__helpIconNudge2___-J3Fk", "drawCanvas": "page-toolbar-module__drawCanvas___D4ZkJ", "dragSelection": "page-toolbar-module__dragSelection___FICBI", "dragCount": "page-toolbar-module__dragCount___k23a6", "highlightsContainer": "page-toolbar-module__highlightsContainer___Dtrkr", "selectedElementHighlight": "page-toolbar-module__selectedElementHighlight___6tZvS", "themeIconWrapper": "page-toolbar-module__themeIconWrapper___9EVcM", "themeIcon": "page-toolbar-module__themeIcon___xi-Ah", "themeIconIn": "page-toolbar-module__themeIconIn___pKRY4", "scaleOut": "page-toolbar-module__scaleOut___Y1Ztx", "slideUp": "page-toolbar-module__slideUp___496yM", "slideDown": "page-toolbar-module__slideDown___PRK4O", "settingsPanelIn": "page-toolbar-module__settingsPanelIn___YMAX5", "settingsPanelOut": "page-toolbar-module__settingsPanelOut___fv1FI" };
if (typeof document !== "undefined") {
  let style = document.getElementById("feedback-tool-styles-styles-page-toolbar");
  if (!style) {
    style = document.createElement("style");
    style.id = "feedback-tool-styles-styles-page-toolbar";
    style.textContent = css;
    document.head.appendChild(style);
  }
}
var page_toolbar_module_default = classNames;

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/AnnotationPopup.vue
var import_vue = require("vue");
var import_vue2 = require("vue");

// src/core/styles/annotation-popup.module.scss
var css2 = 'svg[fill=none] {\n  fill: none !important;\n}\n\n@keyframes annotation-popup-module__popupEnter___Jw46V {\n  from {\n    opacity: 0;\n    transform: translateX(-50%) scale(0.95) translateY(4px);\n  }\n  to {\n    opacity: 1;\n    transform: translateX(-50%) scale(1) translateY(0);\n  }\n}\n@keyframes annotation-popup-module__popupExit___XocAN {\n  from {\n    opacity: 1;\n    transform: translateX(-50%) scale(1) translateY(0);\n  }\n  to {\n    opacity: 0;\n    transform: translateX(-50%) scale(0.95) translateY(4px);\n  }\n}\n@keyframes annotation-popup-module__shake___xipFi {\n  0%, 100% {\n    transform: translateX(-50%) scale(1) translateY(0) translateX(0);\n  }\n  20% {\n    transform: translateX(-50%) scale(1) translateY(0) translateX(-3px);\n  }\n  40% {\n    transform: translateX(-50%) scale(1) translateY(0) translateX(3px);\n  }\n  60% {\n    transform: translateX(-50%) scale(1) translateY(0) translateX(-2px);\n  }\n  80% {\n    transform: translateX(-50%) scale(1) translateY(0) translateX(2px);\n  }\n}\n.annotation-popup-module__popup___PDGqY {\n  position: fixed;\n  transform: translateX(-50%);\n  width: 280px;\n  padding: 0.75rem 1rem 14px;\n  background: #1a1a1a;\n  border-radius: 16px;\n  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08);\n  cursor: default;\n  z-index: 100001;\n  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n  will-change: transform, opacity;\n  opacity: 0;\n}\n.annotation-popup-module__popup___PDGqY.annotation-popup-module__enter___oKCIl {\n  animation: annotation-popup-module__popupEnter___Jw46V 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;\n}\n.annotation-popup-module__popup___PDGqY.annotation-popup-module__entered___NFsl4 {\n  opacity: 1;\n  transform: translateX(-50%) scale(1) translateY(0);\n}\n.annotation-popup-module__popup___PDGqY.annotation-popup-module__exit___rM7Hx {\n  animation: annotation-popup-module__popupExit___XocAN 0.15s ease-in forwards;\n}\n.annotation-popup-module__popup___PDGqY.annotation-popup-module__entered___NFsl4.annotation-popup-module__shake___xipFi {\n  animation: annotation-popup-module__shake___xipFi 0.25s ease-out;\n}\n\n.annotation-popup-module__header___6kDz- {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-bottom: 0.5625rem;\n}\n\n.annotation-popup-module__element___qYwDo {\n  font-size: 0.75rem;\n  font-weight: 400;\n  color: rgba(255, 255, 255, 0.5);\n  max-width: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  flex: 1;\n}\n\n.annotation-popup-module__headerToggle___IcORo {\n  display: flex;\n  align-items: center;\n  gap: 0.25rem;\n  background: none;\n  border: none;\n  padding: 0;\n  cursor: pointer;\n  flex: 1;\n  min-width: 0;\n  text-align: left;\n}\n.annotation-popup-module__headerToggle___IcORo .annotation-popup-module__element___qYwDo {\n  flex: 1;\n}\n\n.annotation-popup-module__chevron___vTQ8- {\n  color: rgba(255, 255, 255, 0.5);\n  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);\n  flex-shrink: 0;\n}\n.annotation-popup-module__chevron___vTQ8-.annotation-popup-module__expanded___uPG3k {\n  transform: rotate(90deg);\n}\n\n.annotation-popup-module__stylesWrapper___zvY0F {\n  display: grid;\n  grid-template-rows: 0fr;\n  transition: grid-template-rows 0.3s cubic-bezier(0.16, 1, 0.3, 1);\n}\n.annotation-popup-module__stylesWrapper___zvY0F.annotation-popup-module__expanded___uPG3k {\n  grid-template-rows: 1fr;\n}\n\n.annotation-popup-module__stylesInner___WAukz {\n  overflow: hidden;\n}\n\n.annotation-popup-module__stylesBlock___Tx-no {\n  background: rgba(255, 255, 255, 0.05);\n  border-radius: 0.375rem;\n  padding: 0.5rem 0.625rem;\n  margin-bottom: 0.5rem;\n  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;\n  font-size: 0.6875rem;\n  line-height: 1.5;\n}\n\n.annotation-popup-module__styleLine___H6Ae6 {\n  color: rgba(255, 255, 255, 0.85);\n  word-break: break-word;\n}\n\n.annotation-popup-module__styleProperty___oioCJ {\n  color: #c792ea;\n}\n\n.annotation-popup-module__styleValue___7TzXf {\n  color: rgba(255, 255, 255, 0.85);\n}\n\n.annotation-popup-module__timestamp___pZqyO {\n  font-size: 0.625rem;\n  font-weight: 500;\n  color: rgba(255, 255, 255, 0.35);\n  font-variant-numeric: tabular-nums;\n  margin-left: 0.5rem;\n  flex-shrink: 0;\n}\n\n.annotation-popup-module__quote___QwLIF {\n  font-size: 12px;\n  font-style: italic;\n  color: rgba(255, 255, 255, 0.6);\n  margin-bottom: 0.5rem;\n  padding: 0.4rem 0.5rem;\n  background: rgba(255, 255, 255, 0.05);\n  border-radius: 0.25rem;\n  line-height: 1.45;\n}\n\n.annotation-popup-module__textarea___Zyn-U {\n  width: 100%;\n  padding: 0.5rem 0.625rem;\n  font-size: 0.8125rem;\n  font-family: inherit;\n  background: rgba(255, 255, 255, 0.05);\n  color: #fff;\n  border: 1px solid rgba(255, 255, 255, 0.15);\n  border-radius: 8px;\n  resize: none;\n  outline: none;\n  transition: border-color 0.15s ease;\n}\n.annotation-popup-module__textarea___Zyn-U:focus {\n  border-color: #3c82f7;\n}\n.annotation-popup-module__textarea___Zyn-U.annotation-popup-module__green___ekRyG:focus {\n  border-color: #34c759;\n}\n.annotation-popup-module__textarea___Zyn-U::placeholder {\n  color: rgba(255, 255, 255, 0.35);\n}\n.annotation-popup-module__textarea___Zyn-U::-webkit-scrollbar {\n  width: 6px;\n}\n.annotation-popup-module__textarea___Zyn-U::-webkit-scrollbar-track {\n  background: transparent;\n}\n.annotation-popup-module__textarea___Zyn-U::-webkit-scrollbar-thumb {\n  background: rgba(255, 255, 255, 0.2);\n  border-radius: 3px;\n}\n\n.annotation-popup-module__actions___drsIf {\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.375rem;\n  margin-top: 0.5rem;\n}\n\n.annotation-popup-module__cancel___rNb7H,\n.annotation-popup-module__submit___REHVM {\n  padding: 0.4rem 0.875rem;\n  font-size: 0.75rem;\n  font-weight: 500;\n  border-radius: 1rem;\n  border: none;\n  cursor: pointer;\n  transition: background-color 0.15s ease, color 0.15s ease, opacity 0.15s ease;\n}\n\n.annotation-popup-module__cancel___rNb7H {\n  background: transparent;\n  color: rgba(255, 255, 255, 0.5);\n}\n.annotation-popup-module__cancel___rNb7H:hover {\n  background: rgba(255, 255, 255, 0.1);\n  color: rgba(255, 255, 255, 0.8);\n}\n\n.annotation-popup-module__submit___REHVM {\n  color: white;\n}\n.annotation-popup-module__submit___REHVM:hover:not(:disabled) {\n  filter: brightness(0.9);\n}\n.annotation-popup-module__submit___REHVM:disabled {\n  cursor: not-allowed;\n}\n\n.annotation-popup-module__deleteWrapper___DSjb3 {\n  margin-right: auto;\n}\n\n.annotation-popup-module__deleteButton___Wo28o {\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 28px;\n  height: 28px;\n  border-radius: 50%;\n  border: none;\n  background: transparent;\n  color: rgba(255, 255, 255, 0.4);\n  transition: background-color 0.15s ease, color 0.15s ease, transform 0.1s ease;\n}\n.annotation-popup-module__deleteButton___Wo28o:hover {\n  background: rgba(255, 59, 48, 0.25);\n  color: #ff3b30;\n}\n.annotation-popup-module__deleteButton___Wo28o:active {\n  transform: scale(0.92);\n}\n\n.annotation-popup-module__light___h0-ZQ.annotation-popup-module__popup___PDGqY {\n  background: #fff;\n  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.06);\n}\n.annotation-popup-module__light___h0-ZQ .annotation-popup-module__element___qYwDo {\n  color: rgba(0, 0, 0, 0.6);\n}\n.annotation-popup-module__light___h0-ZQ .annotation-popup-module__timestamp___pZqyO {\n  color: rgba(0, 0, 0, 0.4);\n}\n.annotation-popup-module__light___h0-ZQ .annotation-popup-module__chevron___vTQ8- {\n  color: rgba(0, 0, 0, 0.4);\n}\n.annotation-popup-module__light___h0-ZQ .annotation-popup-module__stylesBlock___Tx-no {\n  background: rgba(0, 0, 0, 0.03);\n}\n.annotation-popup-module__light___h0-ZQ .annotation-popup-module__styleLine___H6Ae6 {\n  color: rgba(0, 0, 0, 0.75);\n}\n.annotation-popup-module__light___h0-ZQ .annotation-popup-module__styleProperty___oioCJ {\n  color: #7c3aed;\n}\n.annotation-popup-module__light___h0-ZQ .annotation-popup-module__styleValue___7TzXf {\n  color: rgba(0, 0, 0, 0.75);\n}\n.annotation-popup-module__light___h0-ZQ .annotation-popup-module__quote___QwLIF {\n  color: rgba(0, 0, 0, 0.55);\n  background: rgba(0, 0, 0, 0.04);\n}\n.annotation-popup-module__light___h0-ZQ .annotation-popup-module__textarea___Zyn-U {\n  background: rgba(0, 0, 0, 0.03);\n  color: #1a1a1a;\n  border-color: rgba(0, 0, 0, 0.12);\n}\n.annotation-popup-module__light___h0-ZQ .annotation-popup-module__textarea___Zyn-U::placeholder {\n  color: rgba(0, 0, 0, 0.4);\n}\n.annotation-popup-module__light___h0-ZQ .annotation-popup-module__textarea___Zyn-U::-webkit-scrollbar-thumb {\n  background: rgba(0, 0, 0, 0.15);\n}\n.annotation-popup-module__light___h0-ZQ .annotation-popup-module__cancel___rNb7H {\n  color: rgba(0, 0, 0, 0.5);\n}\n.annotation-popup-module__light___h0-ZQ .annotation-popup-module__cancel___rNb7H:hover {\n  background: rgba(0, 0, 0, 0.06);\n  color: rgba(0, 0, 0, 0.75);\n}\n.annotation-popup-module__light___h0-ZQ .annotation-popup-module__deleteButton___Wo28o {\n  color: rgba(0, 0, 0, 0.4);\n}\n.annotation-popup-module__light___h0-ZQ .annotation-popup-module__deleteButton___Wo28o:hover {\n  background: rgba(255, 59, 48, 0.15);\n  color: #ff3b30;\n}';
var classNames2 = { "popup": "annotation-popup-module__popup___PDGqY", "enter": "annotation-popup-module__enter___oKCIl", "popupEnter": "annotation-popup-module__popupEnter___Jw46V", "entered": "annotation-popup-module__entered___NFsl4", "exit": "annotation-popup-module__exit___rM7Hx", "popupExit": "annotation-popup-module__popupExit___XocAN", "shake": "annotation-popup-module__shake___xipFi", "header": "annotation-popup-module__header___6kDz-", "element": "annotation-popup-module__element___qYwDo", "headerToggle": "annotation-popup-module__headerToggle___IcORo", "chevron": "annotation-popup-module__chevron___vTQ8-", "expanded": "annotation-popup-module__expanded___uPG3k", "stylesWrapper": "annotation-popup-module__stylesWrapper___zvY0F", "stylesInner": "annotation-popup-module__stylesInner___WAukz", "stylesBlock": "annotation-popup-module__stylesBlock___Tx-no", "styleLine": "annotation-popup-module__styleLine___H6Ae6", "styleProperty": "annotation-popup-module__styleProperty___oioCJ", "styleValue": "annotation-popup-module__styleValue___7TzXf", "timestamp": "annotation-popup-module__timestamp___pZqyO", "quote": "annotation-popup-module__quote___QwLIF", "textarea": "annotation-popup-module__textarea___Zyn-U", "green": "annotation-popup-module__green___ekRyG", "actions": "annotation-popup-module__actions___drsIf", "cancel": "annotation-popup-module__cancel___rNb7H", "submit": "annotation-popup-module__submit___REHVM", "deleteWrapper": "annotation-popup-module__deleteWrapper___DSjb3", "deleteButton": "annotation-popup-module__deleteButton___Wo28o", "light": "annotation-popup-module__light___h0-ZQ" };
if (typeof document !== "undefined") {
  let style = document.getElementById("feedback-tool-styles-styles-annotation-popup");
  if (!style) {
    style = document.createElement("style");
    style.id = "feedback-tool-styles-styles-annotation-popup";
    style.textContent = css2;
    document.head.appendChild(style);
  }
}
var annotation_popup_module_default = classNames2;

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/AnnotationPopup.vue
var import_vue3 = require("vue");
var _sfc_main = /* @__PURE__ */ (0, import_vue.defineComponent)({
  __name: "AnnotationPopup",
  props: {
    element: { type: String, required: true },
    timestamp: { type: String, required: false },
    selectedText: { type: String, required: false },
    placeholder: { type: String, required: false, default: "What should change?" },
    initialValue: { type: String, required: false, default: "" },
    submitLabel: { type: String, required: false, default: "Add" },
    onSubmit: { type: Function, required: true },
    onCancel: { type: Function, required: true },
    onDelete: { type: Function, required: false },
    popupStyle: { type: Object, required: false },
    accentColor: { type: String, required: false, default: "#3c82f7" },
    isExiting: { type: Boolean, required: false, default: false },
    lightMode: { type: Boolean, required: false, default: false },
    computedStyles: { type: Object, required: false }
  },
  setup(__props, { expose: __expose }) {
    const props = __props;
    const text = (0, import_vue2.ref)(props.initialValue);
    const isShaking = (0, import_vue2.ref)(false);
    const animState = (0, import_vue2.ref)("initial");
    const isFocused = (0, import_vue2.ref)(false);
    const isStylesExpanded = (0, import_vue2.ref)(false);
    const textareaRef = (0, import_vue2.ref)(null);
    const popupRef = (0, import_vue2.ref)(null);
    let cancelTimer = null;
    let shakeTimer = null;
    (0, import_vue2.watch)(() => props.isExiting, (exiting) => {
      if (exiting && animState.value !== "exit") {
        animState.value = "exit";
      }
    });
    (0, import_vue2.onMounted)(() => {
      originalSetTimeout(() => {
        animState.value = "enter";
      }, 0);
      const enterTimer = originalSetTimeout(() => {
        animState.value = "entered";
      }, 200);
      const focusTimer = originalSetTimeout(() => {
        const textarea = textareaRef.value;
        if (textarea) {
          textarea.focus();
          textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
          textarea.scrollTop = textarea.scrollHeight;
        }
      }, 50);
      (0, import_vue2.onUnmounted)(() => {
        clearTimeout(enterTimer);
        clearTimeout(focusTimer);
        if (cancelTimer) clearTimeout(cancelTimer);
        if (shakeTimer) clearTimeout(shakeTimer);
      });
    });
    function shake() {
      if (shakeTimer) clearTimeout(shakeTimer);
      isShaking.value = true;
      shakeTimer = originalSetTimeout(() => {
        isShaking.value = false;
        textareaRef.value?.focus();
      }, 250);
    }
    function handleCancel() {
      animState.value = "exit";
      cancelTimer = originalSetTimeout(() => {
        props.onCancel();
      }, 150);
    }
    function handleSubmit() {
      if (!text.value.trim()) return;
      props.onSubmit(text.value.trim());
    }
    function handleKeyDown(e) {
      if (e.isComposing) return;
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
      if (e.key === "Escape") {
        handleCancel();
      }
    }
    function toggleStyles() {
      const wasExpanded = isStylesExpanded.value;
      isStylesExpanded.value = !isStylesExpanded.value;
      if (wasExpanded) {
        originalSetTimeout(() => textareaRef.value?.focus(), 0);
      }
    }
    __expose({ shake });
    function popupClassName() {
      return [
        annotation_popup_module_default.popup,
        props.lightMode ? annotation_popup_module_default.light : "",
        animState.value === "enter" ? annotation_popup_module_default.enter : "",
        animState.value === "entered" ? annotation_popup_module_default.entered : "",
        animState.value === "exit" ? annotation_popup_module_default.exit : "",
        isShaking.value ? annotation_popup_module_default.shake : ""
      ].filter(Boolean).join(" ");
    }
    function kebab(str) {
      return str.replace(/([A-Z])/g, "-$1").toLowerCase();
    }
    const __returned__ = { props, text, isShaking, animState, isFocused, isStylesExpanded, textareaRef, popupRef, get cancelTimer() {
      return cancelTimer;
    }, set cancelTimer(v) {
      cancelTimer = v;
    }, get shakeTimer() {
      return shakeTimer;
    }, set shakeTimer(v) {
      shakeTimer = v;
    }, shake, handleCancel, handleSubmit, handleKeyDown, toggleStyles, popupClassName, kebab, get styles() {
      return annotation_popup_module_default;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
var _hoisted_1 = ["placeholder", "value"];
var _hoisted_2 = ["disabled"];
function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (0, import_vue3.openBlock)(), (0, import_vue3.createElementBlock)(
    "div",
    {
      ref: "popupRef",
      class: (0, import_vue3.normalizeClass)($setup.popupClassName()),
      "data-annotation-popup": "",
      style: (0, import_vue3.normalizeStyle)($props.popupStyle),
      onClick: _cache[4] || (_cache[4] = (0, import_vue3.withModifiers)(() => {
      }, ["stop"]))
    },
    [
      (0, import_vue3.createElementVNode)(
        "div",
        {
          class: (0, import_vue3.normalizeClass)($setup.styles.header)
        },
        [
          $props.computedStyles && Object.keys($props.computedStyles).length > 0 ? ((0, import_vue3.openBlock)(), (0, import_vue3.createElementBlock)(
            "button",
            {
              key: 0,
              class: (0, import_vue3.normalizeClass)($setup.styles.headerToggle),
              type: "button",
              onClick: $setup.toggleStyles
            },
            [
              ((0, import_vue3.openBlock)(), (0, import_vue3.createElementBlock)(
                "svg",
                {
                  class: (0, import_vue3.normalizeClass)([$setup.styles.chevron, $setup.isStylesExpanded ? $setup.styles.expanded : ""]),
                  width: "14",
                  height: "14",
                  viewBox: "0 0 14 14",
                  fill: "none",
                  xmlns: "http://www.w3.org/2000/svg"
                },
                [..._cache[5] || (_cache[5] = [
                  (0, import_vue3.createElementVNode)(
                    "path",
                    {
                      d: "M5.5 10.25L9 7.25L5.75 4",
                      stroke: "currentColor",
                      "stroke-width": "1.5",
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round"
                    },
                    null,
                    -1
                    /* CACHED */
                  )
                ])],
                2
                /* CLASS */
              )),
              (0, import_vue3.createElementVNode)(
                "span",
                {
                  class: (0, import_vue3.normalizeClass)($setup.styles.element)
                },
                (0, import_vue3.toDisplayString)($props.element),
                3
                /* TEXT, CLASS */
              )
            ],
            2
            /* CLASS */
          )) : ((0, import_vue3.openBlock)(), (0, import_vue3.createElementBlock)(
            "span",
            {
              key: 1,
              class: (0, import_vue3.normalizeClass)($setup.styles.element)
            },
            (0, import_vue3.toDisplayString)($props.element),
            3
            /* TEXT, CLASS */
          )),
          $props.timestamp ? ((0, import_vue3.openBlock)(), (0, import_vue3.createElementBlock)(
            "span",
            {
              key: 2,
              class: (0, import_vue3.normalizeClass)($setup.styles.timestamp)
            },
            (0, import_vue3.toDisplayString)($props.timestamp),
            3
            /* TEXT, CLASS */
          )) : (0, import_vue3.createCommentVNode)("v-if", true)
        ],
        2
        /* CLASS */
      ),
      (0, import_vue3.createCommentVNode)(" Collapsible computed styles section "),
      $props.computedStyles && Object.keys($props.computedStyles).length > 0 ? ((0, import_vue3.openBlock)(), (0, import_vue3.createElementBlock)(
        "div",
        {
          key: 0,
          class: (0, import_vue3.normalizeClass)([$setup.styles.stylesWrapper, $setup.isStylesExpanded ? $setup.styles.expanded : ""])
        },
        [
          (0, import_vue3.createElementVNode)(
            "div",
            {
              class: (0, import_vue3.normalizeClass)($setup.styles.stylesInner)
            },
            [
              (0, import_vue3.createElementVNode)(
                "div",
                {
                  class: (0, import_vue3.normalizeClass)($setup.styles.stylesBlock)
                },
                [
                  ((0, import_vue3.openBlock)(true), (0, import_vue3.createElementBlock)(
                    import_vue3.Fragment,
                    null,
                    (0, import_vue3.renderList)($props.computedStyles, (value, key) => {
                      return (0, import_vue3.openBlock)(), (0, import_vue3.createElementBlock)(
                        "div",
                        {
                          key,
                          class: (0, import_vue3.normalizeClass)($setup.styles.styleLine)
                        },
                        [
                          (0, import_vue3.createElementVNode)(
                            "span",
                            {
                              class: (0, import_vue3.normalizeClass)($setup.styles.styleProperty)
                            },
                            (0, import_vue3.toDisplayString)($setup.kebab(String(key))),
                            3
                            /* TEXT, CLASS */
                          ),
                          _cache[6] || (_cache[6] = (0, import_vue3.createTextVNode)(
                            " : ",
                            -1
                            /* CACHED */
                          )),
                          (0, import_vue3.createElementVNode)(
                            "span",
                            {
                              class: (0, import_vue3.normalizeClass)($setup.styles.styleValue)
                            },
                            (0, import_vue3.toDisplayString)(value),
                            3
                            /* TEXT, CLASS */
                          ),
                          _cache[7] || (_cache[7] = (0, import_vue3.createTextVNode)(
                            "; ",
                            -1
                            /* CACHED */
                          ))
                        ],
                        2
                        /* CLASS */
                      );
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ],
                2
                /* CLASS */
              )
            ],
            2
            /* CLASS */
          )
        ],
        2
        /* CLASS */
      )) : (0, import_vue3.createCommentVNode)("v-if", true),
      $props.selectedText ? ((0, import_vue3.openBlock)(), (0, import_vue3.createElementBlock)(
        "div",
        {
          key: 1,
          class: (0, import_vue3.normalizeClass)($setup.styles.quote)
        },
        " \u201C" + (0, import_vue3.toDisplayString)($props.selectedText.slice(0, 80)) + (0, import_vue3.toDisplayString)($props.selectedText.length > 80 ? "..." : "") + "\u201D ",
        3
        /* TEXT, CLASS */
      )) : (0, import_vue3.createCommentVNode)("v-if", true),
      (0, import_vue3.createElementVNode)("textarea", {
        ref: "textareaRef",
        class: (0, import_vue3.normalizeClass)($setup.styles.textarea),
        style: (0, import_vue3.normalizeStyle)({ borderColor: $setup.isFocused ? $props.accentColor : void 0 }),
        placeholder: $props.placeholder,
        value: $setup.text,
        rows: 2,
        onInput: _cache[0] || (_cache[0] = ($event) => $setup.text = $event.target.value),
        onFocus: _cache[1] || (_cache[1] = ($event) => $setup.isFocused = true),
        onBlur: _cache[2] || (_cache[2] = ($event) => $setup.isFocused = false),
        onKeydown: $setup.handleKeyDown
      }, null, 46, _hoisted_1),
      (0, import_vue3.createElementVNode)(
        "div",
        {
          class: (0, import_vue3.normalizeClass)($setup.styles.actions)
        },
        [
          $props.onDelete ? ((0, import_vue3.openBlock)(), (0, import_vue3.createElementBlock)(
            "div",
            {
              key: 0,
              class: (0, import_vue3.normalizeClass)($setup.styles.deleteWrapper)
            },
            [
              (0, import_vue3.createElementVNode)(
                "button",
                {
                  class: (0, import_vue3.normalizeClass)($setup.styles.deleteButton),
                  type: "button",
                  onClick: _cache[3] || (_cache[3] = (...args) => $props.onDelete && $props.onDelete(...args))
                },
                [..._cache[8] || (_cache[8] = [
                  (0, import_vue3.createElementVNode)(
                    "svg",
                    {
                      width: "22",
                      height: "22",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      xmlns: "http://www.w3.org/2000/svg"
                    },
                    [
                      (0, import_vue3.createElementVNode)("path", {
                        d: "M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6",
                        stroke: "currentColor",
                        "stroke-width": "1.5",
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round"
                      })
                    ],
                    -1
                    /* CACHED */
                  )
                ])],
                2
                /* CLASS */
              )
            ],
            2
            /* CLASS */
          )) : (0, import_vue3.createCommentVNode)("v-if", true),
          (0, import_vue3.createElementVNode)(
            "button",
            {
              class: (0, import_vue3.normalizeClass)($setup.styles.cancel),
              onClick: $setup.handleCancel
            },
            "Cancel",
            2
            /* CLASS */
          ),
          (0, import_vue3.createElementVNode)("button", {
            class: (0, import_vue3.normalizeClass)($setup.styles.submit),
            style: (0, import_vue3.normalizeStyle)({
              backgroundColor: $props.accentColor,
              opacity: $setup.text.trim() ? 1 : 0.4
            }),
            disabled: !$setup.text.trim(),
            onClick: $setup.handleSubmit
          }, (0, import_vue3.toDisplayString)($props.submitLabel), 15, _hoisted_2)
        ],
        2
        /* CLASS */
      )
    ],
    6
    /* CLASS, STYLE */
  );
}
_sfc_main.render = render;
var AnnotationPopup_default = _sfc_main;

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/AnnotationMarker.vue
var import_vue77 = require("vue");
var import_vue78 = require("vue");

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/icons/IconClose.vue
var import_vue4 = require("vue");
var import_vue5 = require("vue");
var _sfc_main2 = /* @__PURE__ */ (0, import_vue4.defineComponent)({
  __name: "IconClose",
  props: {
    size: { type: Number, required: false, default: 16 }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = {};
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
var _hoisted_12 = ["width", "height"];
function render2(_ctx, _cache, $props, $setup, $data, $options) {
  return (0, import_vue5.openBlock)(), (0, import_vue5.createElementBlock)("svg", {
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 16 16",
    fill: "none"
  }, [..._cache[0] || (_cache[0] = [
    (0, import_vue5.createElementVNode)(
      "path",
      {
        d: "M4 4l8 8M12 4l-8 8",
        stroke: "currentColor",
        "stroke-width": "1.5",
        "stroke-linecap": "round"
      },
      null,
      -1
      /* CACHED */
    )
  ])], 8, _hoisted_12);
}
_sfc_main2.render = render2;
var IconClose_default = _sfc_main2;

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/icons/IconPlus.vue
var import_vue6 = require("vue");
var import_vue7 = require("vue");
var _sfc_main3 = /* @__PURE__ */ (0, import_vue6.defineComponent)({
  __name: "IconPlus",
  props: {
    size: { type: Number, required: false, default: 16 }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = {};
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
var _hoisted_13 = ["width", "height"];
function render3(_ctx, _cache, $props, $setup, $data, $options) {
  return (0, import_vue7.openBlock)(), (0, import_vue7.createElementBlock)("svg", {
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 16 16",
    fill: "none"
  }, [..._cache[0] || (_cache[0] = [
    (0, import_vue7.createElementVNode)(
      "path",
      {
        d: "M8 3v10M3 8h10",
        stroke: "currentColor",
        "stroke-width": "1.5",
        "stroke-linecap": "round"
      },
      null,
      -1
      /* CACHED */
    )
  ])], 8, _hoisted_13);
}
_sfc_main3.render = render3;
var IconPlus_default = _sfc_main3;

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/icons/IconCheck.vue
var import_vue8 = require("vue");
var import_vue9 = require("vue");
var _sfc_main4 = /* @__PURE__ */ (0, import_vue8.defineComponent)({
  __name: "IconCheck",
  props: {
    size: { type: Number, required: false, default: 16 }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = {};
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
var _hoisted_14 = ["width", "height"];
function render4(_ctx, _cache, $props, $setup, $data, $options) {
  return (0, import_vue9.openBlock)(), (0, import_vue9.createElementBlock)("svg", {
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 16 16",
    fill: "none"
  }, [..._cache[0] || (_cache[0] = [
    (0, import_vue9.createElementVNode)(
      "path",
      {
        d: "M3 8l3.5 3.5L13 5",
        stroke: "currentColor",
        "stroke-width": "1.5",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      },
      null,
      -1
      /* CACHED */
    )
  ])], 8, _hoisted_14);
}
_sfc_main4.render = render4;
var IconCheck_default = _sfc_main4;

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/icons/IconCheckSmall.vue
var import_vue10 = require("vue");
var import_vue11 = require("vue");
var _sfc_main5 = /* @__PURE__ */ (0, import_vue10.defineComponent)({
  __name: "IconCheckSmall",
  props: {
    size: { type: Number, required: false, default: 14 }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = {};
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
var _hoisted_15 = ["width", "height"];
function render5(_ctx, _cache, $props, $setup, $data, $options) {
  return (0, import_vue11.openBlock)(), (0, import_vue11.createElementBlock)("svg", {
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 14 14",
    fill: "none"
  }, [..._cache[0] || (_cache[0] = [
    (0, import_vue11.createElementVNode)(
      "path",
      {
        d: "M3.9375 7L6.125 9.1875L10.5 4.8125",
        stroke: "currentColor",
        "stroke-width": "1.5",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      },
      null,
      -1
      /* CACHED */
    )
  ])], 8, _hoisted_15);
}
_sfc_main5.render = render5;
var IconCheckSmall_default = _sfc_main5;

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/icons/IconListSparkle.vue
var import_vue12 = require("vue");
var import_vue13 = require("vue");
var _sfc_main6 = /* @__PURE__ */ (0, import_vue12.defineComponent)({
  __name: "IconListSparkle",
  props: {
    size: { type: Number, required: false, default: 24 },
    style: { type: null, required: false, default: () => ({}) }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = {};
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
var _hoisted_16 = ["width", "height"];
function render6(_ctx, _cache, $props, $setup, $data, $options) {
  return (0, import_vue13.openBlock)(), (0, import_vue13.createElementBlock)("svg", {
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 24 24",
    fill: "none",
    style: (0, import_vue13.normalizeStyle)($props.style)
  }, [..._cache[0] || (_cache[0] = [
    (0, import_vue13.createStaticVNode)('<g clip-path="url(#clip0_list_sparkle)"><path d="M11.5 12L5.5 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M18.5 6.75L5.5 6.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M9.25 17.25L5.5 17.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M16 12.75L16.5179 13.9677C16.8078 14.6494 17.3506 15.1922 18.0323 15.4821L19.25 16L18.0323 16.5179C17.3506 16.8078 16.8078 17.3506 16.5179 18.0323L16 19.25L15.4821 18.0323C15.1922 17.3506 14.6494 16.8078 13.9677 16.5179L12.75 16L13.9677 15.4821C14.6494 15.1922 15.1922 14.6494 15.4821 13.9677L16 12.75Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path></g><defs><clipPath id="clip0_list_sparkle"><rect width="24" height="24" fill="white"></rect></clipPath></defs>', 2)
  ])], 12, _hoisted_16);
}
_sfc_main6.render = render6;
var IconListSparkle_default = _sfc_main6;

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/icons/IconHelp.vue
var import_vue14 = require("vue");
var import_vue15 = require("vue");
var _sfc_main7 = /* @__PURE__ */ (0, import_vue14.defineComponent)({
  __name: "IconHelp",
  props: {
    size: { type: Number, required: false, default: 20 }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = {};
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
var _hoisted_17 = ["width", "height"];
function render7(_ctx, _cache, $props, $setup, $data, $options) {
  return (0, import_vue15.openBlock)(), (0, import_vue15.createElementBlock)("svg", {
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 20 20",
    fill: "none"
  }, [..._cache[0] || (_cache[0] = [
    (0, import_vue15.createElementVNode)(
      "circle",
      {
        cx: "10",
        cy: "10.5",
        r: "5.25",
        stroke: "currentColor",
        "stroke-width": "1.25"
      },
      null,
      -1
      /* CACHED */
    ),
    (0, import_vue15.createElementVNode)(
      "path",
      {
        d: "M8.5 8.75C8.5 7.92 9.17 7.25 10 7.25C10.83 7.25 11.5 7.92 11.5 8.75C11.5 9.58 10.83 10.25 10 10.25V11",
        stroke: "currentColor",
        "stroke-width": "1.25",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      },
      null,
      -1
      /* CACHED */
    ),
    (0, import_vue15.createElementVNode)(
      "circle",
      {
        cx: "10",
        cy: "13",
        r: "0.75",
        fill: "currentColor"
      },
      null,
      -1
      /* CACHED */
    )
  ])], 8, _hoisted_17);
}
_sfc_main7.render = render7;
var IconHelp_default = _sfc_main7;

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/icons/IconCheckSmallAnimated.vue
var import_vue16 = require("vue");
var import_vue17 = require("vue");
var _sfc_main8 = /* @__PURE__ */ (0, import_vue16.defineComponent)({
  __name: "IconCheckSmallAnimated",
  props: {
    size: { type: Number, required: false, default: 14 }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = {};
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
var _hoisted_18 = ["width", "height"];
function render8(_ctx, _cache, $props, $setup, $data, $options) {
  return (0, import_vue17.openBlock)(), (0, import_vue17.createElementBlock)("svg", {
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 14 14",
    fill: "none"
  }, [..._cache[0] || (_cache[0] = [
    (0, import_vue17.createElementVNode)(
      "path",
      {
        class: "check-path-animated",
        d: "M3.9375 7L6.125 9.1875L10.5 4.8125",
        stroke: "currentColor",
        "stroke-width": "1.5",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      },
      null,
      -1
      /* CACHED */
    )
  ])], 8, _hoisted_18);
}
_sfc_main8.render = render8;
if (typeof document !== "undefined") {
  let _style = document.getElementById("vue-sfc-IconCheckSmallAnimated-0");
  if (!_style) {
    _style = document.createElement("style");
    _style.id = "vue-sfc-IconCheckSmallAnimated-0";
    _style.textContent = "\n@keyframes checkDraw {\n  0% { stroke-dashoffset: 12; }\n  100% { stroke-dashoffset: 0; }\n}\n@keyframes checkBounce {\n  0% { transform: scale(0.5); opacity: 0; }\n  50% { transform: scale(1.12); opacity: 1; }\n  75% { transform: scale(0.95); }\n  100% { transform: scale(1); }\n}\n.check-path-animated {\n  stroke-dasharray: 12;\n  stroke-dashoffset: 0;\n  transform-origin: center;\n  animation: checkDraw 0.18s ease-out, checkBounce 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);\n}\n";
    document.head.appendChild(_style);
  }
}
var IconCheckSmallAnimated_default = _sfc_main8;

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/icons/IconCopyAlt.vue
var import_vue18 = require("vue");
var import_vue19 = require("vue");
var _sfc_main9 = /* @__PURE__ */ (0, import_vue18.defineComponent)({
  __name: "IconCopyAlt",
  props: {
    size: { type: Number, required: false, default: 16 }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = {};
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
var _hoisted_19 = ["width", "height"];
function render9(_ctx, _cache, $props, $setup, $data, $options) {
  return (0, import_vue19.openBlock)(), (0, import_vue19.createElementBlock)("svg", {
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 24 24",
    fill: "none"
  }, [..._cache[0] || (_cache[0] = [
    (0, import_vue19.createElementVNode)(
      "path",
      {
        d: "M4.75 11.25C4.75 10.4216 5.42157 9.75 6.25 9.75H12.75C13.5784 9.75 14.25 10.4216 14.25 11.25V17.75C14.25 18.5784 13.5784 19.25 12.75 19.25H6.25C5.42157 19.25 4.75 18.5784 4.75 17.75V11.25Z",
        stroke: "currentColor",
        "stroke-width": "1.5"
      },
      null,
      -1
      /* CACHED */
    ),
    (0, import_vue19.createElementVNode)(
      "path",
      {
        d: "M17.25 14.25H17.75C18.5784 14.25 19.25 13.5784 19.25 12.75V6.25C19.25 5.42157 18.5784 4.75 17.75 4.75H11.25C10.4216 4.75 9.75 5.42157 9.75 6.25V6.75",
        stroke: "currentColor",
        "stroke-width": "1.5",
        "stroke-linecap": "round"
      },
      null,
      -1
      /* CACHED */
    )
  ])], 8, _hoisted_19);
}
_sfc_main9.render = render9;
var IconCopyAlt_default = _sfc_main9;

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/icons/IconCopyAnimated.vue
var import_vue20 = require("vue");
var import_vue21 = require("vue");
var _sfc_main10 = /* @__PURE__ */ (0, import_vue20.defineComponent)({
  __name: "IconCopyAnimated",
  props: {
    size: { type: Number, required: false, default: 24 },
    copied: { type: Boolean, required: false, default: false }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = {};
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
var _hoisted_110 = ["width", "height"];
function render10(_ctx, _cache, $props, $setup, $data, $options) {
  return (0, import_vue21.openBlock)(), (0, import_vue21.createElementBlock)("svg", {
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 24 24",
    fill: "none"
  }, [
    (0, import_vue21.createCommentVNode)(" Copy icon "),
    (0, import_vue21.createElementVNode)(
      "g",
      {
        class: "copy-icon",
        style: (0, import_vue21.normalizeStyle)({
          opacity: $props.copied ? 0 : 1,
          transform: $props.copied ? "scale(0.8)" : "scale(1)",
          transformOrigin: "center"
        })
      },
      [..._cache[0] || (_cache[0] = [
        (0, import_vue21.createElementVNode)(
          "path",
          {
            d: "M4.75 11.25C4.75 10.4216 5.42157 9.75 6.25 9.75H12.75C13.5784 9.75 14.25 10.4216 14.25 11.25V17.75C14.25 18.5784 13.5784 19.25 12.75 19.25H6.25C5.42157 19.25 4.75 18.5784 4.75 17.75V11.25Z",
            stroke: "currentColor",
            "stroke-width": "1.5"
          },
          null,
          -1
          /* CACHED */
        ),
        (0, import_vue21.createElementVNode)(
          "path",
          {
            d: "M17.25 14.25H17.75C18.5784 14.25 19.25 13.5784 19.25 12.75V6.25C19.25 5.42157 18.5784 4.75 17.75 4.75H11.25C10.4216 4.75 9.75 5.42157 9.75 6.25V6.75",
            stroke: "currentColor",
            "stroke-width": "1.5",
            "stroke-linecap": "round"
          },
          null,
          -1
          /* CACHED */
        )
      ])],
      4
      /* STYLE */
    ),
    (0, import_vue21.createCommentVNode)(" Checkmark circle "),
    (0, import_vue21.createElementVNode)(
      "g",
      {
        class: "check-icon",
        style: (0, import_vue21.normalizeStyle)({
          opacity: $props.copied ? 1 : 0,
          transform: $props.copied ? "scale(1)" : "scale(0.8)",
          transformOrigin: "center"
        })
      },
      [..._cache[1] || (_cache[1] = [
        (0, import_vue21.createElementVNode)(
          "path",
          {
            d: "M12 20C7.58172 20 4 16.4182 4 12C4 7.58172 7.58172 4 12 4C16.4182 4 20 7.58172 20 12C20 16.4182 16.4182 20 12 20Z",
            stroke: "#22c55e",
            "stroke-width": "1.5",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          },
          null,
          -1
          /* CACHED */
        ),
        (0, import_vue21.createElementVNode)(
          "path",
          {
            d: "M15 10L11 14.25L9.25 12.25",
            stroke: "#22c55e",
            "stroke-width": "1.5",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          },
          null,
          -1
          /* CACHED */
        )
      ])],
      4
      /* STYLE */
    )
  ], 8, _hoisted_110);
}
_sfc_main10.render = render10;
if (typeof document !== "undefined") {
  let _style = document.getElementById("vue-sfc-IconCopyAnimated-0");
  if (!_style) {
    _style = document.createElement("style");
    _style.id = "vue-sfc-IconCopyAnimated-0";
    _style.textContent = "\n.copy-icon, .check-icon {\n  transition: opacity 0.2s ease, transform 0.2s ease;\n}\n";
    document.head.appendChild(_style);
  }
}
var IconCopyAnimated_default = _sfc_main10;

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/icons/IconSendArrow.vue
var import_vue22 = require("vue");
var import_vue23 = require("vue");
var import_vue24 = require("vue");
var _sfc_main11 = /* @__PURE__ */ (0, import_vue22.defineComponent)({
  __name: "IconSendArrow",
  props: {
    size: { type: Number, required: false, default: 24 },
    state: { type: String, required: false, default: "idle" }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const showArrow = (0, import_vue23.computed)(() => props.state === "idle");
    const showCheck = (0, import_vue23.computed)(() => props.state === "sent");
    const showError = (0, import_vue23.computed)(() => props.state === "failed");
    const isSending = (0, import_vue23.computed)(() => props.state === "sending");
    const arrowStyle = (0, import_vue23.computed)(() => ({
      opacity: showArrow.value ? 1 : isSending.value ? 0.5 : 0,
      transform: showArrow.value ? "scale(1)" : "scale(0.8)",
      transformOrigin: "center"
    }));
    const checkStyle = (0, import_vue23.computed)(() => ({
      opacity: showCheck.value ? 1 : 0,
      transform: showCheck.value ? "scale(1)" : "scale(0.8)",
      transformOrigin: "center"
    }));
    const errorStyle = (0, import_vue23.computed)(() => ({
      opacity: showError.value ? 1 : 0,
      transform: showError.value ? "scale(1)" : "scale(0.8)",
      transformOrigin: "center"
    }));
    const __returned__ = { props, showArrow, showCheck, showError, isSending, arrowStyle, checkStyle, errorStyle };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
var _hoisted_111 = ["width", "height"];
function render11(_ctx, _cache, $props, $setup, $data, $options) {
  return (0, import_vue24.openBlock)(), (0, import_vue24.createElementBlock)("svg", {
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 24 24",
    fill: "none"
  }, [
    (0, import_vue24.createCommentVNode)(" Send arrow "),
    (0, import_vue24.createElementVNode)(
      "g",
      {
        class: "send-arrow-icon",
        style: (0, import_vue24.normalizeStyle)($setup.arrowStyle)
      },
      [..._cache[0] || (_cache[0] = [
        (0, import_vue24.createElementVNode)(
          "path",
          {
            d: "M9.875 14.125L12.3506 19.6951C12.7184 20.5227 13.9091 20.4741 14.2083 19.6193L18.8139 6.46032C19.0907 5.6695 18.3305 4.90933 17.5397 5.18611L4.38072 9.79174C3.52589 10.0909 3.47731 11.2816 4.30494 11.6494L9.875 14.125ZM9.875 14.125L13.375 10.625",
            stroke: "currentColor",
            "stroke-width": "1.5",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          },
          null,
          -1
          /* CACHED */
        )
      ])],
      4
      /* STYLE */
    ),
    (0, import_vue24.createCommentVNode)(" Green checkmark circle "),
    (0, import_vue24.createElementVNode)(
      "g",
      {
        class: "send-check-icon",
        style: (0, import_vue24.normalizeStyle)($setup.checkStyle)
      },
      [..._cache[1] || (_cache[1] = [
        (0, import_vue24.createElementVNode)(
          "path",
          {
            d: "M12 20C7.58172 20 4 16.4182 4 12C4 7.58172 7.58172 4 12 4C16.4182 4 20 7.58172 20 12C20 16.4182 16.4182 20 12 20Z",
            stroke: "#22c55e",
            "stroke-width": "1.5",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          },
          null,
          -1
          /* CACHED */
        ),
        (0, import_vue24.createElementVNode)(
          "path",
          {
            d: "M15 10L11 14.25L9.25 12.25",
            stroke: "#22c55e",
            "stroke-width": "1.5",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          },
          null,
          -1
          /* CACHED */
        )
      ])],
      4
      /* STYLE */
    ),
    (0, import_vue24.createCommentVNode)(" Red error circle with exclamation "),
    (0, import_vue24.createElementVNode)(
      "g",
      {
        class: "send-error-icon",
        style: (0, import_vue24.normalizeStyle)($setup.errorStyle)
      },
      [..._cache[2] || (_cache[2] = [
        (0, import_vue24.createElementVNode)(
          "path",
          {
            d: "M12 20C7.58172 20 4 16.4182 4 12C4 7.58172 7.58172 4 12 4C16.4182 4 20 7.58172 20 12C20 16.4182 16.4182 20 12 20Z",
            stroke: "#ef4444",
            "stroke-width": "1.5",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          },
          null,
          -1
          /* CACHED */
        ),
        (0, import_vue24.createElementVNode)(
          "path",
          {
            d: "M12 8V12",
            stroke: "#ef4444",
            "stroke-width": "1.5",
            "stroke-linecap": "round"
          },
          null,
          -1
          /* CACHED */
        ),
        (0, import_vue24.createElementVNode)(
          "circle",
          {
            cx: "12",
            cy: "15",
            r: "0.5",
            fill: "#ef4444",
            stroke: "#ef4444",
            "stroke-width": "1"
          },
          null,
          -1
          /* CACHED */
        )
      ])],
      4
      /* STYLE */
    )
  ], 8, _hoisted_111);
}
_sfc_main11.render = render11;
if (typeof document !== "undefined") {
  let _style = document.getElementById("vue-sfc-IconSendArrow-0");
  if (!_style) {
    _style = document.createElement("style");
    _style.id = "vue-sfc-IconSendArrow-0";
    _style.textContent = "\n.send-arrow-icon, .send-check-icon, .send-error-icon {\n  transition: opacity 0.15s ease, transform 0.15s ease;\n}\n";
    document.head.appendChild(_style);
  }
}
var IconSendArrow_default = _sfc_main11;

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/icons/IconSendAnimated.vue
var import_vue25 = require("vue");
var import_vue26 = require("vue");
var _sfc_main12 = /* @__PURE__ */ (0, import_vue25.defineComponent)({
  __name: "IconSendAnimated",
  props: {
    size: { type: Number, required: false, default: 24 },
    sent: { type: Boolean, required: false, default: false }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = {};
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
var _hoisted_112 = ["width", "height"];
function render12(_ctx, _cache, $props, $setup, $data, $options) {
  return (0, import_vue26.openBlock)(), (0, import_vue26.createElementBlock)("svg", {
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 22 21",
    fill: "none"
  }, [
    (0, import_vue26.createCommentVNode)(" Send icon (document with arrow) "),
    (0, import_vue26.createElementVNode)(
      "g",
      {
        class: "send-icon",
        style: (0, import_vue26.normalizeStyle)({
          opacity: $props.sent ? 0 : 1,
          transform: $props.sent ? "scale(0.8)" : "scale(1)",
          transformOrigin: "center"
        })
      },
      [..._cache[0] || (_cache[0] = [
        (0, import_vue26.createElementVNode)(
          "path",
          {
            d: "M9.5 5H6.5C4.84315 5 3.5 6.34315 3.5 8V15C3.5 16.6569 4.84315 18 6.5 18H13.5C15.1569 18 16.5 16.6569 16.5 15V12",
            stroke: "currentColor",
            "stroke-width": "1.5",
            "stroke-linecap": "round"
          },
          null,
          -1
          /* CACHED */
        ),
        (0, import_vue26.createElementVNode)(
          "path",
          {
            d: "M13.5 8.5L18.5 3.5M18.5 3.5L14.4524 3.5M18.5 3.5L18.5 7.54762",
            stroke: "currentColor",
            "stroke-width": "1.5",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          },
          null,
          -1
          /* CACHED */
        ),
        (0, import_vue26.createElementVNode)(
          "path",
          {
            d: "M7.5 13.75H12.5",
            stroke: "currentColor",
            "stroke-width": "1.5",
            "stroke-linecap": "round"
          },
          null,
          -1
          /* CACHED */
        ),
        (0, import_vue26.createElementVNode)(
          "path",
          {
            d: "M7.5 10.75H10.5",
            stroke: "currentColor",
            "stroke-width": "1.5",
            "stroke-linecap": "round"
          },
          null,
          -1
          /* CACHED */
        )
      ])],
      4
      /* STYLE */
    ),
    (0, import_vue26.createCommentVNode)(" Checkmark circle (success state) "),
    (0, import_vue26.createElementVNode)(
      "g",
      {
        class: "sent-icon",
        style: (0, import_vue26.normalizeStyle)({
          opacity: $props.sent ? 1 : 0,
          transform: $props.sent ? "scale(1)" : "scale(0.8)",
          transformOrigin: "center"
        })
      },
      [..._cache[1] || (_cache[1] = [
        (0, import_vue26.createElementVNode)(
          "path",
          {
            d: "M11 19C6.58172 19 3 15.4182 3 11C3 6.58172 6.58172 3 11 3C15.4182 3 19 6.58172 19 11C19 15.4182 15.4182 19 11 19Z",
            stroke: "currentColor",
            "stroke-width": "1.5",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          },
          null,
          -1
          /* CACHED */
        ),
        (0, import_vue26.createElementVNode)(
          "path",
          {
            d: "M14 9L10 13.25L8.25 11.25",
            stroke: "currentColor",
            "stroke-width": "1.5",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          },
          null,
          -1
          /* CACHED */
        )
      ])],
      4
      /* STYLE */
    )
  ], 8, _hoisted_112);
}
_sfc_main12.render = render12;
if (typeof document !== "undefined") {
  let _style = document.getElementById("vue-sfc-IconSendAnimated-0");
  if (!_style) {
    _style = document.createElement("style");
    _style.id = "vue-sfc-IconSendAnimated-0";
    _style.textContent = "\n.send-icon, .sent-icon {\n  transition: opacity 0.2s ease, transform 0.2s ease;\n}\n";
    document.head.appendChild(_style);
  }
}
var IconSendAnimated_default = _sfc_main12;

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/icons/IconEye.vue
var import_vue27 = require("vue");
var import_vue28 = require("vue");
var _sfc_main13 = /* @__PURE__ */ (0, import_vue27.defineComponent)({
  __name: "IconEye",
  props: {
    size: { type: Number, required: false, default: 16 }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = {};
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
var _hoisted_113 = ["width", "height"];
function render13(_ctx, _cache, $props, $setup, $data, $options) {
  return (0, import_vue28.openBlock)(), (0, import_vue28.createElementBlock)("svg", {
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 24 24",
    fill: "none"
  }, [..._cache[0] || (_cache[0] = [
    (0, import_vue28.createElementVNode)(
      "path",
      {
        d: "M4.91516 12.7108C4.63794 12.2883 4.63705 11.7565 4.91242 11.3328C5.84146 9.9033 8.30909 6.74994 12 6.74994C15.6909 6.74994 18.1585 9.9033 19.0876 11.3328C19.3629 11.7565 19.3621 12.2883 19.0848 12.7108C18.1537 14.13 15.6873 17.2499 12 17.2499C8.31272 17.2499 5.8463 14.13 4.91516 12.7108Z",
        stroke: "currentColor",
        "stroke-width": "1.5",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      },
      null,
      -1
      /* CACHED */
    ),
    (0, import_vue28.createElementVNode)(
      "path",
      {
        d: "M12 14.25C13.2426 14.25 14.25 13.2426 14.25 12C14.25 10.7574 13.2426 9.75 12 9.75C10.7574 9.75 9.75 10.7574 9.75 12C9.75 13.2426 10.7574 14.25 12 14.25Z",
        stroke: "currentColor",
        "stroke-width": "1.5",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      },
      null,
      -1
      /* CACHED */
    )
  ])], 8, _hoisted_113);
}
_sfc_main13.render = render13;
var IconEye_default = _sfc_main13;

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/icons/IconEyeAlt.vue
var import_vue29 = require("vue");
var import_vue30 = require("vue");
var _sfc_main14 = /* @__PURE__ */ (0, import_vue29.defineComponent)({
  __name: "IconEyeAlt",
  props: {
    size: { type: Number, required: false, default: 24 }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = {};
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
var _hoisted_114 = ["width", "height"];
function render14(_ctx, _cache, $props, $setup, $data, $options) {
  return (0, import_vue30.openBlock)(), (0, import_vue30.createElementBlock)("svg", {
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 24 24",
    fill: "none"
  }, [..._cache[0] || (_cache[0] = [
    (0, import_vue30.createElementVNode)(
      "path",
      {
        d: "M3.91752 12.7539C3.65127 12.2996 3.65037 11.7515 3.9149 11.2962C4.9042 9.59346 7.72688 5.49994 12 5.49994C16.2731 5.49994 19.0958 9.59346 20.0851 11.2962C20.3496 11.7515 20.3487 12.2996 20.0825 12.7539C19.0908 14.4459 16.2694 18.4999 12 18.4999C7.73064 18.4999 4.90918 14.4459 3.91752 12.7539Z",
        stroke: "currentColor",
        "stroke-width": "1.5",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      },
      null,
      -1
      /* CACHED */
    ),
    (0, import_vue30.createElementVNode)(
      "path",
      {
        d: "M12 14.8261C13.5608 14.8261 14.8261 13.5608 14.8261 12C14.8261 10.4392 13.5608 9.17392 12 9.17392C10.4392 9.17392 9.17391 10.4392 9.17391 12C9.17391 13.5608 10.4392 14.8261 12 14.8261Z",
        stroke: "currentColor",
        "stroke-width": "1.5",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      },
      null,
      -1
      /* CACHED */
    )
  ])], 8, _hoisted_114);
}
_sfc_main14.render = render14;
var IconEyeAlt_default = _sfc_main14;

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/icons/IconEyeClosed.vue
var import_vue31 = require("vue");
var import_vue32 = require("vue");
var _sfc_main15 = /* @__PURE__ */ (0, import_vue31.defineComponent)({
  __name: "IconEyeClosed",
  props: {
    size: { type: Number, required: false, default: 24 }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = {};
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
var _hoisted_115 = ["width", "height"];
function render15(_ctx, _cache, $props, $setup, $data, $options) {
  return (0, import_vue32.openBlock)(), (0, import_vue32.createElementBlock)("svg", {
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 24 24",
    fill: "none"
  }, [..._cache[0] || (_cache[0] = [
    (0, import_vue32.createElementVNode)(
      "path",
      {
        d: "M18.6025 9.28503C18.9174 8.9701 19.4364 8.99481 19.7015 9.35271C20.1484 9.95606 20.4943 10.507 20.7342 10.9199C21.134 11.6086 21.1329 12.4454 20.7303 13.1328C20.2144 14.013 19.2151 15.5225 17.7723 16.8193C16.3293 18.1162 14.3852 19.2497 12.0008 19.25C11.4192 19.25 10.8638 19.1823 10.3355 19.0613C9.77966 18.934 9.63498 18.2525 10.0382 17.8493C10.2412 17.6463 10.5374 17.573 10.8188 17.6302C11.1993 17.7076 11.5935 17.75 12.0008 17.75C13.8848 17.7497 15.4867 16.8568 16.7693 15.7041C18.0522 14.5511 18.9606 13.1867 19.4363 12.375C19.5656 12.1543 19.5659 11.8943 19.4373 11.6729C19.2235 11.3049 18.921 10.8242 18.5364 10.3003C18.3085 9.98991 18.3302 9.5573 18.6025 9.28503ZM12.0008 4.75C12.5814 4.75006 13.1358 4.81803 13.6632 4.93953C14.2182 5.06741 14.362 5.74812 13.9593 6.15091C13.7558 6.35435 13.4589 6.42748 13.1771 6.36984C12.7983 6.29239 12.4061 6.25006 12.0008 6.25C10.1167 6.25 8.51415 7.15145 7.23028 8.31543C5.94678 9.47919 5.03918 10.8555 4.56426 11.6729C4.43551 11.8945 4.43582 12.1542 4.56524 12.375C4.77587 12.7343 5.07189 13.2012 5.44718 13.7105C5.67623 14.0213 5.65493 14.4552 5.38193 14.7282C5.0671 15.0431 4.54833 15.0189 4.28292 14.6614C3.84652 14.0736 3.50813 13.5369 3.27129 13.1328C2.86831 12.4451 2.86717 11.6088 3.26739 10.9199C3.78185 10.0345 4.77959 8.51239 6.22247 7.2041C7.66547 5.89584 9.61202 4.75 12.0008 4.75Z",
        fill: "currentColor"
      },
      null,
      -1
      /* CACHED */
    ),
    (0, import_vue32.createElementVNode)(
      "path",
      {
        d: "M5 19L19 5",
        stroke: "currentColor",
        "stroke-width": "1.5",
        "stroke-linecap": "round"
      },
      null,
      -1
      /* CACHED */
    )
  ])], 8, _hoisted_115);
}
_sfc_main15.render = render15;
var IconEyeClosed_default = _sfc_main15;

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/icons/IconEyeAnimated.vue
var import_vue33 = require("vue");
var import_vue34 = require("vue");
var _sfc_main16 = /* @__PURE__ */ (0, import_vue33.defineComponent)({
  __name: "IconEyeAnimated",
  props: {
    size: { type: Number, required: false, default: 24 },
    isOpen: { type: Boolean, required: false, default: true }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = {};
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
var _hoisted_116 = ["width", "height"];
function render16(_ctx, _cache, $props, $setup, $data, $options) {
  return (0, import_vue34.openBlock)(), (0, import_vue34.createElementBlock)("svg", {
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 24 24",
    fill: "none"
  }, [
    (0, import_vue34.createCommentVNode)(" Open state - full outline + pupil "),
    (0, import_vue34.createElementVNode)(
      "g",
      {
        class: "eye-open",
        style: (0, import_vue34.normalizeStyle)({ opacity: $props.isOpen ? 1 : 0 })
      },
      [..._cache[0] || (_cache[0] = [
        (0, import_vue34.createElementVNode)(
          "path",
          {
            d: "M3.91752 12.7539C3.65127 12.2996 3.65037 11.7515 3.9149 11.2962C4.9042 9.59346 7.72688 5.49994 12 5.49994C16.2731 5.49994 19.0958 9.59346 20.0851 11.2962C20.3496 11.7515 20.3487 12.2996 20.0825 12.7539C19.0908 14.4459 16.2694 18.4999 12 18.4999C7.73064 18.4999 4.90918 14.4459 3.91752 12.7539Z",
            stroke: "currentColor",
            "stroke-width": "1.5",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          },
          null,
          -1
          /* CACHED */
        ),
        (0, import_vue34.createElementVNode)(
          "path",
          {
            d: "M12 14.8261C13.5608 14.8261 14.8261 13.5608 14.8261 12C14.8261 10.4392 13.5608 9.17392 12 9.17392C10.4392 9.17392 9.17391 10.4392 9.17391 12C9.17391 13.5608 10.4392 14.8261 12 14.8261Z",
            stroke: "currentColor",
            "stroke-width": "1.5",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          },
          null,
          -1
          /* CACHED */
        )
      ])],
      4
      /* STYLE */
    ),
    (0, import_vue34.createCommentVNode)(" Closed state - split outline + slash "),
    (0, import_vue34.createElementVNode)(
      "g",
      {
        class: "eye-closed",
        style: (0, import_vue34.normalizeStyle)({ opacity: $props.isOpen ? 0 : 1 })
      },
      [..._cache[1] || (_cache[1] = [
        (0, import_vue34.createElementVNode)(
          "path",
          {
            d: "M18.6025 9.28503C18.9174 8.9701 19.4364 8.99481 19.7015 9.35271C20.1484 9.95606 20.4943 10.507 20.7342 10.9199C21.134 11.6086 21.1329 12.4454 20.7303 13.1328C20.2144 14.013 19.2151 15.5225 17.7723 16.8193C16.3293 18.1162 14.3852 19.2497 12.0008 19.25C11.4192 19.25 10.8638 19.1823 10.3355 19.0613C9.77966 18.934 9.63498 18.2525 10.0382 17.8493C10.2412 17.6463 10.5374 17.573 10.8188 17.6302C11.1993 17.7076 11.5935 17.75 12.0008 17.75C13.8848 17.7497 15.4867 16.8568 16.7693 15.7041C18.0522 14.5511 18.9606 13.1867 19.4363 12.375C19.5656 12.1543 19.5659 11.8943 19.4373 11.6729C19.2235 11.3049 18.921 10.8242 18.5364 10.3003C18.3085 9.98991 18.3302 9.5573 18.6025 9.28503ZM12.0008 4.75C12.5814 4.75006 13.1358 4.81803 13.6632 4.93953C14.2182 5.06741 14.362 5.74812 13.9593 6.15091C13.7558 6.35435 13.4589 6.42748 13.1771 6.36984C12.7983 6.29239 12.4061 6.25006 12.0008 6.25C10.1167 6.25 8.51415 7.15145 7.23028 8.31543C5.94678 9.47919 5.03918 10.8555 4.56426 11.6729C4.43551 11.8945 4.43582 12.1542 4.56524 12.375C4.77587 12.7343 5.07189 13.2012 5.44718 13.7105C5.67623 14.0213 5.65493 14.4552 5.38193 14.7282C5.0671 15.0431 4.54833 15.0189 4.28292 14.6614C3.84652 14.0736 3.50813 13.5369 3.27129 13.1328C2.86831 12.4451 2.86717 11.6088 3.26739 10.9199C3.78185 10.0345 4.77959 8.51239 6.22247 7.2041C7.66547 5.89584 9.61202 4.75 12.0008 4.75Z",
            fill: "currentColor"
          },
          null,
          -1
          /* CACHED */
        ),
        (0, import_vue34.createElementVNode)(
          "path",
          {
            d: "M5 19L19 5",
            stroke: "currentColor",
            "stroke-width": "1.5",
            "stroke-linecap": "round"
          },
          null,
          -1
          /* CACHED */
        )
      ])],
      4
      /* STYLE */
    )
  ], 8, _hoisted_116);
}
_sfc_main16.render = render16;
if (typeof document !== "undefined") {
  let _style = document.getElementById("vue-sfc-IconEyeAnimated-0");
  if (!_style) {
    _style = document.createElement("style");
    _style.id = "vue-sfc-IconEyeAnimated-0";
    _style.textContent = "\n.eye-open, .eye-closed {\n  transition: opacity 0.2s ease;\n}\n";
    document.head.appendChild(_style);
  }
}
var IconEyeAnimated_default = _sfc_main16;

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/icons/IconPausePlayAnimated.vue
var import_vue35 = require("vue");
var import_vue36 = require("vue");
var _sfc_main17 = /* @__PURE__ */ (0, import_vue35.defineComponent)({
  __name: "IconPausePlayAnimated",
  props: {
    size: { type: Number, required: false, default: 24 },
    isPaused: { type: Boolean, required: false, default: false }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = {};
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
var _hoisted_117 = ["width", "height"];
function render17(_ctx, _cache, $props, $setup, $data, $options) {
  return (0, import_vue36.openBlock)(), (0, import_vue36.createElementBlock)("svg", {
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 24 24",
    fill: "none"
  }, [
    (0, import_vue36.createCommentVNode)(" Pause bars - visible when not paused "),
    (0, import_vue36.createElementVNode)(
      "path",
      {
        class: "pause-bar",
        d: "M8 6L8 18",
        stroke: "currentColor",
        "stroke-width": "1.5",
        "stroke-linecap": "round",
        style: (0, import_vue36.normalizeStyle)({ opacity: $props.isPaused ? 0 : 1 })
      },
      null,
      4
      /* STYLE */
    ),
    (0, import_vue36.createElementVNode)(
      "path",
      {
        class: "pause-bar",
        d: "M16 18L16 6",
        stroke: "currentColor",
        "stroke-width": "1.5",
        "stroke-linecap": "round",
        style: (0, import_vue36.normalizeStyle)({ opacity: $props.isPaused ? 0 : 1 })
      },
      null,
      4
      /* STYLE */
    ),
    (0, import_vue36.createCommentVNode)(" Play triangle - visible when paused "),
    (0, import_vue36.createElementVNode)(
      "path",
      {
        class: "play-triangle",
        d: "M17.75 10.701C18.75 11.2783 18.75 12.7217 17.75 13.299L8.75 18.4952C7.75 19.0725 6.5 18.3509 6.5 17.1962L6.5 6.80384C6.5 5.64914 7.75 4.92746 8.75 5.50481L17.75 10.701Z",
        stroke: "currentColor",
        "stroke-width": "1.5",
        style: (0, import_vue36.normalizeStyle)({ opacity: $props.isPaused ? 1 : 0 })
      },
      null,
      4
      /* STYLE */
    )
  ], 8, _hoisted_117);
}
_sfc_main17.render = render17;
if (typeof document !== "undefined") {
  let _style = document.getElementById("vue-sfc-IconPausePlayAnimated-0");
  if (!_style) {
    _style = document.createElement("style");
    _style.id = "vue-sfc-IconPausePlayAnimated-0";
    _style.textContent = "\n.pause-bar, .play-triangle {\n  transition: opacity 0.15s ease;\n}\n";
    document.head.appendChild(_style);
  }
}
var IconPausePlayAnimated_default = _sfc_main17;

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/icons/IconEyeMinus.vue
var import_vue37 = require("vue");
var import_vue38 = require("vue");
var _sfc_main18 = /* @__PURE__ */ (0, import_vue37.defineComponent)({
  __name: "IconEyeMinus",
  props: {
    size: { type: Number, required: false, default: 16 }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = {};
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
var _hoisted_118 = ["width", "height"];
function render18(_ctx, _cache, $props, $setup, $data, $options) {
  return (0, import_vue38.openBlock)(), (0, import_vue38.createElementBlock)("svg", {
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 24 24",
    fill: "none"
  }, [..._cache[0] || (_cache[0] = [
    (0, import_vue38.createElementVNode)(
      "path",
      {
        d: "M4.91516 12.7108C4.63794 12.2883 4.63705 11.7565 4.91242 11.3328C5.84146 9.9033 8.30909 6.74994 12 6.74994C15.6909 6.74994 18.1585 9.9033 19.0876 11.3328C19.3629 11.7565 19.3621 12.2883 19.0848 12.7108C18.1537 14.13 15.6873 17.2499 12 17.2499C8.31272 17.2499 5.8463 14.13 4.91516 12.7108Z",
        stroke: "currentColor",
        "stroke-width": "1.5",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      },
      null,
      -1
      /* CACHED */
    ),
    (0, import_vue38.createElementVNode)(
      "path",
      {
        d: "M9 12H15",
        stroke: "currentColor",
        "stroke-width": "1.5",
        "stroke-linecap": "round"
      },
      null,
      -1
      /* CACHED */
    )
  ])], 8, _hoisted_118);
}
_sfc_main18.render = render18;
var IconEyeMinus_default = _sfc_main18;

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/icons/IconGear.vue
var import_vue39 = require("vue");
var import_vue40 = require("vue");
var _sfc_main19 = /* @__PURE__ */ (0, import_vue39.defineComponent)({
  __name: "IconGear",
  props: {
    size: { type: Number, required: false, default: 16 }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = {};
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
var _hoisted_119 = ["width", "height"];
function render19(_ctx, _cache, $props, $setup, $data, $options) {
  return (0, import_vue40.openBlock)(), (0, import_vue40.createElementBlock)("svg", {
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 24 24",
    fill: "none"
  }, [..._cache[0] || (_cache[0] = [
    (0, import_vue40.createElementVNode)(
      "path",
      {
        d: "M10.6504 5.81117C10.9939 4.39628 13.0061 4.39628 13.3496 5.81117C13.5715 6.72517 14.6187 7.15891 15.4219 6.66952C16.6652 5.91193 18.0881 7.33479 17.3305 8.57815C16.8411 9.38134 17.2748 10.4285 18.1888 10.6504C19.6037 10.9939 19.6037 13.0061 18.1888 13.3496C17.2748 13.5715 16.8411 14.6187 17.3305 15.4219C18.0881 16.6652 16.6652 18.0881 15.4219 17.3305C14.6187 16.8411 13.5715 17.2748 13.3496 18.1888C13.0061 19.6037 10.9939 19.6037 10.6504 18.1888C10.4285 17.2748 9.38135 16.8411 8.57815 17.3305C7.33479 18.0881 5.91193 16.6652 6.66952 15.4219C7.15891 14.6187 6.72517 13.5715 5.81117 13.3496C4.39628 13.0061 4.39628 10.9939 5.81117 10.6504C6.72517 10.4285 7.15891 9.38134 6.66952 8.57815C5.91193 7.33479 7.33479 5.91192 8.57815 6.66952C9.38135 7.15891 10.4285 6.72517 10.6504 5.81117Z",
        stroke: "currentColor",
        "stroke-width": "1.5",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      },
      null,
      -1
      /* CACHED */
    ),
    (0, import_vue40.createElementVNode)(
      "circle",
      {
        cx: "12",
        cy: "12",
        r: "2.5",
        stroke: "currentColor",
        "stroke-width": "1.5"
      },
      null,
      -1
      /* CACHED */
    )
  ])], 8, _hoisted_119);
}
_sfc_main19.render = render19;
var IconGear_default = _sfc_main19;

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/icons/IconPauseAlt.vue
var import_vue41 = require("vue");
var import_vue42 = require("vue");
var _sfc_main20 = /* @__PURE__ */ (0, import_vue41.defineComponent)({
  __name: "IconPauseAlt",
  props: {
    size: { type: Number, required: false, default: 16 }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = {};
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
var _hoisted_120 = ["width", "height"];
function render20(_ctx, _cache, $props, $setup, $data, $options) {
  return (0, import_vue42.openBlock)(), (0, import_vue42.createElementBlock)("svg", {
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 24 24",
    fill: "none"
  }, [..._cache[0] || (_cache[0] = [
    (0, import_vue42.createElementVNode)(
      "path",
      {
        d: "M9.25 5.75C9.80228 5.75 10.25 6.19772 10.25 6.75L10.25 17.25C10.25 17.8023 9.80228 18.25 9.25 18.25L6.75 18.25C6.19772 18.25 5.75 17.8023 5.75 17.25L5.75 6.75C5.75 6.19772 6.19772 5.75 6.75 5.75L9.25 5.75Z",
        stroke: "currentColor",
        "stroke-width": "1.5"
      },
      null,
      -1
      /* CACHED */
    ),
    (0, import_vue42.createElementVNode)(
      "path",
      {
        d: "M17.25 5.75C17.8023 5.75 18.25 6.19772 18.25 6.75L18.25 17.25C18.25 17.8023 17.8023 18.25 17.25 18.25L14.75 18.25C14.1977 18.25 13.75 17.8023 13.75 17.25L13.75 6.75C13.75 6.19772 14.1977 5.75 14.75 5.75L17.25 5.75Z",
        stroke: "currentColor",
        "stroke-width": "1.5"
      },
      null,
      -1
      /* CACHED */
    )
  ])], 8, _hoisted_120);
}
_sfc_main20.render = render20;
var IconPauseAlt_default = _sfc_main20;

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/icons/IconPause.vue
var import_vue43 = require("vue");
var import_vue44 = require("vue");
var _sfc_main21 = /* @__PURE__ */ (0, import_vue43.defineComponent)({
  __name: "IconPause",
  props: {
    size: { type: Number, required: false, default: 24 }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = {};
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
var _hoisted_121 = ["width", "height"];
function render21(_ctx, _cache, $props, $setup, $data, $options) {
  return (0, import_vue44.openBlock)(), (0, import_vue44.createElementBlock)("svg", {
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 24 24",
    fill: "none"
  }, [..._cache[0] || (_cache[0] = [
    (0, import_vue44.createElementVNode)(
      "path",
      {
        d: "M8 6L8 18",
        stroke: "currentColor",
        "stroke-width": "1.5",
        "stroke-linecap": "round"
      },
      null,
      -1
      /* CACHED */
    ),
    (0, import_vue44.createElementVNode)(
      "path",
      {
        d: "M16 18L16 6",
        stroke: "currentColor",
        "stroke-width": "1.5",
        "stroke-linecap": "round"
      },
      null,
      -1
      /* CACHED */
    )
  ])], 8, _hoisted_121);
}
_sfc_main21.render = render21;
var IconPause_default = _sfc_main21;

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/icons/IconPlayAlt.vue
var import_vue45 = require("vue");
var import_vue46 = require("vue");
var _sfc_main22 = /* @__PURE__ */ (0, import_vue45.defineComponent)({
  __name: "IconPlayAlt",
  props: {
    size: { type: Number, required: false, default: 16 }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = {};
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
var _hoisted_122 = ["width", "height"];
function render22(_ctx, _cache, $props, $setup, $data, $options) {
  return (0, import_vue46.openBlock)(), (0, import_vue46.createElementBlock)("svg", {
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 24 24",
    fill: "none"
  }, [..._cache[0] || (_cache[0] = [
    (0, import_vue46.createElementVNode)(
      "path",
      {
        d: "M17.75 10.701C18.75 11.2783 18.75 12.7217 17.75 13.299L8.75 18.4952C7.75 19.0725 6.5 18.3509 6.5 17.1962L6.5 6.80384C6.5 5.64914 7.75 4.92746 8.75 5.50481L17.75 10.701Z",
        stroke: "currentColor",
        "stroke-width": "1.5"
      },
      null,
      -1
      /* CACHED */
    )
  ])], 8, _hoisted_122);
}
_sfc_main22.render = render22;
var IconPlayAlt_default = _sfc_main22;

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/icons/IconTrashAlt.vue
var import_vue47 = require("vue");
var import_vue48 = require("vue");
var _sfc_main23 = /* @__PURE__ */ (0, import_vue47.defineComponent)({
  __name: "IconTrashAlt",
  props: {
    size: { type: Number, required: false, default: 16 }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = {};
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
var _hoisted_123 = ["width", "height"];
function render23(_ctx, _cache, $props, $setup, $data, $options) {
  return (0, import_vue48.openBlock)(), (0, import_vue48.createElementBlock)("svg", {
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 24 24",
    fill: "none"
  }, [..._cache[0] || (_cache[0] = [
    (0, import_vue48.createElementVNode)(
      "path",
      {
        d: "M13.5 4C14.7426 4 15.75 5.00736 15.75 6.25V7H18.5C18.9142 7 19.25 7.33579 19.25 7.75C19.25 8.16421 18.9142 8.5 18.5 8.5H17.9678L17.6328 16.2217C17.61 16.7475 17.5912 17.1861 17.5469 17.543C17.5015 17.9087 17.4225 18.2506 17.2461 18.5723C16.9747 19.0671 16.5579 19.4671 16.0518 19.7168C15.7227 19.8791 15.3772 19.9422 15.0098 19.9717C14.6514 20.0004 14.2126 20 13.6865 20H10.3135C9.78735 20 9.34856 20.0004 8.99023 19.9717C8.62278 19.9422 8.27729 19.8791 7.94824 19.7168C7.44205 19.4671 7.02532 19.0671 6.75391 18.5723C6.57751 18.2506 6.49853 17.9087 6.45312 17.543C6.40883 17.1861 6.39005 16.7475 6.36719 16.2217L6.03223 8.5H5.5C5.08579 8.5 4.75 8.16421 4.75 7.75C4.75 7.33579 5.08579 7 5.5 7H8.25V6.25C8.25 5.00736 9.25736 4 10.5 4H13.5ZM7.86621 16.1562C7.89013 16.7063 7.90624 17.0751 7.94141 17.3584C7.97545 17.6326 8.02151 17.7644 8.06934 17.8516C8.19271 18.0763 8.38239 18.2577 8.6123 18.3711C8.70153 18.4151 8.83504 18.4545 9.11035 18.4766C9.39482 18.4994 9.76335 18.5 10.3135 18.5H13.6865C14.2367 18.5 14.6052 18.4994 14.8896 18.4766C15.165 18.4545 15.2985 18.4151 15.3877 18.3711C15.6176 18.2577 15.8073 18.0763 15.9307 17.8516C15.9785 17.7644 16.0245 17.6326 16.0586 17.3584C16.0938 17.0751 16.1099 16.7063 16.1338 16.1562L16.4668 8.5H7.5332L7.86621 16.1562ZM9.97656 10.75C10.3906 10.7371 10.7371 11.0626 10.75 11.4766L10.875 15.4766C10.8879 15.8906 10.5624 16.2371 10.1484 16.25C9.73443 16.2629 9.38794 15.9374 9.375 15.5234L9.25 11.5234C9.23706 11.1094 9.56255 10.7629 9.97656 10.75ZM14.0244 10.75C14.4384 10.7635 14.7635 11.1105 14.75 11.5244L14.6201 15.5244C14.6066 15.9384 14.2596 16.2634 13.8457 16.25C13.4317 16.2365 13.1067 15.8896 13.1201 15.4756L13.251 11.4756C13.2645 11.0617 13.6105 10.7366 14.0244 10.75ZM10.5 5.5C10.0858 5.5 9.75 5.83579 9.75 6.25V7H14.25V6.25C14.25 5.83579 13.9142 5.5 13.5 5.5H10.5Z",
        fill: "currentColor"
      },
      null,
      -1
      /* CACHED */
    )
  ])], 8, _hoisted_123);
}
_sfc_main23.render = render23;
var IconTrashAlt_default = _sfc_main23;

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/icons/IconChatEllipsis.vue
var import_vue49 = require("vue");
var import_vue50 = require("vue");
var _sfc_main24 = /* @__PURE__ */ (0, import_vue49.defineComponent)({
  __name: "IconChatEllipsis",
  props: {
    size: { type: Number, required: false, default: 16 },
    style: { type: null, required: false, default: () => ({}) }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = {};
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
var _hoisted_124 = ["width", "height"];
function render24(_ctx, _cache, $props, $setup, $data, $options) {
  return (0, import_vue50.openBlock)(), (0, import_vue50.createElementBlock)("svg", {
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 24 24",
    fill: "none",
    style: (0, import_vue50.normalizeStyle)($props.style)
  }, [..._cache[0] || (_cache[0] = [
    (0, import_vue50.createElementVNode)(
      "path",
      {
        d: "M18.8875 19.25L19.6112 19.0533C19.6823 19.3148 19.6068 19.5943 19.4137 19.7844C19.2206 19.9746 18.9399 20.0457 18.6795 19.9706L18.8875 19.25ZM14.9631 18.244L15.263 18.9314L14.9631 18.244ZM18.0914 15.6309L17.4669 15.2156L18.0914 15.6309ZM4.75 11.8041H5.5C5.5 15.2664 8.39065 18.1081 12 18.1081V18.8581V19.6081C7.60123 19.6081 4 16.1334 4 11.8041H4.75ZM19.25 11.8041H18.5C18.5 8.34166 15.6094 5.5 12 5.5V4.75V4C16.3988 4 20 7.47476 20 11.8041H19.25ZM12 4.75V5.5C8.39065 5.5 5.5 8.34166 5.5 11.8041H4.75H4C4 7.47476 7.60123 4 12 4V4.75ZM18.0914 15.6309L17.4669 15.2156C18.1213 14.2315 18.5 13.0612 18.5 11.8041H19.25H20C20 13.3681 19.5276 14.8257 18.716 16.0462L18.0914 15.6309ZM18.8875 19.25L18.1638 19.4467L17.2953 16.2517L18.019 16.055L18.7428 15.8583L19.6112 19.0533L18.8875 19.25ZM12 18.8581V18.1081C12.9509 18.1081 13.8518 17.9105 14.6632 17.5565L14.9631 18.244L15.263 18.9314C14.2652 19.3667 13.1603 19.6081 12 19.6081V18.8581ZM15.3144 18.2188L15.5224 17.4982L19.0955 18.5294L18.8875 19.25L18.6795 19.9706L15.1064 18.9394L15.3144 18.2188ZM14.9631 18.244L14.6632 17.5565C14.925 17.4423 15.2286 17.4134 15.5224 17.4982L15.3144 18.2188L15.1064 18.9394C15.1677 18.957 15.223 18.9489 15.263 18.9314L14.9631 18.244ZM18.0914 15.6309L18.716 16.0462C18.7451 16.0024 18.7636 15.9351 18.7428 15.8583L18.019 16.055L17.2953 16.2517C17.1957 15.8853 17.2716 15.5093 17.4669 15.2156L18.0914 15.6309Z",
        fill: "currentColor"
      },
      null,
      -1
      /* CACHED */
    ),
    (0, import_vue50.createElementVNode)(
      "circle",
      {
        cx: "15",
        cy: "11.75",
        r: "1",
        fill: "currentColor"
      },
      null,
      -1
      /* CACHED */
    ),
    (0, import_vue50.createElementVNode)(
      "circle",
      {
        cx: "12",
        cy: "11.75",
        r: "1",
        fill: "currentColor"
      },
      null,
      -1
      /* CACHED */
    ),
    (0, import_vue50.createElementVNode)(
      "circle",
      {
        cx: "9",
        cy: "11.75",
        r: "1",
        fill: "currentColor"
      },
      null,
      -1
      /* CACHED */
    )
  ])], 12, _hoisted_124);
}
_sfc_main24.render = render24;
var IconChatEllipsis_default = _sfc_main24;

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/icons/IconCheckmark.vue
var import_vue51 = require("vue");
var import_vue52 = require("vue");
var _sfc_main25 = /* @__PURE__ */ (0, import_vue51.defineComponent)({
  __name: "IconCheckmark",
  props: {
    size: { type: Number, required: false, default: 16 }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = {};
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
var _hoisted_125 = ["width", "height"];
function render25(_ctx, _cache, $props, $setup, $data, $options) {
  return (0, import_vue52.openBlock)(), (0, import_vue52.createElementBlock)("svg", {
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 24 24",
    fill: "none"
  }, [..._cache[0] || (_cache[0] = [
    (0, import_vue52.createElementVNode)(
      "g",
      { "clip-path": "url(#clip0_2_45)" },
      [
        (0, import_vue52.createElementVNode)("path", {
          d: "M16.25 8.75L10 15.25L7.25 12.25",
          stroke: "currentColor",
          "stroke-width": "1.5",
          "stroke-linecap": "round",
          "stroke-linejoin": "round"
        })
      ],
      -1
      /* CACHED */
    ),
    (0, import_vue52.createElementVNode)(
      "defs",
      null,
      [
        (0, import_vue52.createElementVNode)("clipPath", { id: "clip0_2_45" }, [
          (0, import_vue52.createElementVNode)("rect", {
            width: "24",
            height: "24",
            fill: "white"
          })
        ])
      ],
      -1
      /* CACHED */
    )
  ])], 8, _hoisted_125);
}
_sfc_main25.render = render25;
var IconCheckmark_default = _sfc_main25;

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/icons/IconCheckmarkLarge.vue
var import_vue53 = require("vue");
var import_vue54 = require("vue");
var _sfc_main26 = /* @__PURE__ */ (0, import_vue53.defineComponent)({
  __name: "IconCheckmarkLarge",
  props: {
    size: { type: Number, required: false, default: 16 }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = {};
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
var _hoisted_126 = ["width", "height"];
function render26(_ctx, _cache, $props, $setup, $data, $options) {
  return (0, import_vue54.openBlock)(), (0, import_vue54.createElementBlock)("svg", {
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 24 24",
    fill: "none"
  }, [..._cache[0] || (_cache[0] = [
    (0, import_vue54.createElementVNode)(
      "g",
      { "clip-path": "url(#clip0_2_37)" },
      [
        (0, import_vue54.createElementVNode)("path", {
          d: "M17.5962 7.75L9.42308 16.25L6.15385 12.6538",
          stroke: "currentColor",
          "stroke-width": "1.5",
          "stroke-linecap": "round",
          "stroke-linejoin": "round"
        })
      ],
      -1
      /* CACHED */
    ),
    (0, import_vue54.createElementVNode)(
      "defs",
      null,
      [
        (0, import_vue54.createElementVNode)("clipPath", { id: "clip0_2_37" }, [
          (0, import_vue54.createElementVNode)("rect", {
            width: "24",
            height: "24",
            fill: "white"
          })
        ])
      ],
      -1
      /* CACHED */
    )
  ])], 8, _hoisted_126);
}
_sfc_main26.render = render26;
var IconCheckmarkLarge_default = _sfc_main26;

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/icons/IconCheckmarkCircle.vue
var import_vue55 = require("vue");
var import_vue56 = require("vue");
var _sfc_main27 = /* @__PURE__ */ (0, import_vue55.defineComponent)({
  __name: "IconCheckmarkCircle",
  props: {
    size: { type: Number, required: false, default: 24 }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = {};
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
var _hoisted_127 = ["width", "height"];
function render27(_ctx, _cache, $props, $setup, $data, $options) {
  return (0, import_vue56.openBlock)(), (0, import_vue56.createElementBlock)("svg", {
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 24 24",
    fill: "none"
  }, [..._cache[0] || (_cache[0] = [
    (0, import_vue56.createStaticVNode)('<g clip-path="url(#clip0_checkmark_circle)"><path d="M12 20C7.58172 20 4 16.4182 4 12C4 7.58172 7.58172 4 12 4C16.4182 4 20 7.58172 20 12C20 16.4182 16.4182 20 12 20Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15 10L11 14.25L9.25 12.25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></g><defs><clipPath id="clip0_checkmark_circle"><rect width="24" height="24" fill="white"></rect></clipPath></defs>', 2)
  ])], 8, _hoisted_127);
}
_sfc_main27.render = render27;
var IconCheckmarkCircle_default = _sfc_main27;

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/icons/IconXmark.vue
var import_vue57 = require("vue");
var import_vue58 = require("vue");
var _sfc_main28 = /* @__PURE__ */ (0, import_vue57.defineComponent)({
  __name: "IconXmark",
  props: {
    size: { type: Number, required: false, default: 16 }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = {};
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
var _hoisted_128 = ["width", "height"];
function render28(_ctx, _cache, $props, $setup, $data, $options) {
  return (0, import_vue58.openBlock)(), (0, import_vue58.createElementBlock)("svg", {
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 24 24",
    fill: "none"
  }, [..._cache[0] || (_cache[0] = [
    (0, import_vue58.createStaticVNode)('<g clip-path="url(#clip0_2_53)"><path d="M16.25 16.25L7.75 7.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M7.75 16.25L16.25 7.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></g><defs><clipPath id="clip0_2_53"><rect width="24" height="24" fill="white"></rect></clipPath></defs>', 2)
  ])], 8, _hoisted_128);
}
_sfc_main28.render = render28;
var IconXmark_default = _sfc_main28;

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/icons/IconXmarkLarge.vue
var import_vue59 = require("vue");
var import_vue60 = require("vue");
var _sfc_main29 = /* @__PURE__ */ (0, import_vue59.defineComponent)({
  __name: "IconXmarkLarge",
  props: {
    size: { type: Number, required: false, default: 24 }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = {};
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
var _hoisted_129 = ["width", "height"];
function render29(_ctx, _cache, $props, $setup, $data, $options) {
  return (0, import_vue60.openBlock)(), (0, import_vue60.createElementBlock)("svg", {
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 24 24",
    fill: "none"
  }, [..._cache[0] || (_cache[0] = [
    (0, import_vue60.createElementVNode)(
      "path",
      {
        d: "M16.7198 6.21973C17.0127 5.92683 17.4874 5.92683 17.7803 6.21973C18.0732 6.51262 18.0732 6.9874 17.7803 7.28027L13.0606 12L17.7803 16.7197C18.0732 17.0126 18.0732 17.4874 17.7803 17.7803C17.4875 18.0731 17.0127 18.0731 16.7198 17.7803L12.0001 13.0605L7.28033 17.7803C6.98746 18.0731 6.51268 18.0731 6.21979 17.7803C5.92689 17.4874 5.92689 17.0126 6.21979 16.7197L10.9395 12L6.21979 7.28027C5.92689 6.98738 5.92689 6.51262 6.21979 6.21973C6.51268 5.92683 6.98744 5.92683 7.28033 6.21973L12.0001 10.9395L16.7198 6.21973Z",
        fill: "currentColor"
      },
      null,
      -1
      /* CACHED */
    )
  ])], 8, _hoisted_129);
}
_sfc_main29.render = render29;
var IconXmarkLarge_default = _sfc_main29;

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/icons/IconSun.vue
var import_vue61 = require("vue");
var import_vue62 = require("vue");
var _sfc_main30 = /* @__PURE__ */ (0, import_vue61.defineComponent)({
  __name: "IconSun",
  props: {
    size: { type: Number, required: false, default: 16 }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = {};
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
var _hoisted_130 = ["width", "height"];
function render30(_ctx, _cache, $props, $setup, $data, $options) {
  return (0, import_vue62.openBlock)(), (0, import_vue62.createElementBlock)("svg", {
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 20 20",
    fill: "none"
  }, [..._cache[0] || (_cache[0] = [
    (0, import_vue62.createStaticVNode)('<path d="M9.99999 12.7082C11.4958 12.7082 12.7083 11.4956 12.7083 9.99984C12.7083 8.50407 11.4958 7.2915 9.99999 7.2915C8.50422 7.2915 7.29166 8.50407 7.29166 9.99984C7.29166 11.4956 8.50422 12.7082 9.99999 12.7082Z" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10 3.9585V5.05698" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"></path><path d="M10 14.9429V16.0414" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5.7269 5.72656L6.50682 6.50649" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"></path><path d="M13.4932 13.4932L14.2731 14.2731" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"></path><path d="M3.95834 10H5.05683" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"></path><path d="M14.9432 10H16.0417" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5.7269 14.2731L6.50682 13.4932" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"></path><path d="M13.4932 6.50649L14.2731 5.72656" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"></path>', 9)
  ])], 8, _hoisted_130);
}
_sfc_main30.render = render30;
var IconSun_default = _sfc_main30;

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/icons/IconMoon.vue
var import_vue63 = require("vue");
var import_vue64 = require("vue");
var _sfc_main31 = /* @__PURE__ */ (0, import_vue63.defineComponent)({
  __name: "IconMoon",
  props: {
    size: { type: Number, required: false, default: 16 }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = {};
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
var _hoisted_131 = ["width", "height"];
function render31(_ctx, _cache, $props, $setup, $data, $options) {
  return (0, import_vue64.openBlock)(), (0, import_vue64.createElementBlock)("svg", {
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 20 20",
    fill: "none"
  }, [..._cache[0] || (_cache[0] = [
    (0, import_vue64.createElementVNode)(
      "path",
      {
        d: "M15.5 10.4955C15.4037 11.5379 15.0124 12.5314 14.3721 13.3596C13.7317 14.1878 12.8688 14.8165 11.8841 15.1722C10.8995 15.5278 9.83397 15.5957 8.81217 15.3679C7.79038 15.1401 6.8546 14.6259 6.11434 13.8857C5.37408 13.1454 4.85995 12.2096 4.63211 11.1878C4.40427 10.166 4.47215 9.10048 4.82781 8.11585C5.18346 7.13123 5.81218 6.26825 6.64039 5.62791C7.4686 4.98756 8.46206 4.59634 9.5045 4.5C8.89418 5.32569 8.60049 6.34302 8.67685 7.36695C8.75321 8.39087 9.19454 9.35339 9.92058 10.0794C10.6466 10.8055 11.6091 11.2468 12.6331 11.3231C13.657 11.3995 14.6743 11.1058 15.5 10.4955Z",
        stroke: "currentColor",
        "stroke-width": "1.13793",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      },
      null,
      -1
      /* CACHED */
    )
  ])], 8, _hoisted_131);
}
_sfc_main31.render = render31;
var IconMoon_default = _sfc_main31;

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/icons/IconEdit.vue
var import_vue65 = require("vue");
var import_vue66 = require("vue");
var _sfc_main32 = /* @__PURE__ */ (0, import_vue65.defineComponent)({
  __name: "IconEdit",
  props: {
    size: { type: Number, required: false, default: 16 }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = {};
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
var _hoisted_132 = ["width", "height"];
function render32(_ctx, _cache, $props, $setup, $data, $options) {
  return (0, import_vue66.openBlock)(), (0, import_vue66.createElementBlock)("svg", {
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 16 16",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, [..._cache[0] || (_cache[0] = [
    (0, import_vue66.createElementVNode)(
      "path",
      {
        d: "M11.3799 6.9572L9.05645 4.63375M11.3799 6.9572L6.74949 11.5699C6.61925 11.6996 6.45577 11.791 6.277 11.8339L4.29549 12.3092C3.93194 12.3964 3.60478 12.0683 3.69297 11.705L4.16585 9.75693C4.20893 9.57947 4.29978 9.4172 4.42854 9.28771L9.05645 4.63375M11.3799 6.9572L12.3455 5.98759C12.9839 5.34655 12.9839 4.31002 12.3455 3.66897C11.7033 3.02415 10.6594 3.02415 10.0172 3.66897L9.06126 4.62892L9.05645 4.63375",
        stroke: "currentColor",
        "stroke-width": "0.9",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      },
      null,
      -1
      /* CACHED */
    )
  ])], 8, _hoisted_132);
}
_sfc_main32.render = render32;
var IconEdit_default = _sfc_main32;

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/icons/IconTrash.vue
var import_vue67 = require("vue");
var import_vue68 = require("vue");
var _sfc_main33 = /* @__PURE__ */ (0, import_vue67.defineComponent)({
  __name: "IconTrash",
  props: {
    size: { type: Number, required: false, default: 24 }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = {};
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
var _hoisted_133 = ["width", "height"];
function render33(_ctx, _cache, $props, $setup, $data, $options) {
  return (0, import_vue68.openBlock)(), (0, import_vue68.createElementBlock)("svg", {
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, [..._cache[0] || (_cache[0] = [
    (0, import_vue68.createElementVNode)(
      "path",
      {
        d: "M13.5 4C14.7426 4 15.75 5.00736 15.75 6.25V7H18.5C18.9142 7 19.25 7.33579 19.25 7.75C19.25 8.16421 18.9142 8.5 18.5 8.5H17.9678L17.6328 16.2217C17.61 16.7475 17.5912 17.1861 17.5469 17.543C17.5015 17.9087 17.4225 18.2506 17.2461 18.5723C16.9747 19.0671 16.5579 19.4671 16.0518 19.7168C15.7227 19.8791 15.3772 19.9422 15.0098 19.9717C14.6514 20.0004 14.2126 20 13.6865 20H10.3135C9.78735 20 9.34856 20.0004 8.99023 19.9717C8.62278 19.9422 8.27729 19.8791 7.94824 19.7168C7.44205 19.4671 7.02532 19.0671 6.75391 18.5723C6.57751 18.2506 6.49853 17.9087 6.45312 17.543C6.40883 17.1861 6.39005 16.7475 6.36719 16.2217L6.03223 8.5H5.5C5.08579 8.5 4.75 8.16421 4.75 7.75C4.75 7.33579 5.08579 7 5.5 7H8.25V6.25C8.25 5.00736 9.25736 4 10.5 4H13.5ZM7.86621 16.1562C7.89013 16.7063 7.90624 17.0751 7.94141 17.3584C7.97545 17.6326 8.02151 17.7644 8.06934 17.8516C8.19271 18.0763 8.38239 18.2577 8.6123 18.3711C8.70153 18.4151 8.83504 18.4545 9.11035 18.4766C9.39482 18.4994 9.76335 18.5 10.3135 18.5H13.6865C14.2367 18.5 14.6052 18.4994 14.8896 18.4766C15.165 18.4545 15.2985 18.4151 15.3877 18.3711C15.6176 18.2577 15.8073 18.0763 15.9307 17.8516C15.9785 17.7644 16.0245 17.6326 16.0586 17.3584C16.0938 17.0751 16.1099 16.7063 16.1338 16.1562L16.4668 8.5H7.5332L7.86621 16.1562ZM9.97656 10.75C10.3906 10.7371 10.7371 11.0626 10.75 11.4766L10.875 15.4766C10.8879 15.8906 10.5624 16.2371 10.1484 16.25C9.73443 16.2629 9.38794 15.9374 9.375 15.5234L9.25 11.5234C9.23706 11.1094 9.56255 10.7629 9.97656 10.75ZM14.0244 10.75C14.4383 10.7635 14.7635 11.1105 14.75 11.5244L14.6201 15.5244C14.6066 15.9384 14.2596 16.2634 13.8457 16.25C13.4317 16.2365 13.1067 15.8896 13.1201 15.4756L13.251 11.4756C13.2645 11.0617 13.6105 10.7366 14.0244 10.75ZM10.5 5.5C10.0858 5.5 9.75 5.83579 9.75 6.25V7H14.25V6.25C14.25 5.83579 13.9142 5.5 13.5 5.5H10.5Z",
        fill: "currentColor"
      },
      null,
      -1
      /* CACHED */
    )
  ])], 8, _hoisted_133);
}
_sfc_main33.render = render33;
var IconTrash_default = _sfc_main33;

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/icons/IconChevronLeft.vue
var import_vue69 = require("vue");
var import_vue70 = require("vue");
var _sfc_main34 = /* @__PURE__ */ (0, import_vue69.defineComponent)({
  __name: "IconChevronLeft",
  props: {
    size: { type: Number, required: false, default: 16 }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = {};
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
var _hoisted_134 = ["width", "height"];
function render34(_ctx, _cache, $props, $setup, $data, $options) {
  return (0, import_vue70.openBlock)(), (0, import_vue70.createElementBlock)("svg", {
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 16 16",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, [..._cache[0] || (_cache[0] = [
    (0, import_vue70.createElementVNode)(
      "path",
      {
        d: "M8.5 3.5L4 8L8.5 12.5",
        stroke: "currentColor",
        "stroke-width": "1.5",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      },
      null,
      -1
      /* CACHED */
    )
  ])], 8, _hoisted_134);
}
_sfc_main34.render = render34;
var IconChevronLeft_default = _sfc_main34;

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/icons/IconChevronRight.vue
var import_vue71 = require("vue");
var import_vue72 = require("vue");
var _sfc_main35 = /* @__PURE__ */ (0, import_vue71.defineComponent)({
  __name: "IconChevronRight",
  props: {
    size: { type: Number, required: false, default: 16 }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = {};
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
var _hoisted_135 = ["width", "height"];
function render35(_ctx, _cache, $props, $setup, $data, $options) {
  return (0, import_vue72.openBlock)(), (0, import_vue72.createElementBlock)("svg", {
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 16 16",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, [..._cache[0] || (_cache[0] = [
    (0, import_vue72.createElementVNode)(
      "path",
      {
        d: "M8.5 11.5L12 8L8.5 4.5",
        stroke: "currentColor",
        "stroke-width": "1.5",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      },
      null,
      -1
      /* CACHED */
    )
  ])], 8, _hoisted_135);
}
_sfc_main35.render = render35;
var IconChevronRight_default = _sfc_main35;

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/icons/IconPencil.vue
var import_vue73 = require("vue");
var import_vue74 = require("vue");
var _sfc_main36 = /* @__PURE__ */ (0, import_vue73.defineComponent)({
  __name: "IconPencil",
  props: {
    size: { type: Number, required: false, default: 24 }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = {};
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
var _hoisted_136 = ["width", "height"];
function render36(_ctx, _cache, $props, $setup, $data, $options) {
  return (0, import_vue74.openBlock)(), (0, import_vue74.createElementBlock)("svg", {
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 24 24",
    fill: "none"
  }, [..._cache[0] || (_cache[0] = [
    (0, import_vue74.createElementVNode)(
      "path",
      {
        d: "M15.8787 4.87868C16.6597 4.09763 17.9261 4.09763 18.7071 4.87868L19.1213 5.29289C19.9024 6.07394 19.9024 7.34027 19.1213 8.12132L9.58579 17.6569C9.21071 18.0319 8.70201 18.2426 8.17157 18.2426H5.75V15.8284C5.75 15.298 5.96071 14.7893 6.33579 14.4142L15.8787 4.87868Z",
        stroke: "currentColor",
        "stroke-width": "1.5",
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      },
      null,
      -1
      /* CACHED */
    ),
    (0, import_vue74.createElementVNode)(
      "path",
      {
        d: "M14.5 6.5L17.5 9.5",
        stroke: "currentColor",
        "stroke-width": "1.5",
        "stroke-linecap": "round"
      },
      null,
      -1
      /* CACHED */
    )
  ])], 8, _hoisted_136);
}
_sfc_main36.render = render36;
var IconPencil_default = _sfc_main36;

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/icons/AnimatedBunny.vue
var import_vue75 = require("vue");
var import_vue76 = require("vue");
var _sfc_main37 = /* @__PURE__ */ (0, import_vue75.defineComponent)({
  __name: "AnimatedBunny",
  props: {
    size: { type: Number, required: false, default: 20 },
    color: { type: String, required: false, default: "#4C74FF" }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const __returned__ = {};
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
var _hoisted_137 = ["width", "height"];
var _hoisted_22 = ["fill"];
var _hoisted_3 = ["fill"];
var _hoisted_4 = ["fill"];
var _hoisted_5 = ["fill"];
var _hoisted_6 = ["fill"];
var _hoisted_7 = ["fill"];
function render37(_ctx, _cache, $props, $setup, $data, $options) {
  return (0, import_vue76.openBlock)(), (0, import_vue76.createElementBlock)("svg", {
    width: $props.size,
    height: $props.size,
    viewBox: "0 0 28 28",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, [
    (0, import_vue76.createCommentVNode)(" Invisible hover area to catch all hover events "),
    _cache[0] || (_cache[0] = (0, import_vue76.createElementVNode)(
      "rect",
      {
        width: "28",
        height: "28",
        fill: "transparent"
      },
      null,
      -1
      /* CACHED */
    )),
    (0, import_vue76.createCommentVNode)(" Left ear "),
    (0, import_vue76.createElementVNode)("path", {
      class: "bunny-ear-left",
      d: "M3.738 10.2164L7.224 2.007H9.167L5.676 10.2164H3.738ZM10.791 6.42705C10.791 5.90346 10.726 5.42764 10.596 4.99959C10.47 4.57155 10.292 4.16643 10.063 3.78425C9.833 3.39825 9.56 3.01797 9.243 2.64343C8.926 2.26507 8.767 2.07589 8.767 2.07589L10.24 0.957996C10.24 0.957996 10.433 1.17203 10.819 1.60007C11.209 2.0243 11.559 2.49056 11.869 2.99886C12.178 3.50717 12.413 4.04222 12.574 4.60403C12.734 5.16584 12.814 5.77352 12.814 6.42705C12.814 7.10734 12.73 7.7303 12.562 8.29593C12.394 8.85774 12.153 9.3966 11.84 9.9126C11.526 10.4247 11.181 10.8833 10.802 11.2884C10.428 11.6974 10.24 11.9018 10.24 11.9018L8.767 10.7839C8.767 10.7839 8.924 10.5948 9.237 10.2164C9.554 9.8419 9.83 9.4597 10.063 9.06985C10.3 8.6762 10.479 8.26726 10.602 7.84304C10.728 7.41499 10.791 6.943 10.791 6.42705Z",
      fill: $props.color
    }, null, 8, _hoisted_22),
    (0, import_vue76.createCommentVNode)(" Right ear "),
    (0, import_vue76.createElementVNode)("path", {
      class: "bunny-ear-right",
      d: "M15.003 10.2164L18.489 2.007H20.432L16.941 10.2164H15.003ZM22.056 6.42705C22.056 5.90346 21.991 5.42764 21.861 4.99959C21.735 4.57155 21.557 4.16643 21.328 3.78425C21.098 3.39825 20.825 3.01797 20.508 2.64343C20.191 2.26507 20.032 2.07589 20.032 2.07589L21.505 0.957996C21.505 0.957996 21.698 1.17203 22.084 1.60007C22.474 2.0243 22.824 2.49056 23.133 2.99886C23.443 3.50717 23.678 4.04222 23.839 4.60403C23.999 5.16584 24.079 5.77352 24.079 6.42705C24.079 7.10734 23.995 7.7303 23.827 8.29593C23.659 8.85774 23.418 9.3966 23.105 9.9126C22.791 10.4247 22.445 10.8833 22.067 11.2884C21.693 11.6974 21.505 11.9018 21.505 11.9018L20.032 10.7839C20.032 10.7839 20.189 10.5948 20.502 10.2164C20.819 9.8419 21.094 9.4597 21.328 9.06985C21.565 8.6762 21.744 8.26726 21.866 7.84304C21.993 7.41499 22.056 6.943 22.056 6.42705Z",
      fill: $props.color
    }, null, 8, _hoisted_3),
    (0, import_vue76.createCommentVNode)(" Face outline "),
    (0, import_vue76.createElementVNode)("path", {
      class: "bunny-face",
      d: "M2.03 20.4328C2.03 20.9564 2.093 21.4322 2.219 21.8602C2.345 22.2883 2.523 22.6953 2.752 23.0813C2.981 23.4635 3.254 23.8419 3.572 24.2164C3.889 24.5948 4.047 24.7839 4.047 24.7839L2.574 25.9018C2.574 25.9018 2.379 25.6878 1.989 25.2598C1.603 24.8355 1.256 24.3693 0.946 23.861C0.636 23.3527 0.401 22.8176 0.241 22.2558C0.08 21.694 0 21.0863 0 20.4328C0 19.7525 0.084 19.1314 0.252 18.5696C0.421 18.004 0.661 17.4651 0.975 16.953C1.288 16.4371 1.632 15.9765 2.007 15.5714C2.385 15.1625 2.574 14.958 2.574 14.958L4.047 16.0759C4.047 16.0759 3.889 16.2651 3.572 16.6434C3.258 17.018 2.983 17.4021 2.746 17.7957C2.513 18.1855 2.335 18.5945 2.213 19.0225C2.091 19.4467 2.03 19.9168 2.03 20.4328ZM23.687 20.4271C23.687 19.9035 23.622 19.4276 23.492 18.9996C23.366 18.5715 23.188 18.1664 22.959 17.7843C22.729 17.3982 22.456 17.018 22.139 16.6434C21.822 16.2651 21.663 16.0759 21.663 16.0759L23.136 14.958C23.136 14.958 23.329 15.172 23.715 15.6001C24.105 16.0243 24.455 16.4906 24.765 16.9989C25.074 17.5072 25.309 18.0422 25.47 18.604C25.63 19.1658 25.71 19.7735 25.71 20.4271C25.71 21.1073 25.626 21.7303 25.458 22.2959C25.29 22.8577 25.049 23.3966 24.736 23.9126C24.422 24.4247 24.077 24.8833 23.698 25.2884C23.324 25.6974 23.136 25.9018 23.136 25.9018L21.663 24.7839C21.663 24.7839 21.82 24.5948 22.133 24.2164C22.45 23.8419 22.726 23.4597 22.959 23.0698C23.196 22.6762 23.375 22.2673 23.498 21.843C23.624 21.415 23.687 20.943 23.687 20.4271Z",
      fill: $props.color
    }, null, 8, _hoisted_4),
    (0, import_vue76.createCommentVNode)(" Animated bunny eyes "),
    (0, import_vue76.createElementVNode)("circle", {
      class: "bunny-eye-left",
      cx: "8.277",
      cy: "20.466",
      r: "1.8",
      fill: $props.color
    }, null, 8, _hoisted_5),
    (0, import_vue76.createElementVNode)("circle", {
      class: "bunny-eye-right",
      cx: "19.878",
      cy: "20.466",
      r: "1.8",
      fill: $props.color
    }, null, 8, _hoisted_6),
    (0, import_vue76.createCommentVNode)(" Happy face on hover "),
    (0, import_vue76.createElementVNode)("text", {
      class: "bunny-happy-face",
      x: "14",
      y: "26",
      "text-anchor": "middle",
      "font-size": "12",
      "font-weight": "bold",
      fill: $props.color,
      "font-family": "system-ui, -apple-system, sans-serif"
    }, "\u02C3 \u1D55 \u02C2", 8, _hoisted_7)
  ], 8, _hoisted_137);
}
_sfc_main37.render = render37;
if (typeof document !== "undefined") {
  let _style = document.getElementById("vue-sfc-AnimatedBunny-0");
  if (!_style) {
    _style = document.createElement("style");
    _style.id = "vue-sfc-AnimatedBunny-0";
    _style.textContent = "\n@keyframes bunnyEnterEar {\n  0% { opacity: 0; transform: scale(0.8); }\n  100% { opacity: 1; transform: scale(1); }\n}\n@keyframes bunnyEnterFace {\n  0% { opacity: 0; transform: scale(0.9); }\n  100% { opacity: 1; transform: scale(1); }\n}\n@keyframes bunnyEnterEye {\n  0% { opacity: 0; transform: scale(0.5); }\n  100% { opacity: 1; transform: scale(1); }\n}\n@keyframes leftEyeLook {\n  0%, 8% { transform: translate(0, 0); }\n  10%, 18% { transform: translate(1.5px, 0); }\n  20%, 22% { transform: translate(1.5px, 0) scaleY(0.1); }\n  24%, 32% { transform: translate(1.5px, 0); }\n  35%, 48% { transform: translate(-0.8px, -0.6px); }\n  52%, 54% { transform: translate(0, 0) scaleY(0.1); }\n  56%, 68% { transform: translate(0, 0); }\n  72%, 82% { transform: translate(-0.5px, 0.5px); }\n  85%, 100% { transform: translate(0, 0); }\n}\n@keyframes rightEyeLook {\n  0%, 8% { transform: translate(0, 0); }\n  10%, 18% { transform: translate(0.8px, 0); }\n  20%, 22% { transform: translate(0.8px, 0) scaleY(0.1); }\n  24%, 32% { transform: translate(0.8px, 0); }\n  35%, 48% { transform: translate(-1.5px, -0.6px); }\n  52%, 54% { transform: translate(0, 0) scaleY(0.1); }\n  56%, 68% { transform: translate(0, 0); }\n  72%, 82% { transform: translate(-1.2px, 0.5px); }\n  85%, 100% { transform: translate(0, 0); }\n}\n@keyframes leftEarTwitch {\n  0%, 9% { transform: rotate(0deg); }\n  12% { transform: rotate(-8deg); }\n  16%, 34% { transform: rotate(0deg); }\n  38% { transform: rotate(-12deg); }\n  42% { transform: rotate(-6deg); }\n  48%, 100% { transform: rotate(0deg); }\n}\n@keyframes rightEarTwitch {\n  0%, 9% { transform: rotate(0deg); }\n  12% { transform: rotate(6deg); }\n  16%, 34% { transform: rotate(0deg); }\n  38% { transform: rotate(10deg); }\n  42% { transform: rotate(4deg); }\n  48%, 71% { transform: rotate(0deg); }\n  74% { transform: rotate(8deg); }\n  78%, 100% { transform: rotate(0deg); }\n}\n.bunny-eye-left {\n  opacity: 0;\n  animation: bunnyEnterEye 0.3s ease-out 0.35s forwards, leftEyeLook 5s ease-in-out 0.65s infinite;\n  transform-origin: center;\n  transform-box: fill-box;\n}\n.bunny-eye-right {\n  opacity: 0;\n  animation: bunnyEnterEye 0.3s ease-out 0.4s forwards, rightEyeLook 5s ease-in-out 0.7s infinite;\n  transform-origin: center;\n  transform-box: fill-box;\n}\n.bunny-ear-left {\n  opacity: 0;\n  animation: bunnyEnterEar 0.3s ease-out 0.1s forwards, leftEarTwitch 5s ease-in-out 0.4s infinite;\n  transform-origin: bottom center;\n  transform-box: fill-box;\n}\n.bunny-ear-right {\n  opacity: 0;\n  animation: bunnyEnterEar 0.3s ease-out 0.15s forwards, rightEarTwitch 5s ease-in-out 0.45s infinite;\n  transform-origin: bottom center;\n  transform-box: fill-box;\n}\n.bunny-face {\n  opacity: 0;\n  animation: bunnyEnterFace 0.3s ease-out 0.25s forwards;\n  transform-origin: center;\n  transform-box: fill-box;\n}\nsvg:hover .bunny-eye-left,\nsvg:hover .bunny-eye-right {\n  opacity: 0;\n  transition: opacity 0.2s ease;\n}\n.bunny-happy-face {\n  opacity: 0;\n  transition: opacity 0.2s ease;\n}\nsvg:hover .bunny-happy-face {\n  opacity: 1;\n}\n";
    document.head.appendChild(_style);
  }
}
var AnimatedBunny_default = _sfc_main37;

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/AnnotationMarker.vue
var import_vue79 = require("vue");
var _sfc_main38 = /* @__PURE__ */ (0, import_vue77.defineComponent)({
  __name: "AnnotationMarker",
  props: {
    annotation: { type: null, required: true },
    globalIndex: { type: Number, required: true },
    index: { type: Number, required: true },
    totalVisible: { type: Number, required: true },
    isHovered: { type: Boolean, required: true },
    isDeleting: { type: Boolean, required: true },
    isEditing: { type: Boolean, required: true },
    markerColor: { type: String, required: true },
    markerClickBehavior: { type: String, required: true },
    markersExiting: { type: Boolean, required: true },
    isClearing: { type: Boolean, required: true },
    needsEnterAnimation: { type: Boolean, required: true },
    isFixed: { type: Boolean, required: true },
    renumberFrom: { type: [Number, null], required: true },
    isDarkMode: { type: Boolean, required: true }
  },
  emits: ["mouseenter", "mouseleave", "click", "contextmenu"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const showDeleteState = (0, import_vue78.computed)(() => (props.isHovered || props.isDeleting) && !props.isEditing);
    const showDeleteHover = (0, import_vue78.computed)(() => showDeleteState.value && props.markerClickBehavior === "delete");
    const animClass = (0, import_vue78.computed)(() => {
      if (props.markersExiting) return page_toolbar_module_default.exit;
      if (props.isClearing) return page_toolbar_module_default.clearing;
      if (props.needsEnterAnimation) return page_toolbar_module_default.enter;
      return "";
    });
    const markerClass = (0, import_vue78.computed)(() => [
      page_toolbar_module_default.marker,
      props.isFixed ? page_toolbar_module_default.fixed : "",
      props.annotation.isMultiSelect ? page_toolbar_module_default.multiSelect : "",
      animClass.value,
      showDeleteHover.value ? page_toolbar_module_default.hovered : ""
    ].filter(Boolean).join(" "));
    const animDelay = (0, import_vue78.computed)(() => {
      if (props.markersExiting) {
        return `${(props.totalVisible - 1 - props.index) * 20}ms`;
      }
      if (props.needsEnterAnimation) {
        return `${props.index * 20}ms`;
      }
      return void 0;
    });
    const showTooltip = (0, import_vue78.computed)(() => props.isHovered && !props.isEditing);
    function getTooltipPosition() {
      const tooltipMaxWidth = 200;
      const tooltipEstimatedHeight = 80;
      const markerSize = 22;
      const gap = 10;
      const markerX = props.annotation.x / 100 * window.innerWidth;
      const markerY = typeof props.annotation.y === "string" ? parseFloat(props.annotation.y) : props.annotation.y;
      const result = {};
      const spaceBelow = window.innerHeight - markerY - markerSize - gap;
      if (spaceBelow < tooltipEstimatedHeight) {
        result.top = "auto";
        result.bottom = `calc(100% + ${gap}px)`;
      }
      const centerX = markerX - tooltipMaxWidth / 2;
      const edgePadding = 10;
      if (centerX < edgePadding) {
        const offset = edgePadding - centerX;
        result.left = `calc(50% + ${offset}px)`;
      } else if (centerX + tooltipMaxWidth > window.innerWidth - edgePadding) {
        const overflow = centerX + tooltipMaxWidth - (window.innerWidth - edgePadding);
        result.left = `calc(50% - ${overflow}px)`;
      }
      return result;
    }
    const __returned__ = { props, emit, showDeleteState, showDeleteHover, animClass, markerClass, animDelay, showTooltip, getTooltipPosition, get IconXmark() {
      return IconXmark_default;
    }, get IconEdit() {
      return IconEdit_default;
    }, get styles() {
      return page_toolbar_module_default;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function render38(_ctx, _cache, $props, $setup, $data, $options) {
  return (0, import_vue79.openBlock)(), (0, import_vue79.createElementBlock)(
    "div",
    {
      class: (0, import_vue79.normalizeClass)($setup.markerClass),
      "data-annotation-marker": "",
      style: (0, import_vue79.normalizeStyle)({
        left: `${$props.annotation.x}%`,
        top: $props.annotation.isFixed ? `${$props.annotation.y}px` : $props.annotation.y + "px",
        backgroundColor: $setup.showDeleteHover ? void 0 : $props.markerColor,
        animationDelay: $setup.animDelay
      }),
      onMouseenter: _cache[0] || (_cache[0] = ($event) => $setup.emit("mouseenter")),
      onMouseleave: _cache[1] || (_cache[1] = ($event) => $setup.emit("mouseleave")),
      onClick: _cache[2] || (_cache[2] = (0, import_vue79.withModifiers)(($event) => $setup.emit("click"), ["stop"])),
      onContextmenu: _cache[3] || (_cache[3] = ($event) => $setup.emit("contextmenu", $event))
    },
    [
      $setup.showDeleteState ? ((0, import_vue79.openBlock)(), (0, import_vue79.createElementBlock)(
        import_vue79.Fragment,
        { key: 0 },
        [
          $setup.showDeleteHover ? ((0, import_vue79.openBlock)(), (0, import_vue79.createBlock)($setup["IconXmark"], {
            key: 0,
            size: $props.annotation.isMultiSelect ? 18 : 16
          }, null, 8, ["size"])) : ((0, import_vue79.openBlock)(), (0, import_vue79.createBlock)($setup["IconEdit"], {
            key: 1,
            size: 16
          }))
        ],
        64
        /* STABLE_FRAGMENT */
      )) : ((0, import_vue79.openBlock)(), (0, import_vue79.createElementBlock)(
        "span",
        {
          key: 1,
          class: (0, import_vue79.normalizeClass)($props.renumberFrom !== null && $props.globalIndex >= $props.renumberFrom ? $setup.styles.renumber : void 0)
        },
        (0, import_vue79.toDisplayString)($props.globalIndex + 1),
        3
        /* TEXT, CLASS */
      )),
      (0, import_vue79.createCommentVNode)(" Tooltip "),
      $setup.showTooltip ? ((0, import_vue79.openBlock)(), (0, import_vue79.createElementBlock)(
        "div",
        {
          key: 2,
          class: (0, import_vue79.normalizeClass)([
            $setup.styles.markerTooltip,
            !$props.isDarkMode ? $setup.styles.light : "",
            $setup.styles.enter
          ]),
          style: (0, import_vue79.normalizeStyle)($setup.getTooltipPosition())
        },
        [
          (0, import_vue79.createElementVNode)(
            "span",
            {
              class: (0, import_vue79.normalizeClass)($setup.styles.markerQuote)
            },
            [
              (0, import_vue79.createTextVNode)(
                (0, import_vue79.toDisplayString)($props.annotation.element) + " ",
                1
                /* TEXT */
              ),
              $props.annotation.selectedText ? ((0, import_vue79.openBlock)(), (0, import_vue79.createElementBlock)(
                import_vue79.Fragment,
                { key: 0 },
                [
                  (0, import_vue79.createTextVNode)(
                    ' \xA0"' + (0, import_vue79.toDisplayString)($props.annotation.selectedText.slice(0, 30)) + (0, import_vue79.toDisplayString)($props.annotation.selectedText.length > 30 ? "..." : "") + '" ',
                    1
                    /* TEXT */
                  )
                ],
                64
                /* STABLE_FRAGMENT */
              )) : (0, import_vue79.createCommentVNode)("v-if", true)
            ],
            2
            /* CLASS */
          ),
          (0, import_vue79.createElementVNode)(
            "span",
            {
              class: (0, import_vue79.normalizeClass)($setup.styles.markerNote)
            },
            (0, import_vue79.toDisplayString)($props.annotation.comment),
            3
            /* TEXT, CLASS */
          )
        ],
        6
        /* CLASS, STYLE */
      )) : (0, import_vue79.createCommentVNode)("v-if", true)
    ],
    38
    /* CLASS, STYLE, NEED_HYDRATION */
  );
}
_sfc_main38.render = render38;
var AnnotationMarker_default = _sfc_main38;

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/ToolbarSettingsPanel.vue
var import_vue84 = require("vue");

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/ToolbarTooltip.vue
var import_vue80 = require("vue");
var import_vue81 = require("vue");
var import_vue82 = require("vue");
var _sfc_main39 = /* @__PURE__ */ (0, import_vue80.defineComponent)({
  __name: "ToolbarTooltip",
  props: {
    content: { type: String, required: true },
    isTransitioning: { type: Boolean, required: false }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const isHovering = (0, import_vue81.ref)(false);
    const visible = (0, import_vue81.ref)(false);
    const shouldRender = (0, import_vue81.ref)(false);
    const position = (0, import_vue81.ref)({ top: 0, right: 0 });
    const triggerRef = (0, import_vue81.ref)(null);
    let timeoutId = null;
    let exitTimeoutId = null;
    function updatePosition() {
      if (triggerRef.value) {
        const rect = triggerRef.value.getBoundingClientRect();
        position.value = {
          top: rect.top + rect.height / 2,
          right: window.innerWidth - rect.left + 8
        };
      }
    }
    function handleMouseEnter() {
      isHovering.value = true;
      shouldRender.value = true;
      if (exitTimeoutId) {
        clearTimeout(exitTimeoutId);
        exitTimeoutId = null;
      }
      updatePosition();
      timeoutId = originalSetTimeout(() => {
        visible.value = true;
      }, 500);
    }
    function handleMouseLeave() {
      isHovering.value = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      visible.value = false;
      exitTimeoutId = originalSetTimeout(() => {
        shouldRender.value = false;
      }, 150);
    }
    (0, import_vue81.onUnmounted)(() => {
      if (timeoutId) clearTimeout(timeoutId);
      if (exitTimeoutId) clearTimeout(exitTimeoutId);
    });
    const __returned__ = { props, isHovering, visible, shouldRender, position, triggerRef, get timeoutId() {
      return timeoutId;
    }, set timeoutId(v) {
      timeoutId = v;
    }, get exitTimeoutId() {
      return exitTimeoutId;
    }, set exitTimeoutId(v) {
      exitTimeoutId = v;
    }, updatePosition, handleMouseEnter, handleMouseLeave, Teleport: import_vue81.Teleport };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
function render39(_ctx, _cache, $props, $setup, $data, $options) {
  return (0, import_vue82.openBlock)(), (0, import_vue82.createElementBlock)(
    import_vue82.Fragment,
    null,
    [
      (0, import_vue82.createElementVNode)(
        "span",
        {
          ref: "triggerRef",
          onMouseenter: $setup.handleMouseEnter,
          onMouseleave: $setup.handleMouseLeave
        },
        [
          (0, import_vue82.renderSlot)(_ctx.$slots, "default")
        ],
        544
        /* NEED_HYDRATION, NEED_PATCH */
      ),
      ((0, import_vue82.openBlock)(), (0, import_vue82.createBlock)(import_vue82.Teleport, { to: "body" }, [
        $setup.shouldRender ? ((0, import_vue82.openBlock)(), (0, import_vue82.createElementBlock)(
          "div",
          {
            key: 0,
            "data-feedback-toolbar": "",
            style: (0, import_vue82.normalizeStyle)({
              position: "fixed",
              top: $setup.position.top + "px",
              right: $setup.position.right + "px",
              transform: "translateY(-50%)",
              padding: "6px 10px",
              background: "#383838",
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: "11px",
              fontWeight: 400,
              lineHeight: "14px",
              borderRadius: "10px",
              width: "180px",
              textAlign: "left",
              zIndex: 100020,
              pointerEvents: "none",
              boxShadow: "0px 1px 8px rgba(0, 0, 0, 0.28)",
              opacity: $setup.visible && !$props.isTransitioning ? 1 : 0,
              transition: "opacity 0.15s ease"
            })
          },
          (0, import_vue82.toDisplayString)($props.content),
          5
          /* TEXT, STYLE */
        )) : (0, import_vue82.createCommentVNode)("v-if", true)
      ]))
    ],
    64
    /* STABLE_FRAGMENT */
  );
}
_sfc_main39.render = render39;
var ToolbarTooltip_default = _sfc_main39;

// src/vue/composables/useToolbarSettings.ts
var import_vue83 = require("vue");
var DEFAULT_SETTINGS = {
  outputDetail: "standard",
  autoClearAfterCopy: false,
  annotationColor: "#3c82f7",
  blockInteractions: true,
  reactEnabled: true,
  markerClickBehavior: "edit",
  webhookUrl: "",
  webhooksEnabled: true
};
var OUTPUT_TO_REACT_MODE = {
  compact: "off",
  standard: "filtered",
  detailed: "smart",
  forensic: "all"
};
var OUTPUT_DETAIL_OPTIONS = [
  { value: "compact", label: "Compact" },
  { value: "standard", label: "Standard" },
  { value: "detailed", label: "Detailed" },
  { value: "forensic", label: "Forensic" }
];
var COLOR_OPTIONS = [
  { value: "#AF52DE", label: "Purple" },
  { value: "#3c82f7", label: "Blue" },
  { value: "#5AC8FA", label: "Cyan" },
  { value: "#34C759", label: "Green" },
  { value: "#FFD60A", label: "Yellow" },
  { value: "#FF9500", label: "Orange" },
  { value: "#FF3B30", label: "Red" }
];
var isValidUrl = (url) => {
  if (!url || !url.trim()) return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};
var hasPlayedEntranceAnimation = false;
function useToolbarSettings() {
  const settings = (0, import_vue83.reactive)({ ...DEFAULT_SETTINGS });
  const isDarkMode = (0, import_vue83.ref)(true);
  const showEntranceAnimation = (0, import_vue83.ref)(false);
  const mounted = (0, import_vue83.ref)(false);
  const toolbarPosition = (0, import_vue83.ref)(null);
  const isDraggingToolbar = (0, import_vue83.ref)(false);
  const dragStartPos = (0, import_vue83.ref)(null);
  const dragRotation = (0, import_vue83.ref)(0);
  let justFinishedToolbarDrag = false;
  const isLocalhost = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === "0.0.0.0" || window.location.hostname.endsWith(".local"));
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/";
  function getEffectiveReactMode() {
    return isLocalhost && settings.reactEnabled ? OUTPUT_TO_REACT_MODE[settings.outputDetail] : "off";
  }
  function loadFromStorage() {
    mounted.value = true;
    if (!hasPlayedEntranceAnimation) {
      showEntranceAnimation.value = true;
      hasPlayedEntranceAnimation = true;
      originalSetTimeout(() => {
        showEntranceAnimation.value = false;
      }, 750);
    }
    try {
      const storedSettings = localStorage.getItem("feedback-toolbar-settings");
      if (storedSettings) {
        Object.assign(settings, { ...DEFAULT_SETTINGS, ...JSON.parse(storedSettings) });
      }
    } catch {
    }
    try {
      const savedTheme = localStorage.getItem("feedback-toolbar-theme");
      if (savedTheme !== null) {
        isDarkMode.value = savedTheme === "dark";
      }
    } catch {
    }
    try {
      const savedPosition = localStorage.getItem("feedback-toolbar-position");
      if (savedPosition) {
        const pos = JSON.parse(savedPosition);
        if (typeof pos.x === "number" && typeof pos.y === "number") {
          toolbarPosition.value = pos;
        }
      }
    } catch {
    }
  }
  function saveSettings() {
    if (!mounted.value) return;
    localStorage.setItem("feedback-toolbar-settings", JSON.stringify(settings));
  }
  function saveTheme() {
    if (!mounted.value) return;
    localStorage.setItem("feedback-toolbar-theme", isDarkMode.value ? "dark" : "light");
  }
  function saveToolbarPosition() {
    if (!mounted.value || !toolbarPosition.value) return;
    localStorage.setItem("feedback-toolbar-position", JSON.stringify(toolbarPosition.value));
  }
  function handleToolbarMouseDown(e, isActive, connectionStatus) {
    const target = e.target;
    if (target.closest("button") || target.closest("[data-settings-panel]")) {
      return;
    }
    const toolbarParent = e.currentTarget.parentElement;
    if (!toolbarParent) return;
    const rect = toolbarParent.getBoundingClientRect();
    const currentX = toolbarPosition.value?.x ?? rect.left;
    const currentY = toolbarPosition.value?.y ?? rect.top;
    const randomRotation = (Math.random() - 0.5) * 10;
    dragRotation.value = randomRotation;
    dragStartPos.value = {
      x: e.clientX,
      y: e.clientY,
      toolbarX: currentX,
      toolbarY: currentY
    };
  }
  function getJustFinishedToolbarDrag() {
    return justFinishedToolbarDrag;
  }
  function setJustFinishedToolbarDrag(v) {
    justFinishedToolbarDrag = v;
  }
  return {
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
    setJustFinishedToolbarDrag
  };
}

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/ToolbarSettingsPanel.vue
var import_vue85 = require("vue");
var _sfc_main40 = /* @__PURE__ */ (0, import_vue84.defineComponent)({
  __name: "ToolbarSettingsPanel",
  props: {
    settings: { type: null, required: true },
    isDarkMode: { type: Boolean, required: true },
    showSettingsVisible: { type: Boolean, required: true },
    toolbarPosition: { type: [Object, null], required: true },
    isLocalhost: { type: Boolean, required: true },
    endpoint: { type: String, required: false },
    connectionStatus: { type: String, required: true },
    isTransitioning: { type: Boolean, required: true },
    settingsPage: { type: String, required: true }
  },
  emits: ["update:isDarkMode", "update:settings", "update:settingsPage", "hideToolbar"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    function updateSetting(key, value) {
      emit("update:settings", { [key]: value });
    }
    function cycleOutputDetail() {
      const currentIndex = OUTPUT_DETAIL_OPTIONS.findIndex(
        (opt) => opt.value === props.settings.outputDetail
      );
      const nextIndex = (currentIndex + 1) % OUTPUT_DETAIL_OPTIONS.length;
      updateSetting("outputDetail", OUTPUT_DETAIL_OPTIONS[nextIndex].value);
    }
    const __returned__ = { props, emit, updateSetting, cycleOutputDetail, ToolbarTooltip: ToolbarTooltip_default, get IconHelp() {
      return IconHelp_default;
    }, get IconCheckSmallAnimated() {
      return IconCheckSmallAnimated_default;
    }, get IconSun() {
      return IconSun_default;
    }, get IconMoon() {
      return IconMoon_default;
    }, get IconChevronLeft() {
      return IconChevronLeft_default;
    }, get styles() {
      return page_toolbar_module_default;
    }, get OUTPUT_DETAIL_OPTIONS() {
      return OUTPUT_DETAIL_OPTIONS;
    }, get COLOR_OPTIONS() {
      return COLOR_OPTIONS;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
var _hoisted_138 = ["title"];
var _hoisted_23 = ["checked", "disabled"];
var _hoisted_32 = ["onClick"];
var _hoisted_42 = ["title"];
var _hoisted_52 = ["checked"];
var _hoisted_62 = ["checked"];
var _hoisted_72 = ["title"];
var _hoisted_8 = ["checked", "disabled"];
var _hoisted_9 = ["value"];
function render40(_ctx, _cache, $props, $setup, $data, $options) {
  return (0, import_vue85.openBlock)(), (0, import_vue85.createElementBlock)(
    "div",
    {
      class: (0, import_vue85.normalizeClass)([
        $setup.styles.settingsPanel,
        $props.isDarkMode ? $setup.styles.dark : $setup.styles.light,
        $props.showSettingsVisible ? $setup.styles.enter : $setup.styles.exit
      ]),
      "data-settings-panel": "",
      onClick: _cache[9] || (_cache[9] = (0, import_vue85.withModifiers)(() => {
      }, ["stop"])),
      style: (0, import_vue85.normalizeStyle)(
        $props.toolbarPosition && $props.toolbarPosition.y < 230 ? { bottom: "auto", top: "calc(100% + 0.5rem)" } : void 0
      )
    },
    [
      (0, import_vue85.createElementVNode)(
        "div",
        {
          class: (0, import_vue85.normalizeClass)([
            $setup.styles.settingsPanelContainer,
            $props.isTransitioning ? $setup.styles.transitioning : ""
          ])
        },
        [
          (0, import_vue85.createCommentVNode)(" Main settings page "),
          (0, import_vue85.createElementVNode)(
            "div",
            {
              class: (0, import_vue85.normalizeClass)([
                $setup.styles.settingsPage,
                $props.settingsPage === "automations" ? $setup.styles.slideLeft : ""
              ])
            },
            [
              (0, import_vue85.createElementVNode)(
                "div",
                {
                  class: (0, import_vue85.normalizeClass)($setup.styles.settingsHeader)
                },
                [
                  (0, import_vue85.createElementVNode)(
                    "span",
                    {
                      class: (0, import_vue85.normalizeClass)($setup.styles.settingsBrand)
                    },
                    [
                      (0, import_vue85.createElementVNode)(
                        "span",
                        {
                          class: (0, import_vue85.normalizeClass)($setup.styles.settingsBrandSlash),
                          style: (0, import_vue85.normalizeStyle)({ color: $props.settings.annotationColor, transition: "color 0.2s ease" })
                        },
                        "/",
                        6
                        /* CLASS, STYLE */
                      ),
                      _cache[10] || (_cache[10] = (0, import_vue85.createTextVNode)(
                        " agentation ",
                        -1
                        /* CACHED */
                      ))
                    ],
                    2
                    /* CLASS */
                  ),
                  (0, import_vue85.createElementVNode)(
                    "span",
                    {
                      class: (0, import_vue85.normalizeClass)($setup.styles.settingsVersion)
                    },
                    "v" + (0, import_vue85.toDisplayString)(_ctx.__VERSION__),
                    3
                    /* TEXT, CLASS */
                  ),
                  (0, import_vue85.createElementVNode)("button", {
                    class: (0, import_vue85.normalizeClass)($setup.styles.themeToggle),
                    title: $props.isDarkMode ? "Switch to light mode" : "Switch to dark mode",
                    onClick: _cache[0] || (_cache[0] = ($event) => $setup.emit("update:isDarkMode", !$props.isDarkMode))
                  }, [
                    (0, import_vue85.createElementVNode)(
                      "span",
                      {
                        class: (0, import_vue85.normalizeClass)($setup.styles.themeIconWrapper)
                      },
                      [
                        (0, import_vue85.createElementVNode)(
                          "span",
                          {
                            class: (0, import_vue85.normalizeClass)($setup.styles.themeIcon)
                          },
                          [
                            $props.isDarkMode ? ((0, import_vue85.openBlock)(), (0, import_vue85.createBlock)($setup["IconSun"], {
                              key: 0,
                              size: 20
                            })) : ((0, import_vue85.openBlock)(), (0, import_vue85.createBlock)($setup["IconMoon"], {
                              key: 1,
                              size: 20
                            }))
                          ],
                          2
                          /* CLASS */
                        )
                      ],
                      2
                      /* CLASS */
                    )
                  ], 10, _hoisted_138)
                ],
                2
                /* CLASS */
              ),
              (0, import_vue85.createElementVNode)(
                "div",
                {
                  class: (0, import_vue85.normalizeClass)($setup.styles.settingsSection)
                },
                [
                  (0, import_vue85.createElementVNode)(
                    "div",
                    {
                      class: (0, import_vue85.normalizeClass)($setup.styles.settingsRow)
                    },
                    [
                      (0, import_vue85.createElementVNode)(
                        "div",
                        {
                          class: (0, import_vue85.normalizeClass)([$setup.styles.settingsLabel, !$props.isDarkMode ? $setup.styles.light : ""])
                        },
                        [
                          _cache[11] || (_cache[11] = (0, import_vue85.createTextVNode)(
                            " Output Detail ",
                            -1
                            /* CACHED */
                          )),
                          (0, import_vue85.createVNode)($setup["ToolbarTooltip"], {
                            content: "Controls how much detail is included in the copied output",
                            "is-transitioning": $props.isTransitioning
                          }, {
                            default: (0, import_vue85.withCtx)(() => [
                              (0, import_vue85.createElementVNode)(
                                "span",
                                {
                                  class: (0, import_vue85.normalizeClass)($setup.styles.helpIcon)
                                },
                                [
                                  (0, import_vue85.createVNode)($setup["IconHelp"], { size: 20 })
                                ],
                                2
                                /* CLASS */
                              )
                            ]),
                            _: 1
                            /* STABLE */
                          }, 8, ["is-transitioning"])
                        ],
                        2
                        /* CLASS */
                      ),
                      (0, import_vue85.createElementVNode)(
                        "button",
                        {
                          class: (0, import_vue85.normalizeClass)([$setup.styles.cycleButton, !$props.isDarkMode ? $setup.styles.light : ""]),
                          onClick: $setup.cycleOutputDetail
                        },
                        [
                          (0, import_vue85.createElementVNode)(
                            "span",
                            {
                              class: (0, import_vue85.normalizeClass)($setup.styles.cycleButtonText)
                            },
                            (0, import_vue85.toDisplayString)($setup.OUTPUT_DETAIL_OPTIONS.find((opt) => opt.value === $props.settings.outputDetail)?.label),
                            3
                            /* TEXT, CLASS */
                          ),
                          (0, import_vue85.createElementVNode)(
                            "span",
                            {
                              class: (0, import_vue85.normalizeClass)($setup.styles.cycleDots)
                            },
                            [
                              ((0, import_vue85.openBlock)(true), (0, import_vue85.createElementBlock)(
                                import_vue85.Fragment,
                                null,
                                (0, import_vue85.renderList)($setup.OUTPUT_DETAIL_OPTIONS, (option) => {
                                  return (0, import_vue85.openBlock)(), (0, import_vue85.createElementBlock)(
                                    "span",
                                    {
                                      key: option.value,
                                      class: (0, import_vue85.normalizeClass)([
                                        $setup.styles.cycleDot,
                                        !$props.isDarkMode ? $setup.styles.light : "",
                                        $props.settings.outputDetail === option.value ? $setup.styles.active : ""
                                      ])
                                    },
                                    null,
                                    2
                                    /* CLASS */
                                  );
                                }),
                                128
                                /* KEYED_FRAGMENT */
                              ))
                            ],
                            2
                            /* CLASS */
                          )
                        ],
                        2
                        /* CLASS */
                      )
                    ],
                    2
                    /* CLASS */
                  ),
                  (0, import_vue85.createElementVNode)(
                    "div",
                    {
                      class: (0, import_vue85.normalizeClass)([
                        $setup.styles.settingsRow,
                        $setup.styles.settingsRowMarginTop,
                        !$props.isLocalhost ? $setup.styles.settingsRowDisabled : ""
                      ])
                    },
                    [
                      (0, import_vue85.createElementVNode)(
                        "div",
                        {
                          class: (0, import_vue85.normalizeClass)([$setup.styles.settingsLabel, !$props.isDarkMode ? $setup.styles.light : ""])
                        },
                        [
                          _cache[12] || (_cache[12] = (0, import_vue85.createTextVNode)(
                            " Vue Components ",
                            -1
                            /* CACHED */
                          )),
                          (0, import_vue85.createVNode)($setup["ToolbarTooltip"], {
                            content: !$props.isLocalhost ? "Disabled \u2014 production builds strip component names, making detection unreliable. Enable in dev mode." : "Include Vue component names in annotations",
                            "is-transitioning": $props.isTransitioning
                          }, {
                            default: (0, import_vue85.withCtx)(() => [
                              (0, import_vue85.createElementVNode)(
                                "span",
                                {
                                  class: (0, import_vue85.normalizeClass)($setup.styles.helpIcon)
                                },
                                [
                                  (0, import_vue85.createVNode)($setup["IconHelp"], { size: 20 })
                                ],
                                2
                                /* CLASS */
                              )
                            ]),
                            _: 1
                            /* STABLE */
                          }, 8, ["content", "is-transitioning"])
                        ],
                        2
                        /* CLASS */
                      ),
                      (0, import_vue85.createElementVNode)(
                        "label",
                        {
                          class: (0, import_vue85.normalizeClass)([$setup.styles.toggleSwitch, !$props.isLocalhost ? $setup.styles.disabled : ""])
                        },
                        [
                          (0, import_vue85.createElementVNode)("input", {
                            type: "checkbox",
                            checked: $props.isLocalhost && $props.settings.reactEnabled,
                            disabled: !$props.isLocalhost,
                            onChange: _cache[1] || (_cache[1] = ($event) => $setup.updateSetting("reactEnabled", !$props.settings.reactEnabled))
                          }, null, 40, _hoisted_23),
                          (0, import_vue85.createElementVNode)(
                            "span",
                            {
                              class: (0, import_vue85.normalizeClass)($setup.styles.toggleSlider)
                            },
                            null,
                            2
                            /* CLASS */
                          )
                        ],
                        2
                        /* CLASS */
                      )
                    ],
                    2
                    /* CLASS */
                  )
                ],
                2
                /* CLASS */
              ),
              (0, import_vue85.createElementVNode)(
                "div",
                {
                  class: (0, import_vue85.normalizeClass)($setup.styles.settingsSection)
                },
                [
                  (0, import_vue85.createElementVNode)(
                    "div",
                    {
                      class: (0, import_vue85.normalizeClass)([$setup.styles.settingsLabel, $setup.styles.settingsLabelMarker, !$props.isDarkMode ? $setup.styles.light : ""])
                    },
                    " Marker Colour ",
                    2
                    /* CLASS */
                  ),
                  (0, import_vue85.createElementVNode)(
                    "div",
                    {
                      class: (0, import_vue85.normalizeClass)($setup.styles.colorOptions)
                    },
                    [
                      ((0, import_vue85.openBlock)(true), (0, import_vue85.createElementBlock)(
                        import_vue85.Fragment,
                        null,
                        (0, import_vue85.renderList)($setup.COLOR_OPTIONS, (color) => {
                          return (0, import_vue85.openBlock)(), (0, import_vue85.createElementBlock)("div", {
                            key: color.value,
                            role: "button",
                            style: (0, import_vue85.normalizeStyle)({
                              borderColor: $props.settings.annotationColor === color.value ? color.value : "transparent"
                            }),
                            class: (0, import_vue85.normalizeClass)([
                              $setup.styles.colorOptionRing,
                              $props.settings.annotationColor === color.value ? $setup.styles.selected : ""
                            ]),
                            onClick: ($event) => $setup.updateSetting("annotationColor", color.value)
                          }, [
                            (0, import_vue85.createElementVNode)("div", {
                              class: (0, import_vue85.normalizeClass)([
                                $setup.styles.colorOption,
                                $props.settings.annotationColor === color.value ? $setup.styles.selected : ""
                              ]),
                              style: (0, import_vue85.normalizeStyle)({ backgroundColor: color.value }),
                              title: color.label
                            }, null, 14, _hoisted_42)
                          ], 14, _hoisted_32);
                        }),
                        128
                        /* KEYED_FRAGMENT */
                      ))
                    ],
                    2
                    /* CLASS */
                  )
                ],
                2
                /* CLASS */
              ),
              (0, import_vue85.createElementVNode)(
                "div",
                {
                  class: (0, import_vue85.normalizeClass)($setup.styles.settingsSection)
                },
                [
                  (0, import_vue85.createElementVNode)(
                    "label",
                    {
                      class: (0, import_vue85.normalizeClass)($setup.styles.settingsToggle)
                    },
                    [
                      (0, import_vue85.createElementVNode)("input", {
                        type: "checkbox",
                        id: "autoClearAfterCopy",
                        checked: $props.settings.autoClearAfterCopy,
                        onChange: _cache[2] || (_cache[2] = ($event) => $setup.updateSetting("autoClearAfterCopy", !$props.settings.autoClearAfterCopy))
                      }, null, 40, _hoisted_52),
                      (0, import_vue85.createElementVNode)(
                        "label",
                        {
                          class: (0, import_vue85.normalizeClass)([$setup.styles.customCheckbox, $props.settings.autoClearAfterCopy ? $setup.styles.checked : ""]),
                          for: "autoClearAfterCopy"
                        },
                        [
                          $props.settings.autoClearAfterCopy ? ((0, import_vue85.openBlock)(), (0, import_vue85.createBlock)($setup["IconCheckSmallAnimated"], {
                            key: 0,
                            size: 14
                          })) : (0, import_vue85.createCommentVNode)("v-if", true)
                        ],
                        2
                        /* CLASS */
                      ),
                      (0, import_vue85.createElementVNode)(
                        "span",
                        {
                          class: (0, import_vue85.normalizeClass)([$setup.styles.toggleLabel, !$props.isDarkMode ? $setup.styles.light : ""])
                        },
                        [
                          _cache[13] || (_cache[13] = (0, import_vue85.createTextVNode)(
                            " Clear on copy/send ",
                            -1
                            /* CACHED */
                          )),
                          (0, import_vue85.createVNode)($setup["ToolbarTooltip"], {
                            content: "Automatically clear annotations after copying",
                            "is-transitioning": $props.isTransitioning
                          }, {
                            default: (0, import_vue85.withCtx)(() => [
                              (0, import_vue85.createElementVNode)(
                                "span",
                                {
                                  class: (0, import_vue85.normalizeClass)([$setup.styles.helpIcon, $setup.styles.helpIconNudge2])
                                },
                                [
                                  (0, import_vue85.createVNode)($setup["IconHelp"], { size: 20 })
                                ],
                                2
                                /* CLASS */
                              )
                            ]),
                            _: 1
                            /* STABLE */
                          }, 8, ["is-transitioning"])
                        ],
                        2
                        /* CLASS */
                      )
                    ],
                    2
                    /* CLASS */
                  ),
                  (0, import_vue85.createElementVNode)(
                    "label",
                    {
                      class: (0, import_vue85.normalizeClass)($setup.styles.settingsToggle)
                    },
                    [
                      (0, import_vue85.createElementVNode)("input", {
                        type: "checkbox",
                        id: "blockInteractions",
                        checked: $props.settings.blockInteractions,
                        onChange: _cache[3] || (_cache[3] = ($event) => $setup.updateSetting("blockInteractions", !$props.settings.blockInteractions))
                      }, null, 40, _hoisted_62),
                      (0, import_vue85.createElementVNode)(
                        "label",
                        {
                          class: (0, import_vue85.normalizeClass)([$setup.styles.customCheckbox, $props.settings.blockInteractions ? $setup.styles.checked : ""]),
                          for: "blockInteractions"
                        },
                        [
                          $props.settings.blockInteractions ? ((0, import_vue85.openBlock)(), (0, import_vue85.createBlock)($setup["IconCheckSmallAnimated"], {
                            key: 0,
                            size: 14
                          })) : (0, import_vue85.createCommentVNode)("v-if", true)
                        ],
                        2
                        /* CLASS */
                      ),
                      (0, import_vue85.createElementVNode)(
                        "span",
                        {
                          class: (0, import_vue85.normalizeClass)([$setup.styles.toggleLabel, !$props.isDarkMode ? $setup.styles.light : ""])
                        },
                        " Block page interactions ",
                        2
                        /* CLASS */
                      )
                    ],
                    2
                    /* CLASS */
                  ),
                  (0, import_vue85.createElementVNode)(
                    "label",
                    {
                      class: (0, import_vue85.normalizeClass)([$setup.styles.settingsToggle, $setup.styles.settingsToggleMarginBottom])
                    },
                    [
                      (0, import_vue85.createElementVNode)(
                        "input",
                        {
                          type: "checkbox",
                          id: "hideToolbar",
                          checked: false,
                          onChange: _cache[4] || (_cache[4] = ($event) => $setup.emit("hideToolbar"))
                        },
                        null,
                        32
                        /* NEED_HYDRATION */
                      ),
                      (0, import_vue85.createElementVNode)(
                        "label",
                        {
                          class: (0, import_vue85.normalizeClass)($setup.styles.customCheckbox),
                          for: "hideToolbar"
                        },
                        null,
                        2
                        /* CLASS */
                      ),
                      (0, import_vue85.createElementVNode)(
                        "span",
                        {
                          class: (0, import_vue85.normalizeClass)([$setup.styles.toggleLabel, !$props.isDarkMode ? $setup.styles.light : ""])
                        },
                        [
                          _cache[14] || (_cache[14] = (0, import_vue85.createTextVNode)(
                            " Hide until restart ",
                            -1
                            /* CACHED */
                          )),
                          (0, import_vue85.createVNode)($setup["ToolbarTooltip"], {
                            content: "Hide the toolbar for the rest of this browser session. Reload or open a new tab to bring it back.",
                            "is-transitioning": $props.isTransitioning
                          }, {
                            default: (0, import_vue85.withCtx)(() => [
                              (0, import_vue85.createElementVNode)(
                                "span",
                                {
                                  class: (0, import_vue85.normalizeClass)([$setup.styles.helpIcon, $setup.styles.helpIconNudge2])
                                },
                                [
                                  (0, import_vue85.createVNode)($setup["IconHelp"], { size: 20 })
                                ],
                                2
                                /* CLASS */
                              )
                            ]),
                            _: 1
                            /* STABLE */
                          }, 8, ["is-transitioning"])
                        ],
                        2
                        /* CLASS */
                      )
                    ],
                    2
                    /* CLASS */
                  )
                ],
                2
                /* CLASS */
              ),
              (0, import_vue85.createElementVNode)(
                "div",
                {
                  class: (0, import_vue85.normalizeClass)([$setup.styles.settingsSection, $setup.styles.settingsSectionExtraPadding])
                },
                [
                  (0, import_vue85.createElementVNode)(
                    "button",
                    {
                      class: (0, import_vue85.normalizeClass)([$setup.styles.settingsNavLink, !$props.isDarkMode ? $setup.styles.light : ""]),
                      onClick: _cache[5] || (_cache[5] = ($event) => $setup.emit("update:settingsPage", "automations"))
                    },
                    [
                      _cache[16] || (_cache[16] = (0, import_vue85.createElementVNode)(
                        "span",
                        null,
                        "Manage MCP & Webhooks",
                        -1
                        /* CACHED */
                      )),
                      (0, import_vue85.createElementVNode)(
                        "span",
                        {
                          class: (0, import_vue85.normalizeClass)($setup.styles.settingsNavLinkRight)
                        },
                        [
                          $props.endpoint && $props.connectionStatus !== "disconnected" ? ((0, import_vue85.openBlock)(), (0, import_vue85.createElementBlock)(
                            "span",
                            {
                              key: 0,
                              class: (0, import_vue85.normalizeClass)([$setup.styles.mcpNavIndicator, $setup.styles[$props.connectionStatus]])
                            },
                            null,
                            2
                            /* CLASS */
                          )) : (0, import_vue85.createCommentVNode)("v-if", true),
                          _cache[15] || (_cache[15] = (0, import_vue85.createElementVNode)(
                            "svg",
                            {
                              width: "16",
                              height: "16",
                              viewBox: "0 0 16 16",
                              fill: "none",
                              xmlns: "http://www.w3.org/2000/svg"
                            },
                            [
                              (0, import_vue85.createElementVNode)("path", {
                                d: "M7.5 12.5L12 8L7.5 3.5",
                                stroke: "currentColor",
                                "stroke-width": "1.5",
                                "stroke-linecap": "round",
                                "stroke-linejoin": "round"
                              })
                            ],
                            -1
                            /* CACHED */
                          ))
                        ],
                        2
                        /* CLASS */
                      )
                    ],
                    2
                    /* CLASS */
                  )
                ],
                2
                /* CLASS */
              )
            ],
            2
            /* CLASS */
          ),
          (0, import_vue85.createCommentVNode)(" Automations Page "),
          (0, import_vue85.createElementVNode)(
            "div",
            {
              class: (0, import_vue85.normalizeClass)([
                $setup.styles.settingsPage,
                $setup.styles.automationsPage,
                $props.settingsPage === "automations" ? $setup.styles.slideIn : ""
              ])
            },
            [
              (0, import_vue85.createElementVNode)(
                "button",
                {
                  class: (0, import_vue85.normalizeClass)([$setup.styles.settingsBackButton, !$props.isDarkMode ? $setup.styles.light : ""]),
                  onClick: _cache[6] || (_cache[6] = ($event) => $setup.emit("update:settingsPage", "main"))
                },
                [
                  (0, import_vue85.createVNode)($setup["IconChevronLeft"], { size: 16 }),
                  _cache[17] || (_cache[17] = (0, import_vue85.createElementVNode)(
                    "span",
                    null,
                    "Manage MCP & Webhooks",
                    -1
                    /* CACHED */
                  ))
                ],
                2
                /* CLASS */
              ),
              (0, import_vue85.createCommentVNode)(" MCP Connection section "),
              (0, import_vue85.createElementVNode)(
                "div",
                {
                  class: (0, import_vue85.normalizeClass)($setup.styles.settingsSection)
                },
                [
                  (0, import_vue85.createElementVNode)(
                    "div",
                    {
                      class: (0, import_vue85.normalizeClass)($setup.styles.settingsRow)
                    },
                    [
                      (0, import_vue85.createElementVNode)(
                        "span",
                        {
                          class: (0, import_vue85.normalizeClass)([$setup.styles.automationHeader, !$props.isDarkMode ? $setup.styles.light : ""])
                        },
                        [
                          _cache[18] || (_cache[18] = (0, import_vue85.createTextVNode)(
                            " MCP Connection ",
                            -1
                            /* CACHED */
                          )),
                          (0, import_vue85.createVNode)($setup["ToolbarTooltip"], {
                            content: "Connect via Model Context Protocol to let AI agents like Claude Code receive annotations in real-time.",
                            "is-transitioning": $props.isTransitioning
                          }, {
                            default: (0, import_vue85.withCtx)(() => [
                              (0, import_vue85.createElementVNode)(
                                "span",
                                {
                                  class: (0, import_vue85.normalizeClass)([$setup.styles.helpIcon, $setup.styles.helpIconNudgeDown])
                                },
                                [
                                  (0, import_vue85.createVNode)($setup["IconHelp"], { size: 20 })
                                ],
                                2
                                /* CLASS */
                              )
                            ]),
                            _: 1
                            /* STABLE */
                          }, 8, ["is-transitioning"])
                        ],
                        2
                        /* CLASS */
                      ),
                      $props.endpoint ? ((0, import_vue85.openBlock)(), (0, import_vue85.createElementBlock)("div", {
                        key: 0,
                        class: (0, import_vue85.normalizeClass)([$setup.styles.mcpStatusDot, $setup.styles[$props.connectionStatus]]),
                        title: $props.connectionStatus === "connected" ? "Connected" : $props.connectionStatus === "connecting" ? "Connecting..." : "Disconnected"
                      }, null, 10, _hoisted_72)) : (0, import_vue85.createCommentVNode)("v-if", true)
                    ],
                    2
                    /* CLASS */
                  ),
                  (0, import_vue85.createElementVNode)(
                    "p",
                    {
                      class: (0, import_vue85.normalizeClass)([$setup.styles.automationDescription, !$props.isDarkMode ? $setup.styles.light : ""]),
                      style: { paddingBottom: "6px" }
                    },
                    [
                      _cache[19] || (_cache[19] = (0, import_vue85.createTextVNode)(
                        " MCP connection allows agents to receive and act on annotations. ",
                        -1
                        /* CACHED */
                      )),
                      (0, import_vue85.createElementVNode)(
                        "a",
                        {
                          href: "https://agentation.dev/mcp",
                          target: "_blank",
                          rel: "noopener noreferrer",
                          class: (0, import_vue85.normalizeClass)([$setup.styles.learnMoreLink, !$props.isDarkMode ? $setup.styles.light : ""])
                        },
                        "Learn more",
                        2
                        /* CLASS */
                      )
                    ],
                    2
                    /* CLASS */
                  )
                ],
                2
                /* CLASS */
              ),
              (0, import_vue85.createCommentVNode)(" Webhooks section "),
              (0, import_vue85.createElementVNode)(
                "div",
                {
                  class: (0, import_vue85.normalizeClass)([$setup.styles.settingsSection, $setup.styles.settingsSectionGrow])
                },
                [
                  (0, import_vue85.createElementVNode)(
                    "div",
                    {
                      class: (0, import_vue85.normalizeClass)($setup.styles.settingsRow)
                    },
                    [
                      (0, import_vue85.createElementVNode)(
                        "span",
                        {
                          class: (0, import_vue85.normalizeClass)([$setup.styles.automationHeader, !$props.isDarkMode ? $setup.styles.light : ""])
                        },
                        [
                          _cache[20] || (_cache[20] = (0, import_vue85.createTextVNode)(
                            " Webhooks ",
                            -1
                            /* CACHED */
                          )),
                          (0, import_vue85.createVNode)($setup["ToolbarTooltip"], {
                            content: "Send annotation data to any URL endpoint when annotations change. Useful for custom integrations.",
                            "is-transitioning": $props.isTransitioning
                          }, {
                            default: (0, import_vue85.withCtx)(() => [
                              (0, import_vue85.createElementVNode)(
                                "span",
                                {
                                  class: (0, import_vue85.normalizeClass)([$setup.styles.helpIcon, $setup.styles.helpIconNoNudge])
                                },
                                [
                                  (0, import_vue85.createVNode)($setup["IconHelp"], { size: 20 })
                                ],
                                2
                                /* CLASS */
                              )
                            ]),
                            _: 1
                            /* STABLE */
                          }, 8, ["is-transitioning"])
                        ],
                        2
                        /* CLASS */
                      ),
                      (0, import_vue85.createElementVNode)(
                        "div",
                        {
                          class: (0, import_vue85.normalizeClass)($setup.styles.autoSendRow)
                        },
                        [
                          (0, import_vue85.createElementVNode)(
                            "span",
                            {
                              class: (0, import_vue85.normalizeClass)([
                                $setup.styles.autoSendLabel,
                                !$props.isDarkMode ? $setup.styles.light : "",
                                $props.settings.webhooksEnabled ? $setup.styles.active : ""
                              ])
                            },
                            "Auto-Send",
                            2
                            /* CLASS */
                          ),
                          (0, import_vue85.createElementVNode)(
                            "label",
                            {
                              class: (0, import_vue85.normalizeClass)([$setup.styles.toggleSwitch, !$props.settings.webhookUrl ? $setup.styles.disabled : ""])
                            },
                            [
                              (0, import_vue85.createElementVNode)("input", {
                                type: "checkbox",
                                checked: $props.settings.webhooksEnabled,
                                disabled: !$props.settings.webhookUrl,
                                onChange: _cache[7] || (_cache[7] = ($event) => $setup.updateSetting("webhooksEnabled", !$props.settings.webhooksEnabled))
                              }, null, 40, _hoisted_8),
                              (0, import_vue85.createElementVNode)(
                                "span",
                                {
                                  class: (0, import_vue85.normalizeClass)($setup.styles.toggleSlider)
                                },
                                null,
                                2
                                /* CLASS */
                              )
                            ],
                            2
                            /* CLASS */
                          )
                        ],
                        2
                        /* CLASS */
                      )
                    ],
                    2
                    /* CLASS */
                  ),
                  (0, import_vue85.createElementVNode)(
                    "p",
                    {
                      class: (0, import_vue85.normalizeClass)([$setup.styles.automationDescription, !$props.isDarkMode ? $setup.styles.light : ""])
                    },
                    " The webhook URL will receive live annotation changes and annotation data. ",
                    2
                    /* CLASS */
                  ),
                  (0, import_vue85.createElementVNode)("textarea", {
                    class: (0, import_vue85.normalizeClass)([$setup.styles.webhookUrlInput, !$props.isDarkMode ? $setup.styles.light : ""]),
                    placeholder: "Webhook URL",
                    value: $props.settings.webhookUrl,
                    style: (0, import_vue85.normalizeStyle)({ "--marker-color": $props.settings.annotationColor }),
                    onInput: _cache[8] || (_cache[8] = ($event) => $setup.updateSetting("webhookUrl", $event.target.value))
                  }, null, 46, _hoisted_9)
                ],
                2
                /* CLASS */
              )
            ],
            2
            /* CLASS */
          )
        ],
        2
        /* CLASS */
      )
    ],
    6
    /* CLASS, STYLE */
  );
}
_sfc_main40.render = render40;
var ToolbarSettingsPanel_default = _sfc_main40;

// src/vue/composables/useServerSync.ts
var import_vue86 = require("vue");

// src/core/utils/sync.ts
async function createSession(endpoint, url) {
  const response = await fetch(`${endpoint}/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url })
  });
  if (!response.ok) {
    throw new Error(`Failed to create session: ${response.status}`);
  }
  return response.json();
}
async function getSession(endpoint, sessionId) {
  const response = await fetch(`${endpoint}/sessions/${sessionId}`);
  if (!response.ok) {
    throw new Error(`Failed to get session: ${response.status}`);
  }
  return response.json();
}
async function syncAnnotation(endpoint, sessionId, annotation) {
  const response = await fetch(`${endpoint}/sessions/${sessionId}/annotations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(annotation)
  });
  if (!response.ok) {
    throw new Error(`Failed to sync annotation: ${response.status}`);
  }
  return response.json();
}
async function updateAnnotation(endpoint, annotationId, data) {
  const response = await fetch(`${endpoint}/annotations/${annotationId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error(`Failed to update annotation: ${response.status}`);
  }
  return response.json();
}
async function deleteAnnotation(endpoint, annotationId) {
  const response = await fetch(`${endpoint}/annotations/${annotationId}`, {
    method: "DELETE"
  });
  if (!response.ok) {
    throw new Error(`Failed to delete annotation: ${response.status}`);
  }
}

// src/vue/composables/useServerSync.ts
function useServerSync(options) {
  const {
    endpoint,
    initialSessionId,
    pathname,
    mounted,
    annotations,
    exitingMarkers,
    onSessionCreated
  } = options;
  const currentSessionId = (0, import_vue86.ref)(initialSessionId ?? null);
  const connectionStatus = (0, import_vue86.ref)(
    endpoint ? "connecting" : "disconnected"
  );
  let sessionInitialized = false;
  let prevConnectionStatus = null;
  async function initSession() {
    if (!endpoint || !mounted.value || sessionInitialized) return;
    sessionInitialized = true;
    connectionStatus.value = "connecting";
    try {
      const storedSessionId = loadSessionId(pathname);
      const sessionIdToJoin = initialSessionId || storedSessionId;
      let sessionEstablished = false;
      if (sessionIdToJoin) {
        try {
          const session = await getSession(endpoint, sessionIdToJoin);
          currentSessionId.value = session.id;
          connectionStatus.value = "connected";
          saveSessionId(pathname, session.id);
          sessionEstablished = true;
          const allLocalAnnotations = loadAnnotations(pathname);
          const serverIds = new Set(session.annotations.map((a) => a.id));
          const localToMerge = allLocalAnnotations.filter((a) => !serverIds.has(a.id));
          if (localToMerge.length > 0) {
            const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
            const pageUrl = `${baseUrl}${pathname}`;
            const results = await Promise.allSettled(
              localToMerge.map(
                (annotation) => syncAnnotation(endpoint, session.id, {
                  ...annotation,
                  sessionId: session.id,
                  url: pageUrl
                })
              )
            );
            const syncedAnnotations = results.map((result, i) => {
              if (result.status === "fulfilled") return result.value;
              console.warn("[Agentation] Failed to sync annotation:", result.reason);
              return localToMerge[i];
            });
            const allAnnotations = [...session.annotations, ...syncedAnnotations];
            annotations.value = allAnnotations;
            saveAnnotationsWithSyncMarker(pathname, allAnnotations, session.id);
          } else {
            annotations.value = session.annotations;
            saveAnnotationsWithSyncMarker(pathname, session.annotations, session.id);
          }
        } catch (joinError) {
          console.warn("[Agentation] Could not join session, creating new:", joinError);
          clearSessionId(pathname);
        }
      }
      if (!sessionEstablished) {
        const currentUrl = typeof window !== "undefined" ? window.location.href : "/";
        const session = await createSession(endpoint, currentUrl);
        currentSessionId.value = session.id;
        connectionStatus.value = "connected";
        saveSessionId(pathname, session.id);
        onSessionCreated?.(session.id);
        const allAnnotations = loadAllAnnotations();
        const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
        const syncPromises = [];
        for (const [pagePath, pageAnnotations] of allAnnotations) {
          const unsyncedAnnotations = pageAnnotations.filter(
            (a) => !a._syncedTo
          );
          if (unsyncedAnnotations.length === 0) continue;
          const pageUrl = `${baseUrl}${pagePath}`;
          const isCurrentPage = pagePath === pathname;
          syncPromises.push(
            (async () => {
              try {
                const targetSession = isCurrentPage ? session : await createSession(endpoint, pageUrl);
                const results = await Promise.allSettled(
                  unsyncedAnnotations.map(
                    (annotation) => syncAnnotation(endpoint, targetSession.id, {
                      ...annotation,
                      sessionId: targetSession.id,
                      url: pageUrl
                    })
                  )
                );
                const syncedAnnotations = results.map((result, i) => {
                  if (result.status === "fulfilled") return result.value;
                  console.warn("[Agentation] Failed to sync annotation:", result.reason);
                  return unsyncedAnnotations[i];
                });
                saveAnnotationsWithSyncMarker(pagePath, syncedAnnotations, targetSession.id);
                if (isCurrentPage) {
                  const originalIds = new Set(unsyncedAnnotations.map((a) => a.id));
                  const prev = annotations.value;
                  const newDuringSync = prev.filter((a) => !originalIds.has(a.id));
                  annotations.value = [...syncedAnnotations, ...newDuringSync];
                }
              } catch (err) {
                console.warn(`[Agentation] Failed to sync annotations for ${pagePath}:`, err);
              }
            })()
          );
        }
        await Promise.allSettled(syncPromises);
      }
    } catch (error) {
      connectionStatus.value = "disconnected";
      console.warn("[Agentation] Failed to initialize session, using local storage:", error);
    }
  }
  function startHealthCheck() {
    if (!endpoint || !mounted.value) return void 0;
    const checkHealth = async () => {
      try {
        const response = await fetch(`${endpoint}/health`);
        if (response.ok) {
          connectionStatus.value = "connected";
        } else {
          connectionStatus.value = "disconnected";
        }
      } catch {
        connectionStatus.value = "disconnected";
      }
    };
    checkHealth();
    const interval = originalSetInterval(checkHealth, 1e4);
    return () => clearInterval(interval);
  }
  function startEventSource() {
    if (!endpoint || !mounted.value || !currentSessionId.value) return void 0;
    const eventSource = new EventSource(
      `${endpoint}/sessions/${currentSessionId.value}/events`
    );
    const removedStatuses = ["resolved", "dismissed"];
    const handler = (e) => {
      try {
        const event = JSON.parse(e.data);
        if (removedStatuses.includes(event.payload?.status)) {
          const id = event.payload.id;
          exitingMarkers.value = new Set(exitingMarkers.value).add(id);
          originalSetTimeout(() => {
            annotations.value = annotations.value.filter((a) => a.id !== id);
            const next = new Set(exitingMarkers.value);
            next.delete(id);
            exitingMarkers.value = next;
          }, 150);
        }
      } catch {
      }
    };
    eventSource.addEventListener("annotation.updated", handler);
    return () => {
      eventSource.removeEventListener("annotation.updated", handler);
      eventSource.close();
    };
  }
  async function syncOnReconnect() {
    if (!endpoint || !mounted.value) return;
    const wasDisconnected = prevConnectionStatus === "disconnected";
    const isNowConnected = connectionStatus.value === "connected";
    prevConnectionStatus = connectionStatus.value;
    if (wasDisconnected && isNowConnected) {
      try {
        const localAnnotations = loadAnnotations(pathname);
        if (localAnnotations.length === 0) return;
        const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
        const pageUrl = `${baseUrl}${pathname}`;
        let sessionId = currentSessionId.value;
        let serverAnnotations = [];
        if (sessionId) {
          try {
            const session = await getSession(endpoint, sessionId);
            serverAnnotations = session.annotations;
          } catch {
            sessionId = null;
          }
        }
        if (!sessionId) {
          const newSession = await createSession(endpoint, pageUrl);
          sessionId = newSession.id;
          currentSessionId.value = sessionId;
          saveSessionId(pathname, sessionId);
        }
        const serverIds = new Set(serverAnnotations.map((a) => a.id));
        const unsyncedLocal = localAnnotations.filter((a) => !serverIds.has(a.id));
        if (unsyncedLocal.length > 0) {
          const results = await Promise.allSettled(
            unsyncedLocal.map(
              (annotation) => syncAnnotation(endpoint, sessionId, {
                ...annotation,
                sessionId,
                url: pageUrl
              })
            )
          );
          const syncedAnnotations = results.map((result, i) => {
            if (result.status === "fulfilled") return result.value;
            console.warn("[Agentation] Failed to sync annotation on reconnect:", result.reason);
            return unsyncedLocal[i];
          });
          const allAnnotations = [...serverAnnotations, ...syncedAnnotations];
          annotations.value = allAnnotations;
          saveAnnotationsWithSyncMarker(pathname, allAnnotations, sessionId);
        }
      } catch (err) {
        console.warn("[Agentation] Failed to sync on reconnect:", err);
      }
    }
  }
  return {
    currentSessionId,
    connectionStatus,
    initSession,
    startHealthCheck,
    startEventSource,
    syncOnReconnect
  };
}

// src/vue/composables/useAnnotationState.ts
var import_vue87 = require("vue");
function useAnnotationState() {
  const pendingAnnotation = (0, import_vue87.ref)(null);
  const pendingExiting = (0, import_vue87.ref)(false);
  const editingAnnotation = (0, import_vue87.ref)(null);
  const editExiting = (0, import_vue87.ref)(false);
  const editingTargetElement = (0, import_vue87.ref)(null);
  const editingTargetElements = (0, import_vue87.ref)([]);
  function cancelPending(onBeforeRemove) {
    const strokeId = pendingAnnotation.value?.strokeId;
    pendingExiting.value = true;
    if (strokeId && onBeforeRemove) {
      onBeforeRemove(strokeId);
    }
    originalSetTimeout(() => {
      pendingAnnotation.value = null;
      pendingExiting.value = false;
    }, 150);
  }
  function submitPending(addAnnotation) {
    return (comment) => {
      if (!pendingAnnotation.value) return;
      addAnnotation(comment, pendingAnnotation.value);
      pendingExiting.value = true;
      originalSetTimeout(() => {
        pendingAnnotation.value = null;
        pendingExiting.value = false;
      }, 150);
    };
  }
  function startEditing(annotation) {
    editingAnnotation.value = annotation;
  }
  function cancelEditing() {
    editExiting.value = true;
    originalSetTimeout(() => {
      editingAnnotation.value = null;
      editingTargetElement.value = null;
      editingTargetElements.value = [];
      editExiting.value = false;
    }, 150);
  }
  function closeEditingForDelete() {
    editExiting.value = true;
    originalSetTimeout(() => {
      editingAnnotation.value = null;
      editingTargetElement.value = null;
      editingTargetElements.value = [];
      editExiting.value = false;
    }, 150);
  }
  function submitEditing(updateAnnotationComment) {
    return (newComment) => {
      if (!editingAnnotation.value) return;
      updateAnnotationComment(editingAnnotation.value, newComment);
      editExiting.value = true;
      originalSetTimeout(() => {
        editingAnnotation.value = null;
        editingTargetElement.value = null;
        editingTargetElements.value = [];
        editExiting.value = false;
      }, 150);
    };
  }
  function resetAll() {
    pendingAnnotation.value = null;
    pendingExiting.value = false;
    editingAnnotation.value = null;
    editExiting.value = false;
    editingTargetElement.value = null;
    editingTargetElements.value = [];
  }
  return {
    pendingAnnotation,
    pendingExiting,
    editingAnnotation,
    editExiting,
    editingTargetElement,
    editingTargetElements,
    cancelPending,
    submitPending,
    startEditing,
    cancelEditing,
    closeEditingForDelete,
    submitEditing,
    resetAll
  };
}

// src/vue/composables/useDrawing.ts
var import_vue88 = require("vue");
function findStrokeAtPoint(x, y, strokes, threshold = 12) {
  const scrollY = window.scrollY;
  for (let i = strokes.length - 1; i >= 0; i--) {
    const stroke = strokes[i];
    if (stroke.points.length < 2) continue;
    for (let j = 0; j < stroke.points.length - 1; j++) {
      const a = stroke.points[j];
      const b = stroke.points[j + 1];
      const ay = stroke.fixed ? a.y : a.y - scrollY;
      const by = stroke.fixed ? b.y : b.y - scrollY;
      const ax = a.x;
      const bx = b.x;
      const dx = bx - ax;
      const dy = by - ay;
      const lenSq = dx * dx + dy * dy;
      let t = lenSq === 0 ? 0 : ((x - ax) * dx + (y - ay) * dy) / lenSq;
      t = Math.max(0, Math.min(1, t));
      const projX = ax + t * dx;
      const projY = ay + t * dy;
      const dist = Math.hypot(x - projX, y - projY);
      if (dist < threshold) return i;
    }
  }
  return null;
}
function classifyStrokeGesture(points, fixed) {
  if (points.length < 2) return "Mark";
  const scrollY = window.scrollY;
  const viewportPoints = fixed ? points : points.map((p) => ({ x: p.x, y: p.y - scrollY }));
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of viewportPoints) {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  }
  const bboxW = maxX - minX;
  const bboxH = maxY - minY;
  const bboxDiag = Math.hypot(bboxW, bboxH);
  const start = viewportPoints[0];
  const end = viewportPoints[viewportPoints.length - 1];
  const startEndDist = Math.hypot(end.x - start.x, end.y - start.y);
  const closedLoop = startEndDist < bboxDiag * 0.35;
  const aspectRatio = bboxW / Math.max(bboxH, 1);
  if (closedLoop && bboxDiag > 20) {
    const edgeThreshold = Math.max(bboxW, bboxH) * 0.15;
    let edgePoints = 0;
    for (const p of viewportPoints) {
      const nearLeft = p.x - minX < edgeThreshold;
      const nearRight = maxX - p.x < edgeThreshold;
      const nearTop = p.y - minY < edgeThreshold;
      const nearBottom = maxY - p.y < edgeThreshold;
      if ((nearLeft || nearRight) && (nearTop || nearBottom)) edgePoints++;
    }
    return edgePoints > viewportPoints.length * 0.15 ? "Box" : "Circle";
  } else if (aspectRatio > 3 && bboxH < 40) {
    return "Underline";
  } else if (startEndDist > bboxDiag * 0.5) {
    return "Arrow";
  }
  return "Drawing";
}
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
function useDrawing() {
  const isDrawMode = (0, import_vue88.ref)(false);
  const drawStrokes = (0, import_vue88.ref)([]);
  const hoveredDrawingIdx = (0, import_vue88.ref)(null);
  const drawCanvasRef = (0, import_vue88.ref)(null);
  let isDrawing = false;
  let currentStroke = [];
  const dimAmountRef = { value: 0 };
  const visualHighlightRef = { value: null };
  const exitingStrokeIdRef = { value: null };
  const exitingAlphaRef = { value: 1 };
  const drawStrokesRef = { value: drawStrokes.value };
  function updateDrawStrokesRef() {
    drawStrokesRef.value = drawStrokes.value;
  }
  function redrawCanvas(ctx, strokes, hoveredIdx, dimAmount = 0) {
    const scrollY = window.scrollY;
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.save();
    ctx.scale(dpr, dpr);
    const tracePath = (stroke, offsetY) => {
      const p0 = stroke.points[0];
      ctx.moveTo(p0.x, p0.y - offsetY);
      for (let i = 1; i < stroke.points.length - 1; i++) {
        const curr = stroke.points[i];
        const next = stroke.points[i + 1];
        const midX = (curr.x + next.x) / 2;
        const midY = (curr.y + next.y - 2 * offsetY) / 2;
        ctx.quadraticCurveTo(curr.x, curr.y - offsetY, midX, midY);
      }
      const last = stroke.points[stroke.points.length - 1];
      ctx.lineTo(last.x, last.y - offsetY);
    };
    for (let si = 0; si < strokes.length; si++) {
      const stroke = strokes[si];
      if (stroke.points.length < 2) continue;
      const offsetY = stroke.fixed ? 0 : scrollY;
      let alpha = hoveredIdx != null && si !== hoveredIdx ? 1 - 0.7 * dimAmount : 1;
      if (exitingStrokeIdRef.value && stroke.id === exitingStrokeIdRef.value) {
        alpha *= exitingAlphaRef.value;
      }
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      tracePath(stroke, offsetY);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }
  function resizeCanvas() {
    const canvas = drawCanvasRef.value;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) redrawCanvas(ctx, drawStrokes.value, visualHighlightRef.value, dimAmountRef.value);
  }
  function getIsDrawing() {
    return isDrawing;
  }
  function setIsDrawing(v) {
    isDrawing = v;
  }
  function getCurrentStroke() {
    return currentStroke;
  }
  function setCurrentStroke(v) {
    currentStroke = v;
  }
  return {
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
    setCurrentStroke
  };
}

// src/vue/composables/useDragSelect.ts
var import_vue89 = require("vue");
function useDragSelect() {
  const isDragging = (0, import_vue89.ref)(false);
  let mouseDownPos = null;
  let dragStart = null;
  let dragRectEl = null;
  let highlightsContainerEl = null;
  let justFinishedDrag = false;
  let lastElementUpdate = 0;
  const DRAG_THRESHOLD = 8;
  const ELEMENT_UPDATE_THROTTLE = 50;
  const TEXT_TAGS = /* @__PURE__ */ new Set([
    "P",
    "SPAN",
    "H1",
    "H2",
    "H3",
    "H4",
    "H5",
    "H6",
    "LI",
    "TD",
    "TH",
    "LABEL",
    "BLOCKQUOTE",
    "FIGCAPTION",
    "CAPTION",
    "LEGEND",
    "DT",
    "DD",
    "PRE",
    "CODE",
    "EM",
    "STRONG",
    "B",
    "I",
    "U",
    "S",
    "A",
    "TIME",
    "ADDRESS",
    "CITE",
    "Q",
    "ABBR",
    "DFN",
    "MARK",
    "SMALL",
    "SUB",
    "SUP"
  ]);
  function setDragRectEl(el) {
    dragRectEl = el;
  }
  function setHighlightsContainerEl(el) {
    highlightsContainerEl = el;
  }
  function getJustFinishedDrag() {
    return justFinishedDrag;
  }
  function setJustFinishedDrag(v) {
    justFinishedDrag = v;
  }
  function handleMouseDown(e) {
    const target = e.composedPath()[0] || e.target;
    if (closestCrossingShadow(target, "[data-feedback-toolbar]")) return;
    if (closestCrossingShadow(target, "[data-annotation-marker]")) return;
    if (closestCrossingShadow(target, "[data-annotation-popup]")) return;
    if (TEXT_TAGS.has(target.tagName) || target.isContentEditable) return;
    mouseDownPos = { x: e.clientX, y: e.clientY };
  }
  function handleMouseMove(e) {
    if (!mouseDownPos) return;
    const dx = e.clientX - mouseDownPos.x;
    const dy = e.clientY - mouseDownPos.y;
    const distance = dx * dx + dy * dy;
    const thresholdSq = DRAG_THRESHOLD * DRAG_THRESHOLD;
    if (!isDragging.value && distance >= thresholdSq) {
      dragStart = mouseDownPos;
      isDragging.value = true;
    }
    if ((isDragging.value || distance >= thresholdSq) && dragStart) {
      if (dragRectEl) {
        const left2 = Math.min(dragStart.x, e.clientX);
        const top2 = Math.min(dragStart.y, e.clientY);
        const width = Math.abs(e.clientX - dragStart.x);
        const height = Math.abs(e.clientY - dragStart.y);
        dragRectEl.style.transform = `translate(${left2}px, ${top2}px)`;
        dragRectEl.style.width = `${width}px`;
        dragRectEl.style.height = `${height}px`;
      }
      const now = Date.now();
      if (now - lastElementUpdate < ELEMENT_UPDATE_THROTTLE) return;
      lastElementUpdate = now;
      const startX = dragStart.x;
      const startY = dragStart.y;
      const left = Math.min(startX, e.clientX);
      const top = Math.min(startY, e.clientY);
      const right = Math.max(startX, e.clientX);
      const bottom = Math.max(startY, e.clientY);
      const midX = (left + right) / 2;
      const midY = (top + bottom) / 2;
      const candidateElements = /* @__PURE__ */ new Set();
      const points = [
        [left, top],
        [right, top],
        [left, bottom],
        [right, bottom],
        [midX, midY],
        [midX, top],
        [midX, bottom],
        [left, midY],
        [right, midY]
      ];
      for (const [x, y] of points) {
        const elements = document.elementsFromPoint(x, y);
        for (const el of elements) {
          if (el instanceof HTMLElement) candidateElements.add(el);
        }
      }
      const nearbyElements = document.querySelectorAll(
        "button, a, input, img, p, h1, h2, h3, h4, h5, h6, li, label, td, th, div, span, section, article, aside, nav"
      );
      for (const el of nearbyElements) {
        if (el instanceof HTMLElement) {
          const rect = el.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const centerInside = centerX >= left && centerX <= right && centerY >= top && centerY <= bottom;
          const overlapX = Math.min(rect.right, right) - Math.max(rect.left, left);
          const overlapY = Math.min(rect.bottom, bottom) - Math.max(rect.top, top);
          const overlapArea = overlapX > 0 && overlapY > 0 ? overlapX * overlapY : 0;
          const elementArea = rect.width * rect.height;
          const overlapRatio = elementArea > 0 ? overlapArea / elementArea : 0;
          if (centerInside || overlapRatio > 0.5) candidateElements.add(el);
        }
      }
      const allMatching = [];
      const meaningfulTags = /* @__PURE__ */ new Set([
        "BUTTON",
        "A",
        "INPUT",
        "IMG",
        "P",
        "H1",
        "H2",
        "H3",
        "H4",
        "H5",
        "H6",
        "LI",
        "LABEL",
        "TD",
        "TH",
        "SECTION",
        "ARTICLE",
        "ASIDE",
        "NAV"
      ]);
      for (const el of candidateElements) {
        if (closestCrossingShadow(el, "[data-feedback-toolbar]") || closestCrossingShadow(el, "[data-annotation-marker]")) continue;
        const rect = el.getBoundingClientRect();
        if (rect.width > window.innerWidth * 0.8 && rect.height > window.innerHeight * 0.5) continue;
        if (rect.width < 10 || rect.height < 10) continue;
        if (rect.left < right && rect.right > left && rect.top < bottom && rect.bottom > top) {
          const tagName = el.tagName;
          let shouldInclude = meaningfulTags.has(tagName);
          if (!shouldInclude && (tagName === "DIV" || tagName === "SPAN")) {
            const hasText = el.textContent && el.textContent.trim().length > 0;
            const isInteractive = el.onclick !== null || el.getAttribute("role") === "button" || el.getAttribute("role") === "link" || el.classList.contains("clickable") || el.hasAttribute("data-clickable");
            if ((hasText || isInteractive) && !el.querySelector("p, h1, h2, h3, h4, h5, h6, button, a")) {
              shouldInclude = true;
            }
          }
          if (shouldInclude) {
            let dominated = false;
            for (const existingRect of allMatching) {
              if (existingRect.left <= rect.left && existingRect.right >= rect.right && existingRect.top <= rect.top && existingRect.bottom >= rect.bottom) {
                dominated = true;
                break;
              }
            }
            if (!dominated) allMatching.push(rect);
          }
        }
      }
      if (highlightsContainerEl) {
        const container = highlightsContainerEl;
        while (container.children.length > allMatching.length) {
          container.removeChild(container.lastChild);
        }
        allMatching.forEach((rect, i) => {
          let div = container.children[i];
          if (!div) {
            div = document.createElement("div");
            div.className = page_toolbar_module_default.selectedElementHighlight;
            container.appendChild(div);
          }
          div.style.transform = `translate(${rect.left}px, ${rect.top}px)`;
          div.style.width = `${rect.width}px`;
          div.style.height = `${rect.height}px`;
        });
      }
    }
  }
  function handleMouseUp(e) {
    const wasDragging = isDragging.value;
    const ds = dragStart;
    if (isDragging.value && ds) {
      justFinishedDrag = true;
      const left = Math.min(ds.x, e.clientX);
      const top = Math.min(ds.y, e.clientY);
      const right = Math.max(ds.x, e.clientX);
      const bottom = Math.max(ds.y, e.clientY);
      const allMatching = [];
      const selector = "button, a, input, img, p, h1, h2, h3, h4, h5, h6, li, label, td, th";
      document.querySelectorAll(selector).forEach((el) => {
        if (!(el instanceof HTMLElement)) return;
        if (closestCrossingShadow(el, "[data-feedback-toolbar]") || closestCrossingShadow(el, "[data-annotation-marker]")) return;
        const rect = el.getBoundingClientRect();
        if (rect.width > window.innerWidth * 0.8 && rect.height > window.innerHeight * 0.5) return;
        if (rect.width < 10 || rect.height < 10) return;
        if (rect.left < right && rect.right > left && rect.top < bottom && rect.bottom > top) {
          allMatching.push({ element: el, rect });
        }
      });
      const finalElements = allMatching.filter(
        ({ element: el }) => !allMatching.some(({ element: other }) => other !== el && el.contains(other))
      );
      mouseDownPos = null;
      dragStart = null;
      isDragging.value = false;
      clearHighlights();
      return {
        finalElements,
        empty: finalElements.length === 0,
        x: e.clientX / window.innerWidth * 100,
        y: e.clientY + window.scrollY,
        left,
        top,
        right,
        bottom
      };
    } else if (wasDragging) {
      justFinishedDrag = true;
    }
    mouseDownPos = null;
    dragStart = null;
    isDragging.value = false;
    clearHighlights();
    return null;
  }
  function clearHighlights() {
    if (highlightsContainerEl) {
      while (highlightsContainerEl.firstChild) {
        highlightsContainerEl.removeChild(highlightsContainerEl.firstChild);
      }
    }
  }
  function reset() {
    mouseDownPos = null;
    dragStart = null;
    isDragging.value = false;
    justFinishedDrag = false;
  }
  return {
    isDragging,
    setDragRectEl,
    setHighlightsContainerEl,
    getJustFinishedDrag,
    setJustFinishedDrag,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    reset
  };
}

// src/vue/composables/useMultiSelect.ts
var import_vue90 = require("vue");
function useMultiSelect() {
  const pendingMultiSelectElements = (0, import_vue90.ref)([]);
  const modifiersHeld = { cmd: false, shift: false };
  function getModifiersHeld() {
    return modifiersHeld;
  }
  function addElement(item) {
    pendingMultiSelectElements.value = [...pendingMultiSelectElements.value, item];
  }
  function removeElementAt(index) {
    pendingMultiSelectElements.value = pendingMultiSelectElements.value.filter((_, i) => i !== index);
  }
  function toggleElement(element, item) {
    const existingIndex = pendingMultiSelectElements.value.findIndex(
      (el) => el.element === element
    );
    if (existingIndex >= 0) {
      removeElementAt(existingIndex);
    } else {
      addElement(item);
    }
  }
  function clear() {
    pendingMultiSelectElements.value = [];
  }
  function resetModifiers() {
    modifiersHeld.cmd = false;
    modifiersHeld.shift = false;
  }
  return {
    pendingMultiSelectElements,
    getModifiersHeld,
    modifiersHeld,
    addElement,
    removeElementAt,
    toggleElement,
    clear,
    resetModifiers
  };
}

// src/vue/composables/useHover.ts
var import_vue91 = require("vue");
function useHover() {
  const hoverInfo = (0, import_vue91.ref)(null);
  const hoverPosition = (0, import_vue91.ref)({ x: 0, y: 0 });
  function setHover(info, position) {
    hoverInfo.value = info;
    if (position) {
      hoverPosition.value = position;
    }
  }
  function clearHover() {
    hoverInfo.value = null;
  }
  return {
    hoverInfo,
    hoverPosition,
    setHover,
    clearHover
  };
}

// src/vue/composables/useMarkerVisibility.ts
var import_vue92 = require("vue");
function useMarkerVisibility(options) {
  const { isActive, showMarkers, annotations } = options;
  const markersVisible = (0, import_vue92.ref)(false);
  const markersExiting = (0, import_vue92.ref)(false);
  const animatedMarkers = (0, import_vue92.ref)(/* @__PURE__ */ new Set());
  const exitingMarkers = (0, import_vue92.ref)(/* @__PURE__ */ new Set());
  function getShouldShowMarkers() {
    return isActive.value && showMarkers.value;
  }
  let enterTimer = null;
  let exitTimer = null;
  function updateVisibility() {
    const shouldShow = getShouldShowMarkers();
    if (enterTimer) {
      clearTimeout(enterTimer);
      enterTimer = null;
    }
    if (exitTimer) {
      clearTimeout(exitTimer);
      exitTimer = null;
    }
    if (shouldShow) {
      markersExiting.value = false;
      markersVisible.value = true;
      animatedMarkers.value = /* @__PURE__ */ new Set();
      const enterMaxDelay = Math.max(0, annotations.value.length - 1) * 20;
      enterTimer = originalSetTimeout(() => {
        const newSet = new Set(animatedMarkers.value);
        annotations.value.forEach((a) => newSet.add(a.id));
        animatedMarkers.value = newSet;
      }, enterMaxDelay + 250 + 50);
    } else if (markersVisible.value) {
      markersExiting.value = true;
      const maxDelay = Math.max(0, annotations.value.length - 1) * 20;
      exitTimer = originalSetTimeout(() => {
        markersVisible.value = false;
        markersExiting.value = false;
      }, maxDelay + 200 + 50);
    }
  }
  return {
    markersVisible,
    markersExiting,
    animatedMarkers,
    exitingMarkers,
    getShouldShowMarkers,
    updateVisibility
  };
}

// src/vue/composables/useCursorStyles.ts
function useCursorStyles() {
  function injectCursorStyles() {
    const style = document.createElement("style");
    style.id = "feedback-cursor-styles";
    style.textContent = `
      body * {
        cursor: crosshair !important;
      }
      body p, body span, body h1, body h2, body h3, body h4, body h5, body h6,
      body li, body td, body th, body label, body blockquote, body figcaption,
      body caption, body legend, body dt, body dd, body pre, body code,
      body em, body strong, body b, body i, body u, body s, body a,
      body time, body address, body cite, body q, body abbr, body dfn,
      body mark, body small, body sub, body sup, body [contenteditable],
      body p *, body span *, body h1 *, body h2 *, body h3 *, body h4 *,
      body h5 *, body h6 *, body li *, body a *, body label *, body pre *,
      body code *, body blockquote *, body [contenteditable] * {
        cursor: text !important;
      }
      [data-feedback-toolbar], [data-feedback-toolbar] * {
        cursor: default !important;
      }
      [data-feedback-toolbar] textarea,
      [data-feedback-toolbar] input[type="text"],
      [data-feedback-toolbar] input[type="url"] {
        cursor: text !important;
      }
      [data-feedback-toolbar] button,
      [data-feedback-toolbar] button *,
      [data-feedback-toolbar] label,
      [data-feedback-toolbar] label *,
      [data-feedback-toolbar] a,
      [data-feedback-toolbar] a *,
      [data-feedback-toolbar] [role="button"],
      [data-feedback-toolbar] [role="button"] * {
        cursor: pointer !important;
      }
      [data-annotation-marker], [data-annotation-marker] * {
        cursor: pointer !important;
      }
      html[data-drawing-hover], html[data-drawing-hover] * {
        cursor: pointer !important;
      }
    `;
    document.head.appendChild(style);
  }
  function removeCursorStyles() {
    const existingStyle = document.getElementById("feedback-cursor-styles");
    if (existingStyle) existingStyle.remove();
  }
  function setDrawingHoverCursor(active) {
    if (active) {
      document.documentElement.setAttribute("data-drawing-hover", "");
    } else {
      document.documentElement.removeAttribute("data-drawing-hover");
    }
  }
  return {
    injectCursorStyles,
    removeCursorStyles,
    setDrawingHoverCursor
  };
}

// src/vue/composables/useCopyOutput.ts
function deepElementFromPoint(x, y) {
  let element = document.elementFromPoint(x, y);
  if (!element) return null;
  while (element?.shadowRoot) {
    const deeper = element.shadowRoot.elementFromPoint(x, y);
    if (!deeper || deeper === element) break;
    element = deeper;
  }
  return element;
}
function isElementFixed(element) {
  let current = element;
  while (current && current !== document.body) {
    const style = window.getComputedStyle(current);
    if (style.position === "fixed" || style.position === "sticky") return true;
    current = current.parentElement;
  }
  return false;
}
function generateOutput(annotations, pathname, detailLevel = "standard", reactMode = "filtered") {
  if (annotations.length === 0) return "";
  const viewport = typeof window !== "undefined" ? `${window.innerWidth}\xD7${window.innerHeight}` : "unknown";
  let output = `## Page Feedback: ${pathname}
`;
  if (detailLevel === "forensic") {
    output += `
**Environment:**
`;
    output += `- Viewport: ${viewport}
`;
    if (typeof window !== "undefined") {
      output += `- URL: ${window.location.href}
`;
      output += `- User Agent: ${navigator.userAgent}
`;
      output += `- Timestamp: ${(/* @__PURE__ */ new Date()).toISOString()}
`;
      output += `- Device Pixel Ratio: ${window.devicePixelRatio}
`;
    }
    output += `
---
`;
  } else if (detailLevel !== "compact") {
    output += `**Viewport:** ${viewport}
`;
  }
  output += "\n";
  annotations.forEach((a, i) => {
    if (detailLevel === "compact") {
      output += `${i + 1}. **${a.element}**`;
      if (a.sourceFile) output += ` (${a.sourceFile})`;
      output += `: ${a.comment}`;
      if (a.selectedText) {
        output += ` (re: "${a.selectedText.slice(0, 30)}${a.selectedText.length > 30 ? "..." : ""}")`;
      }
      output += "\n";
    } else if (detailLevel === "forensic") {
      output += `### ${i + 1}. ${a.element}
`;
      if (a.isMultiSelect && a.fullPath) {
        output += `*Forensic data shown for first element of selection*
`;
      }
      if (a.fullPath) output += `**Full DOM Path:** ${a.fullPath}
`;
      if (a.cssClasses) output += `**CSS Classes:** ${a.cssClasses}
`;
      if (a.boundingBox) {
        output += `**Position:** x:${Math.round(a.boundingBox.x)}, y:${Math.round(a.boundingBox.y)} (${Math.round(a.boundingBox.width)}\xD7${Math.round(a.boundingBox.height)}px)
`;
      }
      output += `**Annotation at:** ${a.x.toFixed(1)}% from left, ${Math.round(a.y)}px from top
`;
      if (a.selectedText) output += `**Selected text:** "${a.selectedText}"
`;
      if (a.nearbyText && !a.selectedText) output += `**Context:** ${a.nearbyText.slice(0, 100)}
`;
      if (a.computedStyles) output += `**Computed Styles:** ${a.computedStyles}
`;
      if (a.accessibility) output += `**Accessibility:** ${a.accessibility}
`;
      if (a.nearbyElements) output += `**Nearby Elements:** ${a.nearbyElements}
`;
      if (a.sourceFile) output += `**Source:** ${a.sourceFile}
`;
      if (a.reactComponents) output += `**Vue:** ${a.reactComponents}
`;
      output += `**Feedback:** ${a.comment}

`;
    } else {
      output += `### ${i + 1}. ${a.element}
`;
      output += `**Location:** ${a.elementPath}
`;
      if (a.sourceFile) output += `**Source:** ${a.sourceFile}
`;
      if (a.reactComponents) output += `**Vue:** ${a.reactComponents}
`;
      if (detailLevel === "detailed") {
        if (a.cssClasses) output += `**Classes:** ${a.cssClasses}
`;
        if (a.boundingBox) {
          output += `**Position:** ${Math.round(a.boundingBox.x)}px, ${Math.round(a.boundingBox.y)}px (${Math.round(a.boundingBox.width)}\xD7${Math.round(a.boundingBox.height)}px)
`;
        }
      }
      if (a.selectedText) output += `**Selected text:** "${a.selectedText}"
`;
      if (detailLevel === "detailed" && a.nearbyText && !a.selectedText) {
        output += `**Context:** ${a.nearbyText.slice(0, 100)}
`;
      }
      output += `**Feedback:** ${a.comment}

`;
    }
  });
  return output.trim();
}

// src/vue/composables/useKeyboardShortcuts.ts
function useKeyboardShortcuts(options) {
  const {
    isActive,
    isDrawMode,
    pendingAnnotation,
    annotationsLength,
    drawStrokesLength,
    settingsWebhookUrl,
    webhookUrl,
    sendState,
    onToggleActive,
    onToggleFreeze,
    onToggleDrawMode,
    onToggleMarkers,
    onCopy,
    onClear,
    onSend,
    onUndoStroke,
    onEscapeDrawMode,
    onClearMultiSelect,
    pendingMultiSelectLength,
    hideTooltips
  } = options;
  function handleKeyDown(e) {
    const target = e.target;
    const isTyping = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
    if (e.key === "Escape") {
      if (isDrawMode.value) {
        onEscapeDrawMode();
        return;
      }
      if (pendingMultiSelectLength() > 0) {
        onClearMultiSelect();
        return;
      }
      if (pendingAnnotation.value) {
      } else if (isActive.value) {
        hideTooltips();
        onToggleActive();
      }
    }
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === "f" || e.key === "F")) {
      e.preventDefault();
      hideTooltips();
      onToggleActive();
      return;
    }
    if ((e.metaKey || e.ctrlKey) && (e.key === "z" || e.key === "Z") && isDrawMode.value && !e.shiftKey) {
      e.preventDefault();
      onUndoStroke();
      return;
    }
    if (isTyping || e.metaKey || e.ctrlKey) return;
    if (e.key === "p" || e.key === "P") {
      e.preventDefault();
      hideTooltips();
      onToggleFreeze();
    }
    if (e.key === "d" || e.key === "D") {
      e.preventDefault();
      hideTooltips();
      onToggleDrawMode();
    }
    if (e.key === "h" || e.key === "H") {
      if (annotationsLength() > 0) {
        e.preventDefault();
        hideTooltips();
        onToggleMarkers();
      }
    }
    if (e.key === "c" || e.key === "C") {
      if (annotationsLength() > 0) {
        e.preventDefault();
        hideTooltips();
        onCopy();
      }
    }
    if (e.key === "x" || e.key === "X") {
      if (annotationsLength() > 0) {
        e.preventDefault();
        hideTooltips();
        onClear();
      }
    }
    if (e.key === "s" || e.key === "S") {
      const hasValidWebhook = isValidUrl(settingsWebhookUrl()) || isValidUrl(webhookUrl || "");
      if (annotationsLength() > 0 && hasValidWebhook && sendState.value === "idle") {
        e.preventDefault();
        hideTooltips();
        onSend();
      }
    }
  }
  return { handleKeyDown };
}

// vue-sfc:/Users/viz/dev/agentation-vue/src/vue/components/AgentationToolbar.vue
var import_vue95 = require("vue");
var _sfc_main41 = /* @__PURE__ */ (0, import_vue93.defineComponent)({
  __name: "AgentationToolbar",
  props: {
    className: { type: String, required: false },
    demoAnnotations: { type: Array, required: false },
    demoDelay: { type: Number, required: false, default: 1e3 },
    enableDemoMode: { type: Boolean, required: false, default: false },
    onAnnotationAdd: { type: Function, required: false },
    onAnnotationDelete: { type: Function, required: false },
    onAnnotationUpdate: { type: Function, required: false },
    onAnnotationsClear: { type: Function, required: false },
    onCopy: { type: Function, required: false },
    onSubmit: { type: Function, required: false },
    copyToClipboard: { type: Boolean, required: false, default: true },
    endpoint: { type: String, required: false },
    sessionId: { type: String, required: false },
    onSessionCreated: { type: Function, required: false },
    webhookUrl: { type: String, required: false }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const _window = window;
    const _document = document;
    const props = __props;
    function identifyElementWithVue(element, reactMode = "filtered") {
      const { name: elementName, path } = identifyElement(element);
      if (reactMode === "off") {
        return { name: elementName, elementName, path, reactComponents: null };
      }
      const vueInfo = getVueComponentName(element, { mode: reactMode });
      return {
        name: vueInfo.path ? `${vueInfo.path} ${elementName}` : elementName,
        elementName,
        path,
        reactComponents: vueInfo.path
      };
    }
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
      setJustFinishedToolbarDrag
    } = useToolbarSettings();
    const isActive = (0, import_vue94.ref)(false);
    const showMarkers = (0, import_vue94.ref)(true);
    const scrollY = (0, import_vue94.ref)(0);
    const isScrolling = (0, import_vue94.ref)(false);
    const isFrozen = (0, import_vue94.ref)(false);
    const showSettings = (0, import_vue94.ref)(false);
    const showSettingsVisible = (0, import_vue94.ref)(false);
    const settingsPage = (0, import_vue94.ref)("main");
    const isTransitioning = (0, import_vue94.ref)(false);
    const tooltipsHidden = (0, import_vue94.ref)(false);
    const copied = (0, import_vue94.ref)(false);
    const sendState = (0, import_vue94.ref)("idle");
    const cleared = (0, import_vue94.ref)(false);
    const isClearing = (0, import_vue94.ref)(false);
    const hoveredMarkerId = (0, import_vue94.ref)(null);
    const hoveredTargetElement = (0, import_vue94.ref)(null);
    const isToolbarHidden = (0, import_vue94.ref)(false);
    const isToolbarHiding = (0, import_vue94.ref)(false);
    const tooltipSessionActive = (0, import_vue94.ref)(false);
    let tooltipSessionTimerRef = null;
    const portalWrapperRef = (0, import_vue94.ref)(null);
    const stopBubble = (e) => e.stopPropagation();
    const hoveredTargetElements = (0, import_vue94.ref)([]);
    const deletingMarkerId = (0, import_vue94.ref)(null);
    const renumberFrom = (0, import_vue94.ref)(null);
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
      setCurrentStroke
    } = useDrawing();
    (0, import_vue94.watch)(drawStrokes, () => {
      updateDrawStrokesRef();
    }, { deep: true });
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
      resetAll: resetAnnotationState
    } = useAnnotationState();
    const {
      markersVisible,
      markersExiting,
      animatedMarkers,
      exitingMarkers,
      getShouldShowMarkers,
      updateVisibility
    } = useMarkerVisibility({
      isActive,
      showMarkers,
      annotations: (0, import_vue94.ref)([])
      // will be replaced
    });
    const annotations = (0, import_vue94.ref)([]);
    let annotationsSnapshot = [];
    function updateAnnotationsSnapshot() {
      annotationsSnapshot = annotations.value;
    }
    (0, import_vue94.watch)(annotations, updateAnnotationsSnapshot, { deep: true });
    let recentlyAddedId = null;
    const { hoverInfo, hoverPosition, setHover, clearHover } = useHover();
    const dragSelect = useDragSelect();
    const multiSelect = useMultiSelect();
    const { injectCursorStyles, removeCursorStyles, setDrawingHoverCursor } = useCursorStyles();
    const {
      currentSessionId,
      connectionStatus,
      initSession,
      startHealthCheck,
      startEventSource,
      syncOnReconnect
    } = useServerSync({
      endpoint: props.endpoint,
      initialSessionId: props.sessionId,
      pathname,
      mounted,
      annotations,
      exitingMarkers,
      onSessionCreated: props.onSessionCreated
    });
    const popupRef = (0, import_vue94.ref)(null);
    const editPopupRef = (0, import_vue94.ref)(null);
    let scrollTimeoutId = null;
    const dragRectRef = (0, import_vue94.ref)(null);
    const highlightsContainerRef = (0, import_vue94.ref)(null);
    const effectiveReactMode = (0, import_vue94.computed)(() => getEffectiveReactMode());
    const hasAnnotations = (0, import_vue94.computed)(() => annotations.value.length > 0);
    const shouldShowMarkers = (0, import_vue94.computed)(() => isActive.value && showMarkers.value);
    const visibleAnnotations = (0, import_vue94.computed)(
      () => annotations.value.filter((a) => !exitingMarkers.value.has(a.id) && isRenderableAnnotation(a))
    );
    const exitingAnnotationsList = (0, import_vue94.computed)(
      () => annotations.value.filter((a) => exitingMarkers.value.has(a.id))
    );
    async function fireWebhook(event, payload, force) {
      const targetUrl = settings.webhookUrl || props.webhookUrl;
      if (!targetUrl || !settings.webhooksEnabled && !force) return false;
      try {
        const response = await fetch(targetUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event,
            timestamp: Date.now(),
            url: typeof window !== "undefined" ? window.location.href : void 0,
            ...payload
          })
        });
        return response.ok;
      } catch (error) {
        console.warn("[Agentation] Webhook failed:", error);
        return false;
      }
    }
    function freezeAnimations() {
      if (isFrozen.value) return;
      freeze();
      isFrozen.value = true;
    }
    function unfreezeAnimations() {
      if (!isFrozen.value) return;
      unfreeze();
      isFrozen.value = false;
    }
    function toggleFreeze() {
      if (isFrozen.value) unfreezeAnimations();
      else freezeAnimations();
    }
    function hideTooltipsUntilMouseLeave() {
      tooltipsHidden.value = true;
    }
    function showTooltipsAgain() {
      tooltipsHidden.value = false;
    }
    function hideToolbarTemporarily() {
      isToolbarHiding.value = true;
      originalSetTimeout(() => {
        isToolbarHidden.value = true;
        isToolbarHiding.value = false;
        saveToolbarHidden(true);
      }, 400);
    }
    function handleControlsMouseEnter() {
      tooltipSessionTimerRef = originalSetTimeout(() => {
        tooltipSessionActive.value = true;
      }, 850);
    }
    function handleControlsMouseLeave() {
      if (tooltipSessionTimerRef) {
        clearTimeout(tooltipSessionTimerRef);
        tooltipSessionTimerRef = null;
      }
      tooltipSessionActive.value = false;
      showTooltipsAgain();
    }
    function isRenderableAnnotation(a) {
      return a.status !== "resolved" && a.status !== "dismissed";
    }
    function getSourceFileForElement(element) {
      const result = getSourceLocation(element);
      if (result.found && result.source) {
        return `${result.source.fileName}:${result.source.lineNumber}`;
      }
      return void 0;
    }
    function persistAnnotations() {
      if (mounted.value && annotations.value.length > 0) {
        if (currentSessionId.value) {
          saveAnnotationsWithSyncMarker(pathname, annotations.value, currentSessionId.value);
        } else {
          saveAnnotations(pathname, annotations.value);
        }
      } else if (mounted.value && annotations.value.length === 0) {
        localStorage.removeItem(getStorageKey(pathname));
      }
    }
    function addAnnotation(comment) {
      if (!pendingAnnotation.value) return;
      const pa = pendingAnnotation.value;
      const newAnnotation = {
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
        ...props.endpoint && currentSessionId.value ? {
          sessionId: currentSessionId.value,
          url: typeof window !== "undefined" ? window.location.href : void 0,
          status: "pending"
        } : {}
      };
      annotations.value = [...annotations.value, newAnnotation];
      recentlyAddedId = newAnnotation.id;
      originalSetTimeout(() => {
        recentlyAddedId = null;
      }, 300);
      originalSetTimeout(() => {
        animatedMarkers.value = new Set(animatedMarkers.value).add(newAnnotation.id);
      }, 250);
      props.onAnnotationAdd?.(newAnnotation);
      fireWebhook("annotation.add", { annotation: newAnnotation });
      pendingExiting.value = true;
      originalSetTimeout(() => {
        pendingAnnotation.value = null;
        pendingExiting.value = false;
      }, 150);
      window.getSelection()?.removeAllRanges();
      if (props.endpoint && currentSessionId.value) {
        syncAnnotation(props.endpoint, currentSessionId.value, newAnnotation).then((serverAnnotation) => {
          if (serverAnnotation.id !== newAnnotation.id) {
            annotations.value = annotations.value.map(
              (a) => a.id === newAnnotation.id ? { ...a, id: serverAnnotation.id } : a
            );
            const next = new Set(animatedMarkers.value);
            next.delete(newAnnotation.id);
            next.add(serverAnnotation.id);
            animatedMarkers.value = next;
          }
        }).catch((error) => {
          console.warn("[Agentation] Failed to sync annotation:", error);
        });
      }
    }
    function cancelAnnotation() {
      const strokeId = pendingAnnotation.value?.strokeId;
      pendingExiting.value = true;
      if (strokeId) {
        exitingStrokeIdRef.value = strokeId;
        exitingAlphaRef.value = 1;
        const canvas = drawCanvasRef.value;
        const ctx = canvas?.getContext("2d");
        if (ctx) {
          const start = performance.now();
          const fade = (now) => {
            const t = Math.min((now - start) / 150, 1);
            exitingAlphaRef.value = 1 - t;
            redrawCanvas(ctx, drawStrokesRef.value, visualHighlightRef.value, dimAmountRef.value);
            if (t < 1) requestAnimationFrame(fade);
          };
          requestAnimationFrame(fade);
        }
      }
      originalSetTimeout(() => {
        exitingStrokeIdRef.value = null;
        if (strokeId) {
          const currentStrokes = drawStrokesRef.value;
          const drawingIdx = currentStrokes.findIndex((s) => s.id === strokeId);
          if (drawingIdx >= 0) {
            drawStrokes.value = drawStrokes.value.filter((s) => s.id !== strokeId);
            annotations.value = annotations.value.map(
              (a) => a.drawingIndex != null && a.drawingIndex > drawingIdx ? { ...a, drawingIndex: a.drawingIndex - 1 } : a
            );
          }
        }
        pendingAnnotation.value = null;
        pendingExiting.value = false;
      }, 150);
    }
    function deleteAnnotation2(id) {
      const deletedIndex = annotationsSnapshot.findIndex((a) => a.id === id);
      const deletedAnnotation = annotationsSnapshot[deletedIndex];
      if (editingAnnotation.value?.id === id) {
        editExiting.value = true;
        originalSetTimeout(() => {
          editingAnnotation.value = null;
          editingTargetElement.value = null;
          editingTargetElements.value = [];
          editExiting.value = false;
        }, 150);
      }
      deletingMarkerId.value = id;
      exitingMarkers.value = new Set(exitingMarkers.value).add(id);
      if (deletedAnnotation) {
        props.onAnnotationDelete?.(deletedAnnotation);
        fireWebhook("annotation.delete", { annotation: deletedAnnotation });
      }
      if (props.endpoint) {
        deleteAnnotation(props.endpoint, id).catch((error) => {
          console.warn("[Agentation] Failed to delete annotation from server:", error);
        });
      }
      if (deletedAnnotation?.strokeId) {
        exitingStrokeIdRef.value = deletedAnnotation.strokeId;
        exitingAlphaRef.value = 1;
        const canvas = drawCanvasRef.value;
        const ctx = canvas?.getContext("2d");
        if (ctx) {
          const start = performance.now();
          const fade = (now) => {
            const t = Math.min((now - start) / 150, 1);
            exitingAlphaRef.value = 1 - t;
            redrawCanvas(ctx, drawStrokesRef.value, visualHighlightRef.value, dimAmountRef.value);
            if (t < 1) requestAnimationFrame(fade);
          };
          requestAnimationFrame(fade);
        }
      }
      originalSetTimeout(() => {
        exitingStrokeIdRef.value = null;
        const latestAnn = annotationsSnapshot.find((a) => a.id === id);
        const strokeId = latestAnn?.strokeId;
        const currentStrokes = drawStrokesRef.value;
        const drawingIdx = strokeId ? currentStrokes.findIndex((s) => s.id === strokeId) : -1;
        if (drawingIdx >= 0) {
          drawStrokes.value = drawStrokes.value.filter((s) => s.id !== strokeId);
          annotations.value = annotations.value.filter((a) => a.id !== id).map(
            (a) => a.drawingIndex != null && a.drawingIndex > drawingIdx ? { ...a, drawingIndex: a.drawingIndex - 1 } : a
          );
        } else {
          annotations.value = annotations.value.filter((a) => a.id !== id);
        }
        const next = new Set(exitingMarkers.value);
        next.delete(id);
        exitingMarkers.value = next;
        deletingMarkerId.value = null;
        const currentIndex = annotationsSnapshot.findIndex((a) => a.id === id);
        if (currentIndex >= 0 && currentIndex < annotationsSnapshot.length - 1) {
          renumberFrom.value = currentIndex;
          originalSetTimeout(() => {
            renumberFrom.value = null;
          }, 200);
        }
      }, 150);
    }
    function updateAnnotation2(newComment) {
      if (!editingAnnotation.value) return;
      const updatedAnnotation = { ...editingAnnotation.value, comment: newComment };
      annotations.value = annotations.value.map(
        (a) => a.id === editingAnnotation.value.id ? updatedAnnotation : a
      );
      props.onAnnotationUpdate?.(updatedAnnotation);
      fireWebhook("annotation.update", { annotation: updatedAnnotation });
      if (props.endpoint) {
        updateAnnotation(props.endpoint, editingAnnotation.value.id, {
          comment: newComment
        }).catch((error) => {
          console.warn("[Agentation] Failed to update annotation on server:", error);
        });
      }
      editExiting.value = true;
      originalSetTimeout(() => {
        editingAnnotation.value = null;
        editingTargetElement.value = null;
        editingTargetElements.value = [];
        editExiting.value = false;
      }, 150);
    }
    function startEditAnnotation(annotation) {
      editingAnnotation.value = annotation;
      hoveredMarkerId.value = null;
      hoveredTargetElement.value = null;
      hoveredTargetElements.value = [];
      if (annotation.elementBoundingBoxes?.length) {
        const elements = [];
        for (const bb of annotation.elementBoundingBoxes) {
          const centerX = bb.x + bb.width / 2;
          const centerY = bb.y + bb.height / 2 - window.scrollY;
          const el = deepElementFromPoint(centerX, centerY);
          if (el) elements.push(el);
        }
        editingTargetElements.value = elements;
        editingTargetElement.value = null;
      } else if (annotation.boundingBox) {
        const bb = annotation.boundingBox;
        const centerX = bb.x + bb.width / 2;
        const centerY = annotation.isFixed ? bb.y + bb.height / 2 : bb.y + bb.height / 2 - window.scrollY;
        const el = deepElementFromPoint(centerX, centerY);
        if (el) {
          const elRect = el.getBoundingClientRect();
          const widthRatio = elRect.width / bb.width;
          const heightRatio = elRect.height / bb.height;
          editingTargetElement.value = widthRatio < 0.5 || heightRatio < 0.5 ? null : el;
        } else {
          editingTargetElement.value = null;
        }
        editingTargetElements.value = [];
      } else {
        editingTargetElement.value = null;
        editingTargetElements.value = [];
      }
    }
    function cancelEditAnnotation() {
      editExiting.value = true;
      originalSetTimeout(() => {
        editingAnnotation.value = null;
        editingTargetElement.value = null;
        editingTargetElements.value = [];
        editExiting.value = false;
      }, 150);
    }
    function clearAll() {
      const count = annotations.value.length;
      if (count === 0 && drawStrokes.value.length === 0) return;
      props.onAnnotationsClear?.(annotations.value);
      fireWebhook("annotations.clear", { annotations: annotations.value });
      if (props.endpoint) {
        Promise.all(
          annotations.value.map(
            (a) => deleteAnnotation(props.endpoint, a.id).catch((error) => {
              console.warn("[Agentation] Failed to delete annotation from server:", error);
            })
          )
        );
      }
      isClearing.value = true;
      cleared.value = true;
      drawStrokes.value = [];
      const canvas = drawCanvasRef.value;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      const totalAnimationTime = count * 30 + 200;
      originalSetTimeout(() => {
        annotations.value = [];
        animatedMarkers.value = /* @__PURE__ */ new Set();
        localStorage.removeItem(getStorageKey(pathname));
        isClearing.value = false;
      }, totalAnimationTime);
      originalSetTimeout(() => {
        cleared.value = false;
      }, 1500);
    }
    async function copyOutput() {
      const displayUrl = typeof window !== "undefined" ? window.location.pathname + window.location.search + window.location.hash : pathname;
      let output = generateOutput(annotations.value, displayUrl, settings.outputDetail, effectiveReactMode.value);
      if (!output && drawStrokes.value.length === 0) return;
      if (!output) output = `## Page Feedback: ${displayUrl}
`;
      if (drawStrokes.value.length > 0) {
        const linkedDrawingIndices = /* @__PURE__ */ new Set();
        for (const a of annotations.value) {
          if (a.drawingIndex != null) linkedDrawingIndices.add(a.drawingIndex);
        }
        const canvas = drawCanvasRef.value;
        if (canvas) canvas.style.visibility = "hidden";
        const strokeDescriptions = [];
        const sv = window.scrollY;
        for (let strokeIdx = 0; strokeIdx < drawStrokes.value.length; strokeIdx++) {
          if (linkedDrawingIndices.has(strokeIdx)) continue;
          const stroke = drawStrokes.value[strokeIdx];
          if (stroke.points.length < 2) continue;
          const viewportPoints = stroke.fixed ? stroke.points : stroke.points.map((p) => ({ x: p.x, y: p.y - sv }));
          let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
          for (const p of viewportPoints) {
            minX = Math.min(minX, p.x);
            minY = Math.min(minY, p.y);
            maxX = Math.max(maxX, p.x);
            maxY = Math.max(maxY, p.y);
          }
          const gesture = classifyStrokeGesture(stroke.points, stroke.fixed);
          const sampleCount = Math.min(10, viewportPoints.length);
          const step = Math.max(1, Math.floor(viewportPoints.length / sampleCount));
          const seenElements = /* @__PURE__ */ new Set();
          const elementNames = [];
          const start = viewportPoints[0];
          const end = viewportPoints[viewportPoints.length - 1];
          const samplePoints = [start];
          for (let i = step; i < viewportPoints.length - 1; i += step) samplePoints.push(viewportPoints[i]);
          samplePoints.push(end);
          for (const p of samplePoints) {
            const el = deepElementFromPoint(p.x, p.y);
            if (!el || seenElements.has(el)) continue;
            if (closestCrossingShadow(el, "[data-feedback-toolbar]")) continue;
            seenElements.add(el);
            const { name } = identifyElement(el);
            if (!elementNames.includes(name)) elementNames.push(name);
          }
          const region = `${Math.round(minX)},${Math.round(minY)} \u2192 ${Math.round(maxX)},${Math.round(maxY)}`;
          let desc;
          const g = gesture.toLowerCase();
          if ((g === "circle" || g === "box") && elementNames.length > 0) {
            const verb = g === "box" ? "Boxed" : "Circled";
            desc = `${verb} **${elementNames[0]}**${elementNames.length > 1 ? ` (and ${elementNames.slice(1).join(", ")})` : ""} (region: ${region})`;
          } else if (g === "underline" && elementNames.length > 0) {
            desc = `Underlined **${elementNames[0]}** (${region})`;
          } else if (g === "arrow" && elementNames.length >= 2) {
            desc = `Arrow from **${elementNames[0]}** to **${elementNames[elementNames.length - 1]}** (${Math.round(start.x)},${Math.round(start.y)} \u2192 ${Math.round(end.x)},${Math.round(end.y)})`;
          } else if (elementNames.length > 0) {
            desc = `${g === "arrow" ? "Arrow" : "Drawing"} near **${elementNames.join("**, **")}** (region: ${region})`;
          } else {
            desc = `Drawing at ${region}`;
          }
          strokeDescriptions.push(desc);
        }
        if (canvas) canvas.style.visibility = "";
        if (strokeDescriptions.length > 0) {
          output += `
**Drawings:**
`;
          strokeDescriptions.forEach((d, i) => {
            output += `${i + 1}. ${d}
`;
          });
        }
      }
      if (props.copyToClipboard) {
        try {
          await navigator.clipboard.writeText(output);
        } catch {
        }
      }
      props.onCopy?.(output);
      copied.value = true;
      originalSetTimeout(() => {
        copied.value = false;
      }, 2e3);
      if (settings.autoClearAfterCopy) {
        originalSetTimeout(() => clearAll(), 500);
      }
    }
    async function sendToWebhook() {
      const displayUrl = typeof window !== "undefined" ? window.location.pathname + window.location.search + window.location.hash : pathname;
      const output = generateOutput(annotations.value, displayUrl, settings.outputDetail, effectiveReactMode.value);
      if (!output) return;
      if (props.onSubmit) {
        props.onSubmit(output, annotations.value);
      }
      sendState.value = "sending";
      await new Promise((resolve) => originalSetTimeout(resolve, 150));
      const success = await fireWebhook("submit", { output, annotations: annotations.value }, true);
      sendState.value = success ? "sent" : "failed";
      originalSetTimeout(() => {
        sendState.value = "idle";
      }, 2500);
      if (success && settings.autoClearAfterCopy) {
        originalSetTimeout(() => clearAll(), 500);
      }
    }
    function handleMarkerHover(annotation) {
      if (!annotation) {
        hoveredMarkerId.value = null;
        hoveredTargetElement.value = null;
        hoveredTargetElements.value = [];
        hoveredDrawingIdx.value = null;
        return;
      }
      hoveredMarkerId.value = annotation.id;
      if (annotation.drawingIndex != null && annotation.drawingIndex < drawStrokes.value.length) {
        hoveredDrawingIdx.value = annotation.drawingIndex;
      } else {
        hoveredDrawingIdx.value = null;
      }
      if (annotation.elementBoundingBoxes?.length) {
        const elements = [];
        for (const bb of annotation.elementBoundingBoxes) {
          const centerX = bb.x + bb.width / 2;
          const centerY = bb.y + bb.height / 2 - window.scrollY;
          const allEls = document.elementsFromPoint(centerX, centerY);
          const el = allEls.find(
            (e) => !e.closest("[data-annotation-marker]") && !e.closest("[data-agentation-root]")
          );
          if (el) elements.push(el);
        }
        hoveredTargetElements.value = elements;
        hoveredTargetElement.value = null;
      } else if (annotation.boundingBox) {
        const bb = annotation.boundingBox;
        const centerX = bb.x + bb.width / 2;
        const centerY = annotation.isFixed ? bb.y + bb.height / 2 : bb.y + bb.height / 2 - window.scrollY;
        const el = deepElementFromPoint(centerX, centerY);
        if (el) {
          const elRect = el.getBoundingClientRect();
          const widthRatio = elRect.width / bb.width;
          const heightRatio = elRect.height / bb.height;
          hoveredTargetElement.value = widthRatio < 0.5 || heightRatio < 0.5 ? null : el;
        } else {
          hoveredTargetElement.value = null;
        }
        hoveredTargetElements.value = [];
      } else {
        hoveredTargetElement.value = null;
        hoveredTargetElements.value = [];
      }
    }
    function createMultiSelectPendingAnnotation() {
      const elements = multiSelect.pendingMultiSelectElements.value;
      if (elements.length === 0) return;
      const firstItem = elements[0];
      const firstEl = firstItem.element;
      const isMulti = elements.length > 1;
      const freshRects = elements.map((item) => item.element.getBoundingClientRect());
      if (!isMulti) {
        const rect = freshRects[0];
        const isFixed = isElementFixed(firstEl);
        pendingAnnotation.value = {
          x: rect.left / window.innerWidth * 100,
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
          sourceFile: getSourceFileForElement(firstEl)
        };
      } else {
        const bounds = {
          left: Math.min(...freshRects.map((r) => r.left)),
          top: Math.min(...freshRects.map((r) => r.top)),
          right: Math.max(...freshRects.map((r) => r.right)),
          bottom: Math.max(...freshRects.map((r) => r.bottom))
        };
        const names = elements.slice(0, 5).map((item) => item.name).join(", ");
        const suffix = elements.length > 5 ? ` +${elements.length - 5} more` : "";
        const elementBoundingBoxes = freshRects.map((rect) => ({
          x: rect.left,
          y: rect.top + window.scrollY,
          width: rect.width,
          height: rect.height
        }));
        const lastItem = elements[elements.length - 1];
        const lastEl = lastItem.element;
        const lastRect = freshRects[freshRects.length - 1];
        const lastCenterX = lastRect.left + lastRect.width / 2;
        const lastCenterY = lastRect.top + lastRect.height / 2;
        const lastIsFixed = isElementFixed(lastEl);
        pendingAnnotation.value = {
          x: lastCenterX / window.innerWidth * 100,
          y: lastIsFixed ? lastCenterY : lastCenterY + window.scrollY,
          clientY: lastCenterY,
          element: `${elements.length} elements: ${names}${suffix}`,
          elementPath: "multi-select",
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
          sourceFile: getSourceFileForElement(firstEl)
        };
      }
      multiSelect.clear();
      clearHover();
    }
    const { handleKeyDown } = useKeyboardShortcuts({
      isActive,
      isDrawMode,
      pendingAnnotation,
      annotationsLength: () => annotations.value.length,
      drawStrokesLength: () => drawStrokes.value.length,
      settingsWebhookUrl: () => settings.webhookUrl,
      webhookUrl: props.webhookUrl,
      sendState,
      onToggleActive: () => {
        isActive.value = !isActive.value;
      },
      onToggleFreeze: toggleFreeze,
      onToggleDrawMode: () => {
        isDrawMode.value = !isDrawMode.value;
      },
      onToggleMarkers: () => {
        showMarkers.value = !showMarkers.value;
        if (isDrawMode.value) isDrawMode.value = false;
      },
      onCopy: copyOutput,
      onClear: clearAll,
      onSend: sendToWebhook,
      onUndoStroke: () => {
        drawStrokes.value = drawStrokes.value.slice(0, -1);
        const canvas = drawCanvasRef.value;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          if (ctx) redrawCanvas(ctx, drawStrokes.value);
        }
      },
      onEscapeDrawMode: () => {
        isDrawMode.value = false;
      },
      onClearMultiSelect: () => multiSelect.clear(),
      pendingMultiSelectLength: () => multiSelect.pendingMultiSelectElements.value.length,
      hideTooltips: hideTooltipsUntilMouseLeave
    });
    (0, import_vue94.watch)(showSettings, (val) => {
      if (val) {
        showSettingsVisible.value = true;
      } else {
        tooltipsHidden.value = false;
        settingsPage.value = "main";
        const timer = originalSetTimeout(() => {
          showSettingsVisible.value = false;
        }, 0);
      }
    });
    (0, import_vue94.watch)(settingsPage, () => {
      isTransitioning.value = true;
      const timer = originalSetTimeout(() => {
        isTransitioning.value = false;
      }, 350);
    });
    (0, import_vue94.watch)([shouldShowMarkers, annotations], () => {
      const shouldShow = shouldShowMarkers.value;
      if (shouldShow) {
        markersExiting.value = false;
        markersVisible.value = true;
        animatedMarkers.value = /* @__PURE__ */ new Set();
        const enterMaxDelay = Math.max(0, annotations.value.length - 1) * 20;
        originalSetTimeout(() => {
          const newSet = new Set(animatedMarkers.value);
          annotations.value.forEach((a) => newSet.add(a.id));
          animatedMarkers.value = newSet;
        }, enterMaxDelay + 250 + 50);
      } else if (markersVisible.value) {
        markersExiting.value = true;
        const maxDelay = Math.max(0, annotations.value.length - 1) * 20;
        originalSetTimeout(() => {
          markersVisible.value = false;
          markersExiting.value = false;
        }, maxDelay + 200 + 50);
      }
    }, { immediate: true });
    (0, import_vue94.watch)(annotations, persistAnnotations, { deep: true });
    (0, import_vue94.watch)(() => ({ ...settings }), saveSettings, { deep: true });
    (0, import_vue94.watch)(isDarkMode, saveTheme);
    let prevDragging = false;
    (0, import_vue94.watch)(isDraggingToolbar, (val) => {
      if (prevDragging && !val && toolbarPosition.value && mounted.value) {
        saveToolbarPosition();
      }
      prevDragging = val;
    });
    (0, import_vue94.watch)(isActive, (val) => {
      if (!val) {
        pendingAnnotation.value = null;
        editingAnnotation.value = null;
        editingTargetElement.value = null;
        editingTargetElements.value = [];
        hoverInfo.value = null;
        showSettings.value = false;
        multiSelect.clear();
        multiSelect.resetModifiers();
        isDrawMode.value = false;
        if (isFrozen.value) unfreezeAnimations();
      }
    });
    (0, import_vue94.watch)(isActive, (val) => {
      if (val) injectCursorStyles();
      else removeCursorStyles();
    });
    (0, import_vue94.watch)(hoveredDrawingIdx, (val) => {
      setDrawingHoverCursor(val !== null && isActive.value);
    });
    function handleScroll() {
      scrollY.value = window.scrollY;
      isScrolling.value = true;
      if (scrollTimeoutId) clearTimeout(scrollTimeoutId);
      scrollTimeoutId = originalSetTimeout(() => {
        isScrolling.value = false;
      }, 150);
    }
    function handleMouseMove(e) {
      if (!isActive.value || pendingAnnotation.value || isDrawMode.value) return;
      const target = e.composedPath()[0] || e.target;
      if (closestCrossingShadow(target, "[data-feedback-toolbar]")) {
        clearHover();
        if (!target.closest("[data-annotation-marker]")) hoveredDrawingIdx.value = null;
        return;
      }
      if (drawStrokes.value.length > 0) {
        const strokeIdx = findStrokeAtPoint(e.clientX, e.clientY, drawStrokes.value);
        if (strokeIdx !== null) {
          hoveredDrawingIdx.value = strokeIdx;
          clearHover();
          return;
        }
      }
      hoveredDrawingIdx.value = null;
      const elementUnder = deepElementFromPoint(e.clientX, e.clientY);
      if (!elementUnder || closestCrossingShadow(elementUnder, "[data-feedback-toolbar]")) {
        clearHover();
        return;
      }
      const { name, elementName, path, reactComponents } = identifyElementWithVue(elementUnder, effectiveReactMode.value);
      const rect = elementUnder.getBoundingClientRect();
      setHover(
        { element: name, elementName, elementPath: path, rect, reactComponents },
        { x: e.clientX, y: e.clientY }
      );
    }
    function handleClick(e) {
      if (!isActive.value || isDrawMode.value) return;
      if (dragSelect.getJustFinishedDrag()) {
        dragSelect.setJustFinishedDrag(false);
        return;
      }
      const target = e.composedPath()[0] || e.target;
      if (closestCrossingShadow(target, "[data-feedback-toolbar]")) return;
      if (closestCrossingShadow(target, "[data-annotation-popup]")) return;
      if (closestCrossingShadow(target, "[data-annotation-marker]")) return;
      if (drawStrokes.value.length > 0 && !pendingAnnotation.value && !editingAnnotation.value) {
        const strokeIdx = findStrokeAtPoint(e.clientX, e.clientY, drawStrokes.value);
        if (strokeIdx !== null) {
          e.preventDefault();
          e.stopPropagation();
          const existingAnnotation = annotations.value.find(
            (a) => a.strokeId === drawStrokes.value[strokeIdx]?.id || a.drawingIndex === strokeIdx
          );
          if (existingAnnotation) {
            startEditAnnotation(existingAnnotation);
            return;
          }
          const stroke = drawStrokes.value[strokeIdx];
          const scrollYNow = window.scrollY;
          const canvas = drawCanvasRef.value;
          if (canvas) canvas.style.visibility = "hidden";
          const elementUnder2 = deepElementFromPoint(e.clientX, e.clientY);
          if (canvas) canvas.style.visibility = "";
          const gestureShape = classifyStrokeGesture(stroke.points, stroke.fixed);
          let name2 = `Drawing: ${gestureShape}`;
          let path2 = "";
          let reactComponents2 = null;
          let nearbyText;
          let cssClasses;
          let fullPath;
          let accessibility;
          let computedStylesStr;
          let computedStylesObj;
          let nearbyElements;
          let elIsFixed = stroke.fixed;
          let boundingBox;
          if (elementUnder2) {
            const info = identifyElementWithVue(elementUnder2, effectiveReactMode.value);
            name2 = `Drawing: ${gestureShape} \u2192 ${info.name}`;
            path2 = info.path;
            reactComponents2 = info.reactComponents;
            nearbyText = getNearbyText(elementUnder2);
            cssClasses = getElementClasses(elementUnder2);
            fullPath = getFullElementPath(elementUnder2);
            accessibility = getAccessibilityInfo(elementUnder2);
            computedStylesStr = getForensicComputedStyles(elementUnder2);
            computedStylesObj = getDetailedComputedStyles(elementUnder2);
            nearbyElements = getNearbyElements(elementUnder2);
            const rect2 = elementUnder2.getBoundingClientRect();
            boundingBox = { x: rect2.left, y: elIsFixed ? rect2.top : rect2.top + scrollYNow, width: rect2.width, height: rect2.height };
          }
          pendingAnnotation.value = {
            x: e.clientX / window.innerWidth * 100,
            y: elIsFixed ? e.clientY : e.clientY + scrollYNow,
            clientY: e.clientY,
            element: name2,
            elementPath: path2,
            boundingBox,
            nearbyText,
            cssClasses,
            isFixed: elIsFixed,
            fullPath,
            accessibility,
            computedStyles: computedStylesStr,
            computedStylesObj,
            nearbyElements,
            reactComponents: reactComponents2 ?? void 0,
            targetElement: elementUnder2 ?? void 0,
            drawingIndex: strokeIdx,
            strokeId: stroke.id,
            sourceFile: elementUnder2 ? getSourceFileForElement(elementUnder2) : void 0
          };
          clearHover();
          hoveredDrawingIdx.value = null;
          return;
        }
      }
      if (e.metaKey && e.shiftKey && !pendingAnnotation.value && !editingAnnotation.value) {
        e.preventDefault();
        e.stopPropagation();
        const elementUnder2 = deepElementFromPoint(e.clientX, e.clientY);
        if (!elementUnder2) return;
        const rect2 = elementUnder2.getBoundingClientRect();
        const { name: name2, path: path2, reactComponents: reactComponents2 } = identifyElementWithVue(elementUnder2, effectiveReactMode.value);
        multiSelect.toggleElement(elementUnder2, { element: elementUnder2, rect: rect2, name: name2, path: path2, reactComponents: reactComponents2 ?? void 0 });
        return;
      }
      const isInteractive = closestCrossingShadow(target, "button, a, input, select, textarea, [role='button'], [onclick]");
      if (settings.blockInteractions && isInteractive) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (pendingAnnotation.value) {
        if (isInteractive && !settings.blockInteractions) return;
        e.preventDefault();
        popupRef.value?.shake();
        return;
      }
      if (editingAnnotation.value) {
        if (isInteractive && !settings.blockInteractions) return;
        e.preventDefault();
        editPopupRef.value?.shake();
        return;
      }
      e.preventDefault();
      const elementUnder = deepElementFromPoint(e.clientX, e.clientY);
      if (!elementUnder) return;
      const { name, path, reactComponents } = identifyElementWithVue(elementUnder, effectiveReactMode.value);
      const rect = elementUnder.getBoundingClientRect();
      const x = e.clientX / window.innerWidth * 100;
      const isFixed = isElementFixed(elementUnder);
      const y = isFixed ? e.clientY : e.clientY + window.scrollY;
      const selection = window.getSelection();
      let selectedText;
      if (selection && selection.toString().trim().length > 0) {
        selectedText = selection.toString().trim().slice(0, 500);
      }
      pendingAnnotation.value = {
        x,
        y,
        clientY: e.clientY,
        element: name,
        elementPath: path,
        selectedText,
        boundingBox: { x: rect.left, y: isFixed ? rect.top : rect.top + window.scrollY, width: rect.width, height: rect.height },
        nearbyText: getNearbyText(elementUnder),
        cssClasses: getElementClasses(elementUnder),
        isFixed,
        fullPath: getFullElementPath(elementUnder),
        accessibility: getAccessibilityInfo(elementUnder),
        computedStyles: getForensicComputedStyles(elementUnder),
        computedStylesObj: getDetailedComputedStyles(elementUnder),
        nearbyElements: getNearbyElements(elementUnder),
        reactComponents: reactComponents ?? void 0,
        targetElement: elementUnder,
        sourceFile: getSourceFileForElement(elementUnder)
      };
      clearHover();
    }
    function handleModifierKeyDown(e) {
      if (e.key === "Meta") multiSelect.modifiersHeld.cmd = true;
      if (e.key === "Shift") multiSelect.modifiersHeld.shift = true;
    }
    function handleModifierKeyUp(e) {
      const wasHoldingBoth = multiSelect.modifiersHeld.cmd && multiSelect.modifiersHeld.shift;
      if (e.key === "Meta") multiSelect.modifiersHeld.cmd = false;
      if (e.key === "Shift") multiSelect.modifiersHeld.shift = false;
      const nowHoldingBoth = multiSelect.modifiersHeld.cmd && multiSelect.modifiersHeld.shift;
      if (wasHoldingBoth && !nowHoldingBoth && multiSelect.pendingMultiSelectElements.value.length > 0) {
        createMultiSelectPendingAnnotation();
      }
    }
    function handleWindowBlur() {
      multiSelect.resetModifiers();
      multiSelect.clear();
    }
    function handleDragMouseDown(e) {
      if (!isActive.value || pendingAnnotation.value || isDrawMode.value) return;
      dragSelect.handleMouseDown(e);
    }
    function handleDragMouseMove(e) {
      if (!isActive.value || pendingAnnotation.value) return;
      dragSelect.handleMouseMove(e);
    }
    function handleDragMouseUp(e) {
      if (!isActive.value) return;
      const result = dragSelect.handleMouseUp(e);
      if (!result) return;
      if (result.finalElements.length > 0) {
        const bounds = result.finalElements.reduce(
          (acc, { rect }) => ({
            left: Math.min(acc.left, rect.left),
            top: Math.min(acc.top, rect.top),
            right: Math.max(acc.right, rect.right),
            bottom: Math.max(acc.bottom, rect.bottom)
          }),
          { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity }
        );
        const elementNames = result.finalElements.slice(0, 5).map(({ element }) => identifyElement(element).name).join(", ");
        const suffix = result.finalElements.length > 5 ? ` +${result.finalElements.length - 5} more` : "";
        const firstElement = result.finalElements[0].element;
        pendingAnnotation.value = {
          x: result.x,
          y: result.y,
          clientY: e.clientY,
          element: `${result.finalElements.length} elements: ${elementNames}${suffix}`,
          elementPath: "multi-select",
          boundingBox: { x: bounds.left, y: bounds.top + window.scrollY, width: bounds.right - bounds.left, height: bounds.bottom - bounds.top },
          isMultiSelect: true,
          fullPath: getFullElementPath(firstElement),
          accessibility: getAccessibilityInfo(firstElement),
          computedStyles: getForensicComputedStyles(firstElement),
          computedStylesObj: getDetailedComputedStyles(firstElement),
          nearbyElements: getNearbyElements(firstElement),
          cssClasses: getElementClasses(firstElement),
          nearbyText: getNearbyText(firstElement),
          sourceFile: getSourceFileForElement(firstElement)
        };
      } else {
        const width = Math.abs(result.right - result.left);
        const height = Math.abs(result.bottom - result.top);
        if (width > 20 && height > 20) {
          pendingAnnotation.value = {
            x: result.x,
            y: result.y,
            clientY: e.clientY,
            element: "Area selection",
            elementPath: `region at (${Math.round(result.left)}, ${Math.round(result.top)})`,
            boundingBox: { x: result.left, y: result.top + window.scrollY, width, height },
            isMultiSelect: true
          };
        }
      }
      clearHover();
    }
    function handleToolbarDragMove(e) {
      if (!dragStartPos.value) return;
      const DRAG_THRESHOLD = 10;
      const deltaX = e.clientX - dragStartPos.value.x;
      const deltaY = e.clientY - dragStartPos.value.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (!isDraggingToolbar.value && distance > DRAG_THRESHOLD) {
        isDraggingToolbar.value = true;
      }
      if (isDraggingToolbar.value || distance > DRAG_THRESHOLD) {
        let newX = dragStartPos.value.toolbarX + deltaX;
        let newY = dragStartPos.value.toolbarY + deltaY;
        const padding = 20;
        const wrapperWidth = 297;
        const toolbarHeight = 44;
        const contentWidth = isActive.value ? connectionStatus.value === "connected" ? 297 : 257 : 44;
        const contentOffset = wrapperWidth - contentWidth;
        const minX = padding - contentOffset;
        const maxX = window.innerWidth - padding - wrapperWidth;
        newX = Math.max(minX, Math.min(maxX, newX));
        newY = Math.max(padding, Math.min(window.innerHeight - toolbarHeight - padding, newY));
        toolbarPosition.value = { x: newX, y: newY };
      }
    }
    function handleToolbarDragEnd() {
      if (isDraggingToolbar.value) {
        setJustFinishedToolbarDrag(true);
      }
      isDraggingToolbar.value = false;
      dragStartPos.value = null;
    }
    let drawClickStart = null;
    function setupDrawCanvasListeners() {
      const canvas = drawCanvasRef.value;
      if (!canvas) return () => {
      };
      const ctx = canvas.getContext("2d");
      if (!ctx) return () => {
      };
      const dpr = window.devicePixelRatio || 1;
      const onMouseDown = (e) => {
        if (pendingAnnotation.value) {
          popupRef.value?.shake();
          return;
        }
        if (editingAnnotation.value) {
          editPopupRef.value?.shake();
          return;
        }
        const strokeIdx = findStrokeAtPoint(e.clientX, e.clientY, drawStrokes.value);
        drawClickStart = { x: e.clientX, y: e.clientY, strokeIdx };
        setIsDrawing(true);
        setCurrentStroke([{ x: e.clientX, y: e.clientY }]);
        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.beginPath();
        ctx.strokeStyle = settings.annotationColor;
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.moveTo(e.clientX, e.clientY);
      };
      const onMouseMove = (e) => {
        if (!getIsDrawing()) {
          const strokeIdx = findStrokeAtPoint(e.clientX, e.clientY, drawStrokes.value);
          hoveredDrawingIdx.value = strokeIdx;
          if (strokeIdx !== null) canvas.setAttribute("data-stroke-hover", "");
          else canvas.removeAttribute("data-stroke-hover");
          return;
        }
        const point = { x: e.clientX, y: e.clientY };
        const stroke = getCurrentStroke();
        const prev = stroke[stroke.length - 1];
        if (Math.hypot(point.x - prev.x, point.y - prev.y) < 2) return;
        stroke.push(point);
        const midX = (prev.x + point.x) / 2;
        const midY = (prev.y + point.y) / 2;
        ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(midX, midY);
      };
      const onMouseUp = (e) => {
        if (!getIsDrawing()) return;
        setIsDrawing(false);
        ctx.restore();
        const pts = getCurrentStroke();
        if (drawClickStart && drawClickStart.strokeIdx !== null && pts.length <= 3) {
          const movedDist = Math.hypot(e.clientX - drawClickStart.x, e.clientY - drawClickStart.y);
          if (movedDist < 5) {
            setCurrentStroke([]);
            drawClickStart = null;
            redrawCanvas(ctx, drawStrokes.value, drawClickStart?.strokeIdx ?? null, dimAmountRef.value);
            return;
          }
        }
        drawClickStart = null;
        if (pts.length > 1) {
          canvas.style.visibility = "hidden";
          const isElFixed = (el) => {
            let node = el;
            while (node && node !== document.documentElement) {
              const pos = getComputedStyle(node).position;
              if (pos === "fixed" || pos === "sticky") return true;
              node = node.parentElement;
            }
            return false;
          };
          let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
          for (const p of pts) {
            minX = Math.min(minX, p.x);
            minY = Math.min(minY, p.y);
            maxX = Math.max(maxX, p.x);
            maxY = Math.max(maxY, p.y);
          }
          const centerX = (minX + maxX) / 2;
          const centerY = (minY + maxY) / 2;
          const centerEl = deepElementFromPoint(centerX, centerY);
          let isFixed = centerEl ? isElFixed(centerEl) : false;
          if (!isFixed) {
            let fixedCount = 0, totalSampled = 0;
            const sampleCount = Math.min(6, pts.length);
            const step = Math.max(1, Math.floor(pts.length / sampleCount));
            for (let i = 0; i < pts.length; i += step) {
              const el = deepElementFromPoint(pts[i].x, pts[i].y);
              if (!el) continue;
              totalSampled++;
              if (isElFixed(el)) fixedCount++;
            }
            if (totalSampled > 0 && fixedCount > totalSampled * 0.6) isFixed = true;
          }
          const finalPoints = isFixed ? [...pts] : pts.map((p) => ({ x: p.x, y: p.y + window.scrollY }));
          const newStrokeId = crypto.randomUUID();
          const newStroke = { id: newStrokeId, points: finalPoints, color: settings.annotationColor, fixed: isFixed };
          const gestureShape = classifyStrokeGesture(finalPoints, isFixed);
          let name = `Drawing: ${gestureShape}`;
          let elPath = "";
          let reactComponents = null;
          let nearbyText;
          let cssClasses;
          let fullPath;
          let accessibility;
          let computedStylesStr;
          let computedStylesObj;
          let nearbyElements;
          let boundingBox;
          if (centerEl) {
            const info = identifyElementWithVue(centerEl, effectiveReactMode.value);
            name = `Drawing: ${gestureShape} \u2192 ${info.name}`;
            elPath = info.path;
            reactComponents = info.reactComponents;
            nearbyText = getNearbyText(centerEl);
            cssClasses = getElementClasses(centerEl);
            fullPath = getFullElementPath(centerEl);
            accessibility = getAccessibilityInfo(centerEl);
            computedStylesStr = getForensicComputedStyles(centerEl);
            computedStylesObj = getDetailedComputedStyles(centerEl);
            nearbyElements = getNearbyElements(centerEl);
            const rect = centerEl.getBoundingClientRect();
            boundingBox = { x: rect.left, y: isFixed ? rect.top : rect.top + window.scrollY, width: rect.width, height: rect.height };
          }
          canvas.style.visibility = "";
          const newStrokeIdx = drawStrokes.value.length;
          drawStrokes.value = [...drawStrokes.value, newStroke];
          const lastPt = finalPoints[finalPoints.length - 1];
          const lastPtViewY = isFixed ? lastPt.y : lastPt.y - window.scrollY;
          pendingAnnotation.value = {
            x: lastPt.x / window.innerWidth * 100,
            y: lastPt.y,
            clientY: lastPtViewY,
            element: name,
            elementPath: elPath,
            boundingBox,
            nearbyText,
            cssClasses,
            isFixed,
            fullPath,
            accessibility,
            computedStyles: computedStylesStr,
            computedStylesObj,
            nearbyElements,
            reactComponents: reactComponents ?? void 0,
            targetElement: centerEl ?? void 0,
            drawingIndex: newStrokeIdx,
            strokeId: newStrokeId,
            sourceFile: centerEl ? getSourceFileForElement(centerEl) : void 0
          };
          clearHover();
        }
        setCurrentStroke([]);
      };
      const onMouseLeave = () => {
        hoveredDrawingIdx.value = null;
        canvas.removeAttribute("data-stroke-hover");
      };
      canvas.addEventListener("mousedown", onMouseDown);
      canvas.addEventListener("mousemove", onMouseMove);
      canvas.addEventListener("mouseup", onMouseUp);
      canvas.addEventListener("mouseleave", onMouseLeave);
      return () => {
        canvas.removeEventListener("mousedown", onMouseDown);
        canvas.removeEventListener("mousemove", onMouseMove);
        canvas.removeEventListener("mouseup", onMouseUp);
        canvas.removeEventListener("mouseleave", onMouseLeave);
      };
    }
    let cleanupDrawListeners = null;
    (0, import_vue94.watch)([isDrawMode, isActive], () => {
      if (cleanupDrawListeners) {
        cleanupDrawListeners();
        cleanupDrawListeners = null;
      }
      if (isDrawMode.value && isActive.value) {
        (0, import_vue94.nextTick)(() => {
          cleanupDrawListeners = setupDrawCanvasListeners();
        });
      }
    });
    (0, import_vue94.watch)([isActive, drawStrokes], () => {
      if (!isActive.value) return;
      (0, import_vue94.nextTick)(() => resizeCanvas());
    }, { deep: true });
    (0, import_vue94.watch)(
      [() => hoveredDrawingIdx.value, () => pendingAnnotation.value?.drawingIndex, () => editingAnnotation.value?.drawingIndex, drawStrokes],
      () => {
        const canvas = drawCanvasRef.value;
        if (!canvas || !isActive.value || drawStrokes.value.length === 0) return;
        const effectiveHighlight = hoveredDrawingIdx.value ?? pendingAnnotation.value?.drawingIndex ?? editingAnnotation.value?.drawingIndex ?? null;
        const targetDim = effectiveHighlight != null ? 1 : 0;
        if (effectiveHighlight != null) visualHighlightRef.value = effectiveHighlight;
        if (Math.abs(dimAmountRef.value - targetDim) < 0.01) {
          dimAmountRef.value = targetDim;
          if (targetDim === 0) visualHighlightRef.value = null;
          const ctx = canvas.getContext("2d");
          if (ctx) redrawCanvas(ctx, drawStrokes.value, visualHighlightRef.value, targetDim);
          return;
        }
        let raf;
        const animate = () => {
          const diff = targetDim - dimAmountRef.value;
          if (Math.abs(diff) < 0.01) {
            dimAmountRef.value = targetDim;
            if (targetDim === 0) visualHighlightRef.value = null;
          } else {
            dimAmountRef.value += diff * 0.25;
          }
          const ctx = canvas.getContext("2d");
          if (ctx) redrawCanvas(ctx, drawStrokes.value, visualHighlightRef.value, dimAmountRef.value);
          if (Math.abs(dimAmountRef.value - targetDim) > 0.01) raf = requestAnimationFrame(animate);
        };
        raf = requestAnimationFrame(animate);
      },
      { deep: true }
    );
    function constrainPosition() {
      if (!toolbarPosition.value) return;
      const padding = 20;
      const wrapperWidth = 297;
      const toolbarHeight = 44;
      const contentWidth = isActive.value ? connectionStatus.value === "connected" ? 297 : 257 : 44;
      const contentOffset = wrapperWidth - contentWidth;
      const minX = padding - contentOffset;
      const maxX = window.innerWidth - padding - wrapperWidth;
      let newX = Math.max(minX, Math.min(maxX, toolbarPosition.value.x));
      let newY = Math.max(padding, Math.min(window.innerHeight - toolbarHeight - padding, toolbarPosition.value.y));
      if (newX !== toolbarPosition.value.x || newY !== toolbarPosition.value.y) {
        toolbarPosition.value = { x: newX, y: newY };
      }
    }
    (0, import_vue94.watch)([toolbarPosition, isActive, connectionStatus], constrainPosition);
    (0, import_vue94.onMounted)(() => {
      loadFromStorage();
      scrollY.value = window.scrollY;
      const stored = loadAnnotations(pathname);
      annotations.value = stored;
      if (loadToolbarHidden()) {
        isToolbarHidden.value = true;
      }
      const portalEl = portalWrapperRef.value;
      if (portalEl) {
        portalEl.addEventListener("mousedown", stopBubble);
        portalEl.addEventListener("click", stopBubble);
        portalEl.addEventListener("pointerdown", stopBubble);
      }
      window.addEventListener("scroll", handleScroll, { passive: true });
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("click", handleClick, true);
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("keydown", handleModifierKeyDown);
      document.addEventListener("keyup", handleModifierKeyUp);
      window.addEventListener("blur", handleWindowBlur);
      document.addEventListener("mousedown", handleDragMouseDown);
      document.addEventListener("mousemove", handleDragMouseMove, { passive: true });
      document.addEventListener("mouseup", handleDragMouseUp);
      window.addEventListener("resize", constrainPosition);
      window.addEventListener("resize", () => resizeCanvas());
      window.addEventListener("scroll", () => {
        const canvas = drawCanvasRef.value;
        if (!canvas || !isActive.value) return;
        const ctx = canvas.getContext("2d");
        if (ctx) redrawCanvas(ctx, drawStrokes.value, visualHighlightRef.value, dimAmountRef.value);
      }, { passive: true });
      const toolbarDragMove = (e) => handleToolbarDragMove(e);
      const toolbarDragEnd = () => handleToolbarDragEnd();
      document.addEventListener("mousemove", toolbarDragMove);
      document.addEventListener("mouseup", toolbarDragEnd);
      initSession();
      const cleanupHealth = startHealthCheck();
      const cleanupEvents = startEventSource();
      (0, import_vue94.watch)(connectionStatus, () => syncOnReconnect());
      if (props.enableDemoMode && props.demoAnnotations && props.demoAnnotations.length > 0 && annotations.value.length === 0) {
        const timeoutIds = [];
        timeoutIds.push(originalSetTimeout(() => {
          isActive.value = true;
        }, props.demoDelay - 200));
        props.demoAnnotations.forEach((demo, index) => {
          const annotationDelay = props.demoDelay + index * 300;
          timeoutIds.push(originalSetTimeout(() => {
            const element = document.querySelector(demo.selector);
            if (!element) return;
            const rect = element.getBoundingClientRect();
            const { name, path } = identifyElement(element);
            const newAnnotation = {
              id: `demo-${Date.now()}-${index}`,
              x: (rect.left + rect.width / 2) / window.innerWidth * 100,
              y: rect.top + rect.height / 2 + window.scrollY,
              comment: demo.comment,
              element: name,
              elementPath: path,
              timestamp: Date.now(),
              selectedText: demo.selectedText,
              boundingBox: { x: rect.left, y: rect.top + window.scrollY, width: rect.width, height: rect.height },
              nearbyText: getNearbyText(element),
              cssClasses: getElementClasses(element)
            };
            annotations.value = [...annotations.value, newAnnotation];
          }, annotationDelay));
        });
      }
    });
    (0, import_vue94.onUnmounted)(() => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keydown", handleModifierKeyDown);
      document.removeEventListener("keyup", handleModifierKeyUp);
      window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("mousedown", handleDragMouseDown);
      document.removeEventListener("mouseup", handleDragMouseUp);
      window.removeEventListener("resize", constrainPosition);
      if (scrollTimeoutId) clearTimeout(scrollTimeoutId);
      if (cleanupDrawListeners) cleanupDrawListeners();
      if (portalWrapperRef.value) {
        portalWrapperRef.value.removeEventListener("mousedown", stopBubble);
        portalWrapperRef.value.removeEventListener("click", stopBubble);
        portalWrapperRef.value.removeEventListener("pointerdown", stopBubble);
      }
      removeCursorStyles();
      unfreeze();
    });
    function getPopupStyle(markerX, markerY) {
      return {
        left: Math.max(160, Math.min(window.innerWidth - 160, markerX / 100 * window.innerWidth)) + "px",
        ...markerY > window.innerHeight - 290 ? { bottom: window.innerHeight - markerY + 20 + "px" } : { top: markerY + 20 + "px" }
      };
    }
    function getActiveButtonStyle(active, color) {
      if (!active) return void 0;
      return { color, backgroundColor: hexToRgba(color, 0.25) };
    }
    const __returned__ = { _window, _document, props, identifyElementWithVue, settings, isDarkMode, showEntranceAnimation, mounted, toolbarPosition, isDraggingToolbar, dragStartPos, dragRotation, isLocalhost, pathname, getEffectiveReactMode, loadFromStorage, saveSettings, saveTheme, saveToolbarPosition, handleToolbarMouseDown, getJustFinishedToolbarDrag, setJustFinishedToolbarDrag, isActive, showMarkers, scrollY, isScrolling, isFrozen, showSettings, showSettingsVisible, settingsPage, isTransitioning, tooltipsHidden, copied, sendState, cleared, isClearing, hoveredMarkerId, hoveredTargetElement, isToolbarHidden, isToolbarHiding, tooltipSessionActive, get tooltipSessionTimerRef() {
      return tooltipSessionTimerRef;
    }, set tooltipSessionTimerRef(v) {
      tooltipSessionTimerRef = v;
    }, portalWrapperRef, stopBubble, hoveredTargetElements, deletingMarkerId, renumberFrom, isDrawMode, drawStrokes, hoveredDrawingIdx, drawCanvasRef, dimAmountRef, visualHighlightRef, exitingStrokeIdRef, exitingAlphaRef, drawStrokesRef, updateDrawStrokesRef, redrawCanvas, resizeCanvas, getIsDrawing, setIsDrawing, getCurrentStroke, setCurrentStroke, pendingAnnotation, pendingExiting, editingAnnotation, editExiting, editingTargetElement, editingTargetElements, cancelPending, startEditing, cancelEditing, closeEditingForDelete, resetAnnotationState, markersVisible, markersExiting, animatedMarkers, exitingMarkers, getShouldShowMarkers, updateVisibility, annotations, get annotationsSnapshot() {
      return annotationsSnapshot;
    }, set annotationsSnapshot(v) {
      annotationsSnapshot = v;
    }, updateAnnotationsSnapshot, get recentlyAddedId() {
      return recentlyAddedId;
    }, set recentlyAddedId(v) {
      recentlyAddedId = v;
    }, hoverInfo, hoverPosition, setHover, clearHover, dragSelect, multiSelect, injectCursorStyles, removeCursorStyles, setDrawingHoverCursor, currentSessionId, connectionStatus, initSession, startHealthCheck, startEventSource, syncOnReconnect, popupRef, editPopupRef, get scrollTimeoutId() {
      return scrollTimeoutId;
    }, set scrollTimeoutId(v) {
      scrollTimeoutId = v;
    }, dragRectRef, highlightsContainerRef, effectiveReactMode, hasAnnotations, shouldShowMarkers, visibleAnnotations, exitingAnnotationsList, fireWebhook, freezeAnimations, unfreezeAnimations, toggleFreeze, hideTooltipsUntilMouseLeave, showTooltipsAgain, hideToolbarTemporarily, handleControlsMouseEnter, handleControlsMouseLeave, isRenderableAnnotation, getSourceFileForElement, persistAnnotations, addAnnotation, cancelAnnotation, deleteAnnotation: deleteAnnotation2, updateAnnotation: updateAnnotation2, startEditAnnotation, cancelEditAnnotation, clearAll, copyOutput, sendToWebhook, handleMarkerHover, createMultiSelectPendingAnnotation, handleKeyDown, get prevDragging() {
      return prevDragging;
    }, set prevDragging(v) {
      prevDragging = v;
    }, handleScroll, handleMouseMove, handleClick, handleModifierKeyDown, handleModifierKeyUp, handleWindowBlur, handleDragMouseDown, handleDragMouseMove, handleDragMouseUp, handleToolbarDragMove, handleToolbarDragEnd, get drawClickStart() {
      return drawClickStart;
    }, set drawClickStart(v) {
      drawClickStart = v;
    }, setupDrawCanvasListeners, get cleanupDrawListeners() {
      return cleanupDrawListeners;
    }, set cleanupDrawListeners(v) {
      cleanupDrawListeners = v;
    }, constrainPosition, getPopupStyle, getActiveButtonStyle, Teleport: import_vue94.Teleport, get parseComputedStylesString() {
      return parseComputedStylesString;
    }, get styles() {
      return page_toolbar_module_default;
    }, AnnotationPopup: AnnotationPopup_default, AnnotationMarker: AnnotationMarker_default, ToolbarSettingsPanel: ToolbarSettingsPanel_default, get IconListSparkle() {
      return IconListSparkle_default;
    }, get IconPausePlayAnimated() {
      return IconPausePlayAnimated_default;
    }, get IconPencil() {
      return IconPencil_default;
    }, get IconEyeAnimated() {
      return IconEyeAnimated_default;
    }, get IconCopyAnimated() {
      return IconCopyAnimated_default;
    }, get IconSendArrow() {
      return IconSendArrow_default;
    }, get IconTrashAlt() {
      return IconTrashAlt_default;
    }, get IconGear() {
      return IconGear_default;
    }, get IconXmarkLarge() {
      return IconXmarkLarge_default;
    }, get IconPlus() {
      return IconPlus_default;
    }, get IconXmark() {
      return IconXmark_default;
    }, get IconClose() {
      return IconClose_default;
    }, get isValidUrl() {
      return isValidUrl;
    } };
    Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
    return __returned__;
  }
});
var _hoisted_139 = {
  ref: "portalWrapperRef",
  style: { "display": "contents" }
};
var _hoisted_24 = ["role", "tabindex", "title"];
var _hoisted_33 = ["data-active"];
var _hoisted_43 = ["data-active"];
var _hoisted_53 = ["disabled"];
var _hoisted_63 = ["disabled", "data-active"];
var _hoisted_73 = ["disabled", "data-no-hover", "tabindex"];
var _hoisted_82 = ["disabled"];
var _hoisted_92 = ["title"];
function render41(_ctx, _cache, $props, $setup, $data, $options) {
  return (0, import_vue95.openBlock)(), (0, import_vue95.createBlock)(import_vue95.Teleport, { to: "body" }, [
    (0, import_vue95.createElementVNode)(
      "div",
      _hoisted_139,
      [
        (0, import_vue95.createCommentVNode)(" Toolbar "),
        !$setup.isToolbarHidden ? ((0, import_vue95.openBlock)(), (0, import_vue95.createElementBlock)(
          import_vue95.Fragment,
          { key: 0 },
          [
            (0, import_vue95.createElementVNode)(
              "div",
              {
                class: (0, import_vue95.normalizeClass)($setup.styles.toolbar),
                "data-feedback-toolbar": "",
                "data-agentation-root": "",
                style: (0, import_vue95.normalizeStyle)($setup.toolbarPosition ? { left: $setup.toolbarPosition.x + "px", top: $setup.toolbarPosition.y + "px", right: "auto", bottom: "auto" } : void 0)
              },
              [
                (0, import_vue95.createElementVNode)("div", {
                  class: (0, import_vue95.normalizeClass)([
                    $setup.styles.toolbarContainer,
                    $props.className,
                    !$setup.isDarkMode ? $setup.styles.light : "",
                    $setup.isActive ? $setup.styles.expanded : $setup.styles.collapsed,
                    $setup.showEntranceAnimation ? $setup.styles.entrance : "",
                    $setup.isDraggingToolbar ? $setup.styles.dragging : "",
                    $setup.isToolbarHiding ? $setup.styles.hiding : "",
                    !$setup.settings.webhooksEnabled && ($setup.isValidUrl($setup.settings.webhookUrl) || $setup.isValidUrl($props.webhookUrl || "")) ? $setup.styles.serverConnected : ""
                  ]),
                  onClick: _cache[11] || (_cache[11] = ($event) => !$setup.isActive ? $setup.getJustFinishedToolbarDrag() ? ($setup.setJustFinishedToolbarDrag(false), $event.preventDefault()) : $setup.isActive = true : void 0),
                  onMousedown: _cache[12] || (_cache[12] = (e) => $setup.handleToolbarMouseDown(e, $setup.isActive, $setup.connectionStatus)),
                  role: !$setup.isActive ? "button" : void 0,
                  tabindex: !$setup.isActive ? 0 : -1,
                  title: !$setup.isActive ? "Start feedback mode" : void 0,
                  style: (0, import_vue95.normalizeStyle)($setup.isDraggingToolbar ? { transform: `scale(1.05) rotate(${$setup.dragRotation}deg)`, cursor: "grabbing" } : void 0)
                }, [
                  (0, import_vue95.createCommentVNode)(" Toggle content (collapsed) "),
                  (0, import_vue95.createElementVNode)(
                    "div",
                    {
                      class: (0, import_vue95.normalizeClass)([$setup.styles.toggleContent, !$setup.isActive ? $setup.styles.visible : $setup.styles.hidden])
                    },
                    [
                      (0, import_vue95.createVNode)($setup["IconListSparkle"], { size: 24 }),
                      $setup.hasAnnotations ? ((0, import_vue95.openBlock)(), (0, import_vue95.createElementBlock)(
                        "span",
                        {
                          key: 0,
                          class: (0, import_vue95.normalizeClass)([$setup.styles.badge, $setup.isActive ? $setup.styles.fadeOut : "", $setup.showEntranceAnimation ? $setup.styles.entrance : ""]),
                          style: (0, import_vue95.normalizeStyle)({ backgroundColor: $setup.settings.annotationColor })
                        },
                        (0, import_vue95.toDisplayString)($setup.annotations.length),
                        7
                        /* TEXT, CLASS, STYLE */
                      )) : (0, import_vue95.createCommentVNode)("v-if", true)
                    ],
                    2
                    /* CLASS */
                  ),
                  (0, import_vue95.createCommentVNode)(" Controls content (expanded) "),
                  (0, import_vue95.createElementVNode)(
                    "div",
                    {
                      class: (0, import_vue95.normalizeClass)([
                        $setup.styles.controlsContent,
                        $setup.isActive ? $setup.styles.visible : $setup.styles.hidden,
                        $setup.toolbarPosition && $setup.toolbarPosition.y < 100 ? $setup.styles.tooltipBelow : "",
                        $setup.tooltipsHidden || $setup.showSettings ? $setup.styles.tooltipsHidden : "",
                        $setup.tooltipSessionActive ? $setup.styles.tooltipsInSession : ""
                      ]),
                      onMouseenter: $setup.handleControlsMouseEnter,
                      onMouseleave: $setup.handleControlsMouseLeave
                    },
                    [
                      (0, import_vue95.createElementVNode)(
                        "div",
                        {
                          class: (0, import_vue95.normalizeClass)([$setup.styles.buttonWrapper, $setup.toolbarPosition && $setup.toolbarPosition.x < 120 ? $setup.styles.buttonWrapperAlignLeft : ""])
                        },
                        [
                          (0, import_vue95.createElementVNode)("button", {
                            class: (0, import_vue95.normalizeClass)([$setup.styles.controlButton, !$setup.isDarkMode ? $setup.styles.light : ""]),
                            "data-active": $setup.isFrozen,
                            onClick: _cache[0] || (_cache[0] = (0, import_vue95.withModifiers)(($event) => {
                              $setup.hideTooltipsUntilMouseLeave();
                              $setup.toggleFreeze();
                            }, ["stop"]))
                          }, [
                            (0, import_vue95.createVNode)($setup["IconPausePlayAnimated"], {
                              size: 24,
                              "is-paused": $setup.isFrozen
                            }, null, 8, ["is-paused"])
                          ], 10, _hoisted_33),
                          (0, import_vue95.createElementVNode)(
                            "span",
                            {
                              class: (0, import_vue95.normalizeClass)($setup.styles.buttonTooltip)
                            },
                            [
                              (0, import_vue95.createTextVNode)(
                                (0, import_vue95.toDisplayString)($setup.isFrozen ? "Resume animations" : "Pause animations") + " ",
                                1
                                /* TEXT */
                              ),
                              (0, import_vue95.createElementVNode)(
                                "span",
                                {
                                  class: (0, import_vue95.normalizeClass)($setup.styles.shortcut)
                                },
                                "P",
                                2
                                /* CLASS */
                              )
                            ],
                            2
                            /* CLASS */
                          )
                        ],
                        2
                        /* CLASS */
                      ),
                      (0, import_vue95.createElementVNode)(
                        "div",
                        {
                          class: (0, import_vue95.normalizeClass)($setup.styles.buttonWrapper)
                        },
                        [
                          (0, import_vue95.createElementVNode)("button", {
                            class: (0, import_vue95.normalizeClass)([$setup.styles.controlButton, !$setup.isDarkMode ? $setup.styles.light : ""]),
                            "data-active": $setup.isDrawMode,
                            onClick: _cache[1] || (_cache[1] = (0, import_vue95.withModifiers)(($event) => {
                              $setup.hideTooltipsUntilMouseLeave();
                              $setup.isDrawMode = !$setup.isDrawMode;
                            }, ["stop"]))
                          }, [
                            (0, import_vue95.createVNode)($setup["IconPencil"], { size: 24 })
                          ], 10, _hoisted_43),
                          (0, import_vue95.createElementVNode)(
                            "span",
                            {
                              class: (0, import_vue95.normalizeClass)($setup.styles.buttonTooltip)
                            },
                            [
                              (0, import_vue95.createTextVNode)(
                                (0, import_vue95.toDisplayString)($setup.isDrawMode ? "Exit draw mode" : "Draw mode") + " ",
                                1
                                /* TEXT */
                              ),
                              (0, import_vue95.createElementVNode)(
                                "span",
                                {
                                  class: (0, import_vue95.normalizeClass)($setup.styles.shortcut)
                                },
                                "D",
                                2
                                /* CLASS */
                              )
                            ],
                            2
                            /* CLASS */
                          )
                        ],
                        2
                        /* CLASS */
                      ),
                      (0, import_vue95.createElementVNode)(
                        "div",
                        {
                          class: (0, import_vue95.normalizeClass)($setup.styles.buttonWrapper)
                        },
                        [
                          (0, import_vue95.createElementVNode)("button", {
                            class: (0, import_vue95.normalizeClass)([$setup.styles.controlButton, !$setup.isDarkMode ? $setup.styles.light : ""]),
                            disabled: !$setup.hasAnnotations,
                            onClick: _cache[2] || (_cache[2] = (0, import_vue95.withModifiers)(($event) => {
                              $setup.hideTooltipsUntilMouseLeave();
                              $setup.showMarkers = !$setup.showMarkers;
                              if ($setup.isDrawMode) $setup.isDrawMode = false;
                            }, ["stop"]))
                          }, [
                            (0, import_vue95.createVNode)($setup["IconEyeAnimated"], {
                              size: 24,
                              "is-open": $setup.showMarkers
                            }, null, 8, ["is-open"])
                          ], 10, _hoisted_53),
                          (0, import_vue95.createElementVNode)(
                            "span",
                            {
                              class: (0, import_vue95.normalizeClass)($setup.styles.buttonTooltip)
                            },
                            [
                              (0, import_vue95.createTextVNode)(
                                (0, import_vue95.toDisplayString)($setup.showMarkers ? "Hide markers" : "Show markers") + " ",
                                1
                                /* TEXT */
                              ),
                              (0, import_vue95.createElementVNode)(
                                "span",
                                {
                                  class: (0, import_vue95.normalizeClass)($setup.styles.shortcut)
                                },
                                "H",
                                2
                                /* CLASS */
                              )
                            ],
                            2
                            /* CLASS */
                          )
                        ],
                        2
                        /* CLASS */
                      ),
                      (0, import_vue95.createElementVNode)(
                        "div",
                        {
                          class: (0, import_vue95.normalizeClass)($setup.styles.buttonWrapper)
                        },
                        [
                          (0, import_vue95.createElementVNode)("button", {
                            class: (0, import_vue95.normalizeClass)([$setup.styles.controlButton, !$setup.isDarkMode ? $setup.styles.light : "", $setup.copied ? $setup.styles.statusShowing : ""]),
                            disabled: !$setup.hasAnnotations && $setup.drawStrokes.length === 0,
                            "data-active": $setup.copied,
                            onClick: _cache[3] || (_cache[3] = (0, import_vue95.withModifiers)(($event) => {
                              $setup.hideTooltipsUntilMouseLeave();
                              $setup.copyOutput();
                            }, ["stop"]))
                          }, [
                            (0, import_vue95.createVNode)($setup["IconCopyAnimated"], {
                              size: 24,
                              copied: $setup.copied
                            }, null, 8, ["copied"])
                          ], 10, _hoisted_63),
                          (0, import_vue95.createElementVNode)(
                            "span",
                            {
                              class: (0, import_vue95.normalizeClass)($setup.styles.buttonTooltip)
                            },
                            [
                              _cache[15] || (_cache[15] = (0, import_vue95.createTextVNode)(
                                " Copy feedback ",
                                -1
                                /* CACHED */
                              )),
                              (0, import_vue95.createElementVNode)(
                                "span",
                                {
                                  class: (0, import_vue95.normalizeClass)($setup.styles.shortcut)
                                },
                                "C",
                                2
                                /* CLASS */
                              )
                            ],
                            2
                            /* CLASS */
                          )
                        ],
                        2
                        /* CLASS */
                      ),
                      (0, import_vue95.createCommentVNode)(" Send button "),
                      (0, import_vue95.createElementVNode)(
                        "div",
                        {
                          class: (0, import_vue95.normalizeClass)([$setup.styles.buttonWrapper, $setup.styles.sendButtonWrapper, $setup.isActive && !$setup.settings.webhooksEnabled && ($setup.isValidUrl($setup.settings.webhookUrl) || $setup.isValidUrl($props.webhookUrl || "")) ? $setup.styles.sendButtonVisible : ""])
                        },
                        [
                          (0, import_vue95.createElementVNode)("button", {
                            class: (0, import_vue95.normalizeClass)([$setup.styles.controlButton, !$setup.isDarkMode ? $setup.styles.light : "", $setup.sendState === "sent" || $setup.sendState === "failed" ? $setup.styles.statusShowing : ""]),
                            disabled: !$setup.hasAnnotations || !$setup.isValidUrl($setup.settings.webhookUrl) && !$setup.isValidUrl($props.webhookUrl || "") || $setup.sendState === "sending",
                            "data-no-hover": $setup.sendState === "sent" || $setup.sendState === "failed",
                            tabindex: $setup.isValidUrl($setup.settings.webhookUrl) || $setup.isValidUrl($props.webhookUrl || "") ? 0 : -1,
                            onClick: _cache[4] || (_cache[4] = (0, import_vue95.withModifiers)(($event) => {
                              $setup.hideTooltipsUntilMouseLeave();
                              $setup.sendToWebhook();
                            }, ["stop"]))
                          }, [
                            (0, import_vue95.createVNode)($setup["IconSendArrow"], {
                              size: 24,
                              state: $setup.sendState
                            }, null, 8, ["state"]),
                            $setup.hasAnnotations && $setup.sendState === "idle" ? ((0, import_vue95.openBlock)(), (0, import_vue95.createElementBlock)(
                              "span",
                              {
                                key: 0,
                                class: (0, import_vue95.normalizeClass)([$setup.styles.buttonBadge, !$setup.isDarkMode ? $setup.styles.light : ""]),
                                style: (0, import_vue95.normalizeStyle)({ backgroundColor: $setup.settings.annotationColor })
                              },
                              (0, import_vue95.toDisplayString)($setup.annotations.length),
                              7
                              /* TEXT, CLASS, STYLE */
                            )) : (0, import_vue95.createCommentVNode)("v-if", true)
                          ], 10, _hoisted_73),
                          (0, import_vue95.createElementVNode)(
                            "span",
                            {
                              class: (0, import_vue95.normalizeClass)($setup.styles.buttonTooltip)
                            },
                            [
                              _cache[16] || (_cache[16] = (0, import_vue95.createTextVNode)(
                                " Send Annotations ",
                                -1
                                /* CACHED */
                              )),
                              (0, import_vue95.createElementVNode)(
                                "span",
                                {
                                  class: (0, import_vue95.normalizeClass)($setup.styles.shortcut)
                                },
                                "S",
                                2
                                /* CLASS */
                              )
                            ],
                            2
                            /* CLASS */
                          )
                        ],
                        2
                        /* CLASS */
                      ),
                      (0, import_vue95.createElementVNode)(
                        "div",
                        {
                          class: (0, import_vue95.normalizeClass)($setup.styles.buttonWrapper)
                        },
                        [
                          (0, import_vue95.createElementVNode)("button", {
                            class: (0, import_vue95.normalizeClass)([$setup.styles.controlButton, !$setup.isDarkMode ? $setup.styles.light : ""]),
                            disabled: !$setup.hasAnnotations && $setup.drawStrokes.length === 0,
                            "data-danger": "",
                            onClick: _cache[5] || (_cache[5] = (0, import_vue95.withModifiers)(($event) => {
                              $setup.hideTooltipsUntilMouseLeave();
                              $setup.clearAll();
                            }, ["stop"]))
                          }, [
                            (0, import_vue95.createVNode)($setup["IconTrashAlt"], { size: 24 })
                          ], 10, _hoisted_82),
                          (0, import_vue95.createElementVNode)(
                            "span",
                            {
                              class: (0, import_vue95.normalizeClass)($setup.styles.buttonTooltip)
                            },
                            [
                              _cache[17] || (_cache[17] = (0, import_vue95.createTextVNode)(
                                " Clear all ",
                                -1
                                /* CACHED */
                              )),
                              (0, import_vue95.createElementVNode)(
                                "span",
                                {
                                  class: (0, import_vue95.normalizeClass)($setup.styles.shortcut)
                                },
                                "X",
                                2
                                /* CLASS */
                              )
                            ],
                            2
                            /* CLASS */
                          )
                        ],
                        2
                        /* CLASS */
                      ),
                      (0, import_vue95.createElementVNode)(
                        "div",
                        {
                          class: (0, import_vue95.normalizeClass)($setup.styles.buttonWrapper)
                        },
                        [
                          (0, import_vue95.createElementVNode)(
                            "button",
                            {
                              class: (0, import_vue95.normalizeClass)([$setup.styles.controlButton, !$setup.isDarkMode ? $setup.styles.light : ""]),
                              onClick: _cache[6] || (_cache[6] = (0, import_vue95.withModifiers)(($event) => {
                                $setup.hideTooltipsUntilMouseLeave();
                                $setup.showSettings = !$setup.showSettings;
                              }, ["stop"]))
                            },
                            [
                              (0, import_vue95.createVNode)($setup["IconGear"], { size: 24 })
                            ],
                            2
                            /* CLASS */
                          ),
                          $props.endpoint && $setup.connectionStatus !== "disconnected" ? ((0, import_vue95.openBlock)(), (0, import_vue95.createElementBlock)("span", {
                            key: 0,
                            class: (0, import_vue95.normalizeClass)([$setup.styles.mcpIndicator, !$setup.isDarkMode ? $setup.styles.light : "", $setup.styles[$setup.connectionStatus], $setup.showSettings ? $setup.styles.hidden : ""]),
                            title: $setup.connectionStatus === "connected" ? "MCP Connected" : "MCP Connecting..."
                          }, null, 10, _hoisted_92)) : (0, import_vue95.createCommentVNode)("v-if", true),
                          (0, import_vue95.createElementVNode)(
                            "span",
                            {
                              class: (0, import_vue95.normalizeClass)($setup.styles.buttonTooltip)
                            },
                            "Settings",
                            2
                            /* CLASS */
                          )
                        ],
                        2
                        /* CLASS */
                      ),
                      (0, import_vue95.createElementVNode)(
                        "div",
                        {
                          class: (0, import_vue95.normalizeClass)([$setup.styles.divider, !$setup.isDarkMode ? $setup.styles.light : ""])
                        },
                        null,
                        2
                        /* CLASS */
                      ),
                      (0, import_vue95.createElementVNode)(
                        "div",
                        {
                          class: (0, import_vue95.normalizeClass)([$setup.styles.buttonWrapper, $setup.toolbarPosition && $setup.toolbarPosition.x > $setup._window.innerWidth - 120 ? $setup.styles.buttonWrapperAlignRight : ""])
                        },
                        [
                          (0, import_vue95.createElementVNode)(
                            "button",
                            {
                              class: (0, import_vue95.normalizeClass)([$setup.styles.controlButton, !$setup.isDarkMode ? $setup.styles.light : ""]),
                              onClick: _cache[7] || (_cache[7] = (0, import_vue95.withModifiers)(($event) => {
                                $setup.hideTooltipsUntilMouseLeave();
                                $setup.isActive = false;
                              }, ["stop"]))
                            },
                            [
                              (0, import_vue95.createVNode)($setup["IconXmarkLarge"], { size: 24 })
                            ],
                            2
                            /* CLASS */
                          ),
                          (0, import_vue95.createElementVNode)(
                            "span",
                            {
                              class: (0, import_vue95.normalizeClass)($setup.styles.buttonTooltip)
                            },
                            [
                              _cache[18] || (_cache[18] = (0, import_vue95.createTextVNode)(
                                " Exit ",
                                -1
                                /* CACHED */
                              )),
                              (0, import_vue95.createElementVNode)(
                                "span",
                                {
                                  class: (0, import_vue95.normalizeClass)($setup.styles.shortcut)
                                },
                                "Esc",
                                2
                                /* CLASS */
                              )
                            ],
                            2
                            /* CLASS */
                          )
                        ],
                        2
                        /* CLASS */
                      )
                    ],
                    34
                    /* CLASS, NEED_HYDRATION */
                  ),
                  (0, import_vue95.createCommentVNode)(" Settings Panel "),
                  (0, import_vue95.createVNode)($setup["ToolbarSettingsPanel"], {
                    settings: $setup.settings,
                    "is-dark-mode": $setup.isDarkMode,
                    "show-settings-visible": $setup.showSettingsVisible,
                    "toolbar-position": $setup.toolbarPosition,
                    "is-localhost": $setup.isLocalhost,
                    endpoint: $props.endpoint,
                    "connection-status": $setup.connectionStatus,
                    "is-transitioning": $setup.isTransitioning,
                    "settings-page": $setup.settingsPage,
                    "onUpdate:isDarkMode": _cache[8] || (_cache[8] = ($event) => $setup.isDarkMode = $event),
                    "onUpdate:settings": _cache[9] || (_cache[9] = ($event) => Object.assign($setup.settings, $event)),
                    "onUpdate:settingsPage": _cache[10] || (_cache[10] = ($event) => $setup.settingsPage = $event),
                    onHideToolbar: $setup.hideToolbarTemporarily
                  }, null, 8, ["settings", "is-dark-mode", "show-settings-visible", "toolbar-position", "is-localhost", "endpoint", "connection-status", "is-transitioning", "settings-page"])
                ], 46, _hoisted_24)
              ],
              6
              /* CLASS, STYLE */
            ),
            (0, import_vue95.createCommentVNode)(" Draw canvas "),
            (0, import_vue95.createElementVNode)(
              "canvas",
              {
                ref: "drawCanvasRef",
                class: (0, import_vue95.normalizeClass)([$setup.styles.drawCanvas, $setup.isDrawMode ? $setup.styles.active : ""]),
                style: (0, import_vue95.normalizeStyle)({ opacity: $setup.shouldShowMarkers ? 1 : 0, transition: "opacity 0.15s ease" }),
                "data-feedback-toolbar": ""
              },
              null,
              6
              /* CLASS, STYLE */
            ),
            (0, import_vue95.createCommentVNode)(" Markers layer (normal scrolling) "),
            (0, import_vue95.createElementVNode)(
              "div",
              {
                class: (0, import_vue95.normalizeClass)($setup.styles.markersLayer),
                "data-feedback-toolbar": ""
              },
              [
                $setup.markersVisible ? ((0, import_vue95.openBlock)(), (0, import_vue95.createElementBlock)(
                  import_vue95.Fragment,
                  { key: 0 },
                  [
                    ((0, import_vue95.openBlock)(true), (0, import_vue95.createElementBlock)(
                      import_vue95.Fragment,
                      null,
                      (0, import_vue95.renderList)($setup.visibleAnnotations.filter((a) => !a.isFixed), (annotation, index) => {
                        return (0, import_vue95.openBlock)(), (0, import_vue95.createBlock)($setup["AnnotationMarker"], {
                          key: annotation.id,
                          annotation,
                          "global-index": $setup.annotations.findIndex((a) => a.id === annotation.id),
                          index,
                          "total-visible": $setup.visibleAnnotations.filter((a) => !a.isFixed).length,
                          "is-hovered": !$setup.markersExiting && $setup.hoveredMarkerId === annotation.id,
                          "is-deleting": $setup.deletingMarkerId === annotation.id,
                          "is-editing": !!$setup.editingAnnotation,
                          "marker-color": annotation.isMultiSelect ? "#34C759" : $setup.settings.annotationColor,
                          "marker-click-behavior": $setup.settings.markerClickBehavior,
                          "markers-exiting": $setup.markersExiting,
                          "is-clearing": $setup.isClearing,
                          "needs-enter-animation": !$setup.animatedMarkers.has(annotation.id),
                          "is-fixed": false,
                          "renumber-from": $setup.renumberFrom,
                          "is-dark-mode": $setup.isDarkMode,
                          onMouseenter: ($event) => !$setup.markersExiting && annotation.id !== $setup.recentlyAddedId && $setup.handleMarkerHover(annotation),
                          onMouseleave: _cache[13] || (_cache[13] = ($event) => $setup.handleMarkerHover(null)),
                          onClick: ($event) => !$setup.markersExiting && ($setup.settings.markerClickBehavior === "delete" ? $setup.deleteAnnotation(annotation.id) : $setup.startEditAnnotation(annotation)),
                          onContextmenu: (e) => {
                            if ($setup.settings.markerClickBehavior === "delete") {
                              e.preventDefault();
                              e.stopPropagation();
                              if (!$setup.markersExiting) $setup.startEditAnnotation(annotation);
                            }
                          }
                        }, null, 8, ["annotation", "global-index", "index", "total-visible", "is-hovered", "is-deleting", "is-editing", "marker-color", "marker-click-behavior", "markers-exiting", "is-clearing", "needs-enter-animation", "renumber-from", "is-dark-mode", "onMouseenter", "onClick", "onContextmenu"]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    )),
                    (0, import_vue95.createCommentVNode)(" Exiting markers (normal) "),
                    !$setup.markersExiting ? ((0, import_vue95.openBlock)(true), (0, import_vue95.createElementBlock)(
                      import_vue95.Fragment,
                      { key: 0 },
                      (0, import_vue95.renderList)($setup.exitingAnnotationsList.filter((a) => !a.isFixed), (annotation) => {
                        return (0, import_vue95.openBlock)(), (0, import_vue95.createElementBlock)(
                          "div",
                          {
                            key: "exit-" + annotation.id,
                            class: (0, import_vue95.normalizeClass)([$setup.styles.marker, $setup.styles.hovered, annotation.isMultiSelect ? $setup.styles.multiSelect : "", $setup.styles.exit]),
                            "data-annotation-marker": "",
                            style: (0, import_vue95.normalizeStyle)({ left: `${annotation.x}%`, top: annotation.y + "px" })
                          },
                          [
                            (0, import_vue95.createVNode)($setup["IconXmark"], {
                              size: annotation.isMultiSelect ? 12 : 10
                            }, null, 8, ["size"])
                          ],
                          6
                          /* CLASS, STYLE */
                        );
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    )) : (0, import_vue95.createCommentVNode)("v-if", true)
                  ],
                  64
                  /* STABLE_FRAGMENT */
                )) : (0, import_vue95.createCommentVNode)("v-if", true)
              ],
              2
              /* CLASS */
            ),
            (0, import_vue95.createCommentVNode)(" Fixed markers layer "),
            (0, import_vue95.createElementVNode)(
              "div",
              {
                class: (0, import_vue95.normalizeClass)($setup.styles.fixedMarkersLayer),
                "data-feedback-toolbar": ""
              },
              [
                $setup.markersVisible ? ((0, import_vue95.openBlock)(), (0, import_vue95.createElementBlock)(
                  import_vue95.Fragment,
                  { key: 0 },
                  [
                    ((0, import_vue95.openBlock)(true), (0, import_vue95.createElementBlock)(
                      import_vue95.Fragment,
                      null,
                      (0, import_vue95.renderList)($setup.visibleAnnotations.filter((a) => a.isFixed), (annotation, index) => {
                        return (0, import_vue95.openBlock)(), (0, import_vue95.createBlock)($setup["AnnotationMarker"], {
                          key: annotation.id,
                          annotation,
                          "global-index": $setup.annotations.findIndex((a) => a.id === annotation.id),
                          index,
                          "total-visible": $setup.visibleAnnotations.filter((a) => a.isFixed).length,
                          "is-hovered": !$setup.markersExiting && $setup.hoveredMarkerId === annotation.id,
                          "is-deleting": $setup.deletingMarkerId === annotation.id,
                          "is-editing": !!$setup.editingAnnotation,
                          "marker-color": annotation.isMultiSelect ? "#34C759" : $setup.settings.annotationColor,
                          "marker-click-behavior": $setup.settings.markerClickBehavior,
                          "markers-exiting": $setup.markersExiting,
                          "is-clearing": $setup.isClearing,
                          "needs-enter-animation": !$setup.animatedMarkers.has(annotation.id),
                          "is-fixed": true,
                          "renumber-from": $setup.renumberFrom,
                          "is-dark-mode": $setup.isDarkMode,
                          onMouseenter: ($event) => !$setup.markersExiting && annotation.id !== $setup.recentlyAddedId && $setup.handleMarkerHover(annotation),
                          onMouseleave: _cache[14] || (_cache[14] = ($event) => $setup.handleMarkerHover(null)),
                          onClick: ($event) => !$setup.markersExiting && ($setup.settings.markerClickBehavior === "delete" ? $setup.deleteAnnotation(annotation.id) : $setup.startEditAnnotation(annotation)),
                          onContextmenu: (e) => {
                            if ($setup.settings.markerClickBehavior === "delete") {
                              e.preventDefault();
                              e.stopPropagation();
                              if (!$setup.markersExiting) $setup.startEditAnnotation(annotation);
                            }
                          }
                        }, null, 8, ["annotation", "global-index", "index", "total-visible", "is-hovered", "is-deleting", "is-editing", "marker-color", "marker-click-behavior", "markers-exiting", "is-clearing", "needs-enter-animation", "renumber-from", "is-dark-mode", "onMouseenter", "onClick", "onContextmenu"]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    )),
                    (0, import_vue95.createCommentVNode)(" Exiting markers (fixed) "),
                    !$setup.markersExiting ? ((0, import_vue95.openBlock)(true), (0, import_vue95.createElementBlock)(
                      import_vue95.Fragment,
                      { key: 0 },
                      (0, import_vue95.renderList)($setup.exitingAnnotationsList.filter((a) => a.isFixed), (annotation) => {
                        return (0, import_vue95.openBlock)(), (0, import_vue95.createElementBlock)(
                          "div",
                          {
                            key: "exit-fixed-" + annotation.id,
                            class: (0, import_vue95.normalizeClass)([$setup.styles.marker, $setup.styles.fixed, $setup.styles.hovered, annotation.isMultiSelect ? $setup.styles.multiSelect : "", $setup.styles.exit]),
                            "data-annotation-marker": "",
                            style: (0, import_vue95.normalizeStyle)({ left: `${annotation.x}%`, top: annotation.y + "px" })
                          },
                          [
                            (0, import_vue95.createVNode)($setup["IconClose"], {
                              size: annotation.isMultiSelect ? 12 : 10
                            }, null, 8, ["size"])
                          ],
                          6
                          /* CLASS, STYLE */
                        );
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    )) : (0, import_vue95.createCommentVNode)("v-if", true)
                  ],
                  64
                  /* STABLE_FRAGMENT */
                )) : (0, import_vue95.createCommentVNode)("v-if", true)
              ],
              2
              /* CLASS */
            ),
            (0, import_vue95.createCommentVNode)(" Interactive overlay "),
            $setup.isActive ? ((0, import_vue95.openBlock)(), (0, import_vue95.createElementBlock)(
              "div",
              {
                key: 0,
                class: (0, import_vue95.normalizeClass)($setup.styles.overlay),
                "data-feedback-toolbar": "",
                style: (0, import_vue95.normalizeStyle)($setup.pendingAnnotation || $setup.editingAnnotation ? { zIndex: 99999 } : void 0)
              },
              [
                (0, import_vue95.createCommentVNode)(" Hover highlight "),
                $setup.hoverInfo?.rect && !$setup.pendingAnnotation && !$setup.isScrolling && !$setup.dragSelect.isDragging.value && !$setup.isDrawMode ? ((0, import_vue95.openBlock)(), (0, import_vue95.createElementBlock)(
                  "div",
                  {
                    key: 0,
                    class: (0, import_vue95.normalizeClass)([$setup.styles.hoverHighlight, $setup.styles.enter]),
                    style: (0, import_vue95.normalizeStyle)({
                      left: $setup.hoverInfo.rect.left + "px",
                      top: $setup.hoverInfo.rect.top + "px",
                      width: $setup.hoverInfo.rect.width + "px",
                      height: $setup.hoverInfo.rect.height + "px",
                      borderColor: `${$setup.settings.annotationColor}80`,
                      backgroundColor: `${$setup.settings.annotationColor}0A`
                    })
                  },
                  null,
                  6
                  /* CLASS, STYLE */
                )) : (0, import_vue95.createCommentVNode)("v-if", true),
                (0, import_vue95.createCommentVNode)(" Cmd+shift+click multi-select highlights "),
                ((0, import_vue95.openBlock)(true), (0, import_vue95.createElementBlock)(
                  import_vue95.Fragment,
                  null,
                  (0, import_vue95.renderList)($setup.multiSelect.pendingMultiSelectElements.value.filter((i) => $setup._document.contains(i.element)), (item, index) => {
                    return (0, import_vue95.openBlock)(), (0, import_vue95.createElementBlock)(
                      "div",
                      {
                        key: "ms-" + index,
                        class: (0, import_vue95.normalizeClass)($setup.multiSelect.pendingMultiSelectElements.value.length > 1 ? $setup.styles.multiSelectOutline : $setup.styles.singleSelectOutline),
                        style: (0, import_vue95.normalizeStyle)({
                          position: "fixed",
                          left: item.element.getBoundingClientRect().left + "px",
                          top: item.element.getBoundingClientRect().top + "px",
                          width: item.element.getBoundingClientRect().width + "px",
                          height: item.element.getBoundingClientRect().height + "px",
                          ...$setup.multiSelect.pendingMultiSelectElements.value.length > 1 ? {} : { borderColor: `${$setup.settings.annotationColor}99`, backgroundColor: `${$setup.settings.annotationColor}0D` }
                        })
                      },
                      null,
                      6
                      /* CLASS, STYLE */
                    );
                  }),
                  128
                  /* KEYED_FRAGMENT */
                )),
                (0, import_vue95.createCommentVNode)(" Hover tooltip "),
                $setup.hoverInfo && !$setup.pendingAnnotation && !$setup.isScrolling && !$setup.dragSelect.isDragging.value && !$setup.isDrawMode ? ((0, import_vue95.openBlock)(), (0, import_vue95.createElementBlock)(
                  "div",
                  {
                    key: 1,
                    class: (0, import_vue95.normalizeClass)([$setup.styles.hoverTooltip, $setup.styles.enter]),
                    style: (0, import_vue95.normalizeStyle)({
                      left: Math.max(8, Math.min($setup.hoverPosition.x, $setup._window.innerWidth - 100)) + "px",
                      top: Math.max($setup.hoverPosition.y - ($setup.hoverInfo.reactComponents ? 48 : 32), 8) + "px"
                    })
                  },
                  [
                    $setup.hoverInfo.reactComponents ? ((0, import_vue95.openBlock)(), (0, import_vue95.createElementBlock)(
                      "div",
                      {
                        key: 0,
                        class: (0, import_vue95.normalizeClass)($setup.styles.hoverReactPath)
                      },
                      (0, import_vue95.toDisplayString)($setup.hoverInfo.reactComponents),
                      3
                      /* TEXT, CLASS */
                    )) : (0, import_vue95.createCommentVNode)("v-if", true),
                    (0, import_vue95.createElementVNode)(
                      "div",
                      {
                        class: (0, import_vue95.normalizeClass)($setup.styles.hoverElementName)
                      },
                      (0, import_vue95.toDisplayString)($setup.hoverInfo.elementName),
                      3
                      /* TEXT, CLASS */
                    )
                  ],
                  6
                  /* CLASS, STYLE */
                )) : (0, import_vue95.createCommentVNode)("v-if", true),
                (0, import_vue95.createCommentVNode)(" Pending annotation marker + popup "),
                $setup.pendingAnnotation ? ((0, import_vue95.openBlock)(), (0, import_vue95.createElementBlock)(
                  import_vue95.Fragment,
                  { key: 2 },
                  [
                    (0, import_vue95.createCommentVNode)(" Pending outline "),
                    $setup.pendingAnnotation.drawingIndex == null ? ((0, import_vue95.openBlock)(), (0, import_vue95.createElementBlock)(
                      import_vue95.Fragment,
                      { key: 0 },
                      [
                        $setup.pendingAnnotation.targetElement && $setup._document.contains($setup.pendingAnnotation.targetElement) ? ((0, import_vue95.openBlock)(), (0, import_vue95.createElementBlock)(
                          "div",
                          {
                            key: 0,
                            class: (0, import_vue95.normalizeClass)([$setup.styles.singleSelectOutline, $setup.pendingExiting ? $setup.styles.exit : $setup.styles.enter]),
                            style: (0, import_vue95.normalizeStyle)({
                              left: $setup.pendingAnnotation.targetElement.getBoundingClientRect().left + "px",
                              top: $setup.pendingAnnotation.targetElement.getBoundingClientRect().top + "px",
                              width: $setup.pendingAnnotation.targetElement.getBoundingClientRect().width + "px",
                              height: $setup.pendingAnnotation.targetElement.getBoundingClientRect().height + "px",
                              borderColor: `${$setup.settings.annotationColor}99`,
                              backgroundColor: `${$setup.settings.annotationColor}0D`
                            })
                          },
                          null,
                          6
                          /* CLASS, STYLE */
                        )) : $setup.pendingAnnotation.boundingBox ? ((0, import_vue95.openBlock)(), (0, import_vue95.createElementBlock)(
                          "div",
                          {
                            key: 1,
                            class: (0, import_vue95.normalizeClass)([$setup.pendingAnnotation.isMultiSelect ? $setup.styles.multiSelectOutline : $setup.styles.singleSelectOutline, $setup.pendingExiting ? $setup.styles.exit : $setup.styles.enter]),
                            style: (0, import_vue95.normalizeStyle)({
                              left: $setup.pendingAnnotation.boundingBox.x + "px",
                              top: $setup.pendingAnnotation.boundingBox.y - $setup.scrollY + "px",
                              width: $setup.pendingAnnotation.boundingBox.width + "px",
                              height: $setup.pendingAnnotation.boundingBox.height + "px",
                              ...$setup.pendingAnnotation.isMultiSelect ? {} : { borderColor: `${$setup.settings.annotationColor}99`, backgroundColor: `${$setup.settings.annotationColor}0D` }
                            })
                          },
                          null,
                          6
                          /* CLASS, STYLE */
                        )) : (0, import_vue95.createCommentVNode)("v-if", true)
                      ],
                      64
                      /* STABLE_FRAGMENT */
                    )) : (0, import_vue95.createCommentVNode)("v-if", true),
                    (0, import_vue95.createCommentVNode)(" Pending marker "),
                    (0, import_vue95.createElementVNode)(
                      "div",
                      {
                        class: (0, import_vue95.normalizeClass)([$setup.styles.marker, $setup.styles.pending, $setup.pendingAnnotation.isMultiSelect ? $setup.styles.multiSelect : "", $setup.pendingExiting ? $setup.styles.exit : $setup.styles.enter]),
                        style: (0, import_vue95.normalizeStyle)({
                          left: `${$setup.pendingAnnotation.x}%`,
                          top: ($setup.pendingAnnotation.isFixed ? $setup.pendingAnnotation.y : $setup.pendingAnnotation.y - $setup.scrollY) + "px",
                          backgroundColor: $setup.pendingAnnotation.isMultiSelect ? "#34C759" : $setup.settings.annotationColor
                        })
                      },
                      [
                        (0, import_vue95.createVNode)($setup["IconPlus"], { size: 12 })
                      ],
                      6
                      /* CLASS, STYLE */
                    ),
                    (0, import_vue95.createCommentVNode)(" Pending popup "),
                    (0, import_vue95.createVNode)($setup["AnnotationPopup"], {
                      ref: "popupRef",
                      element: $setup.pendingAnnotation.element,
                      "selected-text": $setup.pendingAnnotation.selectedText,
                      "computed-styles": $setup.pendingAnnotation.computedStylesObj,
                      placeholder: $setup.pendingAnnotation.element === "Area selection" ? "What should change in this area?" : $setup.pendingAnnotation.isMultiSelect ? "Feedback for this group of elements..." : "What should change?",
                      "on-submit": $setup.addAnnotation,
                      "on-cancel": $setup.cancelAnnotation,
                      "is-exiting": $setup.pendingExiting,
                      "light-mode": !$setup.isDarkMode,
                      "accent-color": $setup.pendingAnnotation.isMultiSelect ? "#34C759" : $setup.settings.annotationColor,
                      "popup-style": $setup.getPopupStyle($setup.pendingAnnotation.x, $setup.pendingAnnotation.isFixed ? $setup.pendingAnnotation.y : $setup.pendingAnnotation.y - $setup.scrollY)
                    }, null, 8, ["element", "selected-text", "computed-styles", "placeholder", "is-exiting", "light-mode", "accent-color", "popup-style"])
                  ],
                  64
                  /* STABLE_FRAGMENT */
                )) : (0, import_vue95.createCommentVNode)("v-if", true),
                (0, import_vue95.createCommentVNode)(" Edit annotation popup "),
                $setup.editingAnnotation ? ((0, import_vue95.openBlock)(), (0, import_vue95.createElementBlock)(
                  import_vue95.Fragment,
                  { key: 3 },
                  [
                    (0, import_vue95.createCommentVNode)(" Edit outline "),
                    $setup.editingAnnotation.drawingIndex == null ? ((0, import_vue95.openBlock)(), (0, import_vue95.createElementBlock)(
                      import_vue95.Fragment,
                      { key: 0 },
                      [
                        $setup.editingTargetElement && $setup._document.contains($setup.editingTargetElement) ? ((0, import_vue95.openBlock)(), (0, import_vue95.createElementBlock)(
                          "div",
                          {
                            key: 0,
                            class: (0, import_vue95.normalizeClass)([$setup.editingAnnotation.isMultiSelect ? $setup.styles.multiSelectOutline : $setup.styles.singleSelectOutline, $setup.styles.enter]),
                            style: (0, import_vue95.normalizeStyle)({
                              left: $setup.editingTargetElement.getBoundingClientRect().left + "px",
                              top: $setup.editingTargetElement.getBoundingClientRect().top + "px",
                              width: $setup.editingTargetElement.getBoundingClientRect().width + "px",
                              height: $setup.editingTargetElement.getBoundingClientRect().height + "px",
                              ...$setup.editingAnnotation.isMultiSelect ? {} : { borderColor: `${$setup.settings.annotationColor}99`, backgroundColor: `${$setup.settings.annotationColor}0D` }
                            })
                          },
                          null,
                          6
                          /* CLASS, STYLE */
                        )) : $setup.editingAnnotation.boundingBox ? ((0, import_vue95.openBlock)(), (0, import_vue95.createElementBlock)(
                          "div",
                          {
                            key: 1,
                            class: (0, import_vue95.normalizeClass)([$setup.editingAnnotation.isMultiSelect ? $setup.styles.multiSelectOutline : $setup.styles.singleSelectOutline, $setup.styles.enter]),
                            style: (0, import_vue95.normalizeStyle)({
                              left: $setup.editingAnnotation.boundingBox.x + "px",
                              top: ($setup.editingAnnotation.isFixed ? $setup.editingAnnotation.boundingBox.y : $setup.editingAnnotation.boundingBox.y - $setup.scrollY) + "px",
                              width: $setup.editingAnnotation.boundingBox.width + "px",
                              height: $setup.editingAnnotation.boundingBox.height + "px",
                              ...$setup.editingAnnotation.isMultiSelect ? {} : { borderColor: `${$setup.settings.annotationColor}99`, backgroundColor: `${$setup.settings.annotationColor}0D` }
                            })
                          },
                          null,
                          6
                          /* CLASS, STYLE */
                        )) : (0, import_vue95.createCommentVNode)("v-if", true)
                      ],
                      64
                      /* STABLE_FRAGMENT */
                    )) : (0, import_vue95.createCommentVNode)("v-if", true),
                    (0, import_vue95.createVNode)($setup["AnnotationPopup"], {
                      ref: "editPopupRef",
                      element: $setup.editingAnnotation.element,
                      "selected-text": $setup.editingAnnotation.selectedText,
                      "computed-styles": $setup.parseComputedStylesString($setup.editingAnnotation.computedStyles),
                      placeholder: "Edit your feedback...",
                      "initial-value": $setup.editingAnnotation.comment,
                      "submit-label": "Save",
                      "on-submit": $setup.updateAnnotation,
                      "on-cancel": $setup.cancelEditAnnotation,
                      "on-delete": () => $setup.deleteAnnotation($setup.editingAnnotation.id),
                      "is-exiting": $setup.editExiting,
                      "light-mode": !$setup.isDarkMode,
                      "accent-color": $setup.editingAnnotation.isMultiSelect ? "#34C759" : $setup.settings.annotationColor,
                      "popup-style": $setup.getPopupStyle($setup.editingAnnotation.x, $setup.editingAnnotation.isFixed ? $setup.editingAnnotation.y : $setup.editingAnnotation.y - $setup.scrollY)
                    }, null, 8, ["element", "selected-text", "computed-styles", "initial-value", "on-delete", "is-exiting", "light-mode", "accent-color", "popup-style"])
                  ],
                  64
                  /* STABLE_FRAGMENT */
                )) : (0, import_vue95.createCommentVNode)("v-if", true),
                (0, import_vue95.createCommentVNode)(" Drag selection "),
                $setup.dragSelect.isDragging.value ? ((0, import_vue95.openBlock)(), (0, import_vue95.createElementBlock)(
                  import_vue95.Fragment,
                  { key: 4 },
                  [
                    (0, import_vue95.createElementVNode)(
                      "div",
                      {
                        ref: (el) => $setup.dragSelect.setDragRectEl(el),
                        class: (0, import_vue95.normalizeClass)($setup.styles.dragSelection)
                      },
                      null,
                      2
                      /* CLASS */
                    ),
                    (0, import_vue95.createElementVNode)(
                      "div",
                      {
                        ref: (el) => $setup.dragSelect.setHighlightsContainerEl(el),
                        class: (0, import_vue95.normalizeClass)($setup.styles.highlightsContainer)
                      },
                      null,
                      2
                      /* CLASS */
                    )
                  ],
                  64
                  /* STABLE_FRAGMENT */
                )) : (0, import_vue95.createCommentVNode)("v-if", true)
              ],
              6
              /* CLASS, STYLE */
            )) : (0, import_vue95.createCommentVNode)("v-if", true)
          ],
          64
          /* STABLE_FRAGMENT */
        )) : (0, import_vue95.createCommentVNode)("v-if", true)
      ],
      512
      /* NEED_PATCH */
    )
  ]);
}
_sfc_main41.render = render41;
var AgentationToolbar_default = _sfc_main41;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Agentation,
  AgentationToolbar,
  AnimatedBunny,
  AnnotationPopup,
  IconChatEllipsis,
  IconCheck,
  IconCheckSmall,
  IconCheckSmallAnimated,
  IconCheckmark,
  IconCheckmarkCircle,
  IconCheckmarkLarge,
  IconChevronLeft,
  IconChevronRight,
  IconClose,
  IconCopyAlt,
  IconCopyAnimated,
  IconEdit,
  IconEye,
  IconEyeAlt,
  IconEyeAnimated,
  IconEyeClosed,
  IconEyeMinus,
  IconGear,
  IconHelp,
  IconListSparkle,
  IconMoon,
  IconPause,
  IconPauseAlt,
  IconPausePlayAnimated,
  IconPencil,
  IconPlayAlt,
  IconPlus,
  IconSendAnimated,
  IconSendArrow,
  IconSun,
  IconTrash,
  IconTrashAlt,
  IconXmark,
  IconXmarkLarge,
  closestCrossingShadow,
  getElementClasses,
  getElementPath,
  getNearbyText,
  getShadowHost,
  getStorageKey,
  identifyAnimationElement,
  identifyElement,
  isInShadowDOM,
  loadAnnotations,
  saveAnnotations
});
//# sourceMappingURL=vue.js.map