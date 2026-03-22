import { getSingleListing } from "@/services/listing.services";
import { notFound } from "next/navigation";
import ListingDetails from "@/components/modules/Listings/ListingDetails";

interface ListingDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ListingDetailPage({
  params,
}: ListingDetailPageProps) {
  const { id } = await params;

  let listing = null;

  try {
    const response = await getSingleListing(id);
    listing = response?.data || null;
  } catch {
    notFound();
  }

  if (!listing) {
    notFound();
  }

  return <ListingDetails listing={listing} />;
}