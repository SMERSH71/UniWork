module.exports = (app) => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded());
    app.use(express.json());
    app.use(express.static(__dirname + "/public"));
}