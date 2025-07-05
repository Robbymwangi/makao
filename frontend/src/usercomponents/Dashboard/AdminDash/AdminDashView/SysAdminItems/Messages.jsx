import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Flex,
  useBreakpointValue,
  Heading,
  Portal,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { ArrowLeftIcon as StepBackIcon, SearchIcon, FlagIcon, X as CloseIcon } from "lucide-react";
import { Toaster, toaster } from "@/components/ui/toaster";

// --- Avatar logic (copied from user Messages.jsx) ---
const ChakraAvatar = ({ name, src, size = "md" }) => {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?";
  const boxSize = size === "md" ? "40px" : "32px";
  return (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      borderRadius="full"
      bg={src ? "transparent" : "gray.500"}
      color="white"
      fontWeight="medium"
      boxSize={boxSize}
      overflow="hidden"
    >
      {src ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => {
            const parent = e.target.parentNode;
            if (parent) {
              const fallback = parent.querySelector('.avatar-fallback-text');
              if (fallback) fallback.style.display = 'inline-flex';
            }
            e.target.style.display = 'none';
          }}
        />
      ) : null}
      <Box
        as="span"
        className="avatar-fallback-text"
        display={src ? 'none' : 'inline-flex'}
        alignItems="center"
        justifyContent="center"
        w="100%"
        h="100%"
      >
        {initials}
      </Box>
    </Box>
  );
};

const Avatar = {
  Root: ({ children }) => <Box position="relative" display="inline-block">{children}</Box>,
  Image: ({ src, name, ...props }) => (
    src ? <ChakraAvatar src={src} name={name} {...props} /> : null
  ),
  Fallback: ({ name, src, ...props }) => (
    !src && <ChakraAvatar name={name} {...props} />
  ),
};

// --- AppLayout, ChatList, MessageView (copied and adapted) ---
const AppLayout = React.memo(({ chatList, messageView, isMobileView, currentChatId }) => {
  if (isMobileView) {
    return (
      <Box flex="1" minH={0} overflow="hidden" display="flex" flexDirection="column" bg="white">
        {currentChatId ? messageView : chatList}
      </Box>
    );
  }
  return (
    <Flex flex="1" minH={0} p={4} gap={4}>
      <Box
        flex={{ base: "1", md: "1" }}
        minW={{ base: "100%", md: "300px" }}
        maxW={{ base: "100%", md: "400px" }}
        borderWidth="1px"
        borderRadius="lg"
        bg="white"
        shadow="sm"
        overflowY="auto"
        display="flex"
        flexDirection="column"
      >
        {chatList}
      </Box>
      <Box
        flex={{ base: "1", md: "3" }}
        borderWidth="1px"
        borderRadius="lg"
        bg="white"
        shadow="sm"
        overflow="hidden"
        display="flex"
        flexDirection="column"
      >
        {messageView}
      </Box>
    </Flex>
  );
});

