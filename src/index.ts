import { NextApiRequest, NextApiResponse } from "next"

interface INextApiRouter {
  post(url: string, api: Function): INextApiRouter
  get(url: string, api: Function): INextApiRouter
  put(url: string, api: Function): INextApiRouter
  delete(url: string, api: Function): INextApiRouter
  routes(): void
}

interface IHashMap {
  post: any
  get: any
  put: any
  delete: any
}

class NextApiRouter implements INextApiRouter {

  private readonly response: NextApiResponse
  private readonly request: NextApiRequest
  private readonly method: string
  private readonly slugs: Array<string>
  private readonly hashMap: IHashMap

  constructor(req: NextApiRequest, res: NextApiResponse) {
    const { method, query: { slug } } = req

    this.slugs = slug as Array<string>
    this.method = method.toLowerCase()
    this.response = res
    this.request = req
    this.hashMap = {
      get: {},
      post: {},
      put: {},
      delete: {}
    }
  }

  private pathValidation(path: string) {
    return /\/\:slug(\/)?/.test(path)
  }

  private errorResponse(status: number) {
    this.response.status(status).send("error")
  }

  private addRequestPathParams(url: string) {
    const newRequest = { ...this.request }
    url.replace(/^(\/api\/|\/)|(\/)$/g, '').split('/').forEach((path, i) => {
      if(path[0] !== ':') return
      const newQuery = { [path.substr(1)]: this.slugs[i] }
      newRequest.query = { ...newRequest.query, ...newQuery}
    })
    return newRequest
  }

  private apiPathFilter(apiHashMap) {
    return Object.keys(apiHashMap).filter((path: string) => {
      const apiSlugs =  path.replace(/^(\/api\/|\/)|(\/)$/g, '').split('/')
      const apiSlugLen = apiSlugs.length
      
      if(apiSlugLen !== this.slugs.length) return false
      for(let i=0; i<apiSlugLen; i++) {
        if(apiSlugs[i][0] !== ':' && apiSlugs[i] !== this.slugs[i]) return false
      }
      return true
    })
  }

  post(url: string, api: Function): INextApiRouter {
    this.hashMap.post = { ...this.hashMap.post, [url]: api }
    return this
  }

  get(url: string, api: Function): INextApiRouter {
    this.hashMap.get = { ...this.hashMap.get, [url]: api }
    return this
  }

  put(url: string, api: Function): INextApiRouter {
    this.hashMap.put = { ...this.hashMap.put, [url]: api }
    return this
  }

  delete(url: string, api: Function): INextApiRouter {
    this.hashMap.delete = { ...this.hashMap.delete, [url]: api }
    return this
  }

  routes(): void {
    const apiHashMap = this.hashMap?.[this.method] || {}
    const filterApiPath = this.apiPathFilter(apiHashMap)
    const targetApiLen = filterApiPath.length
    
    if(targetApiLen === 0) {
      return this.errorResponse(404)
    }
    
    const targetApiUrl = filterApiPath[targetApiLen - 1]

    if(this.pathValidation(targetApiUrl)) {
      console.error("'slug' cannot be used as a key for query string.")
      return this.errorResponse(500)
    }

    const targetApi = apiHashMap[targetApiUrl]
    const request = this.addRequestPathParams(targetApiUrl)
    
    return targetApi(request, this.response)
  }
}

export default NextApiRouter