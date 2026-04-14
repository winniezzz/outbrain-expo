import type { StyleProp, ViewStyle } from 'react-native';
export interface OutbrainWidgetHandler {
    /** Fired when the widget's internal content height changes */
    onHeightChange?: (newHeight: number) => void;
    /** Fired when a paid recommendation is clicked */
    onRecClick?: (url: string) => void;
    /** Fired when an organic (publisher) recommendation is clicked */
    onOrganicClick?: (url: string) => void;
    /** Generic widget event bus */
    onWidgetEvent?: (eventName: string, data: Record<string, unknown>) => void;
}
export interface OutbrainWidgetProps {
    /** Widget ID as provided by Outbrain (e.g. "MB_1", "AR_2") */
    widgetId: string;
    /** Zero-based index when multiple widgets on same page */
    widgetIndex?: number;
    /** Article / page URL for contextual recommendations */
    articleUrl: string;
    /** Partner / installation key provided by Outbrain */
    partnerKey: string;
    /** v1.0.1 handler object */
    handler?: OutbrainWidgetHandler;
    /** External ID for publisher reporting */
    extId?: string;
    /** Secondary external ID for publisher reporting */
    extSecondaryId?: string;
    /** Publisher impression ID / session click identifier */
    pubImpId?: string;
    /** IDFA / GAID – advertising identifier */
    userId?: string;
    /** GDPR TCF v2 consent string */
    consentV2?: string;
    /** US Privacy / CCPA string */
    ccpaString?: string;
    /** Enable dark mode rendering */
    darkMode?: boolean;
    /** Container style */
    style?: StyleProp<ViewStyle>;
    /** @deprecated Use `articleUrl` */
    url?: string;
    /** @deprecated Use `partnerKey` */
    installationKey?: string;
    /** @deprecated Use `handler.onOrganicClick` */
    onOrganicClick?: (url: string) => void;
    /** @deprecated GDPR v1 – prefer consentV2 */
    consentV1?: string;
}
export interface OutbrainWidgetRef {
    /** Load next chunk of SmartFeed recommendations */
    loadMore: () => void;
}
//# sourceMappingURL=types.d.ts.map