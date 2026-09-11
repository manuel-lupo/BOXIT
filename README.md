# BOXIT

BOXIT is a React Native/Expo time-boxing app for planning focused activities, tracking daily progress, and building Momentum.

## Requirements

- Node.js 18 or newer
- npm
- Expo Go on an iOS or Android device (optional)

## Install

```bash
git clone [paste-link-here]
cd BOXIT
npm install
```

## Run the web app

```bash
npm run web
```

Then open the URL shown by Expo, usually `http://localhost:8081`.

## Test on a phone with Expo Go

Start the development server:

```bash
npm start
```

Scan the QR code from the Expo terminal or developer page with Expo Go.

For a phone outside the same local network, use a tunnel:

```bash
npx expo start --tunnel
```

The computer running the command must remain online while the app is being tested.

## Main features

- Daily time-box planning
- Future dates and recurring activities
- Low, Focus, High, and Critical priorities
- Momentum and daily progress tracking
- Completion and skip handling
- Countdown-focused task screen
- Local persistence on native and web
- English and Spanish localization
- Onboarding tutorial and replay option
- Reminder scheduling

## Notes

BOXIT is still under development. Expo Go is useful for testing the interface and core behavior, but native notification support may be limited by Expo Go and the platform. A development or standalone native build is recommended for complete notification testing.

Local app data can be reset from the profile menu → Settings.
