import { NextApiRequest, NextApiResponse } from "next";

interface INextApiRouter {
  post(url: string, api: Function): INextApiRouter;
  get(url: string, api: Function): INextApiRouter;
  put(url: string, api: Function): INextApiRouter;
  delete(url: string, api: Function): INextApiRouter;
  routes(): void;
}

class NextApiRouter implements INextApiRouter {

  private readonly response: NextApiResponse;
  private readonly request: NextApiRequest;
  private readonly method: string;
  private readonly slugs: Array<string>;
  private readonly apiMap: Map<string, Map<string, Function>>;
  private postApiMap: Map<string, Function>;
  private getApiMap: Map<string, Function>;
  private putApiMap: Map<string, Function>;
  private deleteApiMap: Map<string, Function>;

  constructor(req: NextApiRequest, res: NextApiResponse) {
    const { method, query: { slug } } = req;

    this.slugs = slug as Array<string>;
    this.method = method;
    this.response = res;
    this.request = req;
    this.apiMap = this.generateApiMap();
  }

  private generateApiMap() {
    const apiMap = new Map();

    this.postApiMap = new Map();
    this.getApiMap = new Map();
    this.putApiMap = new Map();
    this.deleteApiMap = new Map();

    apiMap.set('POST', this.postApiMap);
    apiMap.set('GET', this.getApiMap);
    apiMap.set('PUT', this.putApiMap);
    apiMap.set('DELETE', this.deleteApiMap);

    return apiMap;
  }

  private errorResponse(req, res, status=500) {
    res.status(status).send("error");
  }

  post(url: string, api: Function): INextApiRouter {
    this.postApiMap.set(url, api);
    return this;
  }

  get(url: string, api: Function): INextApiRouter {
    this.getApiMap.set(url, api);
    return this;
  }

  put(url: string, api: Function): INextApiRouter {
    this.putApiMap.set(url, api);
    return this;
  }

  delete(url: string, api: Function): INextApiRouter {
    this.deleteApiMap.set(url, api);
    return this;
  }

  routes(): void {
    const targetMethodAPI = this.apiMap.get(this.method);

    let variable = {};
    let targetAPI: Function;
    let request = this.request;

    try {
      targetMethodAPI.forEach((value, key) => {
        const apiSlugs =  key.replace(/^(\/api\/|\/)/, '').split('/');
        const apiSlugLen = apiSlugs.length;

        if(apiSlugLen !== this.slugs.length) return;

        for(let i = 0; i < apiSlugLen; i++) {
          const nowApiSlug = apiSlugs[i];
          const nowSlug = this.slugs[i];

          if(nowApiSlug[0] === ':') {
            const varKey = nowApiSlug.substr(1);

            if(varKey === 'slug') {
              targetAPI = this.errorResponse;
              console.log(new Error("'slug' cannot be used as a key for query string."));
              throw new Error("error");
            }

            variable[varKey] = nowSlug;
          } else {

            if(nowApiSlug !== nowSlug) {
              variable = {};
              return;
            }

          }
        }

        if(Object.keys(variable).length) request.query = { ...request.query, ...variable };

        targetAPI = value;
        throw new Error('break');
      });
    } catch {}

    if(!targetAPI) return this.errorResponse(request, this.response, 404);
    return targetAPI(request, this.response);
  }
}

export default NextApiRouter;