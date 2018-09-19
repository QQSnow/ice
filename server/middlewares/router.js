import Router from 'koa-router'
import config from '../config'
import sha1 from 'sha1'


export const router = app =>{
	const router =new Router();
	router.get('/wechat-hear',(ctx,next) => {
		require('../wechat')
		const token = config.wechat.token
		const {
			signature,
			nonce,
			timestamp,
			echostr
		}=ctx.query

		/*console.log([token,timestamp,nonce,echostr,signature])*/
		const str=[token,timestamp,nonce].sort().join('')
		const sha=sha1(str)

		if(sha == signature){
			ctx.body=echostr
		}else{
			ctx.body='failed'
		}
		
	})
	app.use(router.routes()).use(router.allowedMethods());
	
}