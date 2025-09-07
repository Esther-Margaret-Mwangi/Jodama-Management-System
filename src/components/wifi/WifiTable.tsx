import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface Tenant {
  id: string;
  house_no: string;
  wifi_password: string | null;
  has_wifi: boolean;
}

export function WifiTable() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch tenants with wifi info
  const fetchTenants = async () => {
    const { data, error } = await supabase
      .from("tenants")
      .select("id, house_no, wifi_password, has_wifi")
      .order("house_no");

    if (error) {
      console.error("Error fetching tenants:", error);
    } else {
      setTenants(data || []);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  // Save edits to supabase
  const handleSave = async () => {
    if (!editingTenant) return;

    setLoading(true);
    const { error } = await supabase
      .from("tenants")
      .update({
        wifi_password: editingTenant.wifi_password,
        has_wifi: editingTenant.has_wifi,
      })
      .eq("id", editingTenant.id);

    setLoading(false);

    if (error) {
      console.error("Error updating tenant wifi:", error);
    } else {
      setEditingTenant(null);
      fetchTenants();
    }
  };

  // Delete wifi info (just clears wifi fields)
  const handleDelete = async (tenantId: string) => {
    const { error } = await supabase
      .from("tenants")
      .update({ wifi_password: null, has_wifi: false })
      .eq("id", tenantId);

    if (error) {
      console.error("Error deleting wifi info:", error);
    } else {
      fetchTenants();
    }
  };

  return (
    <Card className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">WiFi Management</h2>
      <table className="w-full border-collapse border border-gray-200 text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">House Number</th>
            <th className="p-2 border">WiFi Password</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((tenant) => (
            <tr key={tenant.id} className="hover:bg-gray-50">
              <td className="p-2 border">{tenant.house_no}</td>
              <td className="p-2 border">
                {tenant.wifi_password || "Not set"}
              </td>
              <td className="p-2 border">
                {tenant.has_wifi ? "Connected" : "Disconnected"}
              </td>
              <td className="p-2 border space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingTenant(tenant)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(tenant.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editingTenant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 w-full max-w-md bg-white rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              Edit WiFi - House {editingTenant.house_no}
            </h3>
            <div className="space-y-4">
              <div>
                <Label>WiFi Password</Label>
                <Input
                  type="text"
                  value={editingTenant.wifi_password || ""}
                  onChange={(e) =>
                    setEditingTenant({
                      ...editingTenant,
                      wifi_password: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={editingTenant.has_wifi}
                  onCheckedChange={(checked) =>
                    setEditingTenant({ ...editingTenant, has_wifi: checked })
                  }
                />
                <Label>
                  {editingTenant.has_wifi ? "Connected" : "Disconnected"}
                </Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="secondary"
                  onClick={() => setEditingTenant(null)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </Card>
  );
}
