import { DefineComponent } from 'vue';

/**
 * Finds the closest ancestor matching a selector, crossing shadow DOM boundaries.
 */
declare function closestCrossingShadow(element: Element, selector: string): Element | null;
/**
 * Checks if an element is inside a shadow DOM
 */
declare function isInShadowDOM(element: Element): boolean;
/**
 * Gets the shadow host for an element, or null if not in shadow DOM
 */
declare function getShadowHost(element: Element): Element | null;
/**
 * Gets a readable path for an element (e.g., "article > section > p")
 * Supports elements inside shadow DOM by crossing shadow boundaries.
 */
declare function getElementPath(target: HTMLElement, maxDepth?: number): string;
/**
 * Identifies an element and returns a human-readable name + path
 */
declare function identifyElement(target: HTMLElement): {
    name: string;
    path: string;
};
/**
 * Gets text content from element and siblings for context
 */
declare function getNearbyText(element: HTMLElement): string;
/**
 * Simplified element identifier for animation feedback (less verbose)
 */
declare function identifyAnimationElement(target: HTMLElement): string;
/**
 * Gets CSS class names from an element (cleaned of module hashes)
 */
declare function getElementClasses(target: HTMLElement): string;

type Annotation = {
    id: string;
    x: number;
    y: number;
    comment: string;
    element: string;
    elementPath: string;
    timestamp: number;
    selectedText?: string;
    boundingBox?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    nearbyText?: string;
    cssClasses?: string;
    nearbyElements?: string;
    computedStyles?: string;
    fullPath?: string;
    accessibility?: string;
    isMultiSelect?: boolean;
    isFixed?: boolean;
    reactComponents?: string;
    sourceFile?: string;
    elementBoundingBoxes?: Array<{
        x: number;
        y: number;
        width: number;
        height: number;
    }>;
    drawingIndex?: number;
    strokeId?: string;
    sessionId?: string;
    url?: string;
    intent?: AnnotationIntent;
    severity?: AnnotationSeverity;
    status?: AnnotationStatus;
    thread?: ThreadMessage[];
    createdAt?: string;
    updatedAt?: string;
    resolvedAt?: string;
    resolvedBy?: "human" | "agent";
    authorId?: string;
    _syncedTo?: string;
};
type AnnotationIntent = "fix" | "change" | "question" | "approve";
type AnnotationSeverity = "blocking" | "important" | "suggestion";
type AnnotationStatus = "pending" | "acknowledged" | "resolved" | "dismissed";
type ThreadMessage = {
    id: string;
    role: "human" | "agent";
    content: string;
    timestamp: number;
};

declare function getStorageKey(pathname: string): string;
declare function loadAnnotations<T = Annotation>(pathname: string): T[];
declare function saveAnnotations<T = Annotation>(pathname: string, annotations: T[]): void;

declare const Agentation: DefineComponent;
declare const AgentationToolbar: DefineComponent;
declare const AnnotationPopup: DefineComponent;
type IconComponent = DefineComponent<{
    size?: number;
}>;
declare const IconClose: IconComponent;
declare const IconPlus: IconComponent;
declare const IconCheck: IconComponent;
declare const IconCheckSmall: IconComponent;
declare const IconListSparkle: IconComponent;
declare const IconHelp: IconComponent;
declare const IconCheckSmallAnimated: IconComponent;
declare const IconCopyAlt: IconComponent;
declare const IconCopyAnimated: IconComponent;
declare const IconSendArrow: IconComponent;
declare const IconSendAnimated: IconComponent;
declare const IconEye: IconComponent;
declare const IconEyeAlt: IconComponent;
declare const IconEyeClosed: IconComponent;
declare const IconEyeAnimated: IconComponent;
declare const IconPausePlayAnimated: IconComponent;
declare const IconEyeMinus: IconComponent;
declare const IconGear: IconComponent;
declare const IconPauseAlt: IconComponent;
declare const IconPause: IconComponent;
declare const IconPlayAlt: IconComponent;
declare const IconTrashAlt: IconComponent;
declare const IconChatEllipsis: IconComponent;
declare const IconCheckmark: IconComponent;
declare const IconCheckmarkLarge: IconComponent;
declare const IconCheckmarkCircle: IconComponent;
declare const IconXmark: IconComponent;
declare const IconXmarkLarge: IconComponent;
declare const IconSun: IconComponent;
declare const IconMoon: IconComponent;
declare const IconEdit: IconComponent;
declare const IconTrash: IconComponent;
declare const IconChevronLeft: IconComponent;
declare const IconChevronRight: IconComponent;
declare const IconPencil: IconComponent;
declare const AnimatedBunny: IconComponent;

export { Agentation, AgentationToolbar, AnimatedBunny, type Annotation, AnnotationPopup, IconChatEllipsis, IconCheck, IconCheckSmall, IconCheckSmallAnimated, IconCheckmark, IconCheckmarkCircle, IconCheckmarkLarge, IconChevronLeft, IconChevronRight, IconClose, IconCopyAlt, IconCopyAnimated, IconEdit, IconEye, IconEyeAlt, IconEyeAnimated, IconEyeClosed, IconEyeMinus, IconGear, IconHelp, IconListSparkle, IconMoon, IconPause, IconPauseAlt, IconPausePlayAnimated, IconPencil, IconPlayAlt, IconPlus, IconSendAnimated, IconSendArrow, IconSun, IconTrash, IconTrashAlt, IconXmark, IconXmarkLarge, closestCrossingShadow, getElementClasses, getElementPath, getNearbyText, getShadowHost, getStorageKey, identifyAnimationElement, identifyElement, isInShadowDOM, loadAnnotations, saveAnnotations };
