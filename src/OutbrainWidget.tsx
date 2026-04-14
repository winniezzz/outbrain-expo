import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { View, type LayoutChangeEvent, type NativeScrollEvent } from 'react-native';

// ─── Import from native package ─────────────────────────────────────────────
// outbrain-react-native v1.0.1 exports OutbrainWidget as a Fabric component
import { OutbrainWidget as NativeOutbrainWidget } from 'outbrain-react-native';

import type {
  OutbrainWidgetProps,
  OutbrainWidgetRef,
  OutbrainWidgetHandler,
} from './types';

// ─── Component ──────────────────────────────────────────────────────────────

export const OutbrainWidget = forwardRef<OutbrainWidgetRef, OutbrainWidgetProps>(
  (props, ref) => {
    const nativeRef = useRef<any>(null);

    // ── Resolve legacy aliases ────────────────────────────────────────────
    const articleUrl = props.articleUrl || props.url || '';
    const partnerKey = props.partnerKey || props.installationKey || '';
    const widgetIndex = props.widgetIndex ?? 0;

    // ── Merge handler with legacy onOrganicClick prop ─────────────────────
    const handler = useMemo<OutbrainWidgetHandler>(() => {
      const h: OutbrainWidgetHandler = { ...props.handler };

      // Legacy prop takes precedence if handler.onOrganicClick not set
      if (props.onOrganicClick && !h.onOrganicClick) {
        h.onOrganicClick = props.onOrganicClick;
      }

      return h;
    }, [props.handler, props.onOrganicClick]);

    // ── Imperative methods ────────────────────────────────────────────────
    const loadMore = useCallback(() => {
      if (nativeRef.current?.loadMore) {
        nativeRef.current.loadMore();
      }
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        loadMore,
      }),
      [loadMore]
    );

    // ── Render ────────────────────────────────────────────────────────────
    return (
      <View style={props.style}>
        <NativeOutbrainWidget
          ref={nativeRef}
          widgetId={props.widgetId}
          widgetIndex={widgetIndex}
          articleUrl={articleUrl}
          partnerKey={partnerKey}
          handler={handler}
          // Optional identifiers
          {...(props.extId != null && { extId: props.extId })}
          {...(props.extSecondaryId != null && {
            extSecondaryId: props.extSecondaryId,
          })}
          {...(props.pubImpId != null && { pubImpId: props.pubImpId })}
          {...(props.userId != null && { userId: props.userId })}
          // Privacy
          {...(props.consentV2 != null && { consentV2: props.consentV2 })}
          {...(props.ccpaString != null && { ccpaString: props.ccpaString })}
          // Display
          {...(props.darkMode != null && { darkMode: props.darkMode })}
        />
      </View>
    );
  }
);

OutbrainWidget.displayName = 'OutbrainWidget';

// ─── SmartFeed scroll helper hook ───────────────────────────────────────────

export interface UseSmartFeedScrollOptions {
  /** Ref to the OutbrainWidget */
  widgetRef: React.RefObject<OutbrainWidgetRef>;
  /** Distance from bottom to trigger loadMore (default: 50) */
  threshold?: number;
  /** Whether the feed is active (default: true) */
  enabled?: boolean;
}

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
export function useSmartFeedScroll({
  widgetRef,
  threshold = 50,
  enabled = true,
}: UseSmartFeedScrollOptions) {
  return useCallback(
    ({ nativeEvent }: { nativeEvent: NativeScrollEvent }) => {
      if (!enabled) return;

      const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
      const isCloseToBottom =
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - threshold;

      if (isCloseToBottom && widgetRef.current) {
        widgetRef.current.loadMore();
      }
    },
    [widgetRef, threshold, enabled]
  );
}
