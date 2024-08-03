import React from 'react';
import { Container, Grid, Typography,Box } from '@mui/material';
import hdan1 from "../../assets/images/hdan1.png"
import hdan2 from "../../assets/images/hdan2.png"
import hdan3 from "../../assets/images/hdan3.png"
import hdan4 from "../../assets/images/hdan4.png"

const steps = [
  {
    image: hdan1,
    title: 'Đặt xe trên website MiMotor',
  },
  {
    image: hdan2,
    title: 'Nhận xe',
  },
  {
    image: hdan3,
    title: 'Bắt đầu hành trình',
  },
  {
    image: hdan4,
    title: 'Trả xe & kết thúc chuyến đi',
  },
];

const CarRentalSteps = () => {
  return (
    <div className='py-20 '>
    <Container>
      <div  className='text-center text-5xl font-extrabold max-w-2xl mx-auto mb-3'>
        Hướng Dẫn Thuê Xe
      </div>
      <h5  className='text-xl mb-10 text-center mx-auto max-w-2xl'>
        Chỉ với 4 bước đơn giản để trải nghiệm thuê xe MiMotor một cách nhanh chóng
      </h5>
      <Grid container spacing={4}>
        {steps.map((step, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
              <img src={step.image} alt={step.title} style={{justifyContent:'center', width: '300px', height: '200px', marginBottom: '28px' }} />
              <h5 className='font-manrope text-2xl font-bold my-2 ml-5'>
                {step.title}
              </h5>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
    </div>
  );
};

export default CarRentalSteps;
