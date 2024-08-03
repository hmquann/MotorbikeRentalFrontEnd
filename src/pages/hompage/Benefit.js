import React from 'react';
import { Grid, Container, Typography, Box } from '@mui/material';
import image1 from "../../assets/images/An tâm đặt xe.png"
import image2 from "../../assets/images/Giao xe tận nơi.png"
import image3 from "../../assets/images/Thủ tục đơn giản.png"


const Benefit = () => {
  const benefits = [
    {
      title: 'An tâm đặt xe',
      description: 'Không tính phí huỷ chuyến trong vòng 1h sau khi đặt cọc. Hoàn cọc và bồi thường 100% nếu chủ xe huỷ chuyến trong vòng 7 ngày trước chuyến đi.',
      image: image1,
    },
    {
      title: 'Thủ tục đơn giản',
      description: 'Chỉ cần có CCCD gắn chip (Hoặc Passport) & Giấy phép lái xe là bạn đã đủ điều kiện thuê xe trên MiMotor.',
      image: image3, 
    },
    {
      title: 'Giao xe tận nơi',
      description: 'Bạn có thể lựa chọn giao xe tận nhà. Phí tiết kiệm chỉ từ 10k/km.',
      image: image2,
    },
    // {
    //   title: 'Dòng xe đa dạng',
    //   description: 'Hơn 100 dòng xe cho bạn tuỳ ý lựa chọn: Wave, Honda SH, Honda Airblade, Liberty,...',
    //   image: image2
    // },
  ];

  return (
    <div className='py-20'>
    <Container className='font-manrope'>
      <h2 className='text-center mb-3 text-5xl font-extrabold'>
        Ưu Điểm Của MiMotor
      </h2>
      <h5 className='text-xl mb-10 text-center mx-auto max-w-2xl'>
        Những tính năng giúp bạn dễ dàng hơn khi thuê xe trên MiMotor.
      </h5>
      <Grid container spacing={10}>
        {benefits.map((benefit, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
              <img src={benefit.image} alt={benefit.title} style={{justifyContent:'center', width: '200px', height: '100px', marginBottom: '16px' }} />
              <div className='font-bold font-manrope text-xl my-2'>
                {benefit.title}
              </div>
              <div className='font-manrope text-sm'>
                {benefit.description}
              </div>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
    </div>
  );
};

export default Benefit;
