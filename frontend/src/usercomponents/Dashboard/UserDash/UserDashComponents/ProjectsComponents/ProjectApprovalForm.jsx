// ProjectApprovalForm.jsx

import React, { useState, useEffect } from "react";
import {
  VStack,
  Input,
  Textarea,
  Button,
  Box,
  Text,
  HStack,
  Icon,
  CloseButton,
} from "@chakra-ui/react";
import { FileText, Upload } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { FileUpload } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import supabase from "@/utils/supabaseClient";
import { submitProjectApproval, uploadDocuments } from "@/api/projectApproval";

// Helper to format currency with commas (no symbol)
function formatCurrency(value) {
  if (!value) return "";
  const num = Number(String(value).replace(/[^0-9.]/g, ""));
  if (isNaN(num)) return "";
  return num.toLocaleString("en-KE");
}

const initialState = {
  name: "",
  location: "",
  yourAddress: "",
  estimatedBudget: "",
  estimatedTimeline: "",
  additionalDetails: "",
  documents: [],
};

const allowedTypes = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg"
];
const maxSize = 5 * 1024 * 1024; // 5MB

const mandatoryDocs = [
  "Title Deed",
  "Land Search",
  "Owner ID",
  "Survey Map"
];
const optionalDocs = [
  "Architectural Plans",
  "NEMA Certificate",
  "KRA PIN",
  "Other"
];

