import React from 'react';
import { type NativeScrollEvent } from 'react-native';
import type { OutbrainWidgetProps, OutbrainWidgetRef } from './types';
export declare const OutbrainWidget: React.ForwardRefExoticComponent<OutbrainWidgetProps & React.RefAttributes<OutbrainWidgetRef>>;
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
export declare function useSmartFeedScroll({ widgetRef, threshold, enabled, }: UseSmartFeedScrollOptions): ({ nativeEvent }: {
    nativeEvent: NativeScrollEvent;
}) => void;
//# sourceMappingURL=OutbrainWidget.d.ts.map