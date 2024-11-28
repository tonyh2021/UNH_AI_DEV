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

## Step 3: Post-install Steps

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

## Step 4: Adding your API key

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
