import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  ArrowLeft,
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import {
  onCreateClientAction,
  onUpdateClientAction,
  onGetClientByIdAction,
} from "../actions/clients.action";
import {
  createClientSchema,
  updateClientSchema,
  type CreateClientSchemaType,
  type UpdateClientSchemaType,
} from "../schemas/clients.schema";
import { PathManager } from "@/core/routes/path_manager.route";

const CreateEditClientPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("id");

  const isEditing = !!editId;

  // Create form
  const createForm = useForm<CreateClientSchemaType>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      client_name: "",
      client_email: "",
      client_phone: "",
      client_address: "",
    },
  });

  // Edit form
  const editForm = useForm<UpdateClientSchemaType>({
    resolver: zodResolver(updateClientSchema),
    defaultValues: {
      id_client: "",
      client_name: "",
      client_email: "",
      client_phone: "",
      client_address: "",
    },
  });

  // Watch form values for preview
  const watchedValues = isEditing ? editForm.watch() : createForm.watch();

  // Fetch client data if editing
  const { data: clientData, isLoading: clientLoading } = useQuery({
    queryKey: ["client", editId],
    queryFn: () => onGetClientByIdAction(editId!),
    enabled: !!editId,
  });

  // Populate form when editing
  useEffect(() => {
    if (clientData && isEditing) {
      editForm.reset({
        id_client: clientData.id_client,
        client_name: clientData.client_name || "",
        client_email: clientData.client_email || "",
        client_phone: clientData.client_phone || "",
        client_address: clientData.client_address || "",
      });
    }
  }, [clientData, isEditing, editForm]);

  const createMutation = useMutation({
    mutationFn: (data: CreateClientSchemaType) => {
      // Convert empty strings to null for nullable fields
      const processedData = {
        ...data,
        client_phone: data.client_phone || null,
        client_address: data.client_address || null,
      };
      return onCreateClientAction(processedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Client created successfully");
      navigate(PathManager.CLIENTS_PAGE);
    },
    onError: (error: Error) => {
      toast.error("Failed to create client", { description: error.message });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateClientSchemaType) => {
      // Convert empty strings to null for nullable fields
      const processedData = {
        ...data,
        client_phone: data.client_phone || null,
        client_address: data.client_address || null,
      };
      return onUpdateClientAction(processedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Client updated successfully");
      navigate(PathManager.CLIENTS_PAGE);
    },
    onError: (error: Error) => {
      toast.error("Failed to update client", { description: error.message });
    },
  });

  const onCreateSubmit = (data: CreateClientSchemaType) => {
    createMutation.mutate(data);
  };

  const onUpdateSubmit = (data: UpdateClientSchemaType) => {
    updateMutation.mutate(data);
  };

  const isLoading = isEditing && clientLoading;
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Get initials for avatar preview
  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get gradient for avatar
  const getGradient = (name: string) => {
    const gradients = [
      "from-primary to-violet-500",
      "from-info to-cyan-500",
      "from-success to-emerald-500",
      "from-warning to-amber-500",
      "from-pink-500 to-rose-500",
      "from-indigo-500 to-purple-500",
    ];
    return gradients[name.charCodeAt(0) % gradients.length];
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(PathManager.CLIENTS_PAGE)}
          className="mb-4 gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Clients
        </Button>
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/5">
            <User className="w-8 h-8 text-violet-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-500 via-purple-500 to-violet-500/60 bg-clip-text text-transparent">
              {isEditing ? "Edit Client" : "Create New Client"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEditing ? "Update client details and information" : "Fill in the details to add a new client to your database"}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <motion.div
          className="lg:col-span-2 space-y-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Basic Information */}
          <Card className="border-border/50 dark:border-zinc-800 bg-card/30 dark:bg-zinc-900/30 backdrop-blur-sm overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-violet-500 to-purple-500" />
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building className="w-5 h-5 text-violet-500" />
                Basic Information <span className="text-destructive">*</span>
              </CardTitle>
              <CardDescription>Client name and contact details</CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Form {...editForm}>
                  <form onSubmit={editForm.handleSubmit(onUpdateSubmit)} className="space-y-4">
                    <FormField
                      control={editForm.control}
                      name="client_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Acme Corporation"
                              className="bg-background/50 border-border/50 h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editForm.control}
                      name="client_email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="e.g. contact@acme.com"
                              className="bg-background/50 border-border/50 h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editForm.control}
                      name="client_phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. +1 234 567 8900"
                              className="bg-background/50 border-border/50 h-12"
                              {...field}
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editForm.control}
                      name="client_address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. 123 Business Street, City, Country"
                              className="bg-background/50 border-border/50 h-12"
                              {...field}
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate(PathManager.CLIENTS_PAGE)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                        )}
                        Update Client
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <Form {...createForm}>
                  <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
                    <FormField
                      control={createForm.control}
                      name="client_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Acme Corporation"
                              className="bg-background/50 border-border/50 h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="client_email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="e.g. contact@acme.com"
                              className="bg-background/50 border-border/50 h-12"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="client_phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. +1 234 567 8900"
                              className="bg-background/50 border-border/50 h-12"
                              {...field}
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={createForm.control}
                      name="client_address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. 123 Business Street, City, Country"
                              className="bg-background/50 border-border/50 h-12"
                              {...field}
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate(PathManager.CLIENTS_PAGE)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                        )}
                        Create Client
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Preview Panel */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Client Preview Card */}
          <Card className="border-border/50 dark:border-zinc-800 bg-card/30 dark:bg-zinc-900/30 backdrop-blur-sm overflow-hidden sticky top-6">
            <div className="h-1 bg-gradient-to-r from-violet-500 to-purple-500" />
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-500" />
                Preview
              </CardTitle>
              <CardDescription>How your client will appear</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Avatar and Name */}
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getGradient(watchedValues.client_name || "?")} flex items-center justify-center text-white text-xl font-bold shadow-lg`}
                >
                  {getInitials(watchedValues.client_name || "")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-lg truncate">
                    {watchedValues.client_name || "Client Name"}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {watchedValues.client_email || "email@example.com"}
                  </p>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-3 pt-4 border-t border-border/30">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/30">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium truncate">
                      {watchedValues.client_email || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/30">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium truncate">
                      {watchedValues.client_phone || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/30">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">Address</p>
                    <p className="text-sm font-medium truncate">
                      {watchedValues.client_address || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between pt-4 border-t border-border/30">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-success/10 text-success border border-success/30">
                  Active
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateEditClientPage;
