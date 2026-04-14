import { ConfigPlugin } from 'expo/config-plugins';
export interface OutbrainPluginProps {
    /**
     * Your Google Mobile Ads APPLICATION_ID.
     * Required only if you also use react-native-google-mobile-ads or similar.
     * Setting this resolves the manifest merger conflict with Outbrain's bundled GMA id.
     */
    androidGmaAppId?: string;
}
export declare const withOutbrainMaven: ConfigPlugin<OutbrainPluginProps>;
export declare const withOutbrainGmaFix: ConfigPlugin<OutbrainPluginProps>;
//# sourceMappingURL=withOutbrainAndroid.d.ts.map