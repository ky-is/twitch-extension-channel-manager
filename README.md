# twitch-extension-channel-manager

Allow users to enable and disable your Twitch.tv browser extension on a per-channel basis of their choosing.

## Setup

Include `images/icon-on.png` and `images/icon-off.png` images in your extension bundle.

## Usage

In your manifest file, ensure you have an entry for `background` and `content_scripts`:
```json
  "background": {
    "persistent": false,
    "scripts": ["background.js"]
  },
  "content_scripts": [
    {
      "matches": ["*://www.twitch.tv/*", "*://twitch.tv/*"],
      "js": [ "inject.js"]
    }
  ]
```

In your background script file, add:
```js
import './twitch-extension-channel-manager/background'
```

In your content script, add:
```js
import { injectTwitchPageOnBehalfOf } from './twitch-extension-channel-manager/inject'

injectTwitchPageOnBehalfOf('YOUR_PROJECT_CSS_CLASSNAME', () => {
  // Run your code here whenever the page content on Twitch updates.
})
```
