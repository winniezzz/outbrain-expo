# outbrain-expo

Wrapper Expo 55+ pour `outbrain-react-native` v1.0.1+ (Fabric Native Component).

Fournit :

- **Expo config plugin** — injection automatique du Maven `cherry-repo.com` (Android) + fix du conflit `APPLICATION_ID` Google Mobile Ads
- **Wrapper TypeScript moderne** — hooks, `forwardRef`, types stricts, compat legacy
- **`useSmartFeedScroll()`** — hook pour le chargement infini du SmartFeed

## Prérequis

- Expo SDK 55+ avec `expo-dev-client` (dev build obligatoire — ce package wrappe un module natif)
- `outbrain-react-native` >= 1.0.0

## Installation

```bash
# 1. Installer le SDK natif Outbrain
npx expo install outbrain-react-native

# 2. Installer ce wrapper (depuis le dossier local ou npm)
npm install ./outbrain-expo
# ou si publié :
# npm install outbrain-expo

# 3. Rebuild le dev client
npx expo prebuild --clean
npx expo run:ios
# ou
npx expo run:android
```

## Configuration Expo

Dans `app.json` ou `app.config.js` :

```json
{
  "expo": {
    "plugins": [
      "outbrain-expo"
    ]
  }
}
```

Si tu utilises aussi `react-native-google-mobile-ads` et que tu as un conflit `APPLICATION_ID` :

```json
{
  "expo": {
    "plugins": [
      ["outbrain-expo", {
        "androidGmaAppId": "ca-app-pub-XXXXXXXXXX~YYYYYYYYYY"
      }]
    ]
  }
}
```

## Usage — Widget simple

```tsx
import { OutbrainWidget } from 'outbrain-expo';

export function ArticleScreen() {
  return (
    <ScrollView>
      {/* ... ton contenu article ... */}

      <OutbrainWidget
        widgetId="MB_2"
        widgetIndex={0}
        articleUrl="https://mon-site.com/article/123"
        partnerKey="MON_PARTNER_KEY"
      />
    </ScrollView>
  );
}
```

## Usage — SmartFeed avec scroll infini

```tsx
import { useRef } from 'react';
import { ScrollView } from 'react-native';
import {
  OutbrainWidget,
  useSmartFeedScroll,
  type OutbrainWidgetRef,
} from 'outbrain-expo';

export function FeedScreen() {
  const widgetRef = useRef<OutbrainWidgetRef>(null);
  const onScrollEnd = useSmartFeedScroll({ widgetRef });

  return (
    <ScrollView onMomentumScrollEnd={onScrollEnd}>
      {/* ... header / contenu ... */}

      <OutbrainWidget
        ref={widgetRef}
        widgetId="MB_1"
        widgetIndex={0}
        articleUrl="https://mon-site.com/article/123"
        partnerKey="MON_PARTNER_KEY"
        darkMode={true}
      />
    </ScrollView>
  );
}
```

## Usage — Event Handlers

```tsx
<OutbrainWidget
  widgetId="MB_1"
  widgetIndex={0}
  articleUrl="https://mon-site.com/article/123"
  partnerKey="MON_PARTNER_KEY"
  handler={{
    onRecClick: (url) => {
      // Ouvrir dans un navigateur custom (WebBrowser, etc.)
      console.log('Paid click:', url);
    },
    onOrganicClick: (url) => {
      // Navigation in-app
      navigation.push('Article', { url });
    },
    onHeightChange: (newHeight) => {
      console.log('Widget height:', newHeight);
    },
    onWidgetEvent: (eventName, data) => {
      console.log('Widget event:', eventName, data);
    },
  }}
/>
```

## Usage — GDPR / CCPA

```tsx
<OutbrainWidget
  widgetId="MB_1"
  widgetIndex={0}
  articleUrl="https://mon-site.com/article/123"
  partnerKey="MON_PARTNER_KEY"
  consentV2="CPXxRfAPXxRfAAfKABENB-CgAAAAAAAAAAYgAAAAAAAA"
  ccpaString="1YNN"
/>
```

## Usage — Widgets multiples sur une page

```tsx
<OutbrainWidget
  widgetId="MB_2"
  widgetIndex={0}
  articleUrl="https://mon-site.com/article/123"
  partnerKey="MON_PARTNER_KEY"
/>

{/* ... autre contenu ... */}

<OutbrainWidget
  widgetId="SB_1"
  widgetIndex={1}
  articleUrl="https://mon-site.com/article/123"
  partnerKey="MON_PARTNER_KEY"
/>
```

## Usage — IDFA / GAID (userId)

