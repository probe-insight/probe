import style from '@/shared/Comparison/Comparison.module.css'
import {Box, useTheme} from '@mui/material'

const ItemCard = ({item}: {item: {icon: any; title: string; problem: string; solution: string}}) => {
  const t = useTheme()
  return (
    <Box
      sx={{
        display: 'flex',
        p: 1,
        borderRadius: t.vars.shape.borderRadius,
        flexDirection: 'column',
        background: t.vars.palette.background.paper,
      }}
    >
      <Box sx={{background: t.vars.palette.background.default}}>
        <item.icon />
      </Box>
      <div>
        <h4 className={style.item_title}>{item.title}</h4>
        <div className={style.item_problem}>{item.problem}</div>
      </div>
      <div className={style.item_solution}>{item.solution}</div>
    </Box>
  )
}
