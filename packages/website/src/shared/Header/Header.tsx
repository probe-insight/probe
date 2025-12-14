import Image from 'next/image'
import style from './Header.module.css'
import {Button} from '@mui/material'
import {m} from '@/i18n'
import {MenuItem} from '@/shared/Header/MenuItem'
import Link from 'next/link'
import {AppTitle} from '@infoportal/client-core/server'

export const Header = () => {
  return (
    <header className={style.root}>
      <Link href="/" className={style.rootLink}>
        <Image src="/app-logo.svg" alt={m.logoAlt} height={34} width={34} />
        <AppTitle sx={{ml: 0.25, fontSize: '1.5em'}} />
      </Link>
      <nav className={style.nav}>
        <MenuItem href="/blog">{m.blog}</MenuItem>
        <Button size="small" variant="contained">
          &nbsp;&nbsp;{m.cta}&nbsp;&nbsp;
        </Button>
      </nav>
    </header>
  )
}
