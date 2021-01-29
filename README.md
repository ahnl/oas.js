# oas.js
<center>
  <img src="https://i.imgur.com/siamnYR.png">
</center>
A client-side JavaScript library for Optical Answer Sheet rendering in YTL style. Rows and columns are resized dynamically based on the input data. Oas.js has both interactive and read-only optical answer sheets.

<a href="https://ahnl.github.io/oas.js/example.html">Hosted demo.</a> | <a href="https://discord.gg/epNrVdDWRz">Need help? Join our Discord.</a>

## Getting started
Include oas.js in your project by using CDN or downloading locally.

### CDN
Add the following lines to the `<head>`-section of your HTML-page.
```html
<script src="https://cdn.jsdelivr.net/gh/ahnl/oas.js@latest/oas.min.js"></script>
<link href="https://cdn.jsdelivr.net/gh/ahnl/oas.js@latest/oas.min.css" rel="stylesheet" />
```

### Local
Download `oas.min.js` and `oas.min.css` from this repo to your project folder. Add the following lines to the <head>-section of your HTML-page.
 ```html
<script src="/oas.min.js"></script>
<link href="/oas.min.css" rel="stylesheet" />
```

## Usage

```html
<div class="oas">CCCBAABCACCABBACABBBACABB</div>
<script>
  new Oas('.oas');
</script>
```

You can alternatively pass the answer line to `data-answer` attribute. Answer line can contain spaces, but they will be stripped out. Only alphabets A-Z and dots can be used. Dots will become empty columns.

You can also pass some options to oas.js.

```js
let oas = new Oas('.oas', {
  minDataRows: 4,
  sectionLength: 10,
  readOnly: false
});

// you can also change the readOnly state
oas.readOnly = true; 

// or get the value
alert(oas.elements[0].dataset.answers);

// or set the value
oas.elements[0].dataset.answers = 'ABCDCBA';
oas.render();
```

See `example.html` for some more examples.
