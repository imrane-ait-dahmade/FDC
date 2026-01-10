import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { tripService } from "@/services/trip.service";
import type { Trip } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";

export const TripDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    status: "pending" as Trip["status"],
    mileageEnd: 0,
    fuelConsumption: 0,
    notes: "",
  });

  useEffect(() => {
    if (id) {
      fetchTrip();
    }
  }, [id]);

  const fetchTrip = async () => {
    try {
      setLoading(true);
      const data = await tripService.getById(id!);
      setTrip(data);
      setFormData({
        status: data.status,
        mileageEnd: data.mileageEnd || data.mileageStart,
        fuelConsumption: data.fuelConsumption || 0,
        notes: data.notes || "",
      });
    } catch (error) {
      console.error("Error fetching trip:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      setUpdating(true);
      await tripService.updateStatus(
        id,
        formData.status,
        formData.mileageEnd,
        formData.fuelConsumption
      );
      fetchTrip();
    } catch (error) {
      console.error("Error updating trip:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  if (!trip) {
    return <div className="p-8 text-center">Trajet non trouvé</div>;
  }

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

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/driver/trips")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Détails du Trajet</h1>
          <p className="text-muted-foreground mt-2">
            {trip.tripNumber}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informations du Trajet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-muted-foreground">Statut</Label>
              <div className="mt-1">{getStatusBadge(trip.status)}</div>
            </div>
            <div>
              <Label className="text-muted-foreground">Origine</Label>
              <p className="mt-1 font-medium">{trip.origin}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Destination</Label>
              <p className="mt-1 font-medium">{trip.destination}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Date de départ</Label>
              <p className="mt-1 font-medium">
                {format(new Date(trip.departureDate), "dd/MM/yyyy à HH:mm", {
                  locale: fr,
                })}
              </p>
            </div>
            {trip.arrivalDate && (
              <div>
                <Label className="text-muted-foreground">Date d'arrivée</Label>
                <p className="mt-1 font-medium">
                  {format(new Date(trip.arrivalDate), "dd/MM/yyyy à HH:mm", {
                    locale: fr,
                  })}
                </p>
              </div>
            )}
            <div>
              <Label className="text-muted-foreground">Kilométrage départ</Label>
              <p className="mt-1 font-medium">{trip.mileageStart.toLocaleString()} km</p>
            </div>
            {trip.mileageEnd && (
              <div>
                <Label className="text-muted-foreground">Kilométrage arrivée</Label>
                <p className="mt-1 font-medium">{trip.mileageEnd.toLocaleString()} km</p>
              </div>
            )}
            {trip.fuelConsumption && (
              <div>
                <Label className="text-muted-foreground">Consommation (L)</Label>
                <p className="mt-1 font-medium">{trip.fuelConsumption} L</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mettre à jour le Statut</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select
                  id="status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as Trip["status"],
                    })
                  }
                  required
                >
                  <option value="pending">À faire</option>
                  <option value="in_progress">En cours</option>
                  <option value="completed">Terminé</option>
                  <option value="cancelled">Annulé</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mileageEnd">Kilométrage arrivée</Label>
                <Input
                  id="mileageEnd"
                  type="number"
                  value={formData.mileageEnd}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mileageEnd: parseInt(e.target.value) || 0,
                    })
                  }
                  min={trip.mileageStart}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fuelConsumption">Consommation (L)</Label>
                <Input
                  id="fuelConsumption"
                  type="number"
                  step="0.1"
                  value={formData.fuelConsumption}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fuelConsumption: parseFloat(e.target.value) || 0,
                    })
                  }
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Remarques</Label>
                <textarea
                  id="notes"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full" disabled={updating}>
                {updating ? "Mise à jour..." : "Mettre à jour"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

