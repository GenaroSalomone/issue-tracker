
import prisma from "@/prisma/client";
import IssueSumary from './IssueSumary'
import LatestIssues from './LatestIssues'
import IssueChart from "./IssueChart";

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
  return (
    <IssueChart open={open} inProgress={in_progress} closed={closed} />
  )
}
