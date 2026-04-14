import { ConfigPlugin, createRunOncePlugin } from 'expo/config-plugins';
import {
  withOutbrainMaven,
  withOutbrainGmaFix,
  type OutbrainPluginProps,
} from './withOutbrainAndroid';
import { withOutbrainIos } from './withOutbrainIos';

const pkg = require('../../package.json');

const withOutbrain: ConfigPlugin<OutbrainPluginProps | void> = (
  config,
  props = {}
) => {
  const pluginProps: OutbrainPluginProps = props || {};

  // Android: Maven repo + optional GMA conflict fix
  config = withOutbrainMaven(config, pluginProps);
  config = withOutbrainGmaFix(config, pluginProps);

  // iOS: optional in-app browser pod
  config = withOutbrainIos(config, pluginProps);

  return config;
};

export default createRunOncePlugin(withOutbrain, pkg.name, pkg.version);
