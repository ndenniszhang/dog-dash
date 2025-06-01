// // Add any global setup needed for your tests
// import '@testing-library/jest-dom';

// // Import the mock first
// import * as Reanimated from 'react-native-reanimated/mock';

// // Mock react-native-reanimated
// jest.mock('react-native-reanimated', () => {
//   Reanimated.default.call = () => {};
//   return Reanimated;
// });

// // Mock Expo's vector icons
// jest.mock('@expo/vector-icons', () => ({
//   MaterialIcons: '',
//   // Add other icon sets you're using
// }));

// // Mock react-native-gesture-handler
// jest.mock('react-native-gesture-handler', () => ({}));

// // Mock react-native-safe-area-context
// jest.mock('react-native-safe-area-context', () => ({
//   SafeAreaProvider: ({ children }) => children,
//   useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
// }));

// // Set up global mocks for React Native
// global.window = global;
// global.__reanimatedWorkletInit = jest.fn();
