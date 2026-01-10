import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export const DriverProfile = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Mon Profil</h1>
        <p className="text-muted-foreground mt-2">
          Informations de votre compte
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations Personnelles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-muted-foreground">Email</Label>
            <p className="mt-1 font-medium">{user?.email}</p>
          </div>
          {user?.name && (
            <div>
              <Label className="text-muted-foreground">Nom</Label>
              <p className="mt-1 font-medium">{user.name}</p>
            </div>
          )}
          <div>
            <Label className="text-muted-foreground">Rôle</Label>
            <p className="mt-1 font-medium capitalize">{user?.role}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

