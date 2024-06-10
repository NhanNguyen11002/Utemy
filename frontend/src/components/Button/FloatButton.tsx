import React, { useEffect, useRef, useState } from "react";
import Fab from "@mui/material/Fab";
import Button from "@mui/material/Button";
import ChatBubbleBottomCenterTextIcon from "@heroicons/react/24/outline/ChatBubbleBottomCenterTextIcon";
// import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { styled } from "@mui/system";
import { useAppDispatch } from "../../hooks/hooks";
import { boxChatActions } from "../../redux/slices";
const UserMessageCard = styled(Card)({
    backgroundColor: "#2196f3",
    color: "#ffffff",
    padding: "10px",
    marginBottom: "10px",
    marginLeft: "50px",
});
const ResponseMessageCard = styled(Card)({
    backgroundColor: "#33CC00",
    color: "#ffffff",
    padding: "10px",
    marginBottom: "10px",
    marginRight: "50px",
});
const FloatButton = () => {
    const dispatch = useAppDispatch();
    interface Message {
        text: string;
        sender: string;
    }
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const messageEndRef = useRef<HTMLDivElement>(null); // Sử dụng useRef với kiểu dữ liệu tường minh

    if (messageEndRef.current) {
        setTimeout(() => {
            if(messageEndRef.current)
                messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }, 100); // Đợi 100ms trước khi cuộn
      }
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        const storedMessages = localStorage.getItem('messages');
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
        const lastMessage = messages[messages.length - 1];
        console.log(lastMessage);
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
    }, [messages, dispatch]);
    const handleSendMessage = () => {
        if (inputText.trim() !== "") {
            // Thêm tin nhắn từ người dùng vào danh sách tin nhắn
            addMessage(inputText, "user");
            setInputText("");
        }
    };
    return (
        <>
            <Fab
                color="primary"
                aria-label="add"
                style={{ position: "fixed", bottom: 20, right: 20 }}
                onClick={handleOpen}
            >
                <ChatBubbleBottomCenterTextIcon />
            </Fab>
            {open && (
                <Card
                    style={{
                        position: "fixed",
                        bottom: 20,
                        right: 20,
                        maxWidth: "400px",
                        width: "90%",
                        zIndex: 9999,
                        backgroundColor: "#99FFFF",
                        border: "1px solid #64b5f6",
                    }}
                >
                    <CardContent>
                        <Typography variant="h5" component="h2" style={{}}>
                            Chat
                        </Typography>
                        <List
                            style={{
                                height: "300px",
                                overflowY: "scroll",
                                border: "1px solid #64b5f6",
                                backgroundColor: "#ffffff",
                            }}
                        >
                            {messages.map((message, index) =>
                                message.sender === "user" ? (
                                    <UserMessageCard key={index}>
                                        <Typography>{message.text}</Typography>
                                    </UserMessageCard>
                                ) : (
                                    <ResponseMessageCard key={index}>
                                        <Typography>{message.text}</Typography>
                                    </ResponseMessageCard>
                                ),
                            )}
                            <div ref={messageEndRef} />
                        </List>
                        {/* <div ref={messageEndRef} /> */}
                        {/* Thêm trường nhập văn bản và nút gửi tin nhắn */}
                        <TextField
                            label="Type your message"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            style={{ backgroundColor: "#ffffff" }}
                        />
                        <Button
                            style={{ marginLeft: "300px", backgroundColor: "#ffffff" }} 
                            onClick={handleSendMessage}
                            color="primary"
                        >
                            Send
                        </Button>
                    </CardContent>
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
