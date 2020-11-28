import 'jest'
import NextApiRouter from '../src'

describe('Next Api Router - Method DELETE', () => {
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

  it('default', () => {
    const req: any = {
      method: 'DELETE',
      query: {
        slug: ['foo']
      }
    }

    const nextApiRouter = new NextApiRouter(req, res)

    nextApiRouter.delete('/api/foo', (req, res) => {
      res.status(200).send(true)
    })

    nextApiRouter.routes()
    
    expect(resStatus).toEqual(200)
    expect(resData).toEqual(true)
  })

  it('default - omit api path', () => {
    const req: any = {
      method: 'DELETE',
      query: {
        slug: ['foo']
      }
    }

    const nextApiRouter = new NextApiRouter(req, res)

    nextApiRouter.delete('/foo', (req, res) => {
      res.status(200).send(true)
    })

    nextApiRouter.routes()
    
    expect(resStatus).toEqual(200)
    expect(resData).toEqual(true)
  })

  it('multiple paths', () => {
    const req: any = {
      method: 'DELETE',
      query: {
        slug: ['foo','boo']
      }
    }

    const nextApiRouter = new NextApiRouter(req, res)

    nextApiRouter.delete('/foo/boo', (req, res) => {
      res.status(200).send(true)
    })

    nextApiRouter.routes()
    
    expect(resStatus).toEqual(200)
    expect(resData).toEqual(true)
  })

  it('variable paths', () => {
    const req: any = {
      method: 'DELETE',
      query: {
        slug: ['foo','booValue']
      }
    }

    const nextApiRouter = new NextApiRouter(req, res)

    nextApiRouter.delete('/foo/:boo', (req, res) => {
      const { boo } = req.query
      res.status(200).send(boo)
    })

    nextApiRouter.routes()
    
    expect(resStatus).toEqual(200)
    expect(resData).toEqual('booValue')
  })

  it('string params', () => {
    const req: any = {
      method: 'DELETE',
      query: {
        slug: ['foo'],
        boo: 'booValue'
      }
    }

    const nextApiRouter = new NextApiRouter(req, res)

    nextApiRouter.delete('/foo', (req, res) => {
      const { boo } = req.query
      res.status(200).send(boo)
    })

    nextApiRouter.routes()
    
    expect(resStatus).toEqual(200)
    expect(resData).toEqual('booValue')
  })

  it('string params + string params', () => {
    const req: any = {
      method: 'DELETE',
      query: {
        slug: ['foo', 'fooValue'],
        boo: 'booValue'
      }
    }

    const nextApiRouter = new NextApiRouter(req, res)

    nextApiRouter.delete('/foo/:foo', (req, res) => {
      const { boo, foo } = req.query
      res.status(200).send({ boo, foo })
    })

    nextApiRouter.routes()
    
    expect(resStatus).toEqual(200)
    expect(resData).toEqual({ boo: 'booValue', foo: 'fooValue' })
  })

})