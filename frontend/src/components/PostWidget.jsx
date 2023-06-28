import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  InputBase,
  Button,
} from "@mui/material";
import FlexBetween from "tools/FlexBetween";
import Friend from "tools/Friend";
import WidgetWrapper from "tools/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setPost } from "state";
import UserImage from "tools/UserImage";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const loggedInUserName = useSelector((state) => state.user.firstName);
  const loggedInUserPicture = useSelector((state) => state.user.picturePath);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const [comment, setComment] = useState("");

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(`http://localhost:5000/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const handleComment = async () => {
    const response = await fetch(
      `http://localhost:5000/posts/${postId}/comment`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: loggedInUserId,
          userpic: loggedInUserPicture,
          username: loggedInUserName,
          comment: comment,
        }),
      }
    );
    const updatedPost = await response.json();
    setComment("");
    dispatch(setPost({ post: updatedPost }));
  };

  return (
    <WidgetWrapper m="2rem 0">
       <div sx={{ margin: "-8px 0 16px 0" }}>
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} 
      sx={{ mt: "1rem"
      }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={picturePath}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              width: '100%',
              padding: '0.1rem',
            }}
          >
            <InputBase
              placeholder="  Write a comment..."
              onChange={(e) => setComment(e.target.value)}
              value={comment}
              sx={{
                flex: 1,
                backgroundColor: palette.neutral.light,
                borderRadius: '1rem',
              }}
            />
            <Button
              disabled={!comment}
              onClick={handleComment}
              sx={{
                // color: palette.background.alt,
                color:"black",
                backgroundColor: palette.primary.main,
                borderRadius: '0.75rem',
                fontSize: '0.5rem',
                "&:hover": {
                  backgroundColor: "primary.dark", 
                },
              }}
            >
              COMMENT
            </Button>
          </Box>
          {comments.map((item, i) => (
            <Box key={`${name}-${i}`} sx={{ mt: '0.5rem' }}>
              <Divider />
              <Box sx={{ display: 'flex', alignItems: 'center', mt: '0.5rem' }}>
                <UserImage image={item.userpic} size="30px" />
                <Typography
                  sx={{
                    color: palette.secondary.main,
                    ml: '1rem',
                    fontWeight: 'bold', 
                    '&:hover': {
                      color: palette.primary.light,
                      cursor: 'pointer',
                    },
                  }}
                  onClick={() => {
                    navigate(`/profile/${item.userId}`);
                    navigate(0);
                  }}
                >
                  {item.username}
                </Typography>
                <Typography sx={{ color: main, ml: '0.5rem' }}>
                  {item.comment}
                </Typography>
              </Box>
            </Box>
          ))}
          <Divider sx={{ mt: '0.2rem' }} />
        </Box>
      )}
       </div>
    </WidgetWrapper>
  );
};

export default PostWidget;
