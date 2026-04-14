import {
  ConfigPlugin,
  withProjectBuildGradle,
  withAndroidManifest,
} from 'expo/config-plugins';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface OutbrainPluginProps {
  /**
   * Your Google Mobile Ads APPLICATION_ID.
   * Required only if you also use react-native-google-mobile-ads or similar.
   * Setting this resolves the manifest merger conflict with Outbrain's bundled GMA id.
   */
  androidGmaAppId?: string;
}

// ─── 1. Add cherry-repo Maven to project-level build.gradle ─────────────────

export const withOutbrainMaven: ConfigPlugin<OutbrainPluginProps> = (config) => {
  return withProjectBuildGradle(config, (mod) => {
    const contents = mod.modResults.contents;

    const mavenBlock = `maven { url "https://cherry-repo.com/repository/releases/" }`;

    // Avoid duplicate injection
    if (contents.includes('cherry-repo.com')) {
      return mod;
    }

    // Strategy: insert inside allprojects > repositories block
    // If allprojects block exists, inject there
    if (contents.includes('allprojects')) {
      mod.modResults.contents = contents.replace(
        /(allprojects\s*\{[\s\S]*?repositories\s*\{)/,
        `$1\n        ${mavenBlock}`
      );
    } else {
      // Append allprojects block at the end
      mod.modResults.contents =
        contents +
        `\n\nallprojects {\n    repositories {\n        google()\n        mavenCentral()\n        ${mavenBlock}\n    }\n}\n`;
    }

    return mod;
  });
};

// ─── 2. Handle APPLICATION_ID manifest conflict ─────────────────────────────

export const withOutbrainGmaFix: ConfigPlugin<OutbrainPluginProps> = (
  config,
  props
) => {
  if (!props?.androidGmaAppId) {
    return config;
  }

  return withAndroidManifest(config, (mod) => {
    const mainApplication = mod.modResults.manifest.application?.[0];
    if (!mainApplication) return mod;

    // Ensure meta-data array exists
    if (!mainApplication['meta-data']) {
      mainApplication['meta-data'] = [];
    }

    const gmaMetaKey = 'com.google.android.gms.ads.APPLICATION_ID';

    // Remove existing entries to avoid duplicates
    mainApplication['meta-data'] = mainApplication['meta-data'].filter(
      (meta: any) => meta.$?.['android:name'] !== gmaMetaKey
    );

    // Add with tools:replace to win the manifest merger
    mainApplication['meta-data'].push({
      $: {
        'android:name': gmaMetaKey,
        'android:value': props.androidGmaAppId,
        'tools:replace': 'android:value',
      },
    } as any);

    // Ensure tools namespace is declared on <manifest>
    const manifest = mod.modResults.manifest;
    if (!manifest.$['xmlns:tools']) {
      manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';
    }

    return mod;
  });
};
