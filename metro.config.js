const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure these packages work with Metro
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;
