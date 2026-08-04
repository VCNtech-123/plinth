// client/src/pages/clients/components/ClientContactInfo.tsx
import { Mail, Phone, Building2 } from "lucide-react";
import Card, { CardContent, CardHeader } from "../../../components/ui/Card";
import type { Client } from "../../../types/client.types";

interface ClientContactInfoProps {
  client: Client;
}

const ClientDetailsContactInfo = ({ client }: ClientContactInfoProps) => {
  const hasContactInfo = client.email || client.phone || client.company;

  if (!hasContactInfo) {
    return null;
  }

  return (
    <Card className="animate-slideUp">
      <CardHeader>
        <h2 className="text-lg font-semibold">Contact Information</h2>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Email */}
        {client.email && (
          <div className="flex items-start gap-3">
            <Mail size={18} className="text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs opacity-60">Email</p>
              <a
                href={`mailto:${client.email}`}
                className="text-sm font-medium break-all hover:text-primary transition-colors"
              >
                {client.email}
              </a>
            </div>
          </div>
        )}

        {/* Phone */}
        {client.phone && (
          <div className="flex items-start gap-3">
            <Phone size={18} className="text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs opacity-60">Phone</p>
              <a
                href={`tel:${client.phone}`}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {client.phone}
              </a>
            </div>
          </div>
        )}

        {/* Company */}
        {client.company && (
          <div className="flex items-start gap-3">
            <Building2 size={18} className="text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs opacity-60">Company</p>
              <p className="text-sm font-medium">{client.company}</p>
            </div>
          </div>
        )}

        {/* Created Date */}
        <div className="pt-3 border-t border-app">
          <p className="text-xs opacity-50">
            Member since{" "}
            <span className="font-medium">
              {new Date(client.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientDetailsContactInfo;