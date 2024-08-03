import React, { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import {
  IconButton,
  Popover,
  Card,
  CardContent,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { styled } from "@mui/system";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");

const NotificationButton = styled(IconButton)({
  color: "rgb(34 197 94)", // Green color
  marginRight: "8px", // or theme.spacing(2) if you're using Material-UI theme
});

const PopoverContent = styled("div")({
  width: "400px",
  maxHeight: "300px", // Limit the height of the popover
  overflowY: "auto", // Show scrollbar when content overflows
  padding: "16px", // or theme.spacing(2)
});

const NotificationCard = styled(Card)({
  marginBottom: "8px", // or theme.spacing(1)
});

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const userDataString = localStorage.getItem("user");
  const userData = JSON.parse(userDataString);
  const userId = userData ? userData.userId : null;

  useEffect(() => {
    if (!userId) return; // Ensure userId is available

    // Query notifications filtered by userId
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notificationsData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          message: JSON.parse(data.message), // Parse the message from JSON
          timestamp: data.timestamp.toDate(),
        };
      });

      // Sort notifications by timestamp (newest first)
      notificationsData.sort((a, b) => b.timestamp - a.timestamp);

      setNotifications(notificationsData);

      // Calculate unseen notifications
      const unseenCount = notificationsData.filter(
        (notification) => !notification.seen
      ).length;
      setNotificationCount(unseenCount);
      setLoading(false); // Set loading to false after data is loaded
    });
    console.log(notifications);
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [userId]);

  const handleClick = async (event) => {
    setAnchorEl(event.currentTarget);

    // Mark all notifications as seen when the bell is clicked
    notifications.forEach(async (notification) => {
      if (!notification.seen) {
        const notificationDocRef = doc(db, "notifications", notification.id);
        await updateDoc(notificationDocRef, { seen: true });
      }
    });

    setNotificationCount(0); // Reset the count after viewing
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
        {notificationCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {notificationCount}
          </span>
        )}
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
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress color="inherit" />
            </div>
          ) : !userId || notifications.length === 0 ? (
            <Typography variant="body2" color="textSecondary">
              Hiện chưa có thông báo
            </Typography>
          ) : (
            notifications.map((notification, index) => (
              <NotificationCard key={notification.id}>
                <CardContent>
                  <Typography
                    variant="h6"
                    dangerouslySetInnerHTML={{
                      __html: notification.message.title,
                    }}
                  />
                  <Typography
                    variant="body2"
                    dangerouslySetInnerHTML={{
                      __html: notification.message.content,
                    }}
                  />
                  <Typography color="textSecondary" variant="caption">
                    {dayjs(notification.timestamp).fromNow()}
                  </Typography>
                </CardContent>
                {index < notifications.length - 1 && <Divider />}
              </NotificationCard>
            ))
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default NotificationDropdown;
