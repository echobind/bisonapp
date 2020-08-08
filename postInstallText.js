module.exports = `

All set! To finalize setup, do the following:

cd %NAME%

* Run \`vc\` to link your project to vercel.
* Migrate your database with \`yarn db:migrate\`. You will be prompted to create it if necessary.
* Run the app with \`yarn dev\`. This will start the dev server and watchers for generating types.
* Create a new GitHub repo, and push the code from your newly generated app.

See the https://github.com/echobind/bisonapp#recommended-dev-workflow for tips and further setup.
`;
