import { useEffect, useState } from "react";
import { tripService } from "@/services/trip.service";
import type { Trip } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";
import { useNavigate } from "react-router-dom";
import { generateTripPDF } from "@/utils/pdf";

export const DriverTrips = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const data = await tripService.getMyTrips();
      setTrips(data);
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: Trip["status"]) => {
    const variants: Record<Trip["status"], "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      in_progress: "default",
      completed: "secondary",
      cancelled: "destructive",
    };
    const labels: Record<Trip["status"], string> = {
      pending: "À faire",
      in_progress: "En cours",
      completed: "Terminé",
      cancelled: "Annulé",
    };
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const handleDownloadPDF = (trip: Trip) => {
    generateTripPDF(trip);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Mes Trajets</h1>
        <p className="text-muted-foreground mt-2">
          Consultez vos trajets assignés
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">Chargement...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Numéro</TableHead>
                  <TableHead>Camion</TableHead>
                  <TableHead>Origine</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Date départ</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trips.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Aucun trajet assigné
                    </TableCell>
                  </TableRow>
                ) : (
                  trips.map((trip) => (
                    <TableRow key={trip._id}>
                      <TableCell className="font-medium">
                        {trip.tripNumber}
                      </TableCell>
                      <TableCell>
                        {typeof trip.truckId === "object"
                          ? `${trip.truckId.licensePlate} - ${trip.truckId.brand} ${trip.truckId.model}`
                          : trip.truckId}
                      </TableCell>
                      <TableCell>{trip.origin}</TableCell>
                      <TableCell>{trip.destination}</TableCell>
                      <TableCell>
                        {format(new Date(trip.departureDate), "dd/MM/yyyy", {
                          locale: fr,
                        })}
                      </TableCell>
                      <TableCell>{getStatusBadge(trip.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/driver/trips/${trip._id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDownloadPDF(trip)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

