# instagram-images
A free [online tool](http://instagram-images.muxiqi.com) to fetch instagram images from url of the post.

## Files
```
.
├── controllers: Controller Modules
├── public: Front-End Resources
│      ├── app: Angular App
│      │      ├── components
│      │      ├── shared
│      │      ├── app.module.js
│      │      └── app.routes.js
│      ├── assets: Resources
│      │      ├── css
│      │      ├── img
│      │      ├── js
│      │      └── libs: Bower Libraries
│      └── index.html
├── routes: Express Routes
│      ├── endpoint.js: Non-API endpoints
│      └── api.js: RESTful API Entrance (Scalability)
├── .bowerrc
├── .gitignore
├── bower.json
├── package.json
└── server.js
```

## Initialization

### Prerequisites
NodeJS 8 (NodeJS 10 may have issues)

### Step-by-Step Installation
1. Make sure you have node installed with npm.
1. Run `npm install` under the repository folder
    * It will handle node modules, bower, and bower modules.
    * Read .bowerrc and package.json for detail.
1. For local nodemon, use nodemon.json as the config.

## Development

This is a deployment instruction for [OpenShift](https://www.openshift.com/), which uses Docker internally. Deployment on other platforms should be similar.

### Source & Secret
Source Secret is required for private repo deployment.
#### SSH
This credential uses ssh private/public key pairs to pull repo, and is safe because it can be assigned to single repo by deploy key.
1. Create ssh key **without** passphrase (empty passphrase).
1. Add ssh **public** key to the deploy key of the repo on git source.
1. Create a Source Secret in OpenShift, with ssh **private** key. _Remember: Do not modify after browse and import._
1. Check link to builder account before create.
1. In build config (where source is defined), assign the secret to the souce.
1. SSH url will work. _Remember: Do not use HTTP url, Do not add ssh:// before SSH url._

### Deployment
* Use Webhooks, set PayLoad URL, set Content type as application/json, and then leave Secret Blank. _For private repo, Secret field should be set._ On OpenShift side, rebuild and deployment will automatically take place.
* Use npm scripts.postinstall "npm install bower && bower install" to install bower component. Also use .bowerrc and bower.json to define bower install content.

### Routing
To host an OpenShift app at a specified url, the following steps should be taken:
1. Generate a default route for this app, naming internal-route for example.
1. Generate a specified route for this app, naming external-route for example.
1. Register the specified domain online (for example using [Name](https://www.name.com)).
1. Under DNS settings add a CNAME DNS with your internal-route url as source, and your external-route url as destination.

## References:
* [Bootstrap 3.4.0](https://getbootstrap.com/docs/3.4/)
* [Angular UI Bootstrap](http://angular-ui.github.io/bootstrap/)
* [AngularJS](https://angularjs.org/)
* [JSDOM](https://github.com/jsdom/jsdom)
* [OpenShift](https://www.openshift.com/)

## Known Issues

### In progress
* Add spinner on resource retrieving for better UX.

### To be discussed
* deploy on HTTPS, and adjust Github link when complete

### Out of consideration
* Retrieve authenticated information through official API
    * According to Instagram, endpoint `/users/self/followings` has been depreciated. Thus there is no official API available anymore.
    * Illegal API may exists, but is not worth considered in this small project.
