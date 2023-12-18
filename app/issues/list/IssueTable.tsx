import { IssueStatusBadge } from "@/app/components";
import { Table } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";
import NextLink from "next/link";
import { Issue, Status } from "@prisma/client";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import IssueStatusChooser from "@/app/components/IssueStatusChooser";

export interface IssueQuery {
  status: Status;
  orderBy: keyof Issue;
  sortOrder: "asc" | "desc";
  page: string;
}

interface Props {
  searchParams: IssueQuery;
  issues: Issue[];
}

const IssueTable = ({ searchParams, issues }: Props) => {
  const createLinkHref = (columnValue: string) => ({
    query: {
      ...searchParams,
      orderBy: columnValue,
      sortOrder:
        columnValue === searchParams.orderBy && searchParams.sortOrder === "asc"
          ? "desc"
          : "asc",
    },
  });

  const createSortIcon = (columnValue: string) =>
    columnValue === searchParams.orderBy &&
    (searchParams.sortOrder === "asc" ? (
      <ArrowUpIcon className="inline" />
    ) : (
      <ArrowDownIcon className="inline" />
    ));

  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          {columns.map((column) => (
            <Table.ColumnHeaderCell
              key={column.value}
              className={column.className}
            >
              <NextLink href={createLinkHref(column.value)}>
                {column.label}
              </NextLink>
              {createSortIcon(column.value)}
            </Table.ColumnHeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {issues.map((issue) => (
          <Table.Row key={issue.id}>
            <Table.Cell>
              <Link href={`/issues/${issue.id}`}>{issue.title}</Link>
              <div className="block md:hidden">
                <IssueStatusChooser issueId={issue.id} initialStatus={issue.status} key={issue.id}/>
              </div>
            </Table.Cell>
            <Table.Cell className="hidden md:table-cell">
              <IssueStatusChooser issueId={issue.id} initialStatus={issue.status} key={issue.id}/>
            </Table.Cell>
            <Table.Cell className="hidden md:table-cell">
              {issue.createdAt.toDateString()}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

const columns: { label: string; value: keyof Issue; className?: string }[] = [
  { label: "Issue", value: "title" },
  { label: "Status", value: "status", className: "hidden md:table-cell" },
  { label: "Created", value: "createdAt", className: "hidden md:table-cell" },
];

export const columnNames = columns.map((column) => column.value);

export default IssueTable;
