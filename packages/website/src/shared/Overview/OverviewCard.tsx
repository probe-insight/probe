import style from './OverviewCard.module.css'
import Image from 'next/image'

export const OverviewCard = ({
  imageSrc,
  title,
  desc,
  mirror,
}: {
  mirror?: boolean
  title: string
  desc: string
  imageSrc: string
}) => {
  return (
    <div className={style.root} style={{flexDirection: mirror ? 'row-reverse' : undefined}}>
      <div className={style.imageContainer}>
        <div>
          <Image
            className={style.image}
            alt={title}
            src={imageSrc}
            width={400}
            height={500}
            style={{width: '100%', height: '330px'}}
          />
        </div>
      </div>
      <div className={style.content}>
        <div className={style.title}>{title}</div>
        <div className={style.desc}>{desc}</div>
      </div>
    </div>
  )
}