```tsx
import { getAdvertisingId } from 'expo-tracking-transparency';
// ou react-native-idfa, expo-ads-admob, etc.

const [adId, setAdId] = useState<string | undefined>();

useEffect(() => {
  getAdvertisingId().then(setAdId).catch(console.warn);
}, []);

<OutbrainWidget
  widgetId="MB_1"
  widgetIndex={0}
  articleUrl="https://mon-site.com/article/123"
  partnerKey="MON_PARTNER_KEY"
  userId={adId}
/>
```

## Compatibilité legacy

Ce wrapper accepte aussi les props de l'ancien composant `react-native-outbrain` pour faciliter la migration :

| Ancienne prop       | Nouvelle prop             |
| ------------------- | ------------------------- |
| `url`               | `articleUrl`              |
| `installationKey`   | `partnerKey`              |
| `onOrganicClick`    | `handler.onOrganicClick`  |
| `consentV1`         | (passé tel quel, déprécié)|

## API Reference

### `<OutbrainWidget />`

| Prop             | Type                      | Requis | Description                                      |
| ---------------- | ------------------------- | ------ | ------------------------------------------------ |
| `widgetId`       | `string`                  | ✅     | ID du widget Outbrain                            |
| `widgetIndex`    | `number`                  | —      | Index (0-based) si plusieurs widgets par page    |
| `articleUrl`     | `string`                  | ✅     | URL de l'article / page                          |
| `partnerKey`     | `string`                  | ✅     | Clé partenaire / installation                    |
| `handler`        | `OutbrainWidgetHandler`   | —      | Callbacks (voir ci-dessous)                      |
| `extId`          | `string`                  | —      | ID externe pour reporting                        |
| `extSecondaryId` | `string`                  | —      | ID externe secondaire                            |
| `pubImpId`       | `string`                  | —      | Publisher impression ID                          |
| `userId`         | `string`                  | —      | IDFA / GAID                                      |
| `consentV2`      | `string`                  | —      | GDPR TCF v2 consent string                       |
| `ccpaString`     | `string`                  | —      | US Privacy / CCPA string                         |
| `darkMode`       | `boolean`                 | —      | Mode sombre                                      |
| `style`          | `StyleProp<ViewStyle>`    | —      | Style du conteneur                               |

### `OutbrainWidgetHandler`

```ts
interface OutbrainWidgetHandler {
  onHeightChange?: (newHeight: number) => void;
  onRecClick?: (url: string) => void;
  onOrganicClick?: (url: string) => void;
  onWidgetEvent?: (eventName: string, data: Record<string, unknown>) => void;
}
```

### `OutbrainWidgetRef` (via `ref`)

```ts
interface OutbrainWidgetRef {
  loadMore: () => void;
}
```

### `useSmartFeedScroll(options)`

```ts
function useSmartFeedScroll(options: {
  widgetRef: React.RefObject<OutbrainWidgetRef>;
  threshold?: number;  // default: 50
  enabled?: boolean;   // default: true
}): (event: { nativeEvent: NativeScrollEvent }) => void;
```

## Ce que fait le config plugin

### Android

1. Ajoute `maven { url "https://cherry-repo.com/repository/releases/" }` dans `allprojects.repositories` du `build.gradle` racine
2. (Optionnel) Injecte `<meta-data>` avec `tools:replace` pour résoudre le conflit `APPLICATION_ID` si `androidGmaAppId` est fourni

### iOS

Rien de spécial — le pod `outbrain-react-native` s'autolinke via le mécanisme d'autolinking Expo/CocoaPods.

Pour le navigateur in-app optionnel (`react-native-inappbrowser-reborn`), ajouter manuellement dans le `Podfile` si besoin :

```ruby
pod 'react-native-inappbrowser-reborn', :path => '../node_modules/react-native-inappbrowser-reborn'
```

## Troubleshooting

### `cherry-repo.com` non trouvé (Android)

Vérifier que le plugin est bien listé dans `app.json` et relancer `npx expo prebuild --clean`.

### Conflit APPLICATION_ID

Passer `androidGmaAppId` dans les options du plugin (voir Configuration ci-dessus).

### Le widget ne s'affiche pas

- Vérifier que `widgetId` et `partnerKey` correspondent à ton compte Outbrain
- S'assurer que les settings AMPM sont configurés (Custom Clicks Handler = enable, Feed Manual Chunk Fetch = enable pour SmartFeed)
- Tester avec les valeurs démo : `widgetId="MB_1"`, `partnerKey="NANOWDGT01"`, `articleUrl="http://mobile-demo.outbrain.com"`
