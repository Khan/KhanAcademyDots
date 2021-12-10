## INFO FOR MAINTAINERS OF THIS PLUGIN

### Cloning the repo
This repo contains a Git submodule (Translation Assistant)
so after the initial clone, don't forget to run

    git submodule update --init

### Updating Translation Assistant to latest master

    git submodule update --remote
    git commit translation-assistant

### Publishing a new version of the plugin

1. Bump version in manifest.json

2. Create zip file, both for FireFox and Chrome

```sh
    ./pack_plugin.sh chrome
    ./pack_plugin.sh firefox
```

3. Upload the zip file and publish.

    - https://chrome.google.com/webstore/developer/dashboard
    - https://addons.mozilla.org/en-US/developers/addon/khan-academy-dots/edit
