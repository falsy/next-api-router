import 'jest'
import NextApiRouter from '../src'

describe('Next Api Router - Method POST', () => {
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
      method: 'POST',
      query: {
        slug: ['foo']
      }
    }

    const nextApiRouter = new NextApiRouter(req, res)

    nextApiRouter.post('/api/foo', (req, res) => {
      res.status(200).send(true)
    })

    nextApiRouter.routes()
    
    expect(resStatus).toEqual(200)
    expect(resData).toEqual(true)
  })

  it('default - omit api path', () => {
    const req: any = {
      method: 'POST',
      query: {
        slug: ['foo']
      }
    }

    const nextApiRouter = new NextApiRouter(req, res)

    nextApiRouter.post('/foo', (req, res) => {
      res.status(200).send(true)
    })

    nextApiRouter.routes()
    
    expect(resStatus).toEqual(200)
    expect(resData).toEqual(true)
  })

  it('multiple paths - string body data', () => {
    const req: any = {
      method: 'POST',
      query: {
        slug: ['foo','boo']
      },
      body: 'bodyValue'
    }

    const nextApiRouter = new NextApiRouter(req, res)

    nextApiRouter.post('/foo/boo', (req, res) => {
      res.status(200).send(req.body)
    })

    nextApiRouter.routes()
    
    expect(resStatus).toEqual(200)
    expect(resData).toEqual('bodyValue')
  })

  it('variable paths - json body data', () => {
    const req: any = {
      method: 'POST',
      headers: {
        "Content-Type": 'application/json'
      },
      query: {
        slug: ['foo','booValue']
      },
      body: {
        bodyObjectData: 'bodyValue'
      }
    }

    const nextApiRouter = new NextApiRouter(req, res)

    nextApiRouter.post('/foo/:boo', (req, res) => {
      const { boo } = req.query
      const { bodyObjectData } = req.body
      res.status(200).json({
        pathData: boo,
        bodyData: bodyObjectData
      })
    })

    nextApiRouter.routes()
    
    expect(resStatus).toEqual(200)
    expect(resData).toEqual({
      pathData: 'booValue',
      bodyData: 'bodyValue'
    })
  })

  it('string params', () => {
    const req: any = {
      method: 'POST',
      query: {
        slug: ['foo'],
        boo: 'booValue'
      }
    }

    const nextApiRouter = new NextApiRouter(req, res)

    nextApiRouter.post('/foo', (req, res) => {
      const { boo } = req.query
      res.status(200).send(boo)
    })

    nextApiRouter.routes()
    
    expect(resStatus).toEqual(200)
    expect(resData).toEqual('booValue')
  })

  it('string params + string params + body params', () => {
    const req: any = {
      method: 'POST',
      query: {
        slug: ['foo', 'fooValue'],
        boo: 'booValue'
      },
      body: 'bodyValue'
    }

    const nextApiRouter = new NextApiRouter(req, res)

    nextApiRouter.post('/foo/:foo', (req, res) => {
      const { boo, foo } = req.query
      res.status(200).send({ boo, foo, body: req.body })
    })

    nextApiRouter.routes()
    
    expect(resStatus).toEqual(200)
    expect(resData).toEqual({ boo: 'booValue', foo: 'fooValue', body: 'bodyValue' })
  })

})