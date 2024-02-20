import React, { useEffect, useState } from 'react';
import { Box, Chip, FormControl, InputLabel, MenuItem,
  OutlinedInput, Select, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import * as technologyApi from '../../api/firebase/technology';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, selectedTechnologies, theme) {
  return {
    fontWeight:
      selectedTechnologies.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const TechnologiesSelector = ({ selectedTechnologies, setSelectedTechnologies }) => {
  const theme = useTheme();
  const [technologiesList, setTechnologiesList] = useState([]);

  useEffect(() => {
    const fetchTechnologies = async () => {
      const technologies = await technologyApi.getTechnologyNames();
      setTechnologiesList(technologies);
    };
    fetchTechnologies();
  }, []);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedTechnologies(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <FormControl sx={{ m: 1, width: '100%' }}>
      <InputLabel id="multiple-chip-label">Technologies</InputLabel>
      <Select
        labelId="multiple-chip-label"
        id="multiple-chip"
        multiple
        value={selectedTechnologies}
        onChange={handleChange}
        input={<OutlinedInput id="select-multiple-chip" label="Technologies" />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {technologiesList.map((name) => (
          <MenuItem
            key={name}
            value={name}
            style={getStyles(name, selectedTechnologies, theme)}
          >
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

TechnologiesSelector.propTypes = {
  selectedTechnologies: PropTypes.array.isRequired,
  setSelectedTechnologies: PropTypes.func.isRequired,
};

export default TechnologiesSelector;
