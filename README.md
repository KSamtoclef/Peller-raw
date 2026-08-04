# Peller & Jarvis White Wedding Fan Gifts

Premium mobile-first white-wedding gift experience.

## Easy-edit files

- `assets/js/config.js`
  - demo banner
  - required shares
  - Facebook exit URL
  - final destination links
  - WhatsApp message

- `assets/js/comments.js`
  - names
  - conversation topics
  - replies
  - starting comments

- `assets/js/webpushr.js`
  - paste the official Webpushr code here

- `assets/images/hero.webp`
  - upload the approved hero image using this exact path and filename

## Demo removal

Inside `assets/js/config.js`, change:

```js
demoBanner: 'DEMO PREVIEW — FOR SETUP AND TESTING'
```

to:

```js
demoBanner: ''
```

Then change the browser title inside `index.html` when production cleanup is approved.

## Final links

Inside `assets/js/config.js`:

```js
giftLinks: {
  cow: '',
  data: '',
  cash: '',
  surprise: '',
  status: ''
}
```

## Development reset

Run in the browser console:

```js
resetWhiteWeddingGiftPreview()
```
