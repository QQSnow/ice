import Koa from 'koa'
import { Nuxt, Builder } from 'nuxt'
import R from 'ramda'
import {resolve} from 'path'

//改造之后的内容
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = !(process.env === 'production')
//配置将来需要用到的中间件
const MIDDLEWARES=['router','database']
const r= path =>  resolve(__dirname,path)


class Server {
  constructor(){
    this.app=new Koa();
    this.useMiddleWares(this.app)(MIDDLEWARES);
  }
  useMiddleWares(app){
    return R.map(R.compose(
      R.map(i => i(app)),
      require,
      i=>`${r('./middlewares')}/${i}`
      ))
  }
  async start () {
    // Instantiate nuxt.js
    const nuxt = new Nuxt(config)

    // Build in development
    if (config.dev) {
      const builder = new Builder(nuxt)
      await builder.build()
    }

    this.app.use(ctx => {
      ctx.status = 200
      ctx.respond = false // Mark request as handled for Koa
      ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
      nuxt.render(ctx.req, ctx.res)
    })

    this.app.listen(port, host)
    console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
  }
}

const app=new Server();
app.start();

//改造之前原始的内容
/*async function start () {
  const app = new Koa()
  const host = process.env.HOST || '127.0.0.1'
  const port = process.env.PORT || 3000

  // Import and Set Nuxt.js options
  const config = require('../nuxt.config.js')
  config.dev = !(app.env === 'production')

  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  app.use(ctx => {
    ctx.status = 200
    ctx.respond = false // Mark request as handled for Koa
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  app.listen(port, host)
  console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
}
start()*/