import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Link } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        color: 'text.secondary',
        bgcolor: 'background.paper',
        py: 3,
        px: 2,
        position: 'fixed',
        bottom: 0
      }}
    >
      <Box
        container
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          mx: 'auto'
        }}
      >
        <Typography
          variant="body2"
          component="p"
          sx={{
            mb: { xs: 2, md: 0 },
            fontSize: '0.875rem',
            textAlign: 'center',
            width: '100%'
          }}
        >
          © Copyright 2023 Chandan C, Robel Y, Aadit A
        </Typography>
        {/* <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: { md: 'auto' }
          }}
        >
          <Link component={RouterLink} to="/legal#terms" sx={{ mr: 2, fontSize: '0.875rem' }}>
            Terms
          </Link>
          <Link component={RouterLink} to="/legal#privacy" sx={{ fontSize: '0.875rem' }}>
            Privacy
          </Link>
        </Box> */}
      </Box>
    </Box>
  );
}