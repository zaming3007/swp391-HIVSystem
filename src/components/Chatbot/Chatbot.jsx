import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    IconButton,
    Fab,
    Chip,
    Fade,
    Zoom,
    Avatar,
    Divider
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import ChatIcon from '@mui/icons-material/Chat';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import ChatbotData from './ChatbotData';

const Chatbot = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(true);
    const messagesEndRef = useRef(null);

    // Hiển thị tin nhắn chào mừng khi mở chatbot
    useEffect(() => {
        if (open && messages.length === 0) {
            // Thêm tin nhắn chào mừng với delay để tạo hiệu ứng đang gõ
            setTimeout(() => {
                const randomGreeting = ChatbotData.greetingResponses[
                    Math.floor(Math.random() * ChatbotData.greetingResponses.length)
                ];
                setMessages([
                    {
                        text: randomGreeting,
                        sender: 'bot',
                        timestamp: new Date()
                    }
                ]);
            }, 500);
        }
    }, [open, messages.length]);

    // Cuộn xuống tin nhắn mới nhất
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Xử lý khi người dùng gửi tin nhắn
    const handleSendMessage = () => {
        if (input.trim() === '') return;

        // Thêm tin nhắn của người dùng vào danh sách
        const userMessage = {
            text: input,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setShowSuggestions(false);

        // Xử lý phản hồi từ bot
        setTimeout(() => {
            const botResponse = generateBotResponse(input.toLowerCase());
            setMessages(prev => [...prev, {
                text: botResponse,
                sender: 'bot',
                timestamp: new Date()
            }]);
        }, 500); // Delay để tạo hiệu ứng bot đang gõ
    };

    // Tạo phản hồi từ bot dựa trên tin nhắn của người dùng
    const generateBotResponse = (message) => {
        // Kiểm tra nếu là lời chào
        for (const greeting of ChatbotData.greetings) {
            if (message.includes(greeting.toLowerCase())) {
                return ChatbotData.greetingResponses[
                    Math.floor(Math.random() * ChatbotData.greetingResponses.length)
                ];
            }
        }

        // Tìm câu trả lời phù hợp từ FAQs
        for (const faq of ChatbotData.faqs) {
            for (const keyword of faq.keywords) {
                if (message.includes(keyword.toLowerCase())) {
                    return faq.response;
                }
            }
        }

        // Trả về câu trả lời mặc định nếu không tìm thấy kết quả phù hợp
        return ChatbotData.fallbackResponses[
            Math.floor(Math.random() * ChatbotData.fallbackResponses.length)
        ];
    };

    // Xử lý khi người dùng nhấn phím Enter
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    // Xử lý khi người dùng chọn chủ đề gợi ý
    const handleSuggestionClick = (suggestion) => {
        setInput(suggestion);
        handleSendMessage();
    };

    // Format thời gian
    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <>
            {/* Nút mở chatbot */}
            <Zoom in={!open}>
                <Fab
                    color="primary"
                    aria-label="chat"
                    onClick={() => setOpen(true)}
                    sx={{
                        position: 'fixed',
                        bottom: 20,
                        right: 20,
                        zIndex: 1000
                    }}
                >
                    <ChatIcon />
                </Fab>
            </Zoom>

            {/* Cửa sổ chatbot */}
            <Fade in={open}>
                <Paper
                    elevation={3}
                    sx={{
                        position: 'fixed',
                        bottom: 20,
                        right: 20,
                        width: { xs: '90%', sm: 350 },
                        height: 450,
                        display: 'flex',
                        flexDirection: 'column',
                        zIndex: 1000,
                        overflow: 'hidden'
                    }}
                >
                    {/* Header của chatbot */}
                    <Box
                        sx={{
                            p: 2,
                            bgcolor: 'primary.main',
                            color: 'white',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <SmartToyIcon sx={{ mr: 1 }} />
                            <Typography variant="h6">Trợ lý HIV/AIDS</Typography>
                        </Box>
                        <IconButton
                            color="inherit"
                            onClick={() => setOpen(false)}
                            size="small"
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Khu vực hiển thị tin nhắn */}
                    <Box
                        sx={{
                            p: 2,
                            flexGrow: 1,
                            overflow: 'auto',
                            bgcolor: '#f5f5f5'
                        }}
                    >
                        {messages.map((msg, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                                    mb: 2
                                }}
                            >
                                {/* Avatar */}
                                <Avatar
                                    sx={{
                                        bgcolor: msg.sender === 'user' ? 'secondary.main' : 'primary.main',
                                        width: 32,
                                        height: 32,
                                        mr: msg.sender === 'user' ? 0 : 1,
                                        ml: msg.sender === 'user' ? 1 : 0
                                    }}
                                >
                                    {msg.sender === 'user' ? <PersonIcon /> : <SmartToyIcon />}
                                </Avatar>

                                {/* Tin nhắn */}
                                <Paper
                                    elevation={1}
                                    sx={{
                                        p: 1.5,
                                        maxWidth: '70%',
                                        borderRadius: 2,
                                        bgcolor: msg.sender === 'user' ? 'secondary.light' : 'white',
                                        color: msg.sender === 'user' ? 'white' : 'text.primary'
                                    }}
                                >
                                    <Typography variant="body2">{msg.text}</Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            display: 'block',
                                            textAlign: msg.sender === 'user' ? 'left' : 'right',
                                            mt: 0.5,
                                            opacity: 0.7
                                        }}
                                    >
                                        {formatTime(msg.timestamp)}
                                    </Typography>
                                </Paper>
                            </Box>
                        ))}

                        {/* Hiển thị các chủ đề gợi ý nếu chưa có tin nhắn nào */}
                        {messages.length === 1 && showSuggestions && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2" sx={{ mb: 1, opacity: 0.7 }}>
                                    Bạn có thể hỏi về:
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {ChatbotData.suggestedTopics.map((topic, index) => (
                                        <Chip
                                            key={index}
                                            label={topic}
                                            onClick={() => handleSuggestionClick(topic)}
                                            color="primary"
                                            variant="outlined"
                                            size="small"
                                            sx={{ mb: 1 }}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        )}
                        <div ref={messagesEndRef} />
                    </Box>

                    <Divider />

                    {/* Khu vực nhập tin nhắn */}
                    <Box
                        sx={{
                            p: 1,
                            display: 'flex',
                            alignItems: 'center',
                            bgcolor: 'background.paper'
                        }}
                    >
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Nhập câu hỏi của bạn..."
                            variant="outlined"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            sx={{ mr: 1 }}
                        />
                        <IconButton
                            color="primary"
                            onClick={handleSendMessage}
                            disabled={input.trim() === ''}
                        >
                            <SendIcon />
                        </IconButton>
                    </Box>
                </Paper>
            </Fade>
        </>
    );
};

export default Chatbot; 