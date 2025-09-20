import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2, FileDown } from "lucide-react";
import FinanceForm from "@/components/finance/FinanceForm";
import jsPDF from "jspdf";

interface FinanceRecord {
  id: string;
  house_no: string;
  tenant_name: string;
  phone: string;
  base_rent: number;
  garbage_fee: number;
  water_units: number;
  water_fee: number;
  wifi_fee: number;
  standing_order: number;
  arrears: number;
  total_rent: number;
  amount_paid: number;
  balance: number;
  status: string;
}

export function FinanceTable() {
  const [records, setRecords] = useState<FinanceRecord[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FinanceRecord | null>(
    null
  );

  useEffect(() => {
    fetchRecords();
  }, []);

  const calculateStatus = (total_rent: number, amount_paid: number) => {
    if (amount_paid === 0) return "Not Paid";
    if (amount_paid < total_rent) return "Not Cleared";
    return "Paid";
  };

  //Fetch payments data joined with tenants
  const fetchRecords = async () => {
    const { data, error } = await supabase.from("payments").select(
      `
        id,
        base_rent,
        garbage_fee,
        water_units,
        water_fee,
        wifi_fee,
        standing_order,
        arrears,
        total_due,
        amount_paid,
        balance,
        tenants (
          id,
          house_no,
          name,
          phone
        )
      `
    );

    if (error) {
      console.error("Error fetching finance data:", error);
      return;
    }

    const mapped = (data || []).map((row: any) => ({
      id: row.id,
      house_no: row.tenants?.house_no || "",
      tenant_name: row.tenants?.name || "",
      phone: row.tenants?.phone || "",
      base_rent: row.base_rent,
      garbage_fee: row.garbage_fee,
      water_units: row.water_units,
      water_fee: row.water_fee,
      wifi_fee: row.wifi_fee,
      standing_order: row.standing_order,
      arrears: row.arrears,
      total_rent: row.total_due,
      amount_paid: row.amount_paid,
      balance: row.balance,
      status: calculateStatus(row.total_due, row.amount_paid),
    }));

    setRecords(mapped);
  };

  //Add or Update
  const handleAddOrUpdate = async (record: FinanceRecord) => {
    const balance = record.total_rent - record.amount_paid;
    const status = calculateStatus(record.total_rent, record.amount_paid);

    if (record.id) {
      const { error } = await supabase
        .from("payments")
        .update({ ...record, balance, status })
        .eq("id", record.id);

      if (error) console.error("Error updating payment:", error);
    } else {
      const { error } = await supabase
        .from("payments")
        .insert([{ ...record, balance, status }]);

      if (error) console.error("Error inserting payment:", error);
    }

    fetchRecords();
  };

  //Delete record
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("payments").delete().eq("id", id);
    if (error) console.error("Error deleting payment:", error);
    fetchRecords();
  };

  // Generate receipt
  const downloadReceipt = (record: FinanceRecord) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Jodama Apartment", 20, 20);
    doc.setFontSize(12);
    doc.text(`Tenant Name: ${record.tenant_name}`, 20, 40);
    doc.text(`House Number: ${record.house_no}`, 20, 50);
    doc.text(`Base Rent: ${record.base_rent}`, 20, 70);
    doc.text(`Garbage Fee: ${record.garbage_fee}`, 20, 80);
    doc.text(`Water Units: ${record.water_units}`, 20, 90);
    doc.text(`Water Fee: ${record.water_fee}`, 20, 100);
    doc.text(`Wifi Fee: ${record.wifi_fee}`, 20, 110);
    doc.text(`Standing Order: ${record.standing_order}`, 20, 120);
    doc.text(`Arrears: ${record.arrears}`, 20, 130);
    doc.text(`Total Rent: ${record.total_rent}`, 20, 130);
    doc.text(`Amount Paid: ${record.amount_paid}`, 20, 140);
    doc.text(`Balance: ${record.balance}`, 20, 150);

    doc.save(`Receipt_${record.tenant_name}.pdf`);
  };

  return (
    <Card className="p-6 shadow-lg rounded-2xl">
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Finance Records</h2>
          <Button onClick={() => setFormOpen(true)}>Add Record</Button>
        </div>

        <table className="w-full border-collapse border rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">House No</th>
              <th className="p-2 border">Tenant Name</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Base Rent</th>
              <th className="p-2 border">Garbage Fee</th>
              <th className="p-2 border">Water Units</th>
              <th className="p-2 border">Water Fee</th>
              <th className="p-2 border">Wifi Fee</th>
              <th className="p-2 border">Standing Order</th>
              <th className="p-2 border">Arrears</th>
              <th className="p-2 border">Total Rent</th>
              <th className="p-2 border">Amount Paid</th>
              <th className="p-2 border">Balance</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => (
              <tr key={rec.id} className="text-center">
                <td className="p-2 border">{rec.house_no}</td>
                <td className="p-2 border">{rec.tenant_name}</td>
                <td className="p-2 border">{rec.phone}</td>
                <td className="p-2 border">{rec.base_rent}</td>
                <td className="p-2 border">{rec.garbage_fee}</td>
                <td className="p-2 border">{rec.water_units}</td>
                <td className="p-2 border">{rec.water_fee}</td>
                <td className="p-2 border">{rec.wifi_fee}</td>
                <td className="p-2 border">{rec.standing_order}</td>
                <td className="p-2 border">{rec.arrears}</td>
                <td className="p-2 border">{rec.total_rent}</td>
                <td className="p-2 border">{rec.amount_paid}</td>
                <td className="p-2 border">{rec.balance}</td>
                <td
                  className={`p-2 border font-semibold ${
                    rec.status === "Paid"
                      ? "text-green-600"
                      : rec.status === "Not Cleared"
                      ? "text-orange-500"
                      : "text-red-600"
                  }`}
                >
                  {rec.status}
                </td>
                <td className="p-2 border flex justify-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditingRecord(rec);
                      setFormOpen(true);
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(rec.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => downloadReceipt(rec)}
                  >
                    <FileDown className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>

      {formOpen && (
        <FinanceForm
          payment={editingRecord || undefined}
          onClose={() => {
            setFormOpen(false);
            setEditingRecord(null);
          }}
          onSave={fetchRecords}
        />
      )}
    </Card>
  );
}
