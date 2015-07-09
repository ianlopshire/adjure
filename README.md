#Adjure

Adjure is a simple system to test url API's. Adjure simply allows you to send a request. You can then use the browser dev tools to examine the network activity and see all information about the request.

#### Features include
 - Multiple request types: GET, POST, PUT, DELETE, UPDATE
 - Save requests for later use
 - Add a JSON body to the request

# Quick Start Install

To use the production version of Adjure, follow these steps:

1. Download the [adjure.zip](https://github.com/ianlopshire/adjure/releases) from the latest release.
2. Unzip it into your webserver directory.
3. Visit adjure.html
4. Win!

# Developer Install (from Git)

Before you clone Adjure, make sure you have Node.js installed.
Also, you need Bower and Gulp. To install them (once you have Node running), run this command:

```bash
npm install -g bower gulp
```

Then, clone the repo:

```bash
git clone https://github.com/ianlopshire/adjure.git
cd adjure/
```

Next, install all of the required dependencies for Adjure (if you want to use the repo in production, use the [stable](https://github.com/ianlopshire/adjure/tree/stable) branch:

```bash
npm install
```

Build the Adjure files

```bash
gulp dev
```

If you want to minify the files for production usage

```bash
gulp prod
```

If you are actively developing on the less/js files, and don't want to re-type `gulp dev` every time, run:

```bash
gulp watch

## This will re-compile the files when they get changed
```

Visit the adjure.html file in a browser, and enjoy!

## Road Map

### 2.2.0
 - search requests
 - unsaved indicator
 - categorize requests
