import React, { useState, useEffect } from 'react';
import { Box, Typography, Input, List, ListItem, Modal, InputAdornment, IconButton } from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';

const removeNumberWithFiveDigits = (str) => {
  const regex = /(?:,\s*\d{5}|\b\d{5}\b,?)/g;
  const resultWithNumbersRemoved = str.replace(regex, '');
  return resultWithNumbersRemoved.replace(/^,\s*/, '').replace(/,\s*$/, '');
};
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
export default function MapboxSearchPopUp({ open, onClose, onSelect }) {
  console.log("hello")
  const [searchQuery, setSearchQuery] = useState("");
  const [listResults, setListResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const access_token = "pk.eyJ1Ijoibmd1eWVua2llbjAyIiwiYSI6ImNseDNpem83bjByM3cyaXF4NTZqOWFhZWIifQ.pVT0I74tSdI290kImTlphQ";

  useEffect(() => {
    if (searchQuery.length > 0) {
      const searchLocation = async () => {
        try {
          const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${access_token}&autocomplete=true&language=vi&country=VN`);
          const data = await response.json();
          if (data.features && Array.isArray(data.features)) {
            const modifiedFeatures = data.features.map(feature => ({
              ...feature,
              place_name: removeNumberWithFiveDigits(feature.place_name)
            }));
            setListResults(modifiedFeatures);
          } else {
            setListResults([]);
          }
        } catch (error) {
          console.error('Error:', error);
          setListResults([]);
        }
      };
      searchLocation();
    } else {
      setListResults([]); // Xóa kết quả nếu không có từ khóa tìm kiếm
    }
  }, [searchQuery]);

  const handleSearchQuery = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectResult = (result) => {
    setSelectedResult(result);
    onSelect(result);
    onClose();
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Địa điểm
        </Typography>
        <Input
          name="search"
          onChange={handleSearchQuery}
          value={searchQuery}
          fullWidth
          placeholder="Nhập điểm đến của bạn"
          sx={{ my: 2 }}
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={handleClearSearch}>
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          }
        />
        {listResults.length > 0 ? (
          <List>
            {listResults.map(result => (
              <ListItem
                key={result.id}
                onClick={() => handleSelectResult(result)}
                sx={{
                  cursor: 'pointer',
                  backgroundColor: selectedResult && selectedResult.id === result.id ? '#ddd' : 'transparent'
                }}
              >
                {result.place_name}
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>Không tìm thấy kết quả phù hợp</Typography>
        )}
      </Box>
    </Modal>
  );
}
