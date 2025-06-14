import React, { useState } from "react";
import { Input, Button, VStack, Text, Link, Box } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router";
import AuthLayout from "@/pages/AuthLayout";
import AuthHeader from "@/usercomponents/Auth/UserAuth/AuthHeader";

const credentials = {
  user: ["user@makao.com"],
  systemAdmin: ["admin@system.com"],
  consultantAdmin: ["admin@consultant.com"],
  agentAdmin: ["admin@agent.com"],
};

const Login = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (credentials.systemAdmin.includes(email)) {
      navigate("/admin-dashboard?role=systemAdmin");
    } else if (credentials.consultantAdmin.includes(email)) {
      navigate("/admin-dashboard?role=consultantAdmin");
    } else if (credentials.agentAdmin.includes(email)) {
      navigate("/admin-dashboard?role=agentAdmin");
    } else if (credentials.user.includes(email)) {
      navigate("/dashboard");
    } else {
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <AuthLayout 
      image="https://images.unsplash.com/flagged/photo-1572491259205-506c425b45c3" 
      leftContent="Your dream home is one login away"
    >
      <VStack spacing={6} width="100%" maxW="500px">
        <Box mb={6} w="100%">
          <AuthHeader />
        </Box>
        <Text fontSize="2xl" fontWeight="bold">Log In</Text>
        <Input
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button colorScheme="blue" onClick={handleLogin}>
          Log In
        </Button>
        <Text>
          Don't have an account?{" "}
          <Link variant="underline" asChild>
            <RouterLink to="/signup">Sign Up</RouterLink>
          </Link>
        </Text>
        <Text>
          <Link variant="underline" asChild>
            <RouterLink to="/forgot-password">Forgot Password?</RouterLink>
          </Link>
        </Text>
      </VStack>
    </AuthLayout>
  );
};

export default Login;