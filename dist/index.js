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
        this.method = method;
        this.response = res;
        this.request = req;
        this.apiMap = this.generateApiMap();
    }
    NextApiRouter.prototype.generateApiMap = function () {
        var apiMap = new Map();
        this.postApiMap = new Map();
        this.getApiMap = new Map();
        this.putApiMap = new Map();
        this.deleteApiMap = new Map();
        apiMap.set('POST', this.postApiMap);
        apiMap.set('GET', this.getApiMap);
        apiMap.set('PUT', this.putApiMap);
        apiMap.set('DELETE', this.deleteApiMap);
        return apiMap;
    };
    NextApiRouter.prototype.errorResponse = function (req, res, status) {
        if (status === void 0) { status = 500; }
        res.status(status).send("error");
    };
    NextApiRouter.prototype.post = function (url, api) {
        this.postApiMap.set(url, api);
        return this;
    };
    NextApiRouter.prototype.get = function (url, api) {
        this.getApiMap.set(url, api);
        return this;
    };
    NextApiRouter.prototype.put = function (url, api) {
        this.putApiMap.set(url, api);
        return this;
    };
    NextApiRouter.prototype.delete = function (url, api) {
        this.deleteApiMap.set(url, api);
        return this;
    };
    NextApiRouter.prototype.routes = function () {
        var _this = this;
        var targetMethodAPI = this.apiMap.get(this.method);
        var variable = {};
        var targetAPI;
        var request = this.request;
        try {
            targetMethodAPI.forEach(function (value, key) {
                var apiSlugs = key.replace(/^(\/api\/|\/)/, '').split('/');
                var apiSlugLen = apiSlugs.length;
                if (apiSlugLen !== _this.slugs.length)
                    return;
                for (var i = 0; i < apiSlugLen; i++) {
                    var nowApiSlug = apiSlugs[i];
                    var nowSlug = _this.slugs[i];
                    if (nowApiSlug[0] === ':') {
                        var varKey = nowApiSlug.substr(1);
                        if (varKey === 'slug') {
                            targetAPI = _this.errorResponse;
                            console.log(new Error("'slug' cannot be used as a key for query string."));
                            throw new Error("error");
                        }
                        variable[varKey] = nowSlug;
                    }
                    else {
                        if (nowApiSlug !== nowSlug) {
                            variable = {};
                            return;
                        }
                    }
                }
                if (Object.keys(variable).length)
                    request.query = __assign(__assign({}, request.query), variable);
                targetAPI = value;
                throw new Error('break');
            });
        }
        catch (_a) { }
        if (!targetAPI)
            return this.errorResponse(request, this.response, 404);
        return targetAPI(request, this.response);
    };
    return NextApiRouter;
}());
exports.default = NextApiRouter;
