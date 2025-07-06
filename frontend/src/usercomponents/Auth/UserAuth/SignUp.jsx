import React, { useState } from "react";
import { Input, Button, VStack, Text, Link, Box } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router"; 
import AuthLayout from "@/pages/AuthLayout";
import AuthHeader from "@/usercomponents/Auth/UserAuth/AuthHeader";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthStore } from "@/store/useAuthStore";
import { toaster } from "@/components/ui/toaster";

const SignUp = () => {
  // Add fullName to the form state
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });
  const navigate = useNavigate();
  const { signup, loading, error, clearError } = useAuthStore();

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const onCheck = (checked) => setForm((f) => ({ ...f, agree: checked }));

  const handleSignUp = async (e) => {
    e.preventDefault();
    clearError();
    // Destructure fullName from the form state
    const { fullName, email, password, confirmPassword, agree } = form;

    // Add validation for fullName
    if (!fullName || !email || !password || !confirmPassword) {
      return toaster.create({
        title: "Please fill all required fields",
        type: "error",
        duration: 3000,
      });
    }
    if (password !== confirmPassword) {
      return toaster.create({
        title: "Passwords do not match",
        type: "error",
        duration: 3000,
      });
    }
    if (password.length < 6) {
      return toaster.create({
        title: "Password must be at least 6 characters",
        type: "error",
        duration: 3000,
      });
    }
    if (!agree) {
      return toaster.create({
        title: "You must agree to the terms",
        type: "error",
        duration: 3000,
      });
    }

    try {
      // Pass the fullName to the signup function
      await signup({ fullName, email, password });
      localStorage.setItem("pendingConfirmationEmail", email);
      toaster.create({
        title: "Success! Check your email to verify your account.",
        type: "success",
        duration: 5000,
      });
      navigate("/auth/confirm");
    } catch (err) {
      const code = err.code;
      if (code === "pending_verification") {
        localStorage.setItem("pendingConfirmationEmail", email);
        toaster.create({
          title: "This email is already pending verification.",
          type: "warning",
          duration: 6000,
        });
        return navigate("/auth/confirm");
      }
      if (code === "email_already_registered") {
        return toaster.create({
          title: "An account with this email already exists.",
          type: "error",
          duration: 6000,
        });
      }
      toaster.create({
        title: "Signup Error",
        description: err.message,
        type: "error",
        duration: 4000,
      });
    }
  };

  return (
    <AuthLayout
      image="https://images.unsplash.com/flagged/photo-1572491259205-506c425b45c3"
      leftContent="Join us and start your journey"
    >
      <VStack spacing={6} w="100%" maxW="400px">
        <Box w="100%">
          <AuthHeader />
        </Box>
        <Text fontSize="2xl" fontWeight="bold">
          Sign Up for Makao
        </Text>
        <form onSubmit={handleSignUp} style={{ width: "100%" }}>
          <VStack spacing={4} w="100%">
            {/* Add the Full Name input field */}
            <Input
              name="fullName"
              placeholder="Full Name"
              onChange={onChange}
              disabled={loading}
              value={form.fullName}
            />
            <Input
              name="email"
              placeholder="Email"
              onChange={onChange}
              disabled={loading}
              value={form.email}
            />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              onChange={onChange}
              disabled={loading}
              value={form.password}
            />
            <Input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              onChange={onChange}
              disabled={loading}
              value={form.confirmPassword}
            />
            <Checkbox
              checked={form.agree}
              onCheckedChange={onCheck}
              disabled={loading}
            >
              I agree to the Terms & Conditions
            </Checkbox>
            <Button
              type="submit"
              w="100%"
              isLoading={loading} // Use isLoading for Chakra Button
              disabled={!form.agree || loading}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
          </VStack>
        </form>
        {error && <Text color="red.500">{error.message}</Text>}
        <Text>
          Already have an account?{" "}
          <Link as={RouterLink} to="/login" color="blue.500">
            Log In
          </Link>
        </Text>
      </VStack>
    </AuthLayout>
  );
};

export default SignUp;