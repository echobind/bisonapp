const figlet = require('figlet');
const gradient = require('gradient-string');

async function displayLogo() {
  const msg = `           BISON            `;
  const description = `The Full Stack Jamstack in-a-box. Make something awesome with it!
                                ♥️  Echobind`;

  // Wait for the figlet function to complete before continuing,
  // otherwise the first question appears before logo.
  await new Promise((resolve) => {
    figlet(msg, (err) => {
      console.log(`${gradient.pastel.multiline(
        figlet.textSync(msg, {
          font: 'Big',
          horizontalLayout: 'default',
          vericalLayout: 'default',
          width: 80,
          whitespaceBreak: true,
        })
      )}
      ${gradient.pastel(description)} \n`);

      if (err) {
        console.log('Something went wrong. Try again?');
        console.dir(err);
        return;
      }

      resolve();
    });
  });
}

module.exports = displayLogo;
