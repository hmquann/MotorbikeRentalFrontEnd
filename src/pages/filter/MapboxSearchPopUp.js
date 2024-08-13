import React, { useState, useEffect } from 'react';
import { Box, Typography, Input, List, ListItem, Modal, InputAdornment, IconButton,Button } from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import{faLocationDot} from "@fortawesome/free-solid-svg-icons";
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.75C8.31 2.75 5.3 5.76 5.3 9.45C5.3 14.03 11.3 20.77 11.55 21.05C11.79 21.32 12.21 21.32 12.45 21.05C12.71 20.77 18.7 14.03 18.7 9.45C18.7 5.76 15.69 2.75 12 2.75Z" stroke="#767676" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
              <path d="M12.3849 11.7852C13.6776 11.5795 14.5587 10.3647 14.3529 9.07204C14.1472 7.77936 12.9325 6.89824 11.6398 7.104C10.3471 7.30976 9.46597 8.52449 9.67173 9.81717C9.87749 11.1099 11.0922 11.991 12.3849 11.7852Z" stroke="#767676" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                </path></svg><Typography variant="body2" component="span" sx={{ fontSize: '0.875rem', marginLeft: '8px' }}>
                   {result.place_name}
                   </Typography>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>Không tìm thấy kết quả phù hợp</Typography>
        )}
         <Button
        variant="outlined"
        color="secondary"
        onClick={onClose}
        sx={{ mt: 2 }}
        fullWidth
      >
        Đóng
      </Button>
      </Box>
    </Modal>
  );
}
