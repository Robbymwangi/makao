import React, { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
} from "@chakra-ui/react";

const Messages = () => {
  const [messages, setMessages] = useState([
    { id: 1, user: "Jane Doe", text: "Hello, how can I help you today?" },
    { id: 2, user: "John Smith", text: "I need assistance with my project." },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        { id: messages.length + 1, user: "You", text: newMessage },
      ]);
      setNewMessage("");
    }
  };

  return (
    <Box
     p={2}
    >
      <Text fontSize="xl" fontWeight="bold" mb={4} textAlign="left">
        Message Board
      </Text>
      <VStack
        spacing={4}
        align="stretch"
        maxH="80%"
        overflowY="auto"
      >
        {messages.map((message) => (
          <HStack key={message.id} spacing={4} align="start">
            <Box textAlign="left">
              <Text fontWeight="bold">{message.user}</Text>
              <Text color="gray.600">{message.text}</Text>
            </Box>
          </HStack>
        ))}
      </VStack>
      <HStack mt={4} spacing={4} align="start">
        <Input
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          flex="1"
        />
        <Button colorScheme="blue" onClick={handleSendMessage}>
          Send
        </Button>
      </HStack>
    </Box>
  );
};

export default Messages;