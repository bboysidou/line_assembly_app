import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Loader2, Mail, Phone, MapPin } from "lucide-react";
import { onGetAllClientsAction, onCreateClientAction, onUpdateClientAction, onDeleteClientAction } from "../actions/clients.action";
import type { CreateClientSchemaType, UpdateClientSchemaType } from "../schemas/clients.schema";

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const cardVariants = { hidden: { opacity: 0, y: 20, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1 } };

const ClientsPage = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<UpdateClientSchemaType | null>(null);
  const [formData, setFormData] = useState<CreateClientSchemaType>({
    client_name: "", client_email: "", client_phone: "", client_address: ""
  });

  const { data: clients, isLoading } = useQuery({ queryKey: ["clients"], queryFn: onGetAllClientsAction });
  const createMutation = useMutation({ mutationFn: onCreateClientAction, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["clients"] }); setIsDialogOpen(false); resetForm(); } });
  const updateMutation = useMutation({ mutationFn: onUpdateClientAction, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["clients"] }); setIsDialogOpen(false); setEditingClient(null); resetForm(); } });
  const deleteMutation = useMutation({ mutationFn: onDeleteClientAction, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["clients"] }); } });

  const resetForm = () => setFormData({ client_name: "", client_email: "", client_phone: "", client_address: "" });
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); editingClient ? updateMutation.mutate({ ...editingClient, ...formData }) : createMutation.mutate(formData); };
  const handleEdit = (client: UpdateClientSchemaType) => { setEditingClient(client); setFormData({ client_name: client.client_name, client_email: client.client_email, client_phone: client.client_phone || "", client_address: client.client_address || "" }); setIsDialogOpen(true); };
  const handleDelete = (id: string) => { if (confirm("Delete this client?")) deleteMutation.mutate(id); };
  const getGradient = (name: string) => ["from-violet-500 to-purple-500", "from-blue-500 to-cyan-500", "from-green-500 to-emerald-500", "from-orange-500 to-amber-500", "from-pink-500 to-rose-500", "from-indigo-500 to-blue-500"][name.charCodeAt(0) % 6];
  const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <motion.div className="p-6 space-y-6" initial="hidden" animate="visible" variants={containerVariants}>
      <motion.div className="flex justify-between items-center" variants={cardVariants}>
        <div>
          <motion.h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Clients</motion.h1>
          <p className="text-muted-foreground">Manage your clients</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingClient(null); }} className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" /> Add Client
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editingClient ? "Edit Client" : "New Client"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2"><Label>Name</Label><Input value={formData.client_name} onChange={e => setFormData({...formData, client_name: e.target.value})} required /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" value={formData.client_email} onChange={e => setFormData({...formData, client_email: e.target.value})} required /></div>
              <div className="space-y-2"><Label>Phone</Label><Input value={formData.client_phone} onChange={e => setFormData({...formData, client_phone: e.target.value})} /></div>
              <div className="space-y-2"><Label>Address</Label><Input value={formData.client_address} onChange={e => setFormData({...formData, client_address: e.target.value})} /></div>
              <Button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {editingClient ? "Update" : "Add"} Client
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4" variants={cardVariants}>
        <Card className="bg-gradient-to-br from-violet-50 to-purple-50"><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Total</p><p className="text-3xl font-bold text-violet-600">{clients?.length || 0}</p></CardContent></Card>
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50"><CardContent className="pt-6"><p className="text-sm text-muted-foreground">This Month</p><p className="text-3xl font-bold text-blue-600">{clients?.length || 0}</p></CardContent></Card>
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50"><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Active</p><p className="text-3xl font-bold text-green-600">{clients?.length || 0}</p></CardContent></Card>
      </motion.div>

      {isLoading ? <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-violet-600" /></div> : (
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" variants={containerVariants}>
          <AnimatePresence>
            {clients?.map((client, i) => (
              <motion.div key={client.id_client} variants={cardVariants} initial="hidden" animate="visible" exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.05 }}>
                <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getGradient(client.client_name)} flex items-center justify-center shadow-lg`}>
                        <span className="text-white font-bold">{getInitials(client.client_name)}</span>
                      </div>
                      <div><p className="font-semibold">{client.client_name}</p></div>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> {client.client_email}</p>
                      <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> {client.client_phone || "-"}</p>
                      <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {client.client_address || "-"}</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(client)}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(client.id_client)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ClientsPage;
