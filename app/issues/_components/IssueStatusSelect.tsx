"use client";
import { Flex, Select } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import prisma from "@/prisma/client";
import { Issue, Status } from "@prisma/client";

interface Props {
  issue: Issue;
}

const IssueStatusSelect = ({ issue }: Props) => {
  const [status, setStatus] = useState(issue.status);

  const handleStatusChange = async (newStatus: Status) => {
    setStatus(newStatus);
    // Actualiza el estado del issue en la base de datos
    // await prisma.issue.update({
    //   where: { id: issue.id },
    //   data: { status: newStatus },
    // });

    // Actualiza el estado del issue en el estado local
  };

  return (
    <Flex>
      <Select.Root defaultValue={status} onValueChange={handleStatusChange}>
        <Select.Trigger placeholder="Status..." />
        <Select.Content>
          <Select.Group>
            <Select.Label>Status</Select.Label>
            <Select.Item value="OPEN">Open</Select.Item>
            <Select.Item value="IN_PROGRESS">In Progress</Select.Item>
            <Select.Item value="CLOSED">Closed</Select.Item>
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </Flex>
  );
};

export default IssueStatusSelect;
