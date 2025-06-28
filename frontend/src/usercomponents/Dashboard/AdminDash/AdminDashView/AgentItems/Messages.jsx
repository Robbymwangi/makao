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
  Popover,
  Portal,
  Stack,
  Field,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { ArrowLeftIcon as StepBackIcon, SearchIcon, FlagIcon, X as CloseIcon } from "lucide-react";
import { Toaster, toaster } from "@/components/ui/toaster";
import { useNavigate } from "react-router";

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
    if (!paramsState.set) {
      paramsState.set = (newParams) => {
        paramsState.current = newParams;
        setParams(newParams);
      };
    }
  }, []);
  return params;
};

// Simple Avatar components
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

// AppLayout Component
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

// ChatList Component
const ChatList = React.memo(({ chats, currentChatId, onChatSelect }) => {
  return (
    <>
      <Box p={4} borderBottomWidth="1px" borderColor="gray.200" flexShrink={0}>
        <Text fontSize="xl" fontWeight="bold">
          Client Messages
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
  );
});

// MessageView Component
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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchPopoverOpen, setSearchPopoverOpen] = useState(false);
  const [flagged, setFlagged] = useState(false);
  const [flagPopoverOpen, setFlagPopoverOpen] = useState(false);
  const [flagText, setFlagText] = useState("");
  const [searchMatchIdx, setSearchMatchIdx] = useState(0);

  const matchIndices = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const lower = searchQuery.toLowerCase();
    return currentMessages
      .map((msg, idx) =>
        msg.text.toLowerCase().includes(lower) ? idx : -1
      )
      .filter(idx => idx !== -1);
  }, [currentMessages, searchQuery]);

  useEffect(() => {
    if (matchIndices.length > 0) {
      const idx = matchIndices[searchMatchIdx % matchIndices.length];
      const el = document.getElementById(`message-${idx}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [searchMatchIdx, matchIndices]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (matchIndices.length > 0) {
      setSearchMatchIdx(0);
      const idx = matchIndices[0];
      const el = document.getElementById(`message-${idx}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleNextMatch = () => {
    if (matchIndices.length > 0) {
      setSearchMatchIdx((prev) => (prev + 1) % matchIndices.length);
    }
  };

  const handleSearchPopoverChange = (open) => {
    setSearchPopoverOpen(open);
    if (!open) {
      setSearchQuery("");
      setSearchMatchIdx(0);
    }
  };

  const handleFlagSubmit = (e) => {
    e.preventDefault();
    setFlagged(true);
    setFlagPopoverOpen(false);

    toaster.create({
      title: "Conversation flagged",
      description: flagText ? `Issue: ${flagText}` : "No issue provided.",
      type: "warning",
      duration: 4000,
    });

    setFlagText("");
  };

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
                Select a client to start messaging
              </Text>
            )
          )}
        </HStack>
        <HStack spacing={4}>
          <Popover.Root
            open={searchPopoverOpen}
            onOpenChange={handleSearchPopoverChange}
          >
            <Popover.Trigger asChild>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Search messages"
                borderRadius="full"
                px={2}
              >
                <SearchIcon size={20} />
              </Button>
            </Popover.Trigger>
            <Portal>
              <Popover.Positioner>
                <Popover.Content position="relative">
                  <Popover.Arrow />
                  <Box
                    position="absolute"
                    top="2"
                    right="2"
                    as="button"
                    aria-label="Close search"
                    bg="transparent"
                    border="none"
                    onClick={() => setSearchPopoverOpen(false)}
                    _hover={{ color: "red.500" }}
                  >
                    <CloseIcon size={18} />
                  </Box>
                  <Popover.Body>
                    <form onSubmit={handleSearchSubmit}>
                      <Stack gap="4">
                        <Field.Root>
                          <Field.Label>Search Messages</Field.Label>
                          <Input
                            placeholder="Type to search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </Field.Root>
                        <Button
                          type="submit"
                          colorScheme="blue"
                          size="sm"
                          w="full"
                          isDisabled={!searchQuery.trim()}
                        >
                          Search
                        </Button>
                        {matchIndices.length > 1 && (
                          <Button
                            type="button"
                            colorScheme="gray"
                            size="sm"
                            w="full"
                            onClick={handleNextMatch}
                          >
                            Next Match ({searchMatchIdx + 1}/{matchIndices.length})
                          </Button>
                        )}
                        {matchIndices.length === 1 && (
                          <Text fontSize="sm" color="gray.500" textAlign="center">
                            1 match found
                          </Text>
                        )}
                        {searchQuery && matchIndices.length === 0 && (
                          <Text fontSize="sm" color="red.400" textAlign="center">
                            No matches found
                          </Text>
                        )}
                      </Stack>
                    </form>
                  </Popover.Body>
                  <Popover.CloseTrigger />
                </Popover.Content>
              </Popover.Positioner>
            </Portal>
          </Popover.Root>

          <Popover.Root
            open={flagPopoverOpen}
            onOpenChange={setFlagPopoverOpen}
          >
            <Popover.Trigger asChild>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Flag conversation"
                borderRadius="full"
                px={2}
                color={flagged ? "red.500" : "gray.800"}
              >
                <FlagIcon size={20} />
              </Button>
            </Popover.Trigger>
            <Portal>
              <Popover.Positioner>
                <Popover.Content position="relative">
                  <Popover.Arrow />
                  <Box
                    position="absolute"
                    top="2"
                    right="2"
                    as="button"
                    aria-label="Close flag"
                    bg="transparent"
                    border="none"
                    onClick={() => setFlagPopoverOpen(false)}
                    _hover={{ color: "red.500" }}
                  >
                    <CloseIcon size={18} />
                  </Box>
                  <Popover.Body>
                    <form onSubmit={handleFlagSubmit}>
                      <Stack gap="4">
                        <Field.Root>
                          <Field.Label>Flag Conversation</Field.Label>
                          <Textarea
                            placeholder="Describe the issue..."
                            value={flagText}
                            onChange={(e) => setFlagText(e.target.value)}
                          />
                        </Field.Root>
                        <Button type="submit" colorScheme="red" size="sm" w="full">
                          Flag
                        </Button>
                      </Stack>
                    </form>
                  </Popover.Body>
                  <Popover.CloseTrigger />
                </Popover.Content>
              </Popover.Positioner>
            </Portal>
          </Popover.Root>
        </HStack>
      </HStack>

      <Box
        flexGrow={1}
        overflowY="auto"
        p={4}
        css={{
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
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
              currentMessages.map((message, idx) => {
                const isMatch = searchQuery &&
                  message.text.toLowerCase().includes(searchQuery.toLowerCase());
                const isCurrent =
                  isMatch &&
                  matchIndices[searchMatchIdx % matchIndices.length] === idx;
                return (
                  <Flex
                    key={message.id}
                    id={`message-${idx}`}
                    justify={message.user === "You" ? "flex-end" : "flex-start"}
                  >
                    <Box
                      bg={isCurrent
                        ? "yellow.200"
                        : message.user === "You"
                        ? "blue.500"
                        : "gray.100"}
                      color={
                        isCurrent
                          ? "black"
                          : message.user === "You"
                          ? "white"
                          : "black"
                      }
                      px={4}
                      py={2}
                      borderRadius="lg"
                      maxWidth={{ base: "85%", md: "70%" }}
                      boxShadow="sm"
                      border={isCurrent ? "2px solid #ECC94B" : undefined}
                    >
                      {message.user !== "You" && (
                        <Text fontSize="xs" fontWeight="bold" mb={1} color="gray.500">
                          {message.user}
                        </Text>
                      )}
                      <Text>
                        {isMatch ? (
                          <>
                            {message.text.split(
                              new RegExp(`(${searchQuery})`, "gi")
                            ).map((part, i) =>
                              part.toLowerCase() === searchQuery.toLowerCase() ? (
                                <mark
                                  key={i}
                                  style={{
                                    background: "#FAF089",
                                    color: "#202020",
                                    padding: "0 2px",
                                    borderRadius: "2px",
                                  }}
                                >
                                  {part}
                                </mark>
                              ) : (
                                part
                              )
                            )}
                          </>
                        ) : (
                          message.text
                        )}
                      </Text>
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
                );
              })
            ) : (
              <Text color="gray.400" textAlign="center" mt={10}>
                No messages.
              </Text>
            )
          ) : (
            !isMobileView && (
              <Text color="gray.400" textAlign="center" mt={20}>
                Select a client from the left to view messages.
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

// Main Messages Component
const Messages = () => {
  const [messagesData, setMessagesData] = useState([
    { id: 1, user: "Sarah Johnson", text: "Hi, I need an update on my property renovation.", chatId: 1, timestamp: new Date(Date.now() - 1000 * 60 * 5) },
    { id: 2, user: "Michael Chen", text: "When will the inspection be scheduled?", chatId: 2, timestamp: new Date(Date.now() - 1000 * 60 * 2) },
    { id: 3, user: "Sarah Johnson", text: "Specifically about the kitchen progress.", chatId: 1, timestamp: new Date(Date.now() - 1000 * 60 * 3) },
    { id: 4, user: "You", text: "The kitchen cabinets will be installed tomorrow.", chatId: 1, timestamp: new Date(Date.now() - 1000 * 60 * 1) },
    { id: 5, user: "Emma Davis", text: "Can we discuss the landscaping plan?", chatId: 3, timestamp: new Date(Date.now() - 1000 * 60 * 10) },
    { id: 6, user: "You", text: "I'll send you the updated landscaping designs shortly.", chatId: 3, timestamp: new Date(Date.now() - 1000 * 60 * 9) },
  ]);
  
  const [newMessageText, setNewMessageText] = useState("");
  const navigate = useNavigate();
  const { chatId: currentChatIdParam } = useParams();
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (messagesForCurrentChat.length > 0) {
      scrollToBottom();
    }
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
      window.setChatIdParam(selectedChatId === null ? null : String(selectedChatId));
    } else {
      navigate(`/dashboard/messages/${selectedChatId}`, { replace: true });
    }
  }, [navigate]);

  const chats = useMemo(() => {
    const chatMap = {};
    const sortedMessages = [...messagesData].sort((a, b) => b.timestamp - a.timestamp);

    sortedMessages.forEach((msg) => {
      if (!chatMap[msg.chatId]) {
        const otherUserInChat = messagesData.find(
          (m) => m.chatId === msg.chatId && m.user !== "You"
        )?.user || "Unknown Client";

        chatMap[msg.chatId] = {
          chatId: msg.chatId,
          displayUser: msg.chatId === Number(currentChatIdParam) && otherUserInChat === "Unknown Client" ? "You" : otherUserInChat,
          text: msg.text,
          timestamp: msg.timestamp,
          lastMessageSender: msg.user,
        };
      }
    });
    return Object.values(chatMap).sort((a,b) => b.timestamp - a.timestamp);
  }, [messagesData, currentChatIdParam]);

  const messagesForCurrentChat = useMemo(() => {
    if (!currentChatIdParam) return [];
    return messagesData
      .filter((msg) => msg.chatId === Number(currentChatIdParam))
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [messagesData, currentChatIdParam]);

  const otherUserForHeader = useMemo(() => {
    if (!currentChatIdParam) return "Select a Client";
    const currentChatInfo = chats.find(c => String(c.chatId) === currentChatIdParam);
    return currentChatInfo ? currentChatInfo.displayUser : "Unknown Client";
  }, [chats, currentChatIdParam]);

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
        Client Messages
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
        currentChatId={currentChatIdParam}
      />
    </Flex>
  );
};

export default Messages;