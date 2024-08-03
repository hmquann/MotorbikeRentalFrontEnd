import React from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import forRental from "../../assets/images/forRental.jpg"

const MotorRentalAd = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#effaf3",
        borderRadius: 2,
        padding: 16,
        maxWidth: "80%",
        mx: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom : 10
      }}
    >
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <CardContent>
            <DirectionsCarIcon sx={{ fontSize: 40, color: "#64b5f6" }} />
            <Typography variant="h4" component="h1" gutterBottom>
              Bạn muốn cho thuê xe?
            </Typography>
            <Typography variant="body1" gutterBottom>
              Hơn 5,000 chủ xe đang cho thuê hiệu quả trên Mioto. Đăng ký trở
              thành đối tác của chúng tôi ngay hôm nay để gia tăng thu nhập hàng
              tháng.
            </Typography>
            <Box mt={4} display="flex" justifyContent="center" gap={2}>
            <Button variant="contained" color="primary">
                Đăng ký xe
              </Button>
              <Button variant="contained" color="success">
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
            sx={{ borderRadius: 6, width :600, height: 300 }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default MotorRentalAd;
