import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Play, Clock, Package, Circle, ArrowRight, CheckCircle2 } from "lucide-react";
import { onGetAllStepsAction, onStartStepAction } from "../actions/assembly.action";
import { startStepSchema, type StartStepSchemaType } from "../schemas/assembly.schema";

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const cardVariants = { hidden: { opacity: 0, y: 20, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1 } };

const stepNames = ["Cutting", "Welding", "Painting", "Assembly", "Quality Check", "Packaging"];

const stepColors = [
  { bg: "bg-gradient-to-br from-primary to-primary/70", shadow: "shadow-primary/25" },
  { bg: "bg-gradient-to-br from-info to-info/70", shadow: "shadow-info/25" },
  { bg: "bg-gradient-to-br from-pink-500 to-pink-400", shadow: "shadow-pink-500/25" },
  { bg: "bg-gradient-to-br from-warning to-warning/70", shadow: "shadow-warning/25" },
  { bg: "bg-gradient-to-br from-success to-success/70", shadow: "shadow-success/25" },
  { bg: "bg-gradient-to-br from-indigo-500 to-indigo-400", shadow: "shadow-indigo-500/25" },
];

const AssemblyPage = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<StartStepSchemaType>({
    resolver: zodResolver(startStepSchema),
    defaultValues: {
      id_order: "",
      id_step: 1,
    },
  });

  const { isLoading: stepsLoading } = useQuery({ queryKey: ["assemblySteps"], queryFn: onGetAllStepsAction, refetchOnMount: true });
  const startMutation = useMutation({
    mutationFn: onStartStepAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orderProgress"] });
      setIsDialogOpen(false);
      form.reset();
      toast.success("Step started successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to start step", { description: error.message });
    },
  });

  const onSubmit = (data: StartStepSchemaType) => {
    startMutation.mutate(data);
  };

  return (
    <motion.div 
      className="p-6 space-y-6 max-w-[1600px] mx-auto" 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div className="flex justify-between items-center" variants={cardVariants}>
        <div>
          <motion.h1 
            className="text-3xl font-bold text-gradient" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
          >
            Assembly Line
          </motion.h1>
          <p className="text-muted-foreground mt-1">Track production pipeline</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-primary glow-primary">
              <Play className="w-4 h-4 mr-2" /> Start Step
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card/95 backdrop-blur-xl border-border/50">
            <DialogHeader>
              <DialogTitle className="text-xl">Start Assembly Step</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="id_order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter order ID" className="input-focus" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="id_step"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Step</FormLabel>
                      <Select onValueChange={(v) => field.onChange(parseInt(v))} defaultValue={String(field.value)}>
                        <FormControl>
                          <SelectTrigger className="bg-background/50 border-border/50">
                            <SelectValue placeholder="Select a step" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {stepNames.map((name, i) => <SelectItem key={i} value={String(i + 1)}>{name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full btn-primary" disabled={startMutation.isPending}>
                  {startMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null} Start Step
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Stats Cards */}
      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4" variants={cardVariants}>
        <Card className="card-hover border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-muted/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="pt-6 relative">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-muted/20 rounded-xl group-hover:scale-110 transition-transform">
                <Circle className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Pending</p>
                <p className="text-3xl font-bold text-muted-foreground">-</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-warning/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="pt-6 relative">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-warning/10 rounded-xl group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">In Progress</p>
                <p className="text-3xl font-bold text-warning">-</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="pt-6 relative">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success/10 rounded-xl group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Completed</p>
                <p className="text-3xl font-bold text-success">-</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Production Pipeline */}
      <motion.div variants={cardVariants}>
        <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-primary via-primary/90 to-primary/80">
            <CardTitle className="text-primary-foreground flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Production Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 bg-muted/30">
            {stepsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4">
                {stepNames.map((name, i) => (
                  <motion.div 
                    key={name}
                    className="flex items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex flex-col items-center">
                      <motion.div 
                        className={`w-20 h-20 rounded-2xl ${stepColors[i].bg} flex items-center justify-center shadow-lg ${stepColors[i].shadow} transform hover:scale-110 transition-transform duration-300 cursor-pointer`}
                        whileHover={{ y: -5 }}
                      >
                        <span className="text-primary-foreground font-bold text-2xl">{i + 1}</span>
                      </motion.div>
                      <p className="mt-3 text-sm font-semibold text-center text-foreground">{name}</p>
                      <p className="text-xs text-muted-foreground">Step {i + 1}</p>
                    </div>
                    {i < stepNames.length - 1 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 + 0.2 }}
                      >
                        <ArrowRight className="w-8 h-8 text-primary/40 mx-3 flex-shrink-0" />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Active Orders */}
      <motion.div variants={cardVariants}>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="w-5 h-5 text-primary" /> Active Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">Select an order and step to begin tracking</p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AssemblyPage;
