fetch("https://www.nepalgarments.com/")
  .then(r => r.text())
  .then(html => {
    const urls = html.match(/https?:\/\/[^\s"'()<>]+?\.(?:png|jpe?g|webp)/gi);
    if (urls) {
      console.log(Array.from(new Set(urls)).join("\n"));
    }
  });
