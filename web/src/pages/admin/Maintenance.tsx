import { useEffect, useState } from "react";
import { maintenanceService } from "@/services/maintenance.service";
import { truckService } from "@/services/truck.service";
import type { Maintenance } from "@/types";
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

export const AdminMaintenance = () => {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [trucks, setTrucks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState<Maintenance | null>(null);
  const [formData, setFormData] = useState({
    type: "oil_change" as Maintenance["type"],
    truckId: "",
    trailerId: "",
    tireId: "",
    scheduledDate: new Date().toISOString().split("T")[0],
    mileage: 0,
    cost: 0,
    description: "",
    status: "scheduled" as Maintenance["status"],
    technician: "",
    notes: "",
  });

  useEffect(() => {
    fetchMaintenances();
    fetchTrucks();
  }, []);

  const fetchMaintenances = async () => {
    try {
      setLoading(true);
      const data = await maintenanceService.getAll();
      setMaintenances(data);
    } catch (error) {
      console.error("Error fetching maintenances:", error);
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

  const handleOpenDialog = (maintenance?: Maintenance) => {
    if (maintenance) {
      setEditingMaintenance(maintenance);
      const truckId = typeof maintenance.truckId === "object" && maintenance.truckId !== null
        ? (maintenance.truckId as any)._id
        : maintenance.truckId || "";
      const trailerId = typeof maintenance.trailerId === "object" && maintenance.trailerId !== null
        ? (maintenance.trailerId as any)._id
        : maintenance.trailerId || "";
      const tireId = typeof maintenance.tireId === "object" && maintenance.tireId !== null
        ? (maintenance.tireId as any)._id
        : maintenance.tireId || "";
      
      setFormData({
        type: maintenance.type,
        truckId: String(truckId),
        trailerId: String(trailerId),
        tireId: String(tireId),
        scheduledDate: new Date(maintenance.scheduledDate).toISOString().split("T")[0],
        mileage: maintenance.mileage,
        cost: maintenance.cost || 0,
        description: maintenance.description,
        status: maintenance.status,
        technician: maintenance.technician || "",
        notes: maintenance.notes || "",
      });
    } else {
      setEditingMaintenance(null);
      setFormData({
        type: "oil_change",
        truckId: "",
        trailerId: "",
        tireId: "",
        scheduledDate: new Date().toISOString().split("T")[0],
        mileage: 0,
        cost: 0,
        description: "",
        status: "scheduled",
        technician: "",
        notes: "",
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData: any = { ...formData };
      if (!submitData.truckId) delete submitData.truckId;
      if (!submitData.trailerId) delete submitData.trailerId;
      if (!submitData.tireId) delete submitData.tireId;
      if (!submitData.cost || submitData.cost === 0) delete submitData.cost;
      if (!submitData.technician) delete submitData.technician;
      if (!submitData.notes) delete submitData.notes;

      if (editingMaintenance) {
        await maintenanceService.update(editingMaintenance._id, submitData);
      } else {
        await maintenanceService.create(submitData);
      }
      setDialogOpen(false);
      fetchMaintenances();
    } catch (error: any) {
      console.error("Error saving maintenance:", error);
      alert(error.response?.data?.error || "Erreur lors de la sauvegarde");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette opération de maintenance ?")) {
      try {
        await maintenanceService.delete(id);
        fetchMaintenances();
      } catch (error) {
        console.error("Error deleting maintenance:", error);
      }
    }
  };

  const getStatusBadge = (status: Maintenance["status"]) => {
    const variants: Record<Maintenance["status"], "default" | "secondary" | "destructive" | "outline"> = {
      scheduled: "outline",
      in_progress: "default",
      completed: "secondary",
      cancelled: "destructive",
    };
    const labels: Record<Maintenance["status"], string> = {
      scheduled: "Planifiée",
      in_progress: "En cours",
      completed: "Terminée",
      cancelled: "Annulée",
    };
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const getTypeLabel = (type: Maintenance["type"]) => {
    const labels: Record<Maintenance["type"], string> = {
      oil_change: "Vidange",
      tire_replacement: "Remplacement pneus",
      inspection: "Inspection",
      repair: "Réparation",
      other: "Autre",
    };
    return labels[type];
  };

  const getTruckInfo = (truck: Maintenance["truckId"]) => {
    if (typeof truck === "object" && truck !== null) {
      return `${truck.licensePlate} - ${truck.brand} ${truck.model}`;
    }
    return truck || "N/A";
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion de la Maintenance</h1>
          <p className="text-muted-foreground mt-2">
            Gérez les opérations de maintenance de la flotte
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle maintenance
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
                  <TableHead>Type</TableHead>
                  <TableHead>Camion</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date prévue</TableHead>
                  <TableHead>Kilométrage</TableHead>
                  <TableHead>Coût</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maintenances.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Aucune maintenance trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  maintenances.map((maintenance) => (
                    <TableRow key={maintenance._id}>
                      <TableCell className="font-medium">
                        {getTypeLabel(maintenance.type)}
                      </TableCell>
                      <TableCell>{getTruckInfo(maintenance.truckId)}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {maintenance.description}
                      </TableCell>
                      <TableCell>
                        {format(new Date(maintenance.scheduledDate), "dd/MM/yyyy", {
                          locale: fr,
                        })}
                      </TableCell>
                      <TableCell>{maintenance.mileage.toLocaleString()} km</TableCell>
                      <TableCell>
                        {maintenance.cost ? `${maintenance.cost.toLocaleString()} €` : "-"}
                      </TableCell>
                      <TableCell>{getStatusBadge(maintenance.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(maintenance)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(maintenance._id)}
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
              {editingMaintenance ? "Modifier la maintenance" : "Nouvelle maintenance"}
            </DialogTitle>
            <DialogDescription>
              {editingMaintenance
                ? "Modifiez les informations de la maintenance"
                : "Remplissez les informations de la nouvelle opération de maintenance"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type de maintenance *</Label>
                <Select
                  id="type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as Maintenance["type"],
                    })
                  }
                  required
                >
                  <option value="oil_change">Vidange</option>
                  <option value="tire_replacement">Remplacement pneus</option>
                  <option value="inspection">Inspection</option>
                  <option value="repair">Réparation</option>
                  <option value="other">Autre</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Statut *</Label>
                <Select
                  id="status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as Maintenance["status"],
                    })
                  }
                  required
                >
                  <option value="scheduled">Planifiée</option>
                  <option value="in_progress">En cours</option>
                  <option value="completed">Terminée</option>
                  <option value="cancelled">Annulée</option>
                </Select>
              </div>
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
                {trucks.map((truck) => (
                  <option key={truck._id} value={truck._id}>
                    {truck.licensePlate} - {truck.brand} {truck.model}
                  </option>
                ))}
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduledDate">Date prévue *</Label>
                <Input
                  id="scheduledDate"
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) =>
                    setFormData({ ...formData, scheduledDate: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mileage">Kilométrage *</Label>
                <Input
                  id="mileage"
                  type="number"
                  value={formData.mileage}
                  onChange={(e) =>
                    setFormData({ ...formData, mileage: parseInt(e.target.value) })
                  }
                  required
                  min={0}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
                placeholder="Description de la maintenance"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cost">Coût (€)</Label>
                <Input
                  id="cost"
                  type="number"
                  value={formData.cost}
                  onChange={(e) =>
                    setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })
                  }
                  min={0}
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="technician">Technicien</Label>
                <Input
                  id="technician"
                  value={formData.technician}
                  onChange={(e) =>
                    setFormData({ ...formData, technician: e.target.value })
                  }
                  placeholder="Nom du technicien"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
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
                {editingMaintenance ? "Modifier" : "Créer"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
