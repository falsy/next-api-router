import 'jest'
import NextApiRouter from '../src'

describe('Next Api Router - Error', () => {
  let resStatus: number
  let resData: any

  const res: any = {
    status(code: number) {
      resStatus = code
      return this
    },
    send(data: any) {
      resData = data
      return this
    }
  }

  beforeEach(() => {
    resStatus = 0
    resData = ''
  })

  it('404 - api does not exist', () => {
    const req: any = {
      method: 'GET',
      query: {
        slug: ['boo']
      }
    }

    const nextApiRouter = new NextApiRouter(req, res)

    nextApiRouter.routes()
    
    expect(resStatus).toEqual(404)
    expect(resData).toEqual('error')
  })

  it('404 - HTTP method not supported ', () => {
    const req: any = {
      method: 'AAA',
      query: {
        slug: ['foo', 'boo']
      }
    }

    const nextApiRouter = new NextApiRouter(req, res)

    nextApiRouter.get('/foo/boo', (req, res) => {
      res.status(200).send(true)
    })

    nextApiRouter.routes()
    
    expect(resStatus).toEqual(404)
    expect(resData).toEqual('error')
  })

  it('500 - variable paths', () => {
    const req: any = {
      method: 'GET',
      query: {
        slug: ['foo', 'boo']
      }
    }

    const nextApiRouter = new NextApiRouter(req, res)

    nextApiRouter.get('/foo/:slug', (req, res) => {
      res.status(200).send(true)
    })

    nextApiRouter.routes()
    
    expect(resStatus).toEqual(500)
    expect(resData).toEqual('error')
  })

})