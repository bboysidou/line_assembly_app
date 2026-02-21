import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Users,
  Calendar,
  UserCheck,
} from "lucide-react";
import {
  onGetAllClientsAction,
  onCreateClientAction,
  onUpdateClientAction,
  onDeleteClientAction,
} from "../actions/clients.action";
import {
  createClientSchema,
  updateClientSchema,
  type CreateClientSchemaType,
  type UpdateClientSchemaType,
} from "../schemas/clients.schema";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const ClientsPage = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] =
    useState<UpdateClientSchemaType | null>(null);

  const form = useForm<CreateClientSchemaType>({
    resolver: zodResolver(
      editingClient ? updateClientSchema : createClientSchema,
    ),
    defaultValues: {
      client_name: "",
      client_email: "",
      client_phone: "",
      client_address: "",
    },
  });

  const { data: clients, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: onGetAllClientsAction,
    refetchOnMount: true,
  });
  const createMutation = useMutation({
    mutationFn: onCreateClientAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      setIsDialogOpen(false);
      form.reset();
      toast.success("Client created successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to create client", { description: error.message });
    },
  });
  const updateMutation = useMutation({
    mutationFn: onUpdateClientAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      setIsDialogOpen(false);
      setEditingClient(null);
      form.reset();
      toast.success("Client updated successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to update client", { description: error.message });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: onDeleteClientAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Client deleted successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to delete client", { description: error.message });
    },
  });

  const onSubmit = (data: CreateClientSchemaType) => {
    if (editingClient) {
      updateMutation.mutate({ ...editingClient, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (client: UpdateClientSchemaType) => {
    setEditingClient(client);
    form.reset({
      client_name: client.client_name,
      client_email: client.client_email,
      client_phone: client.client_phone || "",
      client_address: client.client_address || "",
    });
    setIsDialogOpen(true);
  };
  const handleDelete = (id: string) => {
    if (confirm("Delete this client?")) deleteMutation.mutate(id);
  };
  
  const getGradient = (name: string) =>
    [
      "from-primary to-primary/70",
      "from-info to-info/70",
      "from-success to-success/70",
      "from-warning to-warning/70",
      "from-pink-500 to-pink-400",
      "from-indigo-500 to-indigo-400",
    ][name.charCodeAt(0) % 6];
  
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      className="p-6 space-y-6 max-w-[1600px] mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div
        className="flex justify-between items-center"
        variants={cardVariants}
      >
        <div>
          <motion.h1
            className="text-3xl font-bold text-gradient"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Clients
          </motion.h1>
          <p className="text-muted-foreground mt-1">Manage your clients</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                form.reset();
                setEditingClient(null);
              }}
              className="btn-primary glow-primary"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card/95 backdrop-blur-xl border-border/50">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {editingClient ? "Edit Client" : "New Client"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="client_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter client name" className="input-focus" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="client_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter email"
                          className="input-focus"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="client_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" className="input-focus" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="client_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter address" className="input-focus" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full btn-primary"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : null}
                  {editingClient ? "Update" : "Add"} Client
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        variants={cardVariants}
      >
        <Card className="card-hover border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="pt-6 relative">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total</p>
                <p className="text-3xl font-bold text-primary">{clients?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-info/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="pt-6 relative">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-info/10 rounded-xl group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">This Month</p>
                <p className="text-3xl font-bold text-info">{clients?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="pt-6 relative">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success/10 rounded-xl group-hover:scale-110 transition-transform">
                <UserCheck className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Active</p>
                <p className="text-3xl font-bold text-success">{clients?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Clients Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={containerVariants}
      >
        <AnimatePresence>
          {clients?.map((client, i) => (
            <motion.div
              key={client.id_client}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="card-hover border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="pt-6 relative">
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getGradient(client.client_name)} flex items-center justify-center shadow-lg`}
                    >
                      <span className="text-primary-foreground font-bold text-lg">
                        {getInitials(client.client_name)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-lg text-foreground">{client.client_name}</p>
                      <p className="text-xs text-muted-foreground">Client</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary/60" /> {client.client_email}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary/60" /> {client.client_phone || "-"}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary/60" />{" "}
                      {client.client_address || "-"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                      onClick={() => handleEdit(client)}
                    >
                      <Pencil className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDelete(client.id_client)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default ClientsPage;
