// requires
let fs = require('fs');
let PATH = require('path');
let http = require('http');
let https = require('https');
let URL = require("url");
let async = require('async');
let jsdom = require('jsdom');
let { JSDOM } = jsdom;

module.exports = {
    getResources: getResourcesFunc,
    download: downloadFunc
}

function getResourcesFunc(url, callback) {
    // validate url
    let isValidUrl = true;
    try {
        isValidUrl = URL.parse(url).hostname !== null;
    } catch (err) {
        isValidUrl = false;
    }
    if (!isValidUrl) {
        callback(new Error("Not valid Url."), []);
        return;
    }
    // proxy
    // process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    // let resourceLoader = new jsdom.ResourceLoader({
    //     proxy: 'http://10.0.0.249:8888',
    //     strictSSL: false
    // });
    let options = {
        resources: 'usable', // resourceLoader,
        runScripts: 'dangerously',
        beforeParse(window) {
            window.alert = (msg) => { console.log(msg); };
            window.matchMedia = () => ({});
            window.scrollTo = () => {};
        }
    };

    JSDOM.fromURL(url, options).then(dom => {
        let data = dom.window._sharedData;
        let media = null;
        let resources = [];
        if (data &&
            data.entry_data &&
            data.entry_data.PostPage &&
            data.entry_data.PostPage.length &&
            data.entry_data.PostPage[0].graphql &&
            data.entry_data.PostPage[0].graphql.shortcode_media)
            media = data.entry_data.PostPage[0].graphql.shortcode_media;
        if (media && media.edge_sidecar_to_children &&
            media.edge_sidecar_to_children.edges &&
            media.edge_sidecar_to_children.edges.length)
            resources = media.edge_sidecar_to_children.edges
            .filter(elem => elem.node && !elem.node.is_video)
            .map(elem => elem.node);
        else resources = media && !media.is_ad && !media.is_video ? [media] : [];
        dom.window.close();
        callback(null, resources);
    }).catch(err => { callback(err, []); });
}

function downloadFunc(url, folder, callback) {
    let root = PATH.join(__dirname, '..', 'public', 'downloads');
    let path = PATH.join(root, folder);
    async.waterfall([
        (cw) => {
            fs.stat(root, (err, stats) => {
                cw(null, !(err || !stats.isDirectory()));
            });
        },
        (isExists, cw) => {
            if (isExists) cw(null);
            else {
                fs.mkdir(root, cw);
            }
        },
        // initialize download folder
        (cw) => {
            fs.stat(path, (err, stats) => {
                cw(null, !(err || !stats.isDirectory()));
            });
        },
        (isExists, cw) => {
            if (isExists) cw(null);
            else {
                fs.mkdir(path, cw);
            }
        },
        // fetch resources
        (cw) => getResourcesFunc(url, cw),
        // download
        (resources, cw) => {
            let message = '';
            async.eachSeries(resources, (resource, ces) => {
                let isDownloaded = false;
                let srcList = [];
                srcList.push(resource.display_url);
                if (resource.display_resources && resource.display_resources.length) {
                    srcList = srcList.concat(resource.display_resources
                        .sort((a, b) => a.config_width - b.config_width)
                        .map(elem => elem.src));
                }
                let index = 0;
                async.doWhilst(
                    (cdw) => {
                        let src = srcList[index];
                        index++;
                        let Http = src.startsWith('https') ? https : http;
                        Http.get(src, (res) => {
                            if (res.statusCode === 200) {
                                let filename = Math.random().toString(36).substring(2, 15) +
                                    Math.random().toString(36).substring(2, 15);
                                let ext = src.split(/\#|\?/)[0].split('.').pop().trim();
                                let file = fs.createWriteStream(path + '/' + filename + '.' + ext);
                                resource.cached_url = '/downloads/' + folder + '/' + filename + '.' + ext;
                                res.pipe(file);
                                isDownloaded = true;
                            }
                            index++;
                            cdw(null);
                        });
                    },
                    () => { return !isDownloaded && index < srcList.length; },
                    (err) => {
                        if (!isDownloaded)
                            message += 'failed to download image: ' +
                            resource.display_url + '\n';
                        ces(null);
                    });
            }, (err) => {
                if (message) cw(new Error(message));
                else cw(null, resources);
            });
        }
    ], (err, resources) => {
      callback(err, resources);
    });

}
