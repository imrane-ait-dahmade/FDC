import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { truckService } from "@/services/truck.service";
import { tripService } from "@/services/trip.service";
import { Truck, Route, AlertCircle, CheckCircle } from "lucide-react";

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    trucks: 0,
    trips: 0,
    activeTrips: 0,
    availableTrucks: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [trucks, trips] = await Promise.all([
          truckService.getAll(),
          tripService.getAll(),
        ]);

        setStats({
          trucks: trucks.length,
          trips: trips.length,
          activeTrips: trips.filter((t) => t.status === "in_progress").length,
          availableTrucks: trucks.filter((t) => t.status === "available").length,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground mt-2">
          Vue d'ensemble de votre flotte
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Camions</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.trucks}</div>
            <p className="text-xs text-muted-foreground">
              {stats.availableTrucks} disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trajets</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.trips}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeTrips} en cours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trajets Actifs</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeTrips}</div>
            <p className="text-xs text-muted-foreground">En cours d'exécution</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Camions Disponibles</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.availableTrucks}</div>
            <p className="text-xs text-muted-foreground">Prêts à l'emploi</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

