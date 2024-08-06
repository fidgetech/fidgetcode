import { useState } from 'react';
import { Button, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export const CopyButton = ({ text, buttonText='Copy' }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setTooltipOpen(true);
      setTimeout(() => setTooltipOpen(false), 2000); // Hide tooltip after 2 seconds
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <Tooltip title="Copied!"
      open={tooltipOpen}
      disableFocusListener
      disableHoverListener
      disableTouchListener
      onClose={() => setTooltipOpen(false)}
      leaveDelay={1500}
    >
      <Button
        variant="text"
        color="info"
        startIcon={<ContentCopyIcon />}
        onClick={handleCopy}
      >
        {buttonText}
      </Button>
    </Tooltip>
  );
};
