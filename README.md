This is a [**React Native**](https://reactnative.dev) project, primarily focused on calling AI platform([**Open AI**](https://platform.openai.com/docs/overview), [**Gemini**](https://ai.google.dev/gemini-api/docs)) APIs for text, audio, and image processing and interaction.

# Getting Started

> **Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Adding your API key

Create a .env file in the root directory of the project and add your AI platform's API key. As shown in the code below:

```bash
GEMINI_API_KEY = your-gemini-api-key
OPENAI_API_KEY = your-openai-api-key
```

## Congratulations! :tada:

You have successfully run an AI application based on the React Native framework! Have fun! :partying_face:

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Open AI](https://platform.openai.com/docs/overview) - official documentation for OpenAI's platform, including API details, capabilities, and usage guidelines.
- [Gemini](https://ai.google.dev/gemini-api/docs) - official documentation for Gemini, Google's AI platform for developing and deploying models.
