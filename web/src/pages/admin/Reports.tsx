import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const AdminReports = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Rapports</h1>
        <p className="text-muted-foreground mt-2">
          Consultez les rapports de consommation, kilométrage et maintenance
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Rapport de Consommation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Analyse de la consommation de carburant par camion et par période.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rapport de Kilométrage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Suivi du kilométrage total et par véhicule.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rapport de Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Historique et planification des opérations de maintenance.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rapport des Pneus</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              État d'usure et remplacements des pneus.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

