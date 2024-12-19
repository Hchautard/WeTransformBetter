import React from 'react';
import { FormControl, Select, MenuItem, Typography, Slider } from '@mui/material';

const FilterControls = ({ filter, handleFilterChange, blurIntensity, setBlurIntensity }) => {
  return (
    <div>
      <FormControl sx={{ marginLeft: 2, minWidth: 120 }}>
        <Select
          labelId="filter-select-label"
          value={filter}
          onChange={handleFilterChange}
          displayEmpty
        >
          <MenuItem value="">None</MenuItem>
          <MenuItem value="grayscale">Grayscale</MenuItem>
          <MenuItem value="sepia">Sepia</MenuItem>
          <MenuItem value="invert">Invert</MenuItem>
          <MenuItem value="brightness">Brightness</MenuItem>
          <MenuItem value="contrast">Contrast</MenuItem>
          <MenuItem value="glitch">Glitch</MenuItem>
          <MenuItem value="blur">Blur</MenuItem>
        </Select>
      </FormControl>

      {filter === "blur" && (
        <div>
          <Typography>Blur Intensity</Typography>
          <Slider
            value={blurIntensity}
            onChange={(e, newValue) => setBlurIntensity(newValue)}
            step={1}
            min={0}
            max={20}
            valueLabelDisplay="auto"
          />
        </div>
      )}
    </div>
  );
};