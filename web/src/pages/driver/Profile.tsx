import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { driverService, type DriverWithUser } from "@/services/driver.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export const DriverProfile = () => {
  const { user } = useAuth();
  const [driverProfile, setDriverProfile] = useState<DriverWithUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profile = await driverService.getMyProfile();
      setDriverProfile(profile);
    } catch (error) {
      console.error("Error fetching driver profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      inactive: "secondary",
      suspended: "destructive",
    };
    const labels: Record<string, string> = {
      active: "Actif",
      inactive: "Inactif",
      suspended: "Suspendu",
    };
    return (
      <Badge variant={variants[status] || "outline"}>
        {labels[status] || status}
      </Badge>
    );
  };

  const getUserInfo = (driver: DriverWithUser) => {
    if (typeof driver.userId === "string") {
      return { email: user?.email || "N/A", name: user?.name || "N/A" };
    }
    return {
      email: driver.userId.email,
      name: driver.userId.name || driver.userId.email,
    };
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Mon Profil</h1>
          <p className="text-muted-foreground mt-2">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!driverProfile) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Mon Profil</h1>
          <p className="text-muted-foreground mt-2">
            Profil chauffeur non trouvé
          </p>
        </div>
      </div>
    );
  }

  const userInfo = getUserInfo(driverProfile);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Mon Profil</h1>
        <p className="text-muted-foreground mt-2">
          Informations de votre compte et profil chauffeur
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations Personnelles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-muted-foreground">Email</Label>
            <p className="mt-1 font-medium">{userInfo.email}</p>
          </div>
          {userInfo.name && (
            <div>
              <Label className="text-muted-foreground">Nom</Label>
              <p className="mt-1 font-medium">{userInfo.name}</p>
            </div>
          )}
          <div>
            <Label className="text-muted-foreground">Rôle</Label>
            <p className="mt-1 font-medium capitalize">{user?.role}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informations Chauffeur</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-muted-foreground">Numéro de permis</Label>
            <p className="mt-1 font-medium">{driverProfile.licenseNumber}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Date d'expiration du permis</Label>
            <p className="mt-1 font-medium">
              {new Date(driverProfile.licenseExpiryDate).toLocaleDateString("fr-FR")}
            </p>
          </div>
          <div>
            <Label className="text-muted-foreground">Numéro de téléphone</Label>
            <p className="mt-1 font-medium">{driverProfile.phoneNumber}</p>
          </div>
          {driverProfile.address && (
            <div>
              <Label className="text-muted-foreground">Adresse</Label>
              <p className="mt-1 font-medium">{driverProfile.address}</p>
            </div>
          )}
          <div>
            <Label className="text-muted-foreground">Date d'embauche</Label>
            <p className="mt-1 font-medium">
              {new Date(driverProfile.hireDate).toLocaleDateString("fr-FR")}
            </p>
          </div>
          <div>
            <Label className="text-muted-foreground">Statut</Label>
            <div className="mt-1">{getStatusBadge(driverProfile.status)}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

