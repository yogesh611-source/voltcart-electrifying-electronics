import { useState } from "react";
import { Save, Store, Bell, Shield, Palette } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const [storeSettings, setStoreSettings] = useState({
    storeName: "VoltCart",
    storeEmail: "support@voltcart.com",
    storePhone: "+91 98765 43210",
    storeAddress: "Mumbai, Maharashtra, India",
    currency: "INR",
    taxRate: "18",
  });

  const [notifications, setNotifications] = useState({
    orderConfirmation: true,
    orderShipped: true,
    orderDelivered: true,
    lowStock: true,
    newCustomer: false,
  });

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">
              Manage your store configuration
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <Tabs defaultValue="store" className="space-y-6">
          <TabsList>
            <TabsTrigger value="store" className="gap-2">
              <Store className="h-4 w-4" />
              Store
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Store Settings */}
          <TabsContent value="store">
            <Card>
              <CardHeader>
                <CardTitle>Store Information</CardTitle>
                <CardDescription>
                  Basic information about your store
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="storeName">Store Name</Label>
                    <Input
                      id="storeName"
                      value={storeSettings.storeName}
                      onChange={(e) =>
                        setStoreSettings((prev) => ({
                          ...prev,
                          storeName: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storeEmail">Contact Email</Label>
                    <Input
                      id="storeEmail"
                      type="email"
                      value={storeSettings.storeEmail}
                      onChange={(e) =>
                        setStoreSettings((prev) => ({
                          ...prev,
                          storeEmail: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storePhone">Phone Number</Label>
                    <Input
                      id="storePhone"
                      value={storeSettings.storePhone}
                      onChange={(e) =>
                        setStoreSettings((prev) => ({
                          ...prev,
                          storePhone: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Input
                      id="currency"
                      value={storeSettings.currency}
                      onChange={(e) =>
                        setStoreSettings((prev) => ({
                          ...prev,
                          currency: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeAddress">Store Address</Label>
                  <Textarea
                    id="storeAddress"
                    value={storeSettings.storeAddress}
                    onChange={(e) =>
                      setStoreSettings((prev) => ({
                        ...prev,
                        storeAddress: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2 max-w-xs">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={storeSettings.taxRate}
                    onChange={(e) =>
                      setStoreSettings((prev) => ({
                        ...prev,
                        taxRate: e.target.value,
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>
                  Configure when you receive email notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Order Confirmation</p>
                    <p className="text-sm text-muted-foreground">
                      Send confirmation email when order is placed
                    </p>
                  </div>
                  <Switch
                    checked={notifications.orderConfirmation}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({
                        ...prev,
                        orderConfirmation: checked,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Order Shipped</p>
                    <p className="text-sm text-muted-foreground">
                      Notify customer when order is shipped
                    </p>
                  </div>
                  <Switch
                    checked={notifications.orderShipped}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({
                        ...prev,
                        orderShipped: checked,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Order Delivered</p>
                    <p className="text-sm text-muted-foreground">
                      Notify customer when order is delivered
                    </p>
                  </div>
                  <Switch
                    checked={notifications.orderDelivered}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({
                        ...prev,
                        orderDelivered: checked,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Low Stock Alert</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified when product stock is low
                    </p>
                  </div>
                  <Switch
                    checked={notifications.lowStock}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({
                        ...prev,
                        lowStock: checked,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New Customer</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified when a new customer signs up
                    </p>
                  </div>
                  <Switch
                    checked={notifications.newCustomer}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({
                        ...prev,
                        newCustomer: checked,
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Current Password</Label>
                    <Input type="password" placeholder="Enter current password" />
                  </div>
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input type="password" placeholder="Enter new password" />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm New Password</Label>
                    <Input type="password" placeholder="Confirm new password" />
                  </div>
                  <Button variant="outline">Update Password</Button>
                </div>

                <div className="pt-6 border-t">
                  <h4 className="font-medium mb-4">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
