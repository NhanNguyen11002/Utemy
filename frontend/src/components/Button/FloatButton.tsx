import React, { useEffect, useRef, useState } from "react";
import Fab from "@mui/material/Fab";
import logoUtemy from "../../assets/images/utemy_chatbox.jpeg";
import ChatBubbleBottomCenterTextIcon from "@heroicons/react/24/outline/ChatBubbleBottomCenterTextIcon";
// import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import { XMarkIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
import { styled } from "@mui/system";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { boxChatActions } from "../../redux/slices";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

const UserMessageCard = styled(Card)({
    backgroundColor: "#0000FF",
    color: "#ffffff",
    padding: "20px",
    marginBottom: "10px",
    marginLeft: "70px",
    borderRadius: "20px",
    border: "1px solid #64b5f6",
    maxWidth: "300px",
    wordBreak: "break-word",
});
const ResponseMessageCard = styled(Card)({
    backgroundColor: "#DDDDDD",
    color: "#000000",
    padding: "20px",
    marginBottom: "10px",
    marginRight: "70px",
    borderRadius: "20px",
    border: "1px solid #64b5f6",
    maxWidth: "300px",
    wordBreak: "break-word",
});
const FloatButton = () => {
    const dispatch = useAppDispatch();
    interface Message {
        text: string;
        sender: string;
    }
    const user = useAppSelector((state) => state.authSlice.user);
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const messageEndRef = useRef<HTMLDivElement>(null); // Sử dụng useRef với kiểu dữ liệu tường minh

    if (messageEndRef.current) {
        setTimeout(() => {
            if (messageEndRef.current) messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }, 100); // Đợi 100ms trước khi cuộn
    }
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        const storedMessages = localStorage.getItem("messages");
        if (storedMessages) {
            // Nếu có, phục hồi lại danh sách tin nhắn từ dữ liệu lưu trữ
            setMessages(JSON.parse(storedMessages));
        }
        setOpen(false);
    };
    const addMessage = (text: string, sender: string) => {
        // Chỉ định kiểu dữ liệu của text và sender
        setMessages((prevMessages) => [...prevMessages, { text, sender }]);
    };
    const [inputText, setInputText] = useState("");
    useEffect(() => {
        const storedMessages = localStorage.getItem("messages");
        if (storedMessages) {
            setMessages(JSON.parse(storedMessages));
        }
    }, []);
    useEffect(() => {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.sender === "user") {
            // Gửi tin nhắn và xử lý phản hồi
            dispatch(boxChatActions.submitQuestion({ content: lastMessage.text })).then((response) => {
                if (response.payload && response.payload.status_code === 200) {
                    addMessage(response.payload.data.answer, "responser");
                } else {
                    // Xử lý lỗi và hiển thị thông báo nếu cần
                    if (response.payload) addMessage(response.payload.message, "responser");
                }
            });
        }
        localStorage.setItem("messages", JSON.stringify(messages));
    }, [messages, dispatch]);
    const handleSendMessage = () => {
        if (inputText.trim() !== "") {
            // Thêm tin nhắn từ người dùng vào danh sách tin nhắn
            addMessage(inputText, "user");
            setInputText("");
        }
    };
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSendMessage();
        }
    };
    // const handleLogout = () => {
    //     // Clear local storage
    //     localStorage.removeItem('messages');
    //     // Perform other logout operations here
    // };
    return (
        <>
            <Fab
                color="primary"
                aria-label="add"
                style={{ position: "fixed", bottom: 40, right: 40 }}
                onClick={handleOpen}
            >
                <ChatBubbleBottomCenterTextIcon className="w-8 h-8" />
            </Fab>
            {open && (
                <Card
                    style={{
                        position: "fixed",
                        bottom: 20,
                        right: 20,
                        maxWidth: "500px",
                        width: "100%",
                        zIndex: 9999,
                        backgroundColor: "#ffFFFF",
                        border: "3px solid #64b5f6",
                        borderRadius: "20px",
                    }}
                >
                    <Box sx={{ p: 2, backgroundColor: "#e3f2fd", borderRadius: "20px 20px 0 0" }}>
                        <Grid container alignItems="center" spacing={1}>
                            <Grid item>
                                <Avatar src={logoUtemy}></Avatar>
                            </Grid>
                            <Grid item>
                                <Typography
                                    variant="h5"
                                    component="h2"
                                    style={{ color: "#000000", fontSize: "20px", fontWeight: "bold" }}
                                >
                                    Trợ lí ảo UtemyVietNam
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box
                        sx={{
                            p: 2,
                            backgroundColor: "#ffffff",
                            height: "500px",
                            overflowY: "scroll",
                            border: "2px solid #64b5f6",
                            borderRadius: "0 0 0 0",
                        }}
                    >
                        <List>
                            {messages.map((message, index) =>
                                message.sender === "user" ? (
                                    <Grid
                                        container
                                        justifyContent="flex-end"
                                        alignItems="start"
                                        spacing={1}
                                        key={index}
                                    >
                                        <Grid item>
                                            <UserMessageCard>
                                                {/* Use Typography with whiteSpace set to pre-line */}
                                                <Typography whiteSpace="pre-line">{message.text}</Typography>
                                            </UserMessageCard>
                                        </Grid>
                                        <Grid item>
                                            <Avatar src={user.url_avatar}>
                                                {user.url_avatar ? "" : user.last_name.charAt(0)}
                                            </Avatar>
                                        </Grid>
                                    </Grid>
                                ) : (
                                    <Grid
                                        container
                                        justifyContent="flex-start"
                                        alignItems="start"
                                        spacing={1}
                                        key={index}
                                    >
                                        <Grid item>
                                            <Avatar src={logoUtemy}> </Avatar>
                                        </Grid>
                                        <Grid item>
                                            <ResponseMessageCard>
                                                {/* Use Typography with whiteSpace set to pre-line */}
                                                <Typography whiteSpace="pre-line">{message.text}</Typography>
                                            </ResponseMessageCard>
                                        </Grid>
                                    </Grid>
                                ),
                            )}
                            <div ref={messageEndRef} />
                        </List>
                    </Box>
                    <Box sx={{ p: 2, backgroundColor: "#e3f2fd", borderRadius: "0 0 20px 20px", position: "relative" }}>
                        <TextField
                            label="Type your message"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={handleKeyPress}
                            // fullWidth
                            variant="outlined"
                            margin="normal"
                            style={{ backgroundColor: "#ffffff", width: "90%" }}
                        />
                        <IconButton
                            onClick={handleSendMessage}
                            color="primary"
                            style={{
                                position: "absolute",
                                right: "10px",
                                top: "53%",
                                transform: "translateY(-50%)",
                                backgroundColor: "#e3f2fd",
                            }}
                        >
                            <PaperAirplaneIcon className="w-8 h-8 text-black-500 ml-1" />
                        </IconButton>
                    </Box>
                    <IconButton
                        onClick={handleClose}
                        style={{ position: "absolute", top: 5, right: 5 }}
                        aria-label="close"
                    >
                        <XMarkIcon className="w-7 h-7 text-black-500 ml-1 mb-1" />
                    </IconButton>
                </Card>
            )}
        </>
    );
};

export default FloatButton;
