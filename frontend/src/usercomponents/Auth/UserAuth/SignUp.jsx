import React, { useState } from "react";
import { Input, Button, VStack, Text, Link, Box } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router";
import AuthLayout from "@/pages/AuthLayout";
import AuthHeader from "@/usercomponents/Auth/UserAuth/AuthHeader";
import { Checkbox } from "@/components/ui/checkbox";
import { toaster } from "@/components/ui/toaster";
import { supabase } from "@/utils/supabaseClient";


const SignUp = () => {
  const navigate = useNavigate();
  


// State variables for form inputs
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tos, setTos] = useState(false); // Terms of Service checkbox state


const [message, setMessage] = useState("");
// Handle sign-up process
  const handleSignUp = async () => {
    setMessage(""); // Reset message state

    // Check if Terms of Service is accepted
    if (!tos) {
      //toaster({ title: "You must agree to the Terms of Service.", status: "warning" });
      setMessage("You must agree to the Terms of Service.");
      return;
    }
    // Check if all fields are filled
    if (!email || !password || !confirmPassword) {
      //toaster({ title: "Please fill in all fields.", status: "warning" });
      setMessage("Please fill in all fields.");
      return;
    }
    // Check if passwords match
    if (password !== confirmPassword) {
      //toaster({ title: "Passwords do not match.", status: "error" });
      setMessage("Passwords do not match.");
      return;
    }

     try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "http://localhost:5173/dashboard", // Redirect after email confirmation
        data: { full_name: fullName, role: "user" }, // Default role for normal users
      },
    });

    if (error) {
      //toaster({ title: error.message || "Sign up failed.", status: "error" });
    setMessage(error.message || "Sign up failed.");
    } else {
      //toaster({ title: "Sign up successful! Please check your email.", status: "success" });
      setMessage("Sign up successful! Please check your email.");
      // Redirect to OTP challenge page
     // navigate("/otp-challengesend");
    }
  } catch (err) {
    //toaster({ title: "Unexpected error occurred.", status: "error" });
  setMessage("Unexpected error occurred.");
    console.error("Sign up error:", err); 
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
        {/* Full Name input */}
        <Input
          placeholder="Full Name"
          id="full-name"
          name="full-name"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
        />
        {/* Email input */}
        <Input
          placeholder="Email"
          id="signup-email"
          name="signup-email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
         {/* Password input */}
        <Input
          placeholder="Password"
          type="password"
          id="signup-password"
          name="signup-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {/* Confirm Password input */}
        <Input
          placeholder="Confirm Password"
          type="password"
          id="signup-confirm-password"
          name="signup-confirm-password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
        />
        {/* Terms of Service checkbox */}
        <Checkbox
          id="tos"
          name="tos"
          checked={tos}
          onChange={e => setTos(e.target.checked)}
        >
          I agree to the Terms of Service
        </Checkbox>
        {/* Sign Up button */}
        <Button colorScheme="blackAlpha" width="100%" onClick={handleSignUp}>
          Sign Up
        </Button>
        {message && (
  <Text fontSize="sm" color="gold.500" textAlign="center">
    {message}
  </Text>
)}
        {/* Link to login page */}
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