export const menuSlotProps = {
   paper: {
      elevation: 0,
      sx: {
         filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
         mt: 1.5,
         overflow: 'visible',
         '& .MuiAvatar-root': {
            height: 32,
            ml: -0.5,
            mr: 1,
            width: 32,
         },
         '&:before': {
            bgcolor: 'background.paper',
            content: '""',
            display: 'block',
            height: 10,
            position: 'absolute',
            right: 14,
            top: 0,
            transform: 'translateY(-50%) rotate(45deg)',
            width: 10,
            zIndex: 0,
         },
      },
   },
}