import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ShippingAddress, useCheckout } from "@/hooks/useCheckout";
import { ArrowRight } from "lucide-react";

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh"
];

const addressSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  phone: z.string()
    .min(10, "Phone number must be 10 digits")
    .max(10, "Phone number must be 10 digits")
    .regex(/^[6-9]\d{9}$/, "Enter a valid Indian mobile number"),
  addressLine1: z.string().min(5, "Address is too short").max(200, "Address is too long"),
  addressLine2: z.string().max(200, "Address is too long").optional(),
  city: z.string().min(2, "City is required").max(100, "City name is too long"),
  state: z.string().min(2, "State is required"),
  pincode: z.string()
    .min(6, "Pincode must be 6 digits")
    .max(6, "Pincode must be 6 digits")
    .regex(/^[1-9][0-9]{5}$/, "Enter a valid Indian pincode"),
});

type AddressFormData = z.infer<typeof addressSchema>;

const AddressForm = () => {
  const { shippingAddress, setShippingAddress, setStep } = useCheckout();

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: shippingAddress?.name || "",
      phone: shippingAddress?.phone || "",
      addressLine1: shippingAddress?.addressLine1 || "",
      addressLine2: shippingAddress?.addressLine2 || "",
      city: shippingAddress?.city || "",
      state: shippingAddress?.state || "",
      pincode: shippingAddress?.pincode || "",
    },
  });

  const onSubmit = (data: AddressFormData) => {
    const address: ShippingAddress = {
      name: data.name,
      phone: data.phone,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      country: "India",
    };
    setShippingAddress(address);
    setStep("payment");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Shipping Address</h3>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="9876543210" maxLength={10} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="addressLine1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Line 1</FormLabel>
                <FormControl>
                  <Input placeholder="House no., Building name, Street" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="addressLine2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Line 2 (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Landmark, Area" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Mumbai" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {indianStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pincode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pincode</FormLabel>
                  <FormControl>
                    <Input placeholder="400001" maxLength={6} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" className="w-full gap-2" size="lg">
          Continue to Payment
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>
    </Form>
  );
};

export default AddressForm;
