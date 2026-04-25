import { apiFetch } from "./api";

export interface SuperAdminStats {
  total_associations: number;
  total_elections: number;
  total_votes_cast: number;
  total_revenue: number;
  pending_revenue: number;
}

export interface AssociationBilling {
  uid: string;
  name: string;
  publik_id: string;
  profile_picture?: string;
  price_per_vote: number;
  total_elections: number;
  total_votes: number;
}

export interface Invoice {
  uid: string;
  invoice_number: string;
  association_name: string;
  election_title: string;
  total_votes: number;
  price_per_vote: number;
  total_amount: number;
  status: 'pending' | 'paid';
  date: string;
}

export function getSuperAdminStats() {
  return apiFetch<{ status: string; data: SuperAdminStats }>("/billing/dashboard/");
}

export function listAssociationBilling(searchQuery?: string) {
  const url = searchQuery ? `/billing/associations/?search=${encodeURIComponent(searchQuery)}` : "/billing/associations/";
  return apiFetch<{ status: string; data: AssociationBilling[] }>(url);
}

export function getAssociationBillingDetail(associationUid: string) {
  return apiFetch<{ status: string; data: AssociationBilling & { invoices: Invoice[] } }>(`/billing/associations/${associationUid}/`);
}

export function updateAssociationPricing(associationUid: string, pricePerVote: number) {
  return apiFetch(`/billing/associations/${associationUid}/pricing/`, {
    method: "POST",
    body: JSON.stringify({ price_per_vote: pricePerVote }),
  });
}

export function listInvoices(searchQuery?: string) {
  const url = searchQuery ? `/billing/invoices/?search=${encodeURIComponent(searchQuery)}` : "/billing/invoices/";
  return apiFetch<{ status: string; data: Invoice[] }>(url);
}

export function getInvoiceDetail(invoiceUid: string) {
  return apiFetch<{ status: string; data: Invoice }>(`/billing/invoices/${invoiceUid}/`);
}

export function updateInvoiceStatus(invoiceUid: string, status: 'pending' | 'paid') {
  return apiFetch(`/billing/invoices/${invoiceUid}/`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
