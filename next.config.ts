import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // transpilePackages: [
  //   'react-native',
  //   'react-native-web',
  //   '@expo/vector-icons',
  //   'react-native-gesture-handler',
  //   'react-native-reanimated',
  //   'react-native-responsive-screen',
  //   'react-native-safe-area-context',
  //   '@react-navigation/native',
  //   '@react-navigation/native-stack',
  //   'styled-components',
  //   'styled-system'
  // ],
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web'
    };
    return config;
  },
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();