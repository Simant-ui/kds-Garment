import { Metadata } from "next";
import TrackOrderClient from "./TrackOrderClient";

export const metadata: Metadata = {
  title: "Track Your Order",
  description: "Track the real-time status of your KDS Readymade Udhyog order. Enter your tracking ID to see your parcel's journey.",
};

export default function TrackOrderPage() {
  return <TrackOrderClient />;
}