const ChatList = React.memo(({ chats, currentChatId, onChatSelect }) => (
  <>
    <Box p={4} borderBottomWidth="1px" borderColor="gray.200" flexShrink={0}>
      <Text fontSize="xl" fontWeight="bold">
        Chats
      </Text>
    </Box>
    <VStack spacing={0} align="stretch" flexGrow={1} overflowY="auto">
      {chats.map((chat) => (
        <Box
          key={chat.chatId}
          p={4}
          borderBottomWidth="1px"
          borderColor="gray.100"
          cursor="pointer"
          bg={String(chat.chatId) === currentChatId ? "blue.50" : "white"}
          _hover={{ bg: "gray.100" }}
          onClick={() => onChatSelect(chat.chatId)}
        >
          <HStack justify="space-between" align="center">
            <HStack spacing={3}>
              <Avatar.Root>
                <Avatar.Image
                  src={`https://i.pravatar.cc/150?u=${encodeURIComponent(chat.displayUser)}`}
                  name={chat.displayUser}
                  size="md"
                />
                <Avatar.Fallback
                  name={chat.displayUser}
                  size="md"
                  src={`https://i.pravatar.cc/150?u=${encodeURIComponent(chat.displayUser)}`}
                />
              </Avatar.Root>
              <Box overflow="hidden">
                <Text fontWeight="bold" noOfLines={1}>{chat.displayUser}</Text>
                <Text color="gray.600" fontSize="sm" noOfLines={1}>
                  {chat.lastMessageSender === "You" && "You: "}{chat.text}
                </Text>
              </Box>
            </HStack>
            <Text fontSize="xs" color="gray.500" minW="55px" textAlign="right">
              {chat.timestamp
                ? new Date(chat.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </Text>
          </HStack>
        </Box>
      ))}
    </VStack>
  </>
));

const MessageView = React.memo(({
  currentChatId,
  chatHeaderUser,
  currentMessages,
  newMessage,
  onNewMessageChange,
  onSendMessage,
  messagesEndRef,
  isMobileView,
  onBackToChats,
}) => {
  return (
    <Flex direction="column" height="100%" overflow="hidden">
      <Toaster />
      <HStack
        px={4}
        py={3}
        borderBottomWidth="1px"
        borderColor="gray.200"
        bg="gray.50"
        spacing={3}
        flexShrink={0}
        justify="space-between"
      >
        <HStack spacing={3}>
          {isMobileView && currentChatId && (
            <Box
              as="button"
              onClick={onBackToChats}
              aria-label="Back to chats"
              mr={2}
              p={1}
              borderRadius="full"
              _hover={{ bg: "gray.200" }}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StepBackIcon size={20} />
            </Box>
          )}
          {currentChatId && (
            <Avatar.Root>
              <Avatar.Image
                src={`https://i.pravatar.cc/150?u=${encodeURIComponent(chatHeaderUser)}`}
                name={chatHeaderUser}
                size="md"
              />
              <Avatar.Fallback
                name={chatHeaderUser}
                size="md"
                src={`https://i.pravatar.cc/150?u=${encodeURIComponent(chatHeaderUser)}`}
              />
            </Avatar.Root>
          )}
          {currentChatId ? (
            <Text fontWeight="bold">{chatHeaderUser}</Text>
          ) : (
            !isMobileView && (
              <Text fontWeight="bold" color="gray.500">
                Select a chat to start messaging
              </Text>
            )
          )}
        </HStack>
      </HStack>
      <Box
        flexGrow={1}
        overflowY="auto"
        p={4}
        css={{
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            background: "var(--chakra-colors-gray-400)",
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "var(--chakra-colors-gray-500)",
          },
        }}
      >
        <VStack spacing={4} align="stretch">
          {currentChatId ? (
            currentMessages.length > 0 ? (
              currentMessages.map((message, idx) => (
                <Flex
                  key={message.id}
                  id={`message-${idx}`}
                  justify={message.user === "You" ? "flex-end" : "flex-start"}
                >
                  <Box
                    bg={message.user === "You" ? "blue.500" : "gray.100"}
                    color={message.user === "You" ? "white" : "black"}
                    px={4}
                    py={2}
                    borderRadius="lg"
                    maxWidth={{ base: "85%", md: "70%" }}
                    boxShadow="sm"
                  >
                    {message.user !== "You" && (
                      <Text fontSize="xs" fontWeight="bold" mb={1} color="gray.500">
                        {message.user}
                      </Text>
                    )}
                    <Text>{message.text}</Text>
                    <Text
                      fontSize="xs"
                      color={message.user === "You" ? "blue.100" : "gray.500"}
                      mt={1}
                      textAlign="right"
                    >
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </Box>
                </Flex>
              ))
            ) : (
              <Text color="gray.400" textAlign="center" mt={10}>
                No messages.
              </Text>
            )
          ) : (
            !isMobileView && (
              <Text color="gray.400" textAlign="center" mt={20}>
                Select a chat from the left to view messages.
              </Text>
            )
          )}
          <div ref={messagesEndRef} />
        </VStack>
      </Box>
      {currentChatId && (
        <HStack
          p={4}
          borderTopWidth="1px"
          borderColor="gray.200"
          bg="white"
          flexShrink={0}
        >
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => onNewMessageChange(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSendMessage();
              }
            }}
            flex="1"
            borderRadius="full"
            bg="gray.50"
            _focus={{
              bg: "white",
              borderColor: "blue.500",
              boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
            }}
          />
          <Button
            colorScheme="blue"
            onClick={onSendMessage}
            borderRadius="full"
            px={6}
          >
            Send
          </Button>
        </HStack>
      )}
    </Flex>
  );
});

