import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2, FileDown } from "lucide-react";
import jsPDF from "jspdf";

interface BalanceRecord {
  id: string;
  tenant_id: string;
  house_no: string;
  tenant_name: string;
  phone: string;
  month: string;
  balance: number;
  total_balance: number;
}

export function BalanceTable() {
  const [records, setRecords] = useState<BalanceRecord[]>([]);

  useEffect(() => {
    fetchBalances();
  }, []);

  const fetchBalances = async () => {
    const { data, error } = await supabase.from("balances").select(`
        id,
        tenant_id,
        month,
        balance,
        total_balance,
        tenants (
          id,
          house_no,
          name,
          phone
        )
      `);

    if (error) {
      console.error("Error fetching balances:", error);
      return;
    }

    const mapped = (data || []).map((row: any) => ({
      id: row.id,
      tenant_id: row.tenant_id,
      house_no: row.tenants?.house_no || "",
      tenant_name: row.tenants?.name || "",
      phone: row.tenants?.phone || "",
      month: row.month,
      balance: row.balance,
      total_balance: row.total_balance,
    }));

    setRecords(mapped);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("balances").delete().eq("id", id);
    if (error) console.error("Error deleting balance:", error);
    fetchBalances();
  };

  const downloadReceipt = (record: BalanceRecord) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Jodama Apartment", 20, 20);
    doc.setFontSize(12);

    doc.text(`Tenant Name: ${record.tenant_name}`, 20, 40);
    doc.text(`House Number: ${record.house_no}`, 20, 50);
    doc.text(`Phone: ${record.phone}`, 20, 60);
    doc.text(`Month: ${record.month}`, 20, 80);
    doc.text(`Balance: ${record.balance}`, 20, 90);
    doc.text(`Total Balance: ${record.total_balance}`, 20, 110);

    doc.save(`Balance_${record.tenant_name}.pdf`);
  };

  return (
    <Card className="p-6 shadow-lg rounded-2xl">
      <CardContent>
        <h2 className="text-xl font-bold mb-4">Balances</h2>

        <table className="w-full border-collapse border rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">House No</th>
              <th className="p-2 border">Tenant Name</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Month</th>
              <th className="p-2 border">Balance</th>
              <th className="p-2 border">Total Balance</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => (
              <tr key={rec.id} className="text-center">
                <td className="p-2 border">{rec.house_no}</td>
                <td className="p-2 border">{rec.tenant_name}</td>
                <td className="p-2 border">{rec.phone}</td>
                <td className="p-2 border">{rec.month}</td>
                <td className="p-2 border">{rec.balance}</td>
                <td className="p-2 border">{rec.total_balance}</td>
                <td className="p-2 border flex justify-center gap-2">
                  <Button size="sm">
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
    </Card>
  );
}
