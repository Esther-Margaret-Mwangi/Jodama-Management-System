import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FinanceFormProps {
  payment?: any;
  onClose: () => void;
  onSave: () => void;
}

export default function FinanceForm({
  payment,
  onClose,
  onSave,
}: FinanceFormProps) {
  const [tenantInfo, setTenantInfo] = useState<{
    house_no: string;
    name: string;
    phone?: string;
  } | null>(null);

  const [form, setForm] = useState({
    base_rent: 0,
    garbage_fee: 200,
    water_units: 0,
    wifi_fee: 0,
    amount_paid: 0,
    month: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    if (payment) {
      setForm({
        base_rent: payment.base_rent,
        garbage_fee: payment.garbage_fee,
        water_units: payment.water_units,
        wifi_fee: payment.wifi_fee,
        amount_paid: payment.amount_paid,
        month: payment.month || new Date().toISOString().slice(0, 10),
      });
      setTenantInfo({
        house_no: payment.house_no,
        name: payment.tenant_name,
        phone: payment.phone,
      });
    }
  }, [payment]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      tenant_id: payment?.tenant_id,
      base_rent: Number(form.base_rent),
      garbage_fee: Number(form.garbage_fee),
      water_units: Number(form.water_units),
      wifi_fee: Number(form.wifi_fee),
      amount_paid: Number(form.amount_paid),
      month: form.month,
    };

    try {
      if (payment?.id) {
        // update existing record
        const { error } = await supabase
          .from("payments")
          .update(payload)
          .eq("id", payment.id);
        if (error) throw error;
      } else {
        // insert new record
        const { error } = await supabase.from("payments").insert([payload]);
        if (error) throw error;
      }

      onSave();
      onClose();
    } catch (err) {
      console.error("Error saving payment:", err);
      alert("Failed to save record. Check console for details.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg max-h-[90vh] flex flex-col bg-white rounded-lg shadow-lg">
        <CardContent className="overflow-y-auto p-6">
          <h2 className="text-xl font-bold mb-4">
            {payment ? "Edit Payment" : "Add Payment"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {tenantInfo && (
              <div className="p-3 bg-gray-100 rounded">
                <p>
                  <strong>Tenant:</strong> {tenantInfo.name}
                </p>
                <p>
                  <strong>House No:</strong> {tenantInfo.house_no}
                </p>
                {tenantInfo.phone && (
                  <p>
                    <strong>Phone:</strong> {tenantInfo.phone}
                  </p>
                )}
              </div>
            )}

            <div>
              <Label>Base Rent</Label>
              <Input
                type="number"
                name="base_rent"
                value={form.base_rent}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Garbage Fee</Label>
              <Input
                type="number"
                name="garbage_fee"
                value={form.garbage_fee}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Water Units</Label>
              <Input
                type="number"
                name="water_units"
                value={form.water_units}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>WiFi Fee</Label>
              <Input
                type="number"
                name="wifi_fee"
                value={form.wifi_fee}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Amount Paid</Label>
              <Input
                type="number"
                name="amount_paid"
                value={form.amount_paid}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label>Month</Label>
              <Input
                type="date"
                name="month"
                value={form.month}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">{payment ? "Update" : "Save"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
