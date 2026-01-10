import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Trip } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";

export const generateTripPDF = (trip: Trip) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.text("ORDRE DE MISSION", 105, 20, { align: "center" });

  doc.setFontSize(12);
  doc.text(`Numéro: ${trip.tripNumber}`, 20, 35);

  // Trip information
  const tripData = [
    ["Origine", trip.origin],
    ["Destination", trip.destination],
    [
      "Date de départ",
      format(new Date(trip.departureDate), "dd/MM/yyyy à HH:mm", { locale: fr }),
    ],
    ["Kilométrage départ", `${trip.mileageStart.toLocaleString()} km`],
  ];

  if (trip.arrivalDate) {
    tripData.push([
      "Date d'arrivée",
      format(new Date(trip.arrivalDate), "dd/MM/yyyy à HH:mm", { locale: fr }),
    ]);
  }

  if (trip.mileageEnd) {
    tripData.push([
      "Kilométrage arrivée",
      `${trip.mileageEnd.toLocaleString()} km`,
    ]);
  }

  if (trip.fuelConsumption) {
    tripData.push(["Consommation", `${trip.fuelConsumption} L`]);
  }

  autoTable(doc, {
    startY: 45,
    head: [["Information", "Valeur"]],
    body: tripData,
    theme: "striped",
    headStyles: { fillColor: [0, 0, 0] },
  });

  // Status
  const statusLabels: Record<Trip["status"], string> = {
    pending: "En attente",
    in_progress: "En cours",
    completed: "Terminé",
    cancelled: "Annulé",
  };

  doc.setFontSize(10);
  doc.text(
    `Statut: ${statusLabels[trip.status]}`,
    20,
    (doc as any).lastAutoTable.finalY + 10
  );

  // Notes
  if (trip.notes) {
    doc.text(
      `Remarques: ${trip.notes}`,
      20,
      (doc as any).lastAutoTable.finalY + 20
    );
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Page ${i} sur ${pageCount}`,
      105,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }

  // Save the PDF
  doc.save(`ordre-mission-${trip.tripNumber}.pdf`);
};

