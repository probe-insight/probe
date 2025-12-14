import {BoxProps} from '@mui/material/Box'
import {Box} from '@mui/material'

export const AppTitle = ({sx, ...props}: Omit<BoxProps, 'children'>) => {
  return (
    <Box
      {...props}
      sx={{display: 'inline', fontWeight: 500, fontFamily: "'Open Sans', sans-serif", letterSpacing: '.02rem', ...sx}}
    >
      NexusPortal
    </Box>
  )
}
