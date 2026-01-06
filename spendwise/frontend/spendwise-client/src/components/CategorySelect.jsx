import {
  Stack,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';

const CategorySelect = ({
  categories,
  value,
  onChange,
  onAdd,
  onEdit,
  onArchive,
}) => {
  const selected = categories.find(c => c._id === value);

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={value || ''}
          label="Category"
          onChange={(e) => onChange(e.target.value)}
        >
          {categories.map(cat => (
            <MenuItem key={cat._id} value={cat._id}>
              {cat.name}
            </MenuItem>
          ))}

          <MenuItem value=''>
          <em>All Categories</em>
          </MenuItem>
        </Select>
      </FormControl>

      <Tooltip title="Add Category">
        <IconButton size="small" onClick={onAdd}>
          <AddIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title="Edit Category">
        <span>
          <IconButton
            size="small"
            disabled={!selected}
            onClick={() => onEdit(selected)}
          >
            <EditIcon />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title="Archive Category">
        <span>
          <IconButton
            size="small"
            disabled={!selected}
            color="warning"
            onClick={() => onArchive(selected._id)}
          >
            <ArchiveIcon />
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
};

export default CategorySelect;