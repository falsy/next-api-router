# Next API Router

[![npm](https://img.shields.io/npm/v/next-api-router.svg)](https://www.npmjs.com/package/next-api-router)
[![npm](https://img.shields.io/npm/dm/next-api-router.svg)](https://www.npmjs.com/package/next-api-router)
[![Node.js Version](https://img.shields.io/node/v/next-api-router.svg?style=flat)](http://nodejs.org/download/)

## Installation
```
npm install next-api-router
```

## Quick Start
### JavaScript
/pages/api/`[...slug].js` (or /src/pages/api/`[...slug].js`)
```js
import NextApiRouter from 'next-api-router'

export default (req, res) => {
  const Router = new NextApiRouter(req, res)
  
  Router.get('/test', (req, res) => {
    res.status(200).send(true)
  })

  return Router.routes()
}
```
### TypeScript
/pages/api/`[...slug].ts` (or /src/pages/api/`[...slug].ts`)
```js
import { NextApiRequest, NextApiResponse } from "next"
import NextApiRouter from 'next-api-router'

export default (req: NextApiRequest, res: NextApiResponse) => {
  const Router = new NextApiRouter(req, res)
  
  Router.get('/test', (req, res) => {
    res.status(200).send(true)
  })

  return Router.routes()
}
```

## Possible HTTP methods
`NextApiRouter.post()`, `NextApiRouter.get()`, `NextApiRouter.put()`, `NextApiRouter.delete()`

## Example

### Client
```js
import React, { useEffect } from 'react'

const App = () => {

  useEffect(() => {
    fetch('/api/apiUrlPath?apple=hello')
    fetch('/api/apiUrlPath/world')
    fetch('/api/apiUrlPath', {
      method: 'post',
      body: JSON.stringify({
        banana: 'long'
      })
    })
  }, [])

  return (
    <div>hello world</div>
  )
}

export default App
```

### Server
/pages/api/`[...slug].js` (or /src/pages/api/`[...slug].js`)
```js
import NextApiRouter from 'next-api-router'

export default (req, res) => {
  const Router = new NextApiRouter(req, res)
  
  Router
    .get('/apiUrlPath', (req, res) => {
      const { apple } = req.query
      
      console.log(apple)
      // hello
      
      res.status(200)
    })

    .get('/apiUrlPath/:orange', (req, res) => {
      const { orange } = req.query

      console.log(orange)
      // world

      res.status(200)
    })
    
    .post('/apiUrlPath', (req, res) => {
      const { banana } = JSON.parse(req.body)

      console.log(banana)
      // long

      res.status(200)
    })

  return Router.routes()
}
```