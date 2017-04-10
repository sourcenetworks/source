export default ({ body, title }) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>

        <meta charset="UTF-8">
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />

            <!-- add link to style sheet -->
        <link rel="stylesheet" href="/styles.css">

        <link href="//fonts.googleapis.com/css?family=Open+Sans:300,400,500,600,700" rel="stylesheet">
      </head>

      <body>
        <div id="root">${body}</div>
      </body>

      <script src="/bundle.js"></script>
    </html>


  `;
};

// Why is webpack necessary?
