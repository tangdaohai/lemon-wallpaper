import { IncomingMessage } from 'http'
const request = require('request')
/** request 请求封装 */
export default function (url: string, isJson: boolean = true): Promise<object> {
  return new Promise((resolve, reject) => {
    console.log('发起请求:', url)
    request({
      url,
      json: isJson,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36'
      }
    }, (err: any, response: IncomingMessage, body: any) => {
      console.log('请求结束')
      console.log('err: ' + err)
      console.log('typeof body: ' + typeof body)
      if (err) {
        return reject(err)
      }
      resolve(body)
    })
  })
}
