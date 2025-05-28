import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Flex,
  IconButton,
  useBreakpointValue,
  Heading,
} from "@chakra-ui/react"; // Assuming you are using Chakra UI
import { ArrowLeftIcon as StepBackIcon } from "lucide-react"; // Ensure lucide-react is installed

// Mocking react-router hooks for standalone example
const useNavigate = () => {
  return (path, options) => console.log(`Navigate to: ${path}`, options);
};

// Move params state outside the hook so it persists
const paramsState = { current: { chatId: "1" }, set: null };
window.setChatIdParam = (newChatId) => {
  if (typeof paramsState.set === "function") {
    paramsState.set({ chatId: newChatId });
  }
};
const useParams = () => {
  const [params, setParams] = React.useState(paramsState.current);
  React.useEffect(() => {
    if (!paramsState.set) { // Ensure 'set' is assigned only once
        paramsState.set = (newParams) => {
        paramsState.current = newParams;
        setParams(newParams);
      };
    }
  }, []);
  return params;
};

// Simple Avatar components if not using a specific library like Radix with Chakra
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
      bg={src ? "transparent" : "gray.300"}
      color="white"
      fontWeight="medium"
      boxSize={boxSize}
      overflow="hidden" // Ensures image doesn't overflow rounded border
    >
      {src ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => {
            // Hide image and show fallback text if image fails to load
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
        className="avatar-fallback-text" // Add a class to target this
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
  Fallback: ({ name, src, ...props }) => ( // Pass src to Fallback to decide if it should render
    !src && <ChakraAvatar name={name} {...props} />
  ),
};


// --- Components moved outside ---

// AppLayout Component
const AppLayout = React.memo(({ chatList, messageView, isMobileView, currentChatId }) => {
  if (isMobileView) {
    // On mobile, make the container fill the viewport height minus header if needed
    return (
      <Box
        height="100vh"
        minH="100vh"
        maxH="100vh"
        overflow="hidden"
        display="flex"
        flexDirection="column"
        bg="gray.50"
      >
        {currentChatId ? messageView : chatList}
      </Box>
    );
  }
  return (
    <Flex height="calc(100vh - 4rem)" p={4} gap={4} bg="gray.50">
      <Box
        flex={{ base: "1", md: "1" }}
        minW={{ base: "100%", md: "300px" }}
        maxW={{ base: "100%", md: "400px" }}
        borderWidth="1px"
        borderRadius="lg"
        bg="white"
        shadow="sm"
        overflowY="auto"
        p={0}
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
        maxH="calc(100vh - 4rem)" // Ensure this matches the container height
      >
        {messageView}
      </Box>
    </Flex>
  );
});

// ChatList Component
const ChatList = React.memo(({ chats, currentChatId, onChatSelect }) => {
  return (
    <>
      <Box p={4} borderBottomWidth="1px" borderColor="gray.200">
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
                  {/* Fallback will render if src is not provided or fails in ChakraAvatar */}
                  <Avatar.Fallback
                    name={chat.displayUser}
                    size="md"
                    // Pass src here so Fallback knows if Image was supposed to render
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
              <Text
                fontSize="xs"
                color="gray.500"
                minW="55px"
                textAlign="right"
              >
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
  );
});

// MessageView Component with subtle "nipple" at the end of each bubble, StepBackIcon as before
const MessageView = React.memo(({
  currentChatId,
  chatHeaderUser,
  currentMessages,
  newMessage,
  onNewMessageChange,
  onSendMessage,
  messagesEndRef,
  isMobileView,
  onBackToChats
}) => {
  return (
    <Flex direction="column" height="100%" overflow="hidden">
      {/* Header */}
      <HStack
        px={4}
        py={3}
        borderBottomWidth="1px"
        borderColor="gray.200"
        bg="gray.50"
        spacing={3}
        flexShrink={0}
      >
        {isMobileView && currentChatId && (
          <StepBackIcon
            size={20}
            as="span"
            cursor="pointer"
            _hover={{ opacity: 0.7 }}
            onClick={onBackToChats}
            aria-label="Back to chats"
            mr={2}
            display="flex"
          />
        )}
        {currentChatId ? (
          <>
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
            <Text fontWeight="bold">{chatHeaderUser}</Text>
          </>
        ) : (
          !isMobileView && (
            <Text fontWeight="bold" color="gray.500">Select a chat to start messaging</Text>
          )
        )}
      </HStack>

      {/* Messages Container */}
      <Box
        flexGrow={1}
        overflowY="auto"
        p={4}
        css={{
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            width: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#CBD5E0',
            borderRadius: '24px',
          },
        }}
      >
        <VStack spacing={4} align="stretch">
          {currentChatId ? (
            currentMessages.length > 0 ? (
              currentMessages.map((message) => (
                <Flex
                  key={message.id}
                  justify={message.user === "You" ? "flex-end" : "flex-start"}
                  position="relative"
                >
                  <Box
                    bg={message.user === "You" ? "blue.500" : "gray.100"}
                    color={message.user === "You" ? "white" : "black"}
                    px={4}
                    py={2}
                    borderRadius="lg"
                    maxWidth={{ base: "85%", md: "70%" }}
                    boxShadow="sm"
                    position="relative"
                    _after={
                      message.user === "You"
                        ? {
                            content: '""',
                            position: "absolute",
                            bottom: "6px",
                            right: "-8px",
                            width: "0",
                            height: "0",
                            borderTop: "7px solid blue.500",
                            borderLeft: "7px solid transparent",
                            borderRight: "0 solid transparent",
                            borderBottom: "0 solid transparent",
                            borderRadius: "0 0 6px 0",
                            transform: "rotate(20deg)",
                            display: "block",
                          }
                        : {
                            content: '""',
                            position: "absolute",
                            bottom: "6px",
                            left: "-8px",
                            width: "0",
                            height: "0",
                            borderTop: "7px solid gray.100",
                            borderRight: "7px solid transparent",
                            borderLeft: "0 solid transparent",
                            borderBottom: "0 solid transparent",
                            borderRadius: "0 0 0 6px",
                            transform: "rotate(-20deg)",
                            display: "block",
                          }
                    }
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
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})}
                    </Text>
                  </Box>
                </Flex>
              ))
            ) : (
              <Text color="gray.400" textAlign="center" mt={10}>
                No messages yet. Start the conversation!
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

      {/* Input Area */}
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
              if (e.key === "Enter") onSendMessage();
            }}
            flex="1"
            borderRadius="full"
            bg="gray.50"
            _focus={{
              bg: "white",
              borderColor: "blue.500",
              boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)"
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

// Main Messages Component
const Messages = () => {
  const [messagesData, setMessagesData] = useState([
    { id: 1, user: "Jane Doe", text: "Hello, how can I help you today?", chatId: 1, timestamp: new Date(Date.now() - 1000 * 60 * 5) },
    { id: 2, user: "John Smith", text: "I need assistance with my project.", chatId: 2, timestamp: new Date(Date.now() - 1000 * 60 * 2) },
    { id: 3, user: "Jane Doe", text: "Sure, what do you need help with?", chatId: 1, timestamp: new Date(Date.now() - 1000 * 60 * 3) },
  ]);
  const [newMessageText, setNewMessageText] = useState("");
  const navigate = useNavigate(); // Mock navigate
  const { chatId: currentChatIdParam } = useParams(); // From mock useParams

  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messagesData, currentChatIdParam, scrollToBottom]);


  const handleSendMessage = useCallback(() => {
    if (newMessageText.trim() && currentChatIdParam) {
      setMessagesData(prevMessages => [
        ...prevMessages,
        {
          id: prevMessages.length > 0 ? Math.max(...prevMessages.map(m => m.id)) + 1 : 1,
          user: "You",
          text: newMessageText,
          chatId: Number(currentChatIdParam),
          timestamp: new Date(),
        },
      ]);
      setNewMessageText("");
    }
  }, [newMessageText, currentChatIdParam]);

  const handleChatSelect = useCallback((selectedChatId) => {
    if (typeof window.setChatIdParam === 'function') {
      // If selectedChatId is null (e.g. mobile back button), set it to null
      // otherwise, convert to string.
      window.setChatIdParam(selectedChatId === null ? null : String(selectedChatId));
    } else {
      // Fallback, assuming isMobileView might be needed here, but it's not available
      // in this scope directly. For simplicity, we'll keep the original logic.
      // This part might need adjustment based on how isMobileView is determined for navigation.
      navigate(`/dashboard/messages/${selectedChatId}`, { replace: true }); // Simplified
    }
  }, [navigate]);


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
    return Object.values(chatMap).sort((a,b) => b.timestamp - a.timestamp);
  }, [messagesData]);

  const messagesForCurrentChat = useMemo(() => {
    if (!currentChatIdParam) return [];
    return messagesData
      .filter((msg) => msg.chatId === Number(currentChatIdParam))
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [messagesData, currentChatIdParam]);

  const otherUserForHeader = useMemo(() => {
    if (!currentChatIdParam) return "Select a Chat";
    const msg = messagesData.find(
      (m) => m.chatId === Number(currentChatIdParam) && m.user !== "You"
    );
    return msg ? msg.user : "Unknown User";
  }, [messagesData, currentChatIdParam]);

  const isMobileView = useBreakpointValue({ base: true, md: false });

  return (
    <>
      <Heading
        size="4xl"
        fontWeight="bold"
        mb={3}
        fontFamily="'Playfair Display', serif"
        letterSpacing="tight"
        color="gray.800"
        textAlign={{ base: "center", lg: "left" }} // Responsive alignment
      >
        Messages
      </Heading>
      <AppLayout
        chatList={
          <ChatList
            chats={chats}
            currentChatId={currentChatIdParam}
            onChatSelect={handleChatSelect}
          />
        }
        messageView={
          <MessageView
            currentChatId={currentChatIdParam}
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
        currentChatId={currentChatIdParam} // Pass currentChatId to AppLayout for mobile logic
      />
    </>
  );
};

export default Messages;
