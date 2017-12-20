To run client application:

1. Install Node.js platform, npm command should be available after that
2. [Setup npm package manager for Kendo UI components](http://www.telerik.com/kendo-angular-ui/getting-started/)
3. Install application certificate (`server.crt` file)
4. Run `npm run install-start` to install, build and run prod version, or `npm run install-start-dev` to install, build and run dev version
5. After you will see message `Server is running on port: 4200` you can input in your browser this url: https://localhost:4200
6. If you need to change server port, you can to do it in `./env.json` file (based on `./server/env.example.json`)

If you want to change frontend url you need to configure it in backend config (`env.js`)

### To heroku deploy: ###
1. Setup your project like in instruction: https://devcenter.heroku.com/articles/git
2. Setup env variables in settings tab of heroku app:
    * `BACKEND_URL: [url to backend project]`
    * `HTTPS_DISABLED: true`
    * `NPM_CONFIG_PRODUCTION: false`
3. Run in project folder the following command: `git push heroku [your branch name]:master -f`

### Run the following commands to refresh heroku cache (project folder): ###
1. `heroku plugins:install heroku-repo`
2. `heroku repo:purge_cache -a [your application name]`
3. `git push heroku [your branch name]:master -f`

#### It fixes heroku problems with node_modules cache. ####
Source article: https://help.heroku.com/18PI5RSY/how-do-i-clear-the-build-cache
