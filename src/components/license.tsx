import React from 'react'
import {
  Card,
  CardContent,
  Typography
} from '@material-ui/core'
import Layout from './normal-layout'

export default function License () {
  return (
    <Layout>
      <Typography variant='h4' component='h1'>柠檬壁纸 相关说明</Typography>
      <br />
      <Card>
        <CardContent>
          <Typography variant='h6' component='h3'>License</Typography>
          <br />
          <Typography variant='subtitle1' gutterBottom>
            MIT
          </Typography>
          <br />
          <Typography variant='caption' display='block' gutterBottom>
            本程序仅供开源学习、个人使用，它用责任自负。
          </Typography>
        </CardContent>
      </Card>
      <br />
      <Card>
        <CardContent>
          <Typography variant='h6' component='h3'>关于使用到的相关图片数据源</Typography>
          <br />
          <Typography variant='caption' display='block' gutterBottom>
            程序内使用到的数据，没有进行任何商业行为。如有侵权，必将删除。如有侵权请联系：tangdaohai@outlook.com
          </Typography>
          <br />
          <Typography variant='subtitle2' gutterBottom>
            <span>1. 必应壁纸 bing.com（使用了 https://bing.ioliu.cn 提供的 API）</span>
            <br />
            <span>2. Unsplash: https://unsplash.com</span>
            <br />
            <span>3. WallHaven: https://wallhaven.cc</span>
            <br />
          </Typography>
        </CardContent>
      </Card>
      <br />
      <Card>
        <CardContent>
          <Typography variant='h6' component='h3'>建议、意见与 Bug 反馈</Typography>
          <br />
          <Typography variant='caption' display='block' gutterBottom>
            希望可以与您共同打造极致体验的开源产品。
          </Typography>
          <br />
          <Typography variant='subtitle1' gutterBottom>
            感谢您能提出宝贵的建议、意见或者相关 Bug，可以在 GitHub issue 中进行说明，如果您不是 GitHub 用户，也可以发送邮件给我：tangdaohai@outlook.com
          </Typography>
        </CardContent>
      </Card>
    </Layout>
  )
}
