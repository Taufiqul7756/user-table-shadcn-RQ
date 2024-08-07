/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
  PaginationLast,
  PaginationFirst,
} from "@/components/ui/pagination";
import { fetchUsers } from "../../utils/service";
import { MdDeleteOutline } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import { AiOutlineEdit } from "react-icons/ai";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  email: string;
  role: string;
  image: string;
  phone: string;
  bloodGroup: string;
  address: {
    address: string;
    city: string;
    state: string;
    stateCode: string;
    postalCode: string;
    country: string;
  };
  company: {
    department: string;
    name: string;
    title: string;
    address: {
      address: string;
      city: string;
      state: string;
      stateCode: string;
      postalCode: string;
      country: string;
    };
  };
  university: string;
};
const TablePage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const limit = 5;

  const { data, error, isLoading } = useQuery({
    queryKey: ["users", page],
    queryFn: () => fetchUsers(page, limit),
    placeholderData: keepPreviousData,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  const users: User[] = data?.users || [];
  const totalPages = Math.ceil((data?.total || 0) / limit);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <PaginationItem key={i}>
            <PaginationLink isActive={i === page} onClick={() => setPage(i)}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      pageNumbers.push(
        <PaginationItem key={1}>
          <PaginationLink isActive={page === 1} onClick={() => setPage(1)}>
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (page > 3) {
        pageNumbers.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      const startPage = Math.max(2, page - 1);
      const endPage = Math.min(totalPages - 1, page + 1);

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
          <PaginationItem key={i}>
            <PaginationLink isActive={i === page} onClick={() => setPage(i)}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (page < totalPages - 2) {
        pageNumbers.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      pageNumbers.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            isActive={page === totalPages}
            onClick={() => setPage(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return pageNumbers;
  };

  //   Dialog function

  const handleOpenDialog = (user: User) => {
    setSelectedUser(user);
  };

  const handleCloseDialog = () => {
    setSelectedUser(null);
  };

  return (
    <div className="py-20 lg:px-72 md:px-16 sm:px-2 ">
      <div className="flex justify-center items-center font-bold text-2xl pb-5">
        <h1>User Table</h1>
      </div>
      {/* Table Section */}
      <Table className="border border-spacing-2 ">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex justify-start items-center">
                  <img
                    src={user.image}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <div className="grid">
                    <span className="font-semibold">
                      {user.firstName} {user.maidenName} {user.lastName}
                    </span>
                    <span className="font-base">{user.email}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>
                <div className="flex justify-start items-center gap-4">
                  <IoEyeOutline
                    className="cursor-pointer text-green-600"
                    size={18}
                    onClick={() => handleOpenDialog(user)}
                  />
                  <AiOutlineEdit
                    className="cursor-pointer text-blue-600"
                    size={18}
                  />
                  <MdDeleteOutline
                    className="cursor-pointer text-red-600"
                    size={18}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Pagination Section */}
      <Pagination className="mt-8 flex justify-center items-center lg:gap-5 md:gap-3 sm:gap-0 ">
        <PaginationFirst
          className="cursor-pointer"
          onClick={() => setPage(1)}
        />
        <PaginationPrevious
          className="cursor-pointer"
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          aria-disabled={page === 1}
        />
        <PaginationContent>{renderPageNumbers()}</PaginationContent>
        <PaginationNext
          className="cursor-pointer"
          onClick={() => setPage((old) => Math.min(old + 1, totalPages))}
          aria-disabled={page === totalPages}
        />
        <PaginationLast
          className="cursor-pointer"
          onClick={() => setPage(totalPages)}
        />
      </Pagination>

      {/* Modal Section */}

      {selectedUser && (
        <Dialog open={selectedUser !== null} onOpenChange={handleCloseDialog}>
          <DialogContent className="sm:w-50 md:w-96 lg:w-4/5">
            <DialogHeader>
              <DialogTitle>{`${selectedUser.firstName} ${selectedUser.lastName}`}</DialogTitle>
              <DialogDescription>{selectedUser.email}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-2">
              <img
                src={selectedUser.image}
                alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                className="lg:w-32 lg:h-32 md:w-24 md:h-32 sm:w-16 sm:h-16  rounded-full mx-auto "
              />

              <div className="flex justify-center items-center font-bold lg:my-3 md:my-2 sm:my-1">
                <h1>Personal Info</h1>
              </div>
              <div className="grid gap-1 sm:text-sm md:text-md lg:text-base ">
                <p>
                  <strong>Age:</strong> {selectedUser.age}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedUser.phone}
                </p>
                <p>
                  <strong>University:</strong> {selectedUser.university}
                </p>
                <p>
                  <strong>Role:</strong> {selectedUser.role}
                </p>
                <p>
                  <strong>Blood Group:</strong> {selectedUser.bloodGroup}
                </p>

                <p>
                  <strong>Address:</strong> {selectedUser.address.address},{" "}
                  {selectedUser.address.country}
                </p>
              </div>
              <div className="flex justify-center items-center font-bold lg:my-3 md:my-2 sm:my-1">
                <h1>Company Info</h1>
              </div>
              <div className="grid gap-1 sm:text-sm md:text-md lg:text-base">
                <p>
                  <strong>Name:</strong> {selectedUser.company.name}
                </p>
                <p>
                  <strong>Title:</strong> {selectedUser.company.title}
                </p>
                <p>
                  <strong>Company Address:</strong>{" "}
                  {selectedUser.company.address.address},
                  {selectedUser.company.address.country},
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TablePage;
