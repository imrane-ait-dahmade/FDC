import { useEffect, useState } from "react";
import { truckService } from "@/services/truck.service";
import type { Truck as TruckType } from "@/types";
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

export const AdminTrucks = () => {
  const [trucks, setTrucks] = useState<TruckType[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTruck, setEditingTruck] = useState<TruckType | null>(null);
  const [formData, setFormData] = useState({
    licensePlate: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    mileage: 0,
    status: "available" as TruckType["status"],
  });

  useEffect(() => {
    fetchTrucks();
  }, []);

  const fetchTrucks = async () => {
    try {
      setLoading(true);
      const data = await truckService.getAll();
      setTrucks(data);
    } catch (error) {
      console.error("Error fetching trucks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (truck?: TruckType) => {
    if (truck) {
      setEditingTruck(truck);
      setFormData({
        licensePlate: truck.licensePlate,
        brand: truck.brand,
        model: truck.model,
        year: truck.year,
        mileage: truck.mileage,
        status: truck.status,
      });
    } else {
      setEditingTruck(null);
      setFormData({
        licensePlate: "",
        brand: "",
        model: "",
        year: new Date().getFullYear(),
        mileage: 0,
        status: "available",
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTruck) {
        await truckService.update(editingTruck._id, formData);
      } else {
        await truckService.create(formData);
      }
      setDialogOpen(false);
      fetchTrucks();
    } catch (error) {
      console.error("Error saving truck:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce camion ?")) {
      try {
        await truckService.delete(id);
        fetchTrucks();
      } catch (error) {
        console.error("Error deleting truck:", error);
      }
    }
  };

  const getStatusBadge = (status: TruckType["status"]) => {
    const variants: Record<TruckType["status"], "default" | "secondary" | "destructive" | "outline"> = {
      available: "default",
      in_use: "secondary",
      maintenance: "destructive",
      out_of_service: "outline",
    };
    const labels: Record<TruckType["status"], string> = {
      available: "Disponible",
      in_use: "En utilisation",
      maintenance: "Maintenance",
      out_of_service: "Hors service",
    };
    return (
      <Badge variant={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Camions</h1>
          <p className="text-muted-foreground mt-2">
            Gérez votre flotte de camions
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un camion
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
                  <TableHead>Plaque d'immatriculation</TableHead>
                  <TableHead>Marque</TableHead>
                  <TableHead>Modèle</TableHead>
                  <TableHead>Année</TableHead>
                  <TableHead>Kilométrage</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trucks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Aucun camion trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  trucks.map((truck) => (
                    <TableRow key={truck._id}>
                      <TableCell className="font-medium">
                        {truck.licensePlate}
                      </TableCell>
                      <TableCell>{truck.brand}</TableCell>
                      <TableCell>{truck.model}</TableCell>
                      <TableCell>{truck.year}</TableCell>
                      <TableCell>{truck.mileage.toLocaleString()} km</TableCell>
                      <TableCell>{getStatusBadge(truck.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(truck)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(truck._id)}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTruck ? "Modifier le camion" : "Nouveau camion"}
            </DialogTitle>
            <DialogDescription>
              {editingTruck
                ? "Modifiez les informations du camion"
                : "Remplissez les informations du nouveau camion"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="licensePlate">Plaque d'immatriculation</Label>
              <Input
                id="licensePlate"
                value={formData.licensePlate}
                onChange={(e) =>
                  setFormData({ ...formData, licensePlate: e.target.value.toUpperCase() })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Marque</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Modèle</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Année</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: parseInt(e.target.value) })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mileage">Kilométrage</Label>
                <Input
                  id="mileage"
                  type="number"
                  value={formData.mileage}
                  onChange={(e) =>
                    setFormData({ ...formData, mileage: parseInt(e.target.value) })
                  }
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as TruckType["status"],
                  })
                }
                required
              >
                <option value="available">Disponible</option>
                <option value="in_use">En utilisation</option>
                <option value="maintenance">Maintenance</option>
                <option value="out_of_service">Hors service</option>
              </Select>
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
                {editingTruck ? "Modifier" : "Créer"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

