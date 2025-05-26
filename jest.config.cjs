module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/tests/__mocks__/fileMock.js',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^swiper/react$': '<rootDir>/tests/__mocks__/swiperMock.js',
    '^swiper/modules$': '<rootDir>/tests/__mocks__/swiperMock.js',
    '^swiper/css$': 'identity-obj-proxy',
    '^swiper/css/navigation$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
    '^.+$': 'babel-jest'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(swiper|ssr-window|dom7)/)'
  ],
  moduleFileExtensions: ['js', 'jsx'],
  testMatch: ['<rootDir>/tests/**/*.test.[jt]s?(x)'],
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  rootDir: '.'
};