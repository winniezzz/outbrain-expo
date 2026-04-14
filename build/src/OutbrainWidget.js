"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutbrainWidget = void 0;
exports.useSmartFeedScroll = useSmartFeedScroll;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_native_1 = require("react-native");
// ─── Import from native package ─────────────────────────────────────────────
// outbrain-react-native v1.0.1 exports OutbrainWidget as a Fabric component
const outbrain_react_native_1 = require("outbrain-react-native");
// ─── Component ──────────────────────────────────────────────────────────────
exports.OutbrainWidget = (0, react_1.forwardRef)((props, ref) => {
    const nativeRef = (0, react_1.useRef)(null);
    // ── Resolve legacy aliases ────────────────────────────────────────────
    const articleUrl = props.articleUrl || props.url || '';
    const partnerKey = props.partnerKey || props.installationKey || '';
    const widgetIndex = props.widgetIndex ?? 0;
    // ── Merge handler with legacy onOrganicClick prop ─────────────────────
    const handler = (0, react_1.useMemo)(() => {
        const h = { ...props.handler };
        // Legacy prop takes precedence if handler.onOrganicClick not set
        if (props.onOrganicClick && !h.onOrganicClick) {
            h.onOrganicClick = props.onOrganicClick;
        }
        return h;
    }, [props.handler, props.onOrganicClick]);
    // ── Imperative methods ────────────────────────────────────────────────
    const loadMore = (0, react_1.useCallback)(() => {
        if (nativeRef.current?.loadMore) {
            nativeRef.current.loadMore();
        }
    }, []);
    (0, react_1.useImperativeHandle)(ref, () => ({
        loadMore,
    }), [loadMore]);
    // ── Render ────────────────────────────────────────────────────────────
    return ((0, jsx_runtime_1.jsx)(react_native_1.View, { style: props.style, children: (0, jsx_runtime_1.jsx)(outbrain_react_native_1.OutbrainWidget, { ref: nativeRef, widgetId: props.widgetId, widgetIndex: widgetIndex, articleUrl: articleUrl, partnerKey: partnerKey, handler: handler, ...(props.extId != null && { extId: props.extId }), ...(props.extSecondaryId != null && {
                extSecondaryId: props.extSecondaryId,
            }), ...(props.pubImpId != null && { pubImpId: props.pubImpId }), ...(props.userId != null && { userId: props.userId }), ...(props.consentV2 != null && { consentV2: props.consentV2 }), ...(props.ccpaString != null && { ccpaString: props.ccpaString }), ...(props.darkMode != null && { darkMode: props.darkMode }) }) }));
});
exports.OutbrainWidget.displayName = 'OutbrainWidget';
/**
 * Hook that returns an `onMomentumScrollEnd` handler for ScrollView / FlatList.
 * Automatically calls `loadMore()` when the user scrolls near the bottom.
 *
 * @example
 * ```tsx
 * const widgetRef = useRef<OutbrainWidgetRef>(null);
 * const onScrollEnd = useSmartFeedScroll({ widgetRef });
 *
 * <ScrollView onMomentumScrollEnd={onScrollEnd}>
 *   <OutbrainWidget ref={widgetRef} ... />
 * </ScrollView>
 * ```
 */
function useSmartFeedScroll({ widgetRef, threshold = 50, enabled = true, }) {
    return (0, react_1.useCallback)(({ nativeEvent }) => {
        if (!enabled)
            return;
        const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
        const isCloseToBottom = layoutMeasurement.height + contentOffset.y >=
            contentSize.height - threshold;
        if (isCloseToBottom && widgetRef.current) {
            widgetRef.current.loadMore();
        }
    }, [widgetRef, threshold, enabled]);
}
//# sourceMappingURL=OutbrainWidget.js.map