import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Loader2, Package, Calendar, Hash } from "lucide-react";
import { onGetAllOrdersAction, onCreateOrderAction, onUpdateOrderAction, onDeleteOrderAction } from "../actions/orders.action";
import type { CreateOrderSchemaType, UpdateOrderSchemaType } from "../schemas/order.schema";

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const cardVariants = { hidden: { opacity: 0, y: 20, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1 } };

const statusColors: Record<string, string> = { pending: "bg-amber-100 text-amber-700", in_progress: "bg-blue-100 text-blue-700", completed: "bg-green-100 text-green-700", cancelled: "bg-red-100 text-red-700" };
const borderColors: Record<string, string> = { pending: "border-l-4 border-l-amber-500", in_progress: "border-l-4 border-l-blue-500", completed: "border-l-4 border-l-green-500", cancelled: "border-l-4 border-l-red-500" };

type OrderStatus = "pending" | "in_progress" | "completed" | "cancelled";

const OrdersPage = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<UpdateOrderSchemaType | null>(null);
  const [formData, setFormData] = useState<CreateOrderSchemaType>({ order_number: "", product_name: "", quantity: 1, status: "pending" });

  const { data: orders, isLoading } = useQuery({ queryKey: ["orders"], queryFn: onGetAllOrdersAction });
  const createMutation = useMutation({ mutationFn: onCreateOrderAction, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["orders"] }); setIsDialogOpen(false); resetForm(); } });
  const updateMutation = useMutation({ mutationFn: onUpdateOrderAction, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["orders"] }); setIsDialogOpen(false); setEditingOrder(null); resetForm(); } });
  const deleteMutation = useMutation({ mutationFn: onDeleteOrderAction, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }) });

  const resetForm = () => setFormData({ order_number: "", product_name: "", quantity: 1, status: "pending" });
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); editingOrder ? updateMutation.mutate({ ...editingOrder, ...formData }) : createMutation.mutate(formData); };
  const handleEdit = (order: UpdateOrderSchemaType) => { setEditingOrder(order); setFormData({ order_number: order.order_number, product_name: order.product_name, quantity: order.quantity, status: order.status }); setIsDialogOpen(true); };
  const handleDelete = (id: string) => { if (confirm("Delete this order?")) deleteMutation.mutate(id); };

  const pendingCount = orders?.filter(o => o.status === "pending").length || 0;
  const processingCount = orders?.filter(o => o.status === "in_progress").length || 0;
  const completedCount = orders?.filter(o => o.status === "completed").length || 0;

  return (
    <motion.div className="p-6 space-y-6" initial="hidden" animate="visible" variants={containerVariants}>
      <motion.div className="flex justify-between items-center" variants={cardVariants}>
        <div>
          <motion.h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Orders</motion.h1>
          <p className="text-muted-foreground">Manage production orders</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingOrder(null); }} className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
              <Plus className="w-4 h-4 mr-2" /> New Order
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editingOrder ? "Edit Order" : "New Order"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2"><Label>Order Number</Label><Input value={formData.order_number} onChange={e => setFormData({...formData, order_number: e.target.value})} required /></div>
              <div className="space-y-2"><Label>Product Name</Label><Input value={formData.product_name} onChange={e => setFormData({...formData, product_name: e.target.value})} required /></div>
              <div className="space-y-2"><Label>Quantity</Label><Input type="number" min="1" value={formData.quantity} onChange={e => setFormData({...formData, quantity: parseInt(e.target.value) || 1})} required /></div>
              <div className="space-y-2"><Label>Status</Label>
                <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v as OrderStatus})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {editingOrder ? "Update" : "Add"} Order
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4" variants={cardVariants}>
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50"><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="p-2 bg-amber-100 rounded-lg"><Package className="w-5 h-5 text-amber-600" /></div><div><p className="text-sm text-muted-foreground">Pending</p><p className="text-2xl font-bold text-amber-600">{pendingCount}</p></div></div></CardContent></Card>
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50"><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="p-2 bg-blue-100 rounded-lg"><Package className="w-5 h-5 text-blue-600" /></div><div><p className="text-sm text-muted-foreground">In Progress</p><p className="text-2xl font-bold text-blue-600">{processingCount}</p></div></div></CardContent></Card>
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50"><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="p-2 bg-green-100 rounded-lg"><Package className="w-5 h-5 text-green-600" /></div><div><p className="text-sm text-muted-foreground">Completed</p><p className="text-2xl font-bold text-green-600">{completedCount}</p></div></div></CardContent></Card>
      </motion.div>

      {isLoading ? <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div> : (
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" variants={containerVariants}>
          <AnimatePresence>
            {orders?.map((order, i) => (
              <motion.div key={order.id_order} variants={cardVariants} initial="hidden" animate="visible" exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.05 }}>
                <Card className={`hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${borderColors[order.status]}`}>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                          <Package className="w-5 h-5 text-white" />
                        </div>
                        <div><p className="font-semibold">{order.product_name}</p><p className="text-xs text-muted-foreground">#{order.order_number}</p></div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>{order.status.replace("_", " ")}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="w-4 h-4" />{new Date(order.created_at || "").toLocaleDateString()}</div>
                      <div className="flex items-center gap-2 text-muted-foreground"><Hash className="w-4 h-4" />{order.quantity} units</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(order)}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(order.id_order)}><Trash2 className="w-4 h-4" /></Button>
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

export default OrdersPage;
