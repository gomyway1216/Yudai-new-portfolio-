import React, { useEffect, useState } from 'react';
import { Box, Chip, FormControl, InputLabel, MenuItem,
  OutlinedInput, Select, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import * as technologyApi from '../../api/firebase/technology';
import styles from './technologies-selector.module.scss';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

const TechnologiesSelector = ({ selectedTechnologies, setSelectedTechnologies }) => {
  const theme = useTheme();
  const [technologiesList, setTechnologiesList] = useState([]);

  useEffect(() => {
    const fetchTechnologies = async () => {
      const technologies = await technologyApi.getTechnologies();
      setTechnologiesList(technologies);
    };
    fetchTechnologies();
  }, []);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    setSelectedTechnologies(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <FormControl 
      className={styles.technologiesForm} 
    >
      <InputLabel id="multiple-chip-label">Technologies</InputLabel>
      <Select
        labelId="multiple-chip-label"
        id="multiple-chip"
        multiple
        value={selectedTechnologies}
        onChange={handleChange}
        input={<OutlinedInput id="select-multiple-chip" label="Technologies" />}
        renderValue={(selected) => (
          <Box >
            {selected.map((technology) => (
              <Chip key={technology.id} label={technology.name} />
            ))}
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {technologiesList.map((technology) => (
          <MenuItem
            key={technology.id}
            value={technology}
          >
            {technology.name}
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
