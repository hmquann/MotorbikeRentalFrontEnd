import React, { useState } from "react";
import { IconButton } from "@mui/material";
import { Popover } from "@mui/material";
import { Card } from "@mui/material";
import { CardContent } from "@mui/material";
import { Typography } from "@mui/material";
import { Divider } from "@mui/material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import { styled } from "@mui/system";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const NotificationButton = styled(IconButton)({
  color: "rgb(34 197 94)", // Màu xanh lá cây
  marginRight: "8px", // hoặc theme.spacing(2) nếu bạn đang sử dụng chủ đề Material-UI
});

const PopoverContent = styled("div")({
  width: "400px",
  maxHeight: "300px", // Giới hạn chiều cao của popover
  overflowY: "auto", // Hiển thị thanh cuộn khi nội dung vượt quá chiều cao
  padding: "16px", // hoặc theme.spacing(2)
});

const NotificationCard = styled(Card)({
  marginBottom: "8px", // hoặc theme.spacing(1)
});

const notifications = [
  {
    title: "Thông báo",
    message: "Yêu cầu đăng kí xe 32323 bị từ chối phê duyệt.",
    time: dayjs().subtract(2, "month"),
  },
  {
    title: "Hủy đặt xe - Quá hạn đặt cọc",
    message:
      "Yêu cầu thuê xe, chủ xe Quýt, xe SUZUKI XL7 2020, T3 21:00 21/05/2024 - T4 20:00 22/05/2024 đã bị hủy vì quá hạn đặt cọc.",
    time: dayjs().subtract(2, "month"),
  },
  {
    title: "Thông báo",
    message: "Cập nhật GPLX thất bại. Bấm để xem chi tiết",
    time: dayjs().subtract(2, "month"),
  },
  {
    title: "Thông báo",
    message: "Yêu cầu đăng kí xe đã được gửi.",
    time: dayjs().subtract(2, "month"),
  },
  {
    title: "Welcome to Mioto",
    message:
      "Chào mừng bạn tham gia cộng đồng Mioto, bấm vào đây để xem những kinh nghiệm thuê xe hữu ích.",
    time: dayjs().subtract(2, "month"),
  },
];

const NotificationDropdown = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;

  return (
    <div>
      <NotificationButton aria-describedby={id} onClick={handleClick}>
        <NotificationsIcon />
      </NotificationButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <PopoverContent>
          {notifications.map((notification, index) => (
            <NotificationCard key={index}>
              <CardContent>
                <Typography variant="h6">{notification.title}</Typography>
                <Typography variant="body2">{notification.message}</Typography>
                <Typography color="textSecondary" variant="caption">
                  {notification.time.fromNow()}
                </Typography>
              </CardContent>
              {index < notifications.length - 1 && <Divider />}
            </NotificationCard>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default NotificationDropdown;
