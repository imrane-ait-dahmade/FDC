import { useEffect, useState } from "react";
import { tripService } from "@/services/trip.service";
import { truckService } from "@/services/truck.service";
import { driverService } from "@/services/driver.service";
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
import { Plus, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export const AdminTrips = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [trucks, setTrucks] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [formData, setFormData] = useState({
    driverId: "",
    truckId: "",
    trailerId: "",
    origin: "",
    destination: "",
    departureDate: new Date().toISOString().split("T")[0],
    mileageStart: 0,
    status: "pending" as Trip["status"],
    notes: "",
  });

  useEffect(() => {
    fetchTrips();
    fetchTrucks();
    fetchDrivers();
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

  const fetchTrucks = async () => {
    try {
      const data = await truckService.getAll();
      setTrucks(data);
    } catch (error) {
      console.error("Error fetching trucks:", error);
    }
  };

  const fetchDrivers = async () => {
    try {
      const data = await driverService.getAll();
      setDrivers(data);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

  const handleOpenDialog = (trip?: Trip) => {
    if (trip) {
      setEditingTrip(trip);
      const driverId = typeof trip.driverId === "object" && trip.driverId !== null
        ? (trip.driverId as any)._id
        : trip.driverId;
      const truckId = typeof trip.truckId === "object" && trip.truckId !== null
        ? (trip.truckId as any)._id
        : trip.truckId;
      const trailerId = typeof trip.trailerId === "object" && trip.trailerId !== null
        ? (trip.trailerId as any)._id
        : trip.trailerId;
      
      setFormData({
        driverId: String(driverId),
        truckId: String(truckId),
        trailerId: trailerId ? String(trailerId) : "",
        origin: trip.origin,
        destination: trip.destination,
        departureDate: new Date(trip.departureDate).toISOString().split("T")[0],
        mileageStart: trip.mileageStart,
        status: trip.status,
        notes: trip.notes || "",
      });
    } else {
      setEditingTrip(null);
      setFormData({
        driverId: "",
        truckId: "",
        trailerId: "",
        origin: "",
        destination: "",
        departureDate: new Date().toISOString().split("T")[0],
        mileageStart: 0,
        status: "pending",
        notes: "",
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData: any = { ...formData };
      if (!submitData.trailerId) {
        delete submitData.trailerId;
      }
      if (!submitData.notes) {
        delete submitData.notes;
      }

      if (editingTrip) {
        await tripService.update(editingTrip._id, submitData);
      } else {
        await tripService.create(submitData);
      }
      setDialogOpen(false);
      fetchTrips();
    } catch (error: any) {
      console.error("Error saving trip:", error);
      alert(error.response?.data?.error || "Erreur lors de la sauvegarde");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce trajet ?")) {
      try {
        await tripService.delete(id);
        fetchTrips();
      } catch (error) {
        console.error("Error deleting trip:", error);
      }
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

  const getDriverInfo = (driver: Trip["driverId"]) => {
    if (typeof driver === "object" && driver !== null) {
      return driver.licenseNumber || "N/A";
    }
    return driver;
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
        <Button onClick={() => handleOpenDialog()}>
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trips.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Aucun trajet trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  trips.map((trip) => (
                    <TableRow key={trip._id}>
                      <TableCell className="font-medium">
                        {trip.tripNumber}
                      </TableCell>
                      <TableCell>{getDriverInfo(trip.driverId)}</TableCell>
                      <TableCell>{getTruckInfo(trip.truckId)}</TableCell>
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
                            onClick={() => handleOpenDialog(trip)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(trip._id)}
                          >
                            <Trash2 className="h-4 w-4" />
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTrip ? "Modifier le trajet" : "Nouveau trajet"}
            </DialogTitle>
            <DialogDescription>
              {editingTrip
                ? "Modifiez les informations du trajet"
                : "Remplissez les informations du nouveau trajet"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="driverId">Chauffeur *</Label>
                <Select
                  id="driverId"
                  value={formData.driverId}
                  onChange={(e) =>
                    setFormData({ ...formData, driverId: e.target.value })
                  }
                  required
                >
                  <option value="">Sélectionner un chauffeur</option>
                  {drivers.map((driver) => {
                    const userId = typeof driver.userId === "object" 
                      ? driver.userId 
                      : null;
                    return (
                      <option key={driver._id} value={driver._id}>
                        {userId?.name || userId?.email || driver.licenseNumber} - {driver.licenseNumber}
                      </option>
                    );
                  })}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="truckId">Camion *</Label>
                <Select
                  id="truckId"
                  value={formData.truckId}
                  onChange={(e) =>
                    setFormData({ ...formData, truckId: e.target.value })
                  }
                  required
                >
                  <option value="">Sélectionner un camion</option>
                  {trucks
                    .filter((truck) => truck.status === "available" || truck._id === formData.truckId)
                    .map((truck) => (
                      <option key={truck._id} value={truck._id}>
                        {truck.licensePlate} - {truck.brand} {truck.model}
                      </option>
                    ))}
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="trailerId">Remorque (optionnel)</Label>
              <Select
                id="trailerId"
                value={formData.trailerId}
                onChange={(e) =>
                  setFormData({ ...formData, trailerId: e.target.value })
                }
              >
                <option value="">Aucune remorque</option>
                {/* TODO: Add trailer selection when trailer service is available */}
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origin">Origine *</Label>
                <Input
                  id="origin"
                  value={formData.origin}
                  onChange={(e) =>
                    setFormData({ ...formData, origin: e.target.value })
                  }
                  required
                  placeholder="Ville de départ"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Destination *</Label>
                <Input
                  id="destination"
                  value={formData.destination}
                  onChange={(e) =>
                    setFormData({ ...formData, destination: e.target.value })
                  }
                  required
                  placeholder="Ville d'arrivée"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departureDate">Date de départ *</Label>
                <Input
                  id="departureDate"
                  type="date"
                  value={formData.departureDate}
                  onChange={(e) =>
                    setFormData({ ...formData, departureDate: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mileageStart">Kilométrage de départ *</Label>
                <Input
                  id="mileageStart"
                  type="number"
                  value={formData.mileageStart}
                  onChange={(e) =>
                    setFormData({ ...formData, mileageStart: parseInt(e.target.value) })
                  }
                  required
                  min={0}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Statut *</Label>
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
                <option value="pending">En attente</option>
                <option value="in_progress">En cours</option>
                <option value="completed">Terminé</option>
                <option value="cancelled">Annulé</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optionnel)</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Notes supplémentaires"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit">
                {editingTrip ? "Modifier" : "Créer"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
