import React from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  CardContent,
  CardMedia,
} from "@mui/material";
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import forRental from "../../assets/images/forRental.jpg"
import { useNavigate } from "react-router-dom";

const MotorRentalAd = () => {
  const navigate = useNavigate()
  const handleRegister = () =>{
    navigate('/registermotorbike')
  }
  return (
    <Box
      sx={{
        backgroundColor: "#effaf3",
        borderRadius: 2,
        padding: { xs: 2, sm: 4, md: 8 },
        maxWidth: "90%",
        mx: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
        mt: { xs: 2, sm: 4, md: 6 },
        fontFamily: '"Manrope", sans-serif',
      }}
    >
      <Grid container spacing={4} alignItems="center" >
        <Grid item xs={12} md={6} sx={{ fontFamily: '"Manrope", sans-serif'}}>
          <CardContent>
            <TwoWheelerIcon sx={{ fontSize: { xs: 30, md: 40 }, color: "#64b5f6" }} />
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontFamily: '"Manrope", sans-serif' }}>
              Bạn muốn cho thuê xe?
            </Typography>
            <Typography variant="body1" gutterBottom sx={{ fontFamily: '"Manrope", sans-serif' }}>
              Hơn 5,000 chủ xe đang cho thuê hiệu quả trên MiMotor. Đăng ký trở
              thành đối tác của chúng tôi ngay hôm nay để gia tăng thu nhập hàng
              tháng.
            </Typography>
            <Box mt={4} display="flex" justifyContent={{ xs: "center", md: "flex-start" }} gap={2}>
              <Button variant="contained" color="success" onClick={handleRegister} sx={{ fontFamily: '"Manrope", sans-serif' }}>
                Đăng ký xe
              </Button>
            </Box>
          </CardContent>
        </Grid>
        <Grid item xs={12} md={6}>
          <CardMedia
            component="img"
            image={forRental}
            alt="Driving Image"
            sx={{
              borderRadius: 6,
              width: { xs: '100%', md: 600 },
              height: { xs: 'auto', md: 300 },
              maxHeight: { xs: 300, md: '100%' },
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default MotorRentalAd;
