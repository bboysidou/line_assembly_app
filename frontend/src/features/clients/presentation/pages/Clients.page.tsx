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
      "from-violet-500 to-purple-500",
      "from-blue-500 to-cyan-500",
      "from-green-500 to-emerald-500",
      "from-orange-500 to-amber-500",
      "from-pink-500 to-rose-500",
      "from-indigo-500 to-blue-500",
    ][name.charCodeAt(0) % 6];
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  if (isLoading) return <Loader2 className="animate-spin" />;

  return (
    <motion.div
      className="p-6 space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        className="flex justify-between items-center"
        variants={cardVariants}
      >
        <div>
          <motion.h1
            className="text-3xl font-bold bg-linear-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Clients
          </motion.h1>
          <p className="text-muted-foreground">Manage your clients</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                form.reset();
                setEditingClient(null);
              }}
              className="bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Client
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
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
                        <Input placeholder="Enter client name" {...field} />
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
                        <Input placeholder="Enter phone number" {...field} />
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
                        <Input placeholder="Enter address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
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

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        variants={cardVariants}
      >
        <Card className="bg-linear-to-br from-violet-50 to-purple-50">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-3xl font-bold text-violet-600">
              {clients?.length || 0}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-linear-to-br from-blue-50 to-cyan-50">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">This Month</p>
            <p className="text-3xl font-bold text-blue-600">
              {clients?.length || 0}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-linear-to-br from-green-50 to-emerald-50">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-3xl font-bold text-green-600">
              {clients?.length || 0}
            </p>
          </CardContent>
        </Card>
      </motion.div>

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
              <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-12 h-12 rounded-full bg-linear-to-br ${getGradient(client.client_name)} flex items-center justify-center shadow-lg`}
                    >
                      <span className="text-white font-bold">
                        {getInitials(client.client_name)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">{client.client_name}</p>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <Mail className="w-4 h-4" /> {client.client_email}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4" /> {client.client_phone || "-"}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />{" "}
                      {client.client_address || "-"}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(client)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(client.id_client)}
                    >
                      <Trash2 className="w-4 h-4" />
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
