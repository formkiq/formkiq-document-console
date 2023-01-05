/* eslint-disable */
export default {
  displayName: 'formkiq-document-console-react',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nrwl/react/babel'] }],
  },
  transformIgnorePatterns: [`/node_modules/(?!(somePkg)|react-dnd|dnd-core|@react-dnd)`],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/formkiq-document-console-react',
};
