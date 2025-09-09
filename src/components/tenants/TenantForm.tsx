import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TenantFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (tenant: {
    id?: string;
    house_no: string;
    name: string;
    phone: string;
    national_id: string;
    email: string;
  }) => void;
  initialData?: {
    id?: string;
    house_no: string;
    name: string;
    phone: string;
    national_id: string;
    email: string;
  };
}

export function TenantForm({
  open,
  onClose,
  onSubmit,
  initialData,
}: TenantFormProps) {
  const [formData, setFormData] = useState({
    house_no: "",
    name: "",
    phone: "",
    national_id: "",
    email: "",
  });

  // Reset form when dialog opens/closes or when editing data changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        house_no: initialData.house_no,
        name: initialData.name,
        phone: initialData.phone,
        national_id: initialData.national_id,
        email: initialData.email,
      });
    } else {
      resetForm();
    }
  }, [initialData, open]);

  const resetForm = () => {
    setFormData({
      house_no: "",
      name: "",
      phone: "",
      national_id: "",
      email: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Exclude `id` on insert
    if (initialData?.id) {
      onSubmit({ ...formData, id: initialData.id });
    } else {
      onSubmit({ ...formData }); // no id for new tenant
    }

    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Tenant" : "Add Tenant"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="house_no">House Number</Label>
            <Input
              id="house_no"
              name="house_no"
              value={formData.house_no}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="name">Tenant Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="national_id">National ID</Label>
            <Input
              id="national_id"
              name="national_id"
              value={formData.national_id}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">{initialData ? "Update" : "Add"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
