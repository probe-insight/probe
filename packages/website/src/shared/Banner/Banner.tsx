import style from './Banner.module.css'
import {m} from '@/i18n'
import {Box, Button} from '@mui/material'
import {AnimatedText} from '@/shared/AnimatedText'
import {Pulse} from '@/shared/Pulse'
import {AppTitle} from '@infoportal/client-core/server'
import ArrowRight from '@mui/icons-material/ArrowForward'
import Rocket from '@mui/icons-material/RocketLaunch'

export const Banner = () => {
  return (
    <section className={style.root}>
      <div className={style.imageContainer}>
        {/*<Image*/}
        {/*  src={'/ss1.png'}*/}
        {/*  alt=""*/}
        {/*  width={800}*/}
        {/*  height={600}*/}
        {/*  style={{width: '100%', height: 'auto'}}*/}
        {/*  className={style.image}*/}
        {/*/>*/}
        <div className={style.content}>
          <div>
            <AppTitle sx={{fontSize: '4.5rem', color: '#cdfffe'}} />
            <div className={style.desc}>{m.desc}</div>

            <div className={style.keys}>
              <div className={style.key}>{m.key1}</div>
              <ArrowRight className={style.arrow} />
              <div className={style.key}>{m.key2}</div>
              <ArrowRight className={style.arrow} />
              <div className={style.key}>{m.key3}</div>
            </div>
            <Pulse>
              <Button
                variant="contained"
                size="large"
                // endIcon={<Rocket/>}
              >
                {m.cta}
              </Button>
            </Pulse>
          </div>
        </div>
      </div>
    </section>
  )
}
