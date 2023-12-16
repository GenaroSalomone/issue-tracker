
import prisma from "@/prisma/client";
import IssueSummary from './IssueSummary'
import LatestIssues from './LatestIssues'
import IssueChart from "./IssueChart";
import { Flex, Grid } from "@radix-ui/themes";
import { Metadata } from "next";

export default async function Home() {
  const open = await prisma.issue.count({
    where: { status: 'OPEN' }
  })
  const in_progress = await prisma.issue.count({
    where: { status: 'IN_PROGRESS' }
  })
  const closed = await prisma.issue.count({
    where: { status: 'CLOSED' }
  })

  const issueCounts = {
    open,
    inProgress: in_progress,
    closed
  };

  return (
    <Grid columns={ {initial: "1", md:"2" }} gap="5">
      <Flex direction="column" gap="5">
        <IssueSummary {...issueCounts} />
        <IssueChart {...issueCounts} />
      </Flex>
      <LatestIssues />
    </Grid>
  )
}

export const metadata: Metadata = {
  title: 'Issue Tracker - Dashboard',
  description: 'View a summary of project issues'
}