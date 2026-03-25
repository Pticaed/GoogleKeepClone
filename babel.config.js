module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            [
                'module-resolver',
                {
                    alias: {
                        'expo-sqlite/next': 'expo-sqlite',
                    },
                },
            ],
            ['inline-import', { extensions: ['.sql'] }],
            'react-native-reanimated/plugin',
        ],
    };
};