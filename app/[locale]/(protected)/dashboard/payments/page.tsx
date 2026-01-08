"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import PageTitle from "@/components/page-title";
import Loader from "@/components/loader";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Payment {
  id: string;
  stripeId?: string;
  type: "subscription" | "cancellation" | "refund";
  amount: number;
  currency: string;
  status: "succeeded" | "pending" | "failed";
  created: string;
  description: string;
  receiptUrl?: string;
  invoiceUrl?: string;
  planName?: string;
  periodStart?: string;
  periodEnd?: string;
}

interface PaymentsResponse {
  ok: boolean;
  payments: Payment[];
  hasMore: boolean;
  totalFound: number;
  currentPage: number;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalFound, setTotalFound] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, [currentPage]);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `/api/subscription/payments?page=${currentPage}&limit=10`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch payments");
      }

      const data: PaymentsResponse = await response.json();

      if (!data.ok) {
        throw new Error("Failed to fetch payments");
      }

      setPayments(data.payments);
      setHasMore(data.hasMore);
      setTotalFound(data.totalFound);
    } catch (err: any) {
      console.error("Error fetching payments:", err);
      setError(err.message || "Failed to load payments");
      toast.error("Failed to load payments");
    } finally {
      setIsLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount); // Amount is already in dollars
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "succeeded":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "destructive";
      default:
        return "default";
    }
  };

  // Get type badge color
  const getTypeColor = (type: string) => {
    switch (type) {
      case "subscription":
        return "default";
      case "cancellation":
        return "destructive";
      case "refund":
        return "warning";
      default:
        return "secondary";
    }
  };

  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "subscription":
        return "heroicons:credit-card";
      case "cancellation":
        return "heroicons:x-circle";
      case "refund":
        return "heroicons:arrow-path";
      default:
        return "heroicons:document";
    }
  };

  if (isLoading && payments.length === 0) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <PageTitle title="My Payments" />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon icon="heroicons:banknotes" className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Payments</p>
                <p className="text-2xl font-bold">{totalFound}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                <Icon icon="heroicons:check-circle" className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Successful</p>
                <p className="text-2xl font-bold">
                  {payments.filter((p) => p.status === "succeeded").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-info/10 flex items-center justify-center">
                <Icon icon="heroicons:calendar" className="w-6 h-6 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">
                  {
                    payments.filter((p) => {
                      const paymentDate = new Date(p.created);
                      const now = new Date();
                      return (
                        paymentDate.getMonth() === now.getMonth() &&
                        paymentDate.getFullYear() === now.getFullYear()
                      );
                    }).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-xl font-semibold">Payment History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {error ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                <Icon icon="heroicons:exclamation-circle" className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-destructive mb-1">Error Loading Payments</h3>
              <p className="text-muted-foreground text-sm mb-4">{error}</p>
              <Button onClick={() => fetchPayments()} variant="outline" size="sm">
                <Icon icon="heroicons:arrow-path" className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Icon icon="heroicons:credit-card" className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-1">No Payments Yet</h3>
              <p className="text-muted-foreground text-sm text-center max-w-sm">
                Your payment history will appear here once you make a transaction
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">TYPE</TableHead>
                      <TableHead className="font-semibold">DESCRIPTION</TableHead>
                      <TableHead className="font-semibold">PLAN</TableHead>
                      <TableHead className="font-semibold">AMOUNT</TableHead>
                      <TableHead className="font-semibold">STATUS</TableHead>
                      <TableHead className="font-semibold">DATE</TableHead>
                      <TableHead className="font-semibold w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => {
                      const hasActions = payment.invoiceUrl || payment.receiptUrl;
                      
                      return (
                        <TableRow key={payment.id} className="hover:bg-muted/30">
                          <TableCell className="py-4">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                <Icon
                                  icon={getTypeIcon(payment.type)}
                                  className="w-4 h-4"
                                />
                              </div>
                              <Badge color={getTypeColor(payment.type) as any} className="capitalize">
                                {payment.type}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="max-w-md">
                              <p className="text-sm font-medium text-default-900 line-clamp-1">
                                {payment.description}
                              </p>
                              {payment.stripeId && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {payment.stripeId}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            {payment.planName ? (
                              <Badge className="capitalize font-medium border border-default-300 bg-default-100 text-default-900">
                                {payment.planName}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell className="py-4">
                            <span className="font-semibold text-default-900">
                              {formatCurrency(payment.amount, payment.currency)}
                            </span>
                          </TableCell>
                          <TableCell className="py-4">
                            <Badge color={getStatusColor(payment.status) as any} className="capitalize">
                              {payment.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4">
                            <span className="text-sm text-muted-foreground whitespace-nowrap">
                              {formatDate(payment.created)}
                            </span>
                          </TableCell>
                          <TableCell className="py-4">
                            {hasActions && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="cursor-pointer hover:opacity-60 transition-opacity p-1">
                                    <Icon icon="heroicons:ellipsis-vertical" className="h-5 w-5 text-default-900" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[160px]">
                                  {payment.invoiceUrl && (
                                    <DropdownMenuItem asChild>
                                      <a
                                        href={payment.invoiceUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 cursor-pointer"
                                      >
                                        <Icon icon="heroicons:document-text" className="w-4 h-4" />
                                        <span>View Invoice</span>
                                      </a>
                                    </DropdownMenuItem>
                                  )}
                                  {payment.receiptUrl && (
                                    <DropdownMenuItem asChild>
                                      <a
                                        href={payment.receiptUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 cursor-pointer"
                                      >
                                        <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
                                        <span>Download Receipt</span>
                                      </a>
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {(hasMore || currentPage > 1) && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t bg-muted/20">
                  <p className="text-sm text-muted-foreground">
                    Showing <span className="font-medium text-default-900">{payments.length}</span> of <span className="font-medium text-default-900">{totalFound}</span> payments
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1 || isLoading}
                      className="gap-1"
                    >
                      <Icon icon="heroicons:chevron-left" className="w-4 h-4" />
                      Previous
                    </Button>
                    <div className="px-3 py-1 text-sm font-medium bg-background border rounded-md">
                      Page {currentPage}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => p + 1)}
                      disabled={!hasMore || isLoading}
                      className="gap-1"
                    >
                      Next
                      <Icon icon="heroicons:chevron-right" className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

