import request from 'request-promise'

const baseUrl='https://api.weixin.qq.com/cgi-bin/'
/*https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET*/
const api={
	accessToken:baseUrl+'token?grant_type=client_credential'
}

export default class Wechat{
	constructor(opts){		
		this.opts=Object.assign({},opts)
		
		this.appid=opts.appid
		this.secret=opts.secret
		
		this.getAccessToken=opts.getAccessToken
		this.saveAccessToken=opts.saveAccessToken
		this.fetchAccessToken()
	}

	async request(options){
		options=Object.assign({},options,{json:true})
		try{
			const response= await request(options)
			/*console.log('response:'+response)*/
			return response
		}catch(error){
			console.error(error)
		}

		
	}

	async fetchAccessToken(){

		let data=await this.getAccessToken()
		
		if(!this.isValidAccessToken(data)){
			data = await this.updateAccessToken()
		}

		await this.saveAccessToken(data)
		return data;
	}

	async updateAccessToken(){
		const url=api.accessToken+'&appid='+this.appid+'&secret='+this.secret
		const data =await this.request({url:url})
		/*console.log('从微信服务器获取token'+JSON.stringify(data))*/
		const now = (new Date().getTime())
		//设置20s的缓冲期
		const expireIn=now +(data.expires_in-20)*1000
		data.expires_in=expireIn
		return data
	}

	isValidAccessToken(data){
		if(!data || !data.access_token 
			||!data.expires_in ){
			return false
		}
		const expireIn=data.expires_in
		const now =(new Date().getTime())
		if(now < expireIn){
			return true
		}else{
			return false
		}
	}
}