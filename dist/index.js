"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var NextApiRouter = /** @class */ (function () {
    function NextApiRouter(req, res) {
        var method = req.method, slug = req.query.slug;
        this.slugs = slug;
        this.method = method.toLowerCase();
        this.response = res;
        this.request = req;
        this.hashMap = {
            get: {},
            post: {},
            put: {},
            delete: {}
        };
    }
    NextApiRouter.prototype.pathValidation = function (path) {
        return /\/\:slug(\/)?/.test(path);
    };
    NextApiRouter.prototype.errorResponse = function (status) {
        this.response.status(status).send("error");
    };
    NextApiRouter.prototype.addRequestPathParams = function (url) {
        var _this = this;
        var newRequest = __assign({}, this.request);
        url.replace(/^(\/api\/|\/)|(\/)$/g, '').split('/').forEach(function (path, i) {
            var _a;
            if (path[0] !== ':')
                return;
            var newQuery = (_a = {}, _a[path.substr(1)] = _this.slugs[i], _a);
            newRequest.query = __assign(__assign({}, newRequest.query), newQuery);
        });
        return newRequest;
    };
    NextApiRouter.prototype.apiPathFilter = function (apiHashMap) {
        var _this = this;
        return Object.keys(apiHashMap).filter(function (path) {
            var apiSlugs = path.replace(/^(\/api\/|\/)|(\/)$/g, '').split('/');
            var apiSlugLen = apiSlugs.length;
            if (apiSlugLen !== _this.slugs.length)
                return false;
            for (var i = 0; i < apiSlugLen; i++) {
                if (apiSlugs[i][0] !== ':' && apiSlugs[i] !== _this.slugs[i])
                    return false;
            }
            return true;
        });
    };
    NextApiRouter.prototype.post = function (url, api) {
        var _a;
        this.hashMap.post = __assign(__assign({}, this.hashMap.post), (_a = {}, _a[url] = api, _a));
        return this;
    };
    NextApiRouter.prototype.get = function (url, api) {
        var _a;
        this.hashMap.get = __assign(__assign({}, this.hashMap.get), (_a = {}, _a[url] = api, _a));
        return this;
    };
    NextApiRouter.prototype.put = function (url, api) {
        var _a;
        this.hashMap.put = __assign(__assign({}, this.hashMap.put), (_a = {}, _a[url] = api, _a));
        return this;
    };
    NextApiRouter.prototype.delete = function (url, api) {
        var _a;
        this.hashMap.delete = __assign(__assign({}, this.hashMap.delete), (_a = {}, _a[url] = api, _a));
        return this;
    };
    NextApiRouter.prototype.routes = function () {
        var _a;
        var apiHashMap = ((_a = this.hashMap) === null || _a === void 0 ? void 0 : _a[this.method]) || {};
        var filterApiPath = this.apiPathFilter(apiHashMap);
        var targetApiLen = filterApiPath.length;
        if (targetApiLen === 0) {
            return this.errorResponse(404);
        }
        var targetApiUrl = filterApiPath[targetApiLen - 1];
        if (this.pathValidation(targetApiUrl)) {
            console.error("'slug' cannot be used as a key for query string.");
            return this.errorResponse(500);
        }
        var targetApi = apiHashMap[targetApiUrl];
        var request = this.addRequestPathParams(targetApiUrl);
        return targetApi(request, this.response);
    };
    return NextApiRouter;
}());
exports.default = NextApiRouter;
