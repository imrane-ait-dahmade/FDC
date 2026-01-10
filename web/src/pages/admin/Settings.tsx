import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const AdminSettings = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground mt-2">
          Configurez les paramètres de l'application
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Paramètres Généraux</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Configuration générale de l'application.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

