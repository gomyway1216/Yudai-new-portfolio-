import React from 'react';
import { FormControl, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import PropTypes from 'prop-types';

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

const CategorySelector = ({ categoryList, selectedCategories, onCategoryChange }) => {
  return (
    <FormControl sx={{ m: 1, width: 300 }}>
      <InputLabel id="category-multiple-name-label">Category</InputLabel>
      <Select
        labelId="category-multiple-name-label"
        id="category-multiple-name"
        multiple
        value={selectedCategories}
        onChange={onCategoryChange}
        input={<OutlinedInput label="Category" />}
        MenuProps={MenuProps}
      >
        {categoryList.map((category) => (
          <MenuItem key={category} value={category}>
            {category}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

CategorySelector.propTypes = {
  categoryList: PropTypes.array.isRequired,
  selectedCategories: PropTypes.array.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
};

export default CategorySelector;
