import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { TenantForm } from "@/components/tenants/TenantForm";

interface Tenant {
  id: string;
  house_no: string;
  name: string;
  phone: string;
  national_id: string;
  email: string;
}

const TenantsTable: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);

  // Fetch tenants
  const fetchTenants = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("tenants").select("*");
    if (error) console.error("Error fetching tenants:", error);
    else setTenants(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  // Add or edit tenant
  const handleFormSubmit = async (tenant: Tenant) => {
    if (tenant.id) {
      // update
      const { data, error } = await supabase
        .from("tenants")
        .update({
          house_no: tenant.house_no,
          name: tenant.name,
          phone: tenant.phone,
          national_id: tenant.national_id,
          email: tenant.email,
        })
        .eq("id", tenant.id)
        .select();

      if (error) console.error("Error updating tenant:", error);
      else if (data)
        setTenants((prev) =>
          prev.map((t) => (t.id === tenant.id ? data[0] : t))
        );
    } else {
      // insert
      const { data, error } = await supabase
        .from("tenants")
        .insert([tenant])
        .select();

      if (error) console.error("Error adding tenant:", error);
      else if (data) setTenants([...tenants, ...data]);
    }
  };

  // Delete tenant
  const deleteTenant = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this tenant?"
    );
    if (!confirmDelete) return;

    const { error } = await supabase.from("tenants").delete().eq("id", id);
    if (error) console.error("Error deleting tenant:", error);
    else setTenants(tenants.filter((t) => t.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Tenants</h2>
        <Button
          onClick={() => {
            setEditingTenant(null);
            setShowForm(true);
          }}
        >
          Add Tenant
        </Button>
      </div>

      {loading ? (
        <p>Loading tenants...</p>
      ) : (
        <table className="w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">House Number</th>
              <th className="p-2 border">Tenant Name</th>
              <th className="p-2 border">Phone Number</th>
              <th className="p-2 border">National ID</th>
              <th className="p-2 border">Email Address</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenants.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-4">
                  No tenants found.
                </td>
              </tr>
            ) : (
              tenants.map((tenant) => (
                <tr key={tenant.id}>
                  <td className="p-2 border">{tenant.house_no}</td>
                  <td className="p-2 border">{tenant.name}</td>
                  <td className="p-2 border">{tenant.phone}</td>
                  <td className="p-2 border">{tenant.national_id}</td>
                  <td className="p-2 border">{tenant.email}</td>
                  <td className="p-2 border space-x-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        setEditingTenant(tenant);
                        setShowForm(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteTenant(tenant.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      <TenantForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleFormSubmit}
        initialData={editingTenant || undefined}
      />
    </div>
  );
};

export default TenantsTable;
