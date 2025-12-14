import style from './Footer.module.css'
import {appConf} from '@/app/conf'
import OpenInNew from '@mui/icons-material/OpenInNew'
import {AppTitle} from '@infoportal/client-core/server'

export const Footer = () => {
  return (
    <div className={style.root}>
      © 2025 <AppTitle />
      <Separator />
      All rights reserved
      <Separator />
      <a className={style.link} href={appConf.repoUrl}>
        GitHub&nbsp;
        <OpenInNew sx={{fontSize: 'inherit'}} />
      </a>
    </div>
  )
}

const Separator = () => {
  return <>&nbsp;&nbsp;•&nbsp;&nbsp;</>
}
