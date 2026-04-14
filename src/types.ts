import type { StyleProp, ViewStyle } from 'react-native';

// ─── Handler interface (matches outbrain-react-native v1.0.1) ───────────────

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

// ─── Widget props (superset: v1.0.1 API + legacy compat) ────────────────────

export interface OutbrainWidgetProps {
  // ── Required (v1.0.1 API) ─────────────────────────────────────────────────
  /** Widget ID as provided by Outbrain (e.g. "MB_1", "AR_2") */
  widgetId: string;
  /** Zero-based index when multiple widgets on same page */
  widgetIndex?: number;
  /** Article / page URL for contextual recommendations */
  articleUrl: string;
  /** Partner / installation key provided by Outbrain */
  partnerKey: string;

  // ── Event handling ────────────────────────────────────────────────────────
  /** v1.0.1 handler object */
  handler?: OutbrainWidgetHandler;

  // ── Optional identifiers ──────────────────────────────────────────────────
  /** External ID for publisher reporting */
  extId?: string;
  /** Secondary external ID for publisher reporting */
  extSecondaryId?: string;
  /** Publisher impression ID / session click identifier */
  pubImpId?: string;
  /** IDFA / GAID – advertising identifier */
  userId?: string;

  // ── Privacy / consent ─────────────────────────────────────────────────────
  /** GDPR TCF v2 consent string */
  consentV2?: string;
  /** US Privacy / CCPA string */
  ccpaString?: string;

  // ── Display ───────────────────────────────────────────────────────────────
  /** Enable dark mode rendering */
  darkMode?: boolean;
  /** Container style */
  style?: StyleProp<ViewStyle>;

  // ── Legacy compat aliases ─────────────────────────────────────────────────
  /** @deprecated Use `articleUrl` */
  url?: string;
  /** @deprecated Use `partnerKey` */
  installationKey?: string;
  /** @deprecated Use `handler.onOrganicClick` */
  onOrganicClick?: (url: string) => void;
  /** @deprecated GDPR v1 – prefer consentV2 */
  consentV1?: string;
}

// ─── Imperative handle exposed via ref ──────────────────────────────────────

export interface OutbrainWidgetRef {
  /** Load next chunk of SmartFeed recommendations */
  loadMore: () => void;
}
