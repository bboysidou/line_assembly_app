import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Search,
  MoreHorizontal,
  Users,
  Calendar,
  UserCheck,
  ArrowUp,
  ArrowDown,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import {
  onGetAllClientsAction,
  onDeleteClientAction,
} from "../actions/clients.action";
import { PathManager } from "@/core/routes/path_manager.route";

const ClientsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<"client_name" | "client_email" | "created_at">("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data: clients, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: onGetAllClientsAction,
    refetchOnMount: true,
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

  const handleEdit = (clientId: string) => {
    navigate(`${PathManager.CLIENTS_EDIT_PAGE}?id=${clientId}`);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this client?")) deleteMutation.mutate(id);
  };

  const handleSort = (field: "client_name" | "client_email" | "created_at") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredClients = clients?.filter((client) =>
    client.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.client_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.client_phone && client.client_phone.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (client.client_address && client.client_address.toLowerCase().includes(searchQuery.toLowerCase()))
  ).sort((a, b) => {
    const aVal = a[sortField] || "";
    const bVal = b[sortField] || "";
    const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return sortOrder === "asc" ? comparison : -comparison;
  }) || [];

  const getGradient = (name: string) =>
    ["from-primary to-violet-500", "from-info to-cyan-500", "from-success to-emerald-500", "from-warning to-amber-500", "from-pink-500 to-rose-500", "from-indigo-500 to-purple-500"][name.charCodeAt(0) % 6];

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const SortIcon = ({ field }: { field: "client_name" | "client_email" | "created_at" }) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? <ArrowUp className="w-4 h-4 ml-1" /> : <ArrowDown className="w-4 h-4 ml-1" />;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Clients
          </h1>
          <p className="text-muted-foreground mt-1">Manage your client database</p>
        </div>
        <Button
          onClick={() => navigate(PathManager.CLIENTS_CREATE_PAGE)}
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Client
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card to-card/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
          <CardContent className="pt-6 relative">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Clients</p>
                <p className="text-3xl font-bold">{clients?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card to-card/50 hover:shadow-lg hover:shadow-info/5 transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-info/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
          <CardContent className="pt-6 relative">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-info/10 rounded-xl">
                <Calendar className="w-6 h-6 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-3xl font-bold">{clients?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden border-border/50 bg-gradient-to-br from-card to-card/50 hover:shadow-lg hover:shadow-success/5 transition-all duration-300 group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-success/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
          <CardContent className="pt-6 relative">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success/10 rounded-xl">
                <UserCheck className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-3xl font-bold">{clients?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-border/50 bg-card/50">
          <CardContent className="pt-4 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, phone, or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50 border-border/50"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Clients Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-border/50 bg-card/50 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/30 border-b border-border/50 py-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Clients Directory
              <span className="text-sm font-normal text-muted-foreground ml-auto">
                {filteredClients.length} {filteredClients.length === 1 ? "client" : "clients"}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead
                      className="cursor-pointer hover:text-primary transition-colors"
                      onClick={() => handleSort("client_name")}
                    >
                      <div className="flex items-center">
                        Client <SortIcon field="client_name" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:text-primary transition-colors"
                      onClick={() => handleSort("client_email")}
                    >
                      <div className="flex items-center">
                        Contact <SortIcon field="client_email" />
                      </div>
                    </TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead
                      className="cursor-pointer hover:text-primary transition-colors"
                      onClick={() => handleSort("created_at")}
                    >
                      <div className="flex items-center">
                        Created <SortIcon field="created_at" />
                      </div>
                    </TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <div className="flex flex-col items-center gap-2">
                          <Users className="w-12 h-12 text-muted-foreground/50" />
                          <p className="text-muted-foreground">No clients found</p>
                          {searchQuery && (
                            <p className="text-sm text-muted-foreground">Try adjusting your search query</p>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredClients.map((client) => (
                      <TableRow
                        key={client.id_client}
                        className="group hover:bg-muted/30 transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getGradient(client.client_name)} flex items-center justify-center text-white text-sm font-bold shadow-md group-hover:shadow-lg transition-shadow`}
                            >
                              {getInitials(client.client_name)}
                            </div>
                            <div>
                              <p className="font-medium">{client.client_name}</p>
                              <p className="text-xs text-muted-foreground">{client.client_email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{client.client_email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{client.client_phone || "N/A"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm truncate max-w-[200px]">{client.client_address || "N/A"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {client.created_at ? new Date(client.created_at).toLocaleDateString() : "N/A"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur-xl">
                              <DropdownMenuItem
                                onClick={() => handleEdit(client.id_client)}
                                className="cursor-pointer"
                              >
                                <Pencil className="w-4 h-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(client.id_client)}
                                className="cursor-pointer text-destructive focus:text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ClientsPage;
