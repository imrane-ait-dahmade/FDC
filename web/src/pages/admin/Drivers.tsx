import { useEffect, useState } from "react";
import { driverService, type DriverWithUser } from "@/services/driver.service";
import { authService } from "@/services/auth.service";
import type { User } from "@/types";
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
import { Plus, Edit, Trash2, User as UserIcon } from "lucide-react";
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

export const AdminDrivers = () => {
  const [drivers, setDrivers] = useState<DriverWithUser[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<DriverWithUser | null>(null);
  const [createNewUser, setCreateNewUser] = useState(true);
  const [formData, setFormData] = useState({
    userId: "",
    email: "",
    password: "",
    name: "",
    licenseNumber: "",
    licenseExpiryDate: "",
    phoneNumber: "",
    address: "",
    hireDate: new Date().toISOString().split("T")[0],
    status: "active" as DriverWithUser["status"],
  });

  useEffect(() => {
    fetchDrivers();
    if (!editingDriver) {
      fetchAvailableUsers();
    }
  }, [editingDriver]);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const data = await driverService.getAll();
      setDrivers(data);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      const users = await authService.getAvailableDrivers();
      setAvailableUsers(users);
    } catch (error) {
      console.error("Error fetching available users:", error);
    }
  };

  const handleOpenDialog = (driver?: DriverWithUser) => {
    if (driver) {
      setEditingDriver(driver);
      const userId = typeof driver.userId === "string" ? driver.userId : driver.userId._id;
      setFormData({
        userId,
        licenseNumber: driver.licenseNumber,
        licenseExpiryDate: new Date(driver.licenseExpiryDate).toISOString().split("T")[0],
        phoneNumber: driver.phoneNumber,
        address: driver.address || "",
        hireDate: new Date(driver.hireDate).toISOString().split("T")[0],
        status: driver.status,
      });
    } else {
      setEditingDriver(null);
      setCreateNewUser(true);
      setFormData({
        userId: "",
        email: "",
        password: "",
        name: "",
        licenseNumber: "",
        licenseExpiryDate: "",
        phoneNumber: "",
        address: "",
        hireDate: new Date().toISOString().split("T")[0],
        status: "active",
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDriver) {
        // Remove user creation fields when updating
        const { email, password, name, ...updateData } = formData;
        await driverService.update(editingDriver._id, updateData);
      } else {
        // Prepare data for creation
        const createData: any = { ...formData };
        if (createNewUser) {
          // Remove userId if creating new user
          delete createData.userId;
        } else {
          // Remove user creation fields if using existing user
          delete createData.email;
          delete createData.password;
          delete createData.name;
        }
        await driverService.create(createData);
      }
      setDialogOpen(false);
      fetchDrivers();
      fetchAvailableUsers();
    } catch (error: any) {
      console.error("Error saving driver:", error);
      alert(error.response?.data?.error || "Erreur lors de la sauvegarde");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce chauffeur ?")) {
      try {
        await driverService.delete(id);
        fetchDrivers();
      } catch (error) {
        console.error("Error deleting driver:", error);
      }
    }
  };

  const handleStatusChange = async (id: string, status: "active" | "inactive" | "suspended") => {
    try {
      await driverService.updateStatus(id, status);
      fetchDrivers();
    } catch (error) {
      console.error("Error updating driver status:", error);
    }
  };

  const getStatusBadge = (status: DriverWithUser["status"]) => {
    const variants: Record<DriverWithUser["status"], "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      inactive: "secondary",
      suspended: "destructive",
    };
    const labels: Record<DriverWithUser["status"], string> = {
      active: "Actif",
      inactive: "Inactif",
      suspended: "Suspendu",
    };
    return (
      <Badge variant={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const getUserInfo = (driver: DriverWithUser) => {
    if (typeof driver.userId === "string") {
      return { email: "N/A", name: "N/A" };
    }
    return {
      email: driver.userId.email,
      name: driver.userId.name || driver.userId.email,
    };
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Chauffeurs</h1>
          <p className="text-muted-foreground mt-2">
            Gérez les profils de vos chauffeurs
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un chauffeur
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
                  <TableHead>Nom / Email</TableHead>
                  <TableHead>Numéro de permis</TableHead>
                  <TableHead>Expiration permis</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead>Date d'embauche</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {drivers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Aucun chauffeur trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  drivers.map((driver) => {
                    const userInfo = getUserInfo(driver);
                    return (
                      <TableRow key={driver._id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <UserIcon className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <div>{userInfo.name}</div>
                              <div className="text-xs text-muted-foreground">{userInfo.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{driver.licenseNumber}</TableCell>
                        <TableCell>
                          {new Date(driver.licenseExpiryDate).toLocaleDateString("fr-FR")}
                        </TableCell>
                        <TableCell>{driver.phoneNumber}</TableCell>
                        <TableCell>
                          {new Date(driver.hireDate).toLocaleDateString("fr-FR")}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={driver.status}
                            onChange={(e) =>
                              handleStatusChange(
                                driver._id,
                                e.target.value as DriverWithUser["status"]
                              )
                            }
                            className="w-32"
                          >
                            <option value="active">Actif</option>
                            <option value="inactive">Inactif</option>
                            <option value="suspended">Suspendu</option>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenDialog(driver)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(driver._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingDriver ? "Modifier le chauffeur" : "Nouveau chauffeur"}
            </DialogTitle>
            <DialogDescription>
              {editingDriver
                ? "Modifiez les informations du chauffeur"
                : "Remplissez les informations du nouveau chauffeur"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!editingDriver && (
              <div className="space-y-2">
                <Label>Créer un nouvel utilisateur ou utiliser un existant ?</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={createNewUser}
                      onChange={() => setCreateNewUser(true)}
                    />
                    <span>Créer un nouvel utilisateur</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={!createNewUser}
                      onChange={() => setCreateNewUser(false)}
                    />
                    <span>Utiliser un utilisateur existant</span>
                  </label>
                </div>
              </div>
            )}

            {!editingDriver && createNewUser ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    placeholder="driver@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    minLength={6}
                    placeholder="Minimum 6 caractères"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Nom (optionnel)</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Nom du chauffeur"
                  />
                </div>
              </>
            ) : !editingDriver ? (
              <div className="space-y-2">
                <Label htmlFor="userId">Sélectionner un utilisateur *</Label>
                <Select
                  id="userId"
                  value={formData.userId}
                  onChange={(e) =>
                    setFormData({ ...formData, userId: e.target.value })
                  }
                  required
                >
                  <option value="">Sélectionner un utilisateur</option>
                  {availableUsers.length === 0 ? (
                    <option value="" disabled>
                      Aucun utilisateur driver disponible
                    </option>
                  ) : (
                    availableUsers.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name || user.email} ({user.email})
                      </option>
                    ))
                  )}
                </Select>
                {availableUsers.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Aucun utilisateur avec le rôle "driver" disponible. Créez un nouvel utilisateur ci-dessus.
                  </p>
                )}
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="licenseNumber">Numéro de permis</Label>
              <Input
                id="licenseNumber"
                value={formData.licenseNumber}
                onChange={(e) =>
                  setFormData({ ...formData, licenseNumber: e.target.value.toUpperCase() })
                }
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="licenseExpiryDate">Date d'expiration du permis</Label>
                <Input
                  id="licenseExpiryDate"
                  type="date"
                  value={formData.licenseExpiryDate}
                  onChange={(e) =>
                    setFormData({ ...formData, licenseExpiryDate: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hireDate">Date d'embauche</Label>
                <Input
                  id="hireDate"
                  type="date"
                  value={formData.hireDate}
                  onChange={(e) =>
                    setFormData({ ...formData, hireDate: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Numéro de téléphone</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                required
                placeholder="+1234567890"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Adresse (optionnel)</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="123 Rue Example, Ville"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as DriverWithUser["status"],
                  })
                }
                required
              >
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="suspended">Suspendu</option>
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
                {editingDriver ? "Modifier" : "Créer"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
