import React, { useState, useEffect } from "react";
import { Input, Button, VStack, Text, Link, Box } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate, useSearchParams } from "react-router";
import AuthLayout from "@/pages/AuthLayout";
import AuthHeader from "@/usercomponents/Auth/UserAuth/AuthHeader";
import { useAuthStore } from "@/store/useAuthStore";
import { toaster } from "@/components/ui/toaster";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, loading, error, clearError } = useAuthStore();

  useEffect(() => {
    if (searchParams.get('confirmed') === 'true') {
      toaster.create({ title: "Email Confirmed", description: "You can now log in.", type: "success", duration: 5000 });
    }
  }, [searchParams]);

  const handleLogin = async e => {
    e.preventDefault();
    clearError();
    if (!email || !password) {
      return toaster.create({ title: "Validation Error", description: "Both fields required", type: "error", duration: 3000 });
    }
    try {
      const role = await login(email, password);
      toaster.create({ title: "Welcome Back", description: "", type: "success", duration: 2000 });
      // route by role
      if (role === "user") navigate("/otp-challengesend");
      else if (["systemAdmin","consultantAdmin","agentAdmin"].includes(role)) navigate("/staff/otp-challengesend");
      else navigate("/dashboard");
    } catch (err) {
      const code = err.code;
      if (code === 'pending_verification') {
        localStorage.setItem('pendingConfirmationEmail', email);
        toaster.create({ title: "Verify First", description: "", type: "warning", duration: 6000 });
        return navigate("/auth/confirm");
      }
      if (code === 'invalid_credentials') {
        return toaster.create({ title: "Login Failed", description: "Wrong email/password", type: "error", duration: 4000 });
      }
      toaster.create({ title: "Error", description: err.message, type: "error", duration: 4000 });
    }
  };

  return (
    <AuthLayout image="https://images.unsplash.com/flagged/photo-1572491259205-506c425b45c3" leftContent="Your dream home is one login away">
      <VStack spacing={6} w="100%" maxW="500px">
        <Box w="100%"><AuthHeader /></Box>
        <Text fontSize="2xl" fontWeight="bold">Log In</Text>
        <form onSubmit={handleLogin} style={{ width: "100%" }}>
          <VStack spacing={4} w="100%">
            <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} type="email" disabled={loading} />
            <Input placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} type="password" disabled={loading} />
            <Button type="submit" w="100%" loading={loading}>{loading ? "Logging in..." : "Log In"}</Button>
          </VStack>
        </form>
        {error && <Text color="red.500">{error}</Text>}
        <Text>Don't have an account? <Link asChild><RouterLink to="/signup">Sign Up</RouterLink></Link></Text>
        <Text><Link asChild><RouterLink to="/forgot-password">Forgot Password?</RouterLink></Link></Text>
      </VStack>
    </AuthLayout>
  );
};

export default Login;
