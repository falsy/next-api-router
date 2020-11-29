import 'jest'
import NextApiRouter from '../src'

describe('Next Api Router - Query String Params', () => {
  let resStatus: number
  let resData: any

  const res: any = {
    status(code: number) {
      resStatus = code
      return this
    },
    send(data: string) {
      resData = data
      return this
    },
    json(data: any) {
      resData = data
      return this
    }
  }

  beforeEach(() => {
    resStatus = 0
    resData = ''
  })

  it('default', () => {
    const req: any = {
      method: 'GET',
      query: {
        slug: ['foo']
      }
    }

    const nextApiRouter = new NextApiRouter(req, res)

    nextApiRouter.get('/api/foo', (req, res) => {
      res.status(200).send(true)
    })

    nextApiRouter.routes()
    
    expect(resStatus).toEqual(200)
    expect(resData).toEqual(true)
  })

  it('default - omit api path', () => {
    const req: any = {
      method: 'GET',
      query: {
        slug: ['foo']
      }
    }

    const nextApiRouter = new NextApiRouter(req, res)

    nextApiRouter.get('/foo', (req, res) => {
      res.status(200).send(true)
    })

    nextApiRouter.routes()
    
    expect(resStatus).toEqual(200)
    expect(resData).toEqual(true)
  })

  it('multiple paths', () => {
    const req: any = {
      method: 'GET',
      query: {
        slug: ['foo','boo']
      }
    }

    const nextApiRouter = new NextApiRouter(req, res)

    nextApiRouter.get('/foo/boo', (req, res) => {
      res.status(200).send(true)
    })

    nextApiRouter.routes()
    
    expect(resStatus).toEqual(200)
    expect(resData).toEqual(true)
  })

  it('variable paths', () => {
    const req: any = {
      method: 'GET',
      query: {
        slug: ['foo','booValue']
      }
    }

    const nextApiRouter = new NextApiRouter(req, res)

    nextApiRouter.get('/foo/:boo', (req, res) => {
      const { boo } = req.query
      res.status(200).send(boo)
    })

    nextApiRouter.routes()
    
    expect(resStatus).toEqual(200)
    expect(resData).toEqual('booValue')
  })

  it('multiple variable paths', () => {
    const req: any = {
      method: 'GET',
      query: {
        slug: ['foo','fooValue', 'boo', 'booValue']
      }
    }

    const nextApiRouter = new NextApiRouter(req, res)

    nextApiRouter.get('/foo/:foo/boo/:boo', (req, res) => {
      const { foo, boo } = req.query
      res.status(200).json({ foo, boo })
    })

    nextApiRouter.routes()
    
    expect(resStatus).toEqual(200)
    expect(resData).toEqual({ foo: 'fooValue', boo: 'booValue' })
  })

  it('string params', () => {
    const req: any = {
      method: 'GET',
      query: {
        slug: ['foo'],
        boo: 'booValue'
      }
    }

    const nextApiRouter = new NextApiRouter(req, res)

    nextApiRouter.get('/foo', (req, res) => {
      const { boo } = req.query
      res.status(200).send(boo)
    })

    nextApiRouter.routes()
    
    expect(resStatus).toEqual(200)
    expect(resData).toEqual('booValue')
  })

  it('string params + string params', () => {
    const req: any = {
      method: 'GET',
      query: {
        slug: ['foo', 'fooValue'],
        boo: 'booValue'
      }
    }

    const nextApiRouter = new NextApiRouter(req, res)

    nextApiRouter.get('/foo/:foo', (req, res) => {
      const { boo, foo } = req.query
      res.status(200).send({ boo, foo })
    })

    nextApiRouter.routes()
    
    expect(resStatus).toEqual(200)
    expect(resData).toEqual({ boo: 'booValue', foo: 'fooValue' })
  })

})