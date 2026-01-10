import { useEffect, useState } from "react";
import { tripService } from "@/services/trip.service";
import type { Trip } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";

export const AdminTrips = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const data = await tripService.getAll();
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
      pending: "En attente",
      in_progress: "En cours",
      completed: "Terminé",
      cancelled: "Annulé",
    };
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const getTruckInfo = (truck: Trip["truckId"]) => {
    if (typeof truck === "object" && truck !== null) {
      return `${truck.licensePlate} - ${truck.brand} ${truck.model}`;
    }
    return truck;
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Trajets</h1>
          <p className="text-muted-foreground mt-2">
            Gérez tous les trajets de la flotte
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Créer un trajet
        </Button>
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
                  <TableHead>Chauffeur</TableHead>
                  <TableHead>Camion</TableHead>
                  <TableHead>Origine</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Date départ</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trips.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Aucun trajet trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  trips.map((trip) => (
                    <TableRow key={trip._id}>
                      <TableCell className="font-medium">
                        {trip.tripNumber}
                      </TableCell>
                      <TableCell>
                        {typeof trip.driverId === "object"
                          ? trip.driverId.licenseNumber
                          : trip.driverId}
                      </TableCell>
                      <TableCell>{getTruckInfo(trip.truckId)}</TableCell>
                      <TableCell>{trip.origin}</TableCell>
                      <TableCell>{trip.destination}</TableCell>
                      <TableCell>
                        {format(new Date(trip.departureDate), "dd/MM/yyyy", {
                          locale: fr,
                        })}
                      </TableCell>
                      <TableCell>{getStatusBadge(trip.status)}</TableCell>
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

