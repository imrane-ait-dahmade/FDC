import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const AdminMaintenance = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Maintenance</h1>
        <p className="text-muted-foreground mt-2">
          Gérez les opérations de maintenance et configurez les règles de périodicité
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Opérations de Maintenance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Gestion des vidanges, révisions, remplacements de pneus, etc.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuration des Règles</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Configurez les périodicités pour les différents types de maintenance.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

