import { ConfigPlugin, withPodfile } from 'expo/config-plugins';
import type { OutbrainPluginProps } from './withOutbrainAndroid';

// ─── iOS: ensure the in-app browser pod is linked if needed ─────────────────
// The main `outbrain-react-native` pod autolinks via expo autolinking.
// This modifier handles the optional `react-native-inappbrowser-reborn` dep.

export const withOutbrainIos: ConfigPlugin<OutbrainPluginProps> = (config) => {
  return withPodfile(config, (mod) => {
    const contents = mod.modResults.contents;

    // If user already has inappbrowser in their Podfile, skip
    if (contents.includes('react-native-inappbrowser-reborn')) {
      return mod;
    }

    // Insert the pod line after `use_expo_modules!` or inside the target block
    // This is optional — only needed if the user wants in-app browser
    // The native package falls back to Linking.openURL() if not present
    // So we DON'T force-inject it. The user can add it manually if needed.

    return mod;
  });
};
