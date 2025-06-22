import React, { useState } from "react";
import { Input, Button, VStack, Text, Link, Box } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router";
import AuthLayout from "@/pages/AuthLayout";
import AuthHeader from "@/usercomponents/Auth/UserAuth/AuthHeader";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthStore } from "@/store/useAuthStore";
import { toaster } from "@/components/ui/toaster";

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const navigate = useNavigate();
  const { signup, loading, error, clearError } = useAuthStore();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (checked) => {
    setFormData(prev => ({
      ...prev,
      agreeToTerms: checked
    }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    clearError();

    // Validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      toaster.create({
        title: "Validation Error",
        description: "Please fill in all fields",
        type: "error",
        duration: 3000,
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toaster.create({
        title: "Validation Error",
        description: "Passwords do not match",
        type: "error",
        duration: 3000,
      });
      return;
    }

    if (formData.password.length < 6) {
      toaster.create({
        title: "Validation Error",
        description: "Password must be at least 6 characters long",
        type: "error",
        duration: 3000,
      });
      return;
    }

    if (!formData.agreeToTerms) {
      toaster.create({
        title: "Validation Error",
        description: "Please agree to the Terms of Service",
        type: "error",
        duration: 3000,
      });
      return;
    }

    try {
      const result = await signup(formData.email, formData.password, 'user');
      
      if (result.user && result.session) {
        // User was created and confirmed
        toaster.create({
          title: "Account Created",
          description: "Your account has been created successfully!",
          type: "success",
          duration: 3000,
        });
        navigate("/otp-challengesend");
      } else {
        // User created but needs email confirmation
        toaster.create({
          title: "Check Your Email",
          description: "Please check your email to confirm your account before logging in.",
          type: "info",
          duration: 5000,
        });
        navigate("/login");
      }
    } catch (error) {
      toaster.create({
        title: "Signup Failed",
        description: error.message || "Failed to create account. Please try again.",
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
      <VStack spacing={6} width="100%" maxW="400px">
        <Box mb={6} w="100%">
          <AuthHeader />
        </Box>
        <Text fontSize="2xl" fontWeight="bold">Sign Up for Makao</Text>
        <form style={{ width: "100%" }} onSubmit={handleSignUp}>
          <VStack spacing={4} w="100%">
            <Input 
              placeholder="Full Name" 
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
            <Input 
              placeholder="Email" 
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
            <Input 
              placeholder="Password" 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
            <Input 
              placeholder="Confirm Password" 
              type="password" 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              disabled={loading}
            />
            <Checkbox 
              checked={formData.agreeToTerms}
              onCheckedChange={handleCheckboxChange}
              disabled={loading}
            >
              I agree to the Terms of Service
            </Checkbox>
            <Button 
              colorScheme="blackAlpha" 
              width="100%" 
              type="submit"
              loading={loading}
              disabled={loading || !formData.agreeToTerms}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
          </VStack>
        </form>
        {error && (
          <Text color="red.500" fontSize="sm" textAlign="center">
            {error}
          </Text>
        )}
        <Text>
          Already have an account?{" "}
          <Link variant="underline" asChild>
            <RouterLink to="/login">Log In</RouterLink>
          </Link>
        </Text>
      </VStack>
    </AuthLayout>
  );
};

export default SignUp;