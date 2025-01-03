This is a [**React Native**](https://reactnative.dev) project, primarily focused on calling AI platforms ([**Open AI**](https://platform.openai.com/docs/overview), [**Gemini**](https://ai.google.dev/gemini-api/docs)) APIs for text, audio, and image processing and interaction, providing core functionalities such as text processing, speech recognition, image recognition, and text-to-speech (TTS), presented as an AI chatbot application.

<img src="Screenshot.jpeg" width="300" />

### See more details on [**Google Drive**](https://drive.google.com/file/d/1zqfQnXIRaHCQhDe3C1GDrOORWemDDsrx/view?usp=sharing).

# React Native Project Setup

This guide will walk you through the setup process for an existing React Native project. It assumes you've already cloned the project and have the necessary tools installed. If not, follow the [React Native Environment Setup](https://reactnative.dev/docs/environment-setup) instructions to get started.

## Prerequisites

Ensure that you have the following tools installed:

- **Node.js**: Required for managing dependencies.
- **npm or Yarn**: A package manager to install project dependencies.
- **Watchman**: Helps React Native with file system watching on macOS. (Optional but recommended)
- **JDK**: Java Development Kit (Required for Android development).
- **Xcode**: Required for iOS development (macOS only).
- **Android Studio**: Required for Android development.

If you need help installing any of these tools, refer to the [React Native Environment Setup](https://reactnative.dev/docs/environment-setup).

## Step 1: Clone the Project

If you haven't already cloned the project, use the following command to clone the repository:

```bash
git clone git@github.com:tonyh2021/UNH_AI_DEV.git
```

Navigate to the project directory:

```bash
cd UNH_AI_DEV
```

## Step 1: Install Dependencies

Install the project dependencies using npm or Yarn. This will install all necessary packages listed in `package.json`.

```bash
# using npm
npm install

# OR using Yarn
yarn install
```

Install iOS Dependencies (Native iOS Setup)

For iOS, follow these steps to install and configure native dependencies:

### 1. Navigate to the iOS Directory

```bash
cd ios
```

### 2. Install CocoaPods Dependencies

CocoaPods is a dependency manager for iOS projects. To install all the necessary iOS dependencies for your project, run the following command inside the `ios` directory:

```bash
pod install
```

## Step 2: Post-install Steps

### iOS

Add the appropriate keys to your `Info.plist` depending on your requirement:

| Requirement                    | Key                                                     |
| ------------------------------ | ------------------------------------------------------- |
| Select image/video from photos | NSPhotoLibraryUsageDescription                          |
| Capture Image                  | NSCameraUsageDescription                                |
| Capture Video                  | NSCameraUsageDescription & NSMicrophoneUsageDescription |
| Speech Recognition             | NSSpeechRecognitionUsageDescription                     |

### Android

No permissions required (`saveToPhotos` requires permission [check](#note-on-file-storage)).

Note: This library does not require `Manifest.permission.CAMERA`, if your app declares as using this permission in manifest then you have to obtain the permission before using `launchCamera`.

#### Targeting Android API Levels Below 30

If your app's `minSdkVersion` is set to below 30 and it does not already include or depend on `androidx.activity:activity:1.9.+` or a newer version, you'll need to add the following line to the dependencies section of your `app/build.gradle` file to ensure support for the backported AndroidX Photo Picker:

```groovy
dependencies {
    ...
    implementation("androidx.activity:activity:1.9.+")
    ...
}
```

**Notes on Android**

Even after all the permissions are correct in Android, there is one last thing to make sure this libray is working fine on Android. Please make sure the device has Google Speech Recognizing Engine such as `com.google.android.googlequicksearchbox` by calling `Voice.getSpeechRecognitionServices()`. Since Android phones can be configured with so many options, even if a device has googlequicksearchbox engine, it could be configured to use other services. You can check which serivce is used for Voice Assistive App in following steps for most Android phones:

`Settings > App Management > Default App > Assistive App and Voice Input > Assistive App`

## Step 3: Adding your API key

This project uses the `react-native-dotenv` library to manage `.env` files. It’s important to securely store your API keys to protect sensitive data. Follow these steps:

### 1. Install `react-native-dotenv`

Install the library using npm or Yarn:

```bash
# using npm
npm install react-native-dotenv

# OR using Yarn
yarn add react-native-dotenv
```

### 2. Configure Babel

Add the plugin configuration in your `babel.config.js` file:

```javascript
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
      },
    ],
  ],
};
```

### 3. Add `.env` to `.gitignore`

To prevent accidentally committing your `.env` file to version control, open your `.gitignore` file in the root directory and add the following line:

```bash
# Add this line to .gitignore
.env
```

### 4. Create a .env file file in the root directory of your project and add your API keys like this:

```bash
GEMINI_API_KEY = your-gemini-api-key
OPENAI_API_KEY = your-openai-api-key
```

## Step 4: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 5: Start your Application

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

## Congratulations! :tada:

You have successfully run an AI application based on the React Native framework! Have fun! :partying_face:

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Open AI](https://platform.openai.com/docs/overview) - official documentation for OpenAI's platform, including API details, capabilities, and usage guidelines.
- [Gemini](https://ai.google.dev/gemini-api/docs) - official documentation for Gemini, Google's AI platform for developing and deploying models.
