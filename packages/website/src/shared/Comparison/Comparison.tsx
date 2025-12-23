import style from './Comparison.module.css'
import {m} from '@/i18n'
import {SectionTitle} from '@/shared/SectionTitle/SectionTitle'
import {useTheme} from '@mui/material'
import Check from '@mui/icons-material/CheckCircle'
import clsx from 'clsx'

export const Comparison = () => {
  return (
    <section className={style.root}>
      <SectionTitle>{m.comparisonTitle}</SectionTitle>
      <div className={style.container}>
        <article className={style.item}>
          <div></div>
          <div className={clsx(style.col_head, style.colorError)}>{m.comparisonTitle}</div>
          <div className={clsx(style.col_head)}>{m.comparisonTitle}</div>
        </article>

        {Object.entries(m.comparison).map(([key, value]) => (
          <ItemTable item={value} key={key} />
        ))}
      </div>
    </section>
  )
}

const ItemTable = ({item}: {item: {icon: any; title: string; problem: string; solution: string}}) => {
  return (
    <article className={style.item}>
      <item.icon className={style.item_icon} />
      <div>
        <h4 className={style.item_title}>{item.title}</h4>
        <div className={style.item_problem}>{item.problem}</div>
      </div>
      <div className={style.item_solution}>{item.solution}</div>
    </article>
  )
}

const Item = ({item}: {item: {icon: any; title: string; problem: string; solution: string}}) => {
  return (
    <article className={style.item}>
      <div className={style.item_head}>
        <item.icon className={style.item_icon} />
        <h4 className={style.item_title}>
          <WordWrap text={item.title} />
        </h4>
      </div>
      <div>
        {/*<div className={style.item_problem_title}>Common challenge</div>*/}
        <div className={style.item_problem}>{item.problem}</div>
        <div className={style.item_solution_title}>
          <Check fontSize="inherit" />
          &nbsp;How InfoPortal helps
        </div>
        <div className={style.item_solution}>{item.solution}</div>
      </div>
    </article>
  )
}

const WordWrap = ({text}: {text: string}) => (
  <>
    {text.split(/\s+/).map((word, i) => (
      <div key={i}>{word}&nbsp;</div>
    ))}
  </>
)
