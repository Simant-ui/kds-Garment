import { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with KDS Readymade Udhyog. Contact us for custom garment manufacturing, school uniforms, and corporate wear inquiries in Nepal.",
};

export default function ContactPage() {
  return <ContactClient />;
}
