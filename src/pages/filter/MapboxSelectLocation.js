import React, { useState, useEffect } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import { Box, Typography, Input, List, ListItem, Modal, InputAdornment, IconButton, Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot,faCalendarDays} from '@fortawesome/free-solid-svg-icons';
import { Clear as ClearIcon } from '@mui/icons-material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
const removeNumberWithFiveDigits = (str) => {
    const regex = /(?:,\s*\d{5}|\b\d{5}\b,?)/g;
    const resultWithNumbersRemoved = str.replace(regex, '');
    return resultWithNumbersRemoved.replace(/^,\s*/, '').replace(/,\s*$/, '');
  };
export default function MapboxSelectLocation({ open, onClose, onSelect }) {
    const[error,setError]=useState("")
    const [searchQuery, setSearchQuery] = useState('');
    const [listResults, setListResults] = useState([]);
    const [newPlace, setNewPlace] = useState(null);
    const [selectedResult, setSelectedResult] = useState(null);
    const access_token = 'pk.eyJ1Ijoibmd1eWVua2llbjAyIiwiYSI6ImNseDNpem83bjByM3cyaXF4NTZqOWFhZWIifQ.pVT0I74tSdI290kImTlphQ';
    const [viewport, setViewport] = useState({
      latitude: 21.028511,
      longitude: 105.804817,
      zoom: 12,
    });
    useEffect(() => {
      if (searchQuery.length > 0) {
        const searchLocation = async () => {
          try {
            const response = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${access_token}&autocomplete=true&language=vi&country=VN`
            );
            const data = await response.json();
            if (data.features && Array.isArray(data.features)) {
              const modifiedFeatures = data.features.map((feature) => ({
                ...feature,
                place_name: removeNumberWithFiveDigits(feature.place_name),
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
        setListResults([]);
      }
    }, [searchQuery]);
  
    const handleSearchQuery = (e) => {
      setSearchQuery(e.target.value);
    };
  
    const handleSelectResult = (result) => {
      setSearchQuery(result.place_name); // Cập nhật thanh tìm kiếm với giá trị được chọn
      setSelectedResult(result);
      setViewport({
        latitude: result.center[1],
        longitude: result.center[0],
        zoom: 14,
      });
      setListResults([]); // Đóng danh sách kết quả tìm kiếm
    };
  
    const handleClearSearch = () => {
      setSearchQuery('');
      setListResults([]); // Đặt danh sách kết quả tìm kiếm thành rỗng
    };
  
    const handleClick = (e) => {
      const [longitude, latitude] = e.lngLat;
      setNewPlace({
        long: longitude,
        lat: latitude,
      });
    };
  
    const handleSubmit = () => {
      if (!newPlace) {
        setError("Vui lòng chọn vị trí bạn muốn nhận xe trên bản đồ")
      } else {
        setError("")
        onSelect({
          long: newPlace.long,
          lat: newPlace.lat,
          place_name: selectedResult ? selectedResult.place_name : 'Unknown',
        });
          onClose();
      }
      
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
            {listResults.map((result) => (
              <ListItem
                key={result.id}
                onClick={() => handleSelectResult(result)}
                sx={{
                  cursor: 'pointer',
                  backgroundColor: selectedResult && selectedResult.id === result.id ? '#ddd' : 'transparent',
                }}
              >
                {result.place_name}
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography></Typography>
        )}
        <Box sx={{ width: '100%', height: '300px', mt: 2 }}>
          <ReactMapGL
            {...viewport}
            width="100%"
            height="100%"
            mapStyle="mapbox://styles/mapbox/streets-v11"
            mapboxApiAccessToken={access_token}
            onClick={handleClick}
            onViewportChange={(nextViewport) => setViewport(nextViewport)}
          >
            {newPlace && (
              <Marker latitude={newPlace.lat} longitude={newPlace.long}>
                <div style={{ position: 'relative', width: '24px', height: '24px' }}>
                  <FontAwesomeIcon icon={faLocationDot} style={{ color: "#e62214", fontSize: '24px' }} />
                </div>
              </Marker>
            )}
          </ReactMapGL>
        </Box>
        <Typography sx={{ color: 'red' }}>{error}</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ mt: 2 }}
          fullWidth
        >
          Xác nhận
        </Button>
      </Box>
    </Modal>
  );
}