export default function ProjectApprovalForm({
  onClose,
  loading = false,
  initialValues = {},
}) {
  const user = useAuthStore((state) => state.user);
  const userFullName = user?.full_name || user?.user_metadata?.full_name || "";
  const [form, setForm] = useState({ ...initialState, ...initialValues });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileUploadKey, setFileUploadKey] = useState(0);

  useEffect(() => {
    if (userFullName && !form.yourName) {
      setForm((f) => ({ ...f, yourName: userFullName }));
    }
  }, [userFullName, form.yourName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "estimatedBudget") {
      const cleaned = value.replace(/[^0-9.]/g, "");
      setForm((f) => ({ ...f, [name]: cleaned }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleFileChange = (acceptedFiles) => {
    setForm((f) => ({ ...f, documents: acceptedFiles }));
    if (acceptedFiles && acceptedFiles.length > 0) {
      setErrors((prev) => ({ ...prev, documents: undefined }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.name) errs.name = "Project name is required";
    if (!form.location) errs.location = "Location is required";
    if (!form.yourAddress) errs.yourAddress = "Your address is required";
    if (!form.estimatedBudget) errs.estimatedBudget = "Budget is required";
    if (!form.estimatedTimeline) errs.estimatedTimeline = "Estimated timeline is required";
    if (!form.documents || form.documents.length === 0) {
      errs.documents = "At least one supporting document is required";
    } else {
      if (form.documents.length > 5) {
        errs.documents = "You can upload a maximum of 5 files.";
      } else {
        for (const file of form.documents) {
          if (!allowedTypes.includes(file.type)) {
            errs.documents = "Only PDF, PNG, JPG, and JPEG files are allowed.";
            break;
          }
          if (file.size > maxSize) {
            errs.documents = "Each file must not exceed 5MB.";
            break;
          }
        }
      }
    }
    setErrors(errs);
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      const firstError = Object.values(errs)[0];
      toaster.create({
        title: "Submission Failed",
        description: firstError,
        type: "error",
        duration: 4000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload files to Supabase Storage
      const documents = await uploadDocuments(form.documents, user?.id);

      // Call the function directly using RPC
      const { data, error } = await supabase.rpc('submit_project_approval', {
        p_user_id: user.id,
        p_project_name: form.name,
        p_location: form.location,
        p_estimated_budget: form.estimatedBudget,
        p_estimated_timeline: form.estimatedTimeline,
        p_client_address: form.yourAddress,
        p_additional_details: form.additionalDetails || null,
        p_documents: documents
      });

      if (error) {
        throw new Error(error.message || "Failed to submit project");
      }

      toaster.create({
        title: "Project Submitted",
        description: "Your project request has been submitted for approval.",
        type: "success",
        duration: 4000,
      });

      setForm(initialState);
      setFileUploadKey(prev => prev + 1);

      if (onClose) onClose();
    } catch (error) {
      toaster.create({
        title: "Submission Failed",
        description: error.message || "An unexpected error occurred.",
        type: "error",
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        <Box>
          <Text mb={1} fontWeight="medium">Project Name</Text>
          <Input name="name" value={form.name} onChange={handleChange} placeholder="Project Name" bg="white"/>
          {errors.name && <Text color="red.500" fontSize="sm">{errors.name}</Text>}
        </Box>
        <Box>
          <Text mb={1} fontWeight="medium">Location</Text>
          <Input name="location" value={form.location} onChange={handleChange} placeholder="Location" bg="white" />
          {errors.location && <Text color="red.500" fontSize="sm">{errors.location}</Text>}
        </Box>
        <Box>
           <Text mb={1} fontWeight="medium">Your Name</Text>
           <Input name="yourName" value={userFullName} placeholder="Your Name" bg="white" readOnly />
        </Box>
        <Box>
            <Text mb={1} fontWeight="medium">Your Address</Text>
            <Input name="yourAddress" value={form.yourAddress} onChange={handleChange} placeholder="Your Address" bg="white" />
            {errors.yourAddress && <Text color="red.500" fontSize="sm">{errors.yourAddress}</Text>}
        </Box>
        <Box as="hr" border="none" borderTop="1px solid" borderColor="gray.200" my={2} />
        <Box>
            <Text mb={1} fontWeight="medium">Estimated Budget</Text>
            <Box position="relative">
              <Text position="absolute" left="12px" top="50%" transform="translateY(-50%)" color="gray.400" fontWeight="bold" pointerEvents="none" zIndex={1}>KSH</Text>
              <Input name="estimatedBudget" pl="48px" value={formatCurrency(form.estimatedBudget)} onChange={handleChange} placeholder="Estimated Budget" bg="white" inputMode="numeric"/>
            </Box>
            {errors.estimatedBudget && (<Text color="red.500" fontSize="sm">{errors.estimatedBudget}</Text>)}
        </Box>
        <Box>
          <Text mb={1} fontWeight="medium">Estimated Timeline</Text>
          <Input name="estimatedTimeline" value={form.estimatedTimeline} onChange={handleChange} placeholder="e.g., 6 months, 1 year" bg="white"/>
          {errors.estimatedTimeline && <Text color="red.500" fontSize="sm">{errors.estimatedTimeline}</Text>}
        </Box>
        <Box>
          <Text mb={1} fontWeight="medium">Additional Details <Text as="span" color="gray.500">(optional)</Text></Text>
          <Textarea name="additionalDetails" value={form.additionalDetails} onChange={handleChange} placeholder="Additional Details" bg="white"/>
        </Box>
        {/* --- File Upload Section --- */}
        <Box>
          <Text mb={1} fontWeight="medium">
            Supporting Documents <Text as="span" color="red.500">*</Text>
          </Text>
          <Text fontSize="sm" color="gray.500" mb={2}>
            Please upload up to 5 supporting documents.<br />
            <b>Mandatory:</b> {mandatoryDocs.join(", ")}.<br />
            <b>Optional:</b> {optionalDocs.join(", ")}.<br />
            Accepted formats: PDF, PNG, JPG, JPEG. Max size: 5MB each.
          </Text>
          <FileUpload.Root
            key={fileUploadKey}
            maxW="xl"
            alignItems="stretch"
            maxFiles={10}
          >
            <FileUpload.HiddenInput />
            <FileUpload.Dropzone>
              <Icon as={Upload} boxSize={6} color="gray.400" />
              <FileUpload.DropzoneContent>
                <Box>Drag and drop files here</Box>
                <Box color="gray.400">.png, .jpg up to 5MB</Box>
              </FileUpload.DropzoneContent>
            </FileUpload.Dropzone>
            <FileUpload.ItemGroup mt={2}>
              <FileUpload.Context>
                {({ acceptedFiles }) => {
                  useEffect(() => {
                    if (acceptedFiles && acceptedFiles.length !== form.documents.length) {
                      handleFileChange(acceptedFiles);
                    }
                  }, [acceptedFiles]);
                  return acceptedFiles.map((file, index) => (
                    <FileUpload.Item key={index} file={file}>
                      <HStack spacing={2} p={2} borderWidth="1px" borderColor="gray.200" borderRadius="md" justifyContent="space-between" alignItems="center" width="100%" mb={2} bg="white">
                        <HStack spacing={2} flex="1">
                          <Icon as={FileText} boxSize={4} color="gray.600" />
                          <Box fontSize="sm" isTruncated flex="1">
                            {file.name}
                          </Box>
                        </HStack>
                        <FileUpload.ItemDeleteTrigger asChild>
                          <CloseButton size="sm" variant="ghost" colorScheme="red" aria-label={`Remove file ${file.name}`}/>
                        </FileUpload.ItemDeleteTrigger>
                      </HStack>
                    </FileUpload.Item>
                  ));
                }}
              </FileUpload.Context>
            </FileUpload.ItemGroup>
            {errors.documents && (
              <Text color="red.500" fontSize="sm" mt={2}>{errors.documents}</Text>
            )}
          </FileUpload.Root>
        </Box>
        <HStack pt={2} spacing={4}>
          {onClose && (
            <Button
              onClick={onClose}
              variant="outline"
              type="button"
              size="sm"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            size="sm"
            loading={isSubmitting || loading}
          >
            {(isSubmitting || loading) ? "Submitting..." : "Submit"}
          </Button>
        </HStack>
      </VStack>
    </form>
  );
}