export default {
	preset: 'ts-jest',
	testEnvironment: 'jsdom',
	roots: ['<rootDir>/src'],
	testMatch: ['**/*.test.ts', '**/*.test.tsx'],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1'
	},
	setupFilesAfterEnv: ['@testing-library/jest-dom']
};