// --- Main SysAdminMessages Component ---
const SysAdminMessages = () => {
  // Mock data for sysadmin chats/messages
  const [messagesData, setMessagesData] = useState([
    { id: 1, user: "System", text: "Reminder: Maintenance at 2am.", chatId: 1, timestamp: new Date(Date.now() - 1000 * 60 * 60) },
    { id: 2, user: "You", text: "Thanks for the update.", chatId: 1, timestamp: new Date(Date.now() - 1000 * 60 * 55) },
    { id: 3, user: "Support", text: "Ticket #1234 is now In Progress.", chatId: 2, timestamp: new Date(Date.now() - 1000 * 60 * 30) },
    { id: 4, user: "You", text: "Acknowledged.", chatId: 2, timestamp: new Date(Date.now() - 1000 * 60 * 25) },
    { id: 5, user: "HR", text: "Please review the new policy.", chatId: 3, timestamp: new Date(Date.now() - 1000 * 60 * 10) },
  ]);
  const [newMessageText, setNewMessageText] = useState("");
  const [currentChatId, setCurrentChatId] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (messagesForCurrentChat.length > 0) {
      scrollToBottom();
    }
  }, [messagesData, currentChatId, scrollToBottom]);

  const handleSendMessage = useCallback(() => {
    if (newMessageText.trim() && currentChatId) {
      setMessagesData(prevMessages => [
        ...prevMessages,
        {
          id: prevMessages.length > 0 ? Math.max(...prevMessages.map(m => m.id)) + 1 : 1,
          user: "You",
          text: newMessageText,
          chatId: Number(currentChatId),
          timestamp: new Date(),
        },
      ]);
      setNewMessageText("");
    }
  }, [newMessageText, currentChatId]);

  const handleChatSelect = useCallback((selectedChatId) => {
    setCurrentChatId(selectedChatId);
  }, []);

  const chats = useMemo(() => {
    const chatMap = {};
    const sortedMessages = [...messagesData].sort((a, b) => b.timestamp - a.timestamp);
    sortedMessages.forEach((msg) => {
      if (!chatMap[msg.chatId]) {
        const otherUserInChat = messagesData.find(
          (m) => m.chatId === msg.chatId && m.user !== "You"
        )?.user || "Unknown User";
        chatMap[msg.chatId] = {
          chatId: msg.chatId,
          displayUser: otherUserInChat,
          text: msg.text,
          timestamp: msg.timestamp,
          lastMessageSender: msg.user,
        };
      }
    });
    return Object.values(chatMap).sort((a, b) => b.timestamp - a.timestamp);
  }, [messagesData]);

  const messagesForCurrentChat = useMemo(() => {
    if (!currentChatId) return [];
    return messagesData
      .filter((msg) => msg.chatId === Number(currentChatId))
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [messagesData, currentChatId]);

  const otherUserForHeader = useMemo(() => {
    if (!currentChatId) return "Select a Chat";
    const currentChatInfo = chats.find(c => String(c.chatId) === String(currentChatId));
    return currentChatInfo ? currentChatInfo.displayUser : "Unknown User";
  }, [chats, currentChatId]);

  const isMobileView = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    if (messagesForCurrentChat.length > 0) {
      scrollToBottom();
    }
  }, [messagesForCurrentChat, scrollToBottom]);

  return (
    <Flex direction="column" h="100vh" maxH="100vh" overflow="hidden">
      <Heading
        size="4xl"
        fontWeight="bold"
        mb={4}
        fontFamily="'Playfair Display', serif"
        color="gray.800"
        textAlign={{ base: "center", lg: "left" }}
      >
        Messages
      </Heading>
      <AppLayout
        chatList={
          <ChatList
            chats={chats}
            currentChatId={currentChatId}
            onChatSelect={handleChatSelect}
          />
        }
        messageView={
          <MessageView
            currentChatId={currentChatId}
            chatHeaderUser={otherUserForHeader}
            currentMessages={messagesForCurrentChat}
            newMessage={newMessageText}
            onNewMessageChange={setNewMessageText}
            onSendMessage={handleSendMessage}
            messagesEndRef={messagesEndRef}
            isMobileView={isMobileView}
            onBackToChats={() => handleChatSelect(null)}
          />
        }
        isMobileView={isMobileView}
        currentChatId={currentChatId}
      />
    </Flex>
  );
};

export default SysAdminMessages;