import React from 'react';
import { Box, Typography } from '@mui/material';

export default function NewPage() {
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h3" sx={{ marginBottom: 2 }}>
        Welcome to the New Page
      </Typography>
      <Typography variant="body1">
        This is where you can display the content for the new page.
      </Typography>
    </Box>
  );
}
