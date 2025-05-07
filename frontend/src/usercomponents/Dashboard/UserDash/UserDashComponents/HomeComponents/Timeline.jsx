import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { Timeline, Avatar } from "@chakra-ui/react";
import { Check } from "lucide-react";

const ProjectTimeline = () => {
  return (
    <Box p={4} h={"360px"} borderWidth="1px" borderRadius="lg" flex="1" boxShadow="lg">
      <Text fontSize="lg" fontWeight="semibold" mb={6}>Project Timeline</Text>
      <Timeline.Root variant="subtle">
        <Timeline.Item>
          <Timeline.Connector>
            <Timeline.Separator />
            <Timeline.Indicator>
              <Avatar.Root size="sm">
                <Avatar.Fallback name="R" />
              </Avatar.Root>
            </Timeline.Indicator>
          </Timeline.Connector>
          <Timeline.Content>
            <Timeline.Title>Foundation Inspection Passed</Timeline.Title>
            <Timeline.Description mt={1}>3 days ago</Timeline.Description>
          </Timeline.Content>
        </Timeline.Item>

        <Timeline.Item>
          <Timeline.Connector>
            <Timeline.Separator />
            <Timeline.Indicator>
              <Check size={16} />
            </Timeline.Indicator>
          </Timeline.Connector>
          <Timeline.Content>
            <Timeline.Title>Plumbing Rough-In Approved</Timeline.Title>
            <Timeline.Description mt={1}>Next week</Timeline.Description>
          </Timeline.Content>
        </Timeline.Item>
      </Timeline.Root>
    </Box>
  );
};

export default ProjectTimeline;