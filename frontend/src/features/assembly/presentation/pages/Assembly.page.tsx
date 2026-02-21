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
import { Loader2, Play, Clock, Package, Circle, ArrowRight } from "lucide-react";
import { onGetAllStepsAction, onStartStepAction } from "../actions/assembly.action";
import { startStepSchema, type StartStepSchemaType } from "../schemas/assembly.schema";

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const cardVariants = { hidden: { opacity: 0, y: 20, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1 } };

const stepNames = ["Cutting", "Welding", "Painting", "Assembly", "Quality Check", "Packaging"];

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
    <motion.div className="p-6 space-y-6" initial="hidden" animate="visible" variants={containerVariants}>
      <motion.div className="flex justify-between items-center" variants={cardVariants}>
        <div>
          <motion.h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Assembly Line</motion.h1>
          <p className="text-muted-foreground">Track production pipeline</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700">
              <Play className="w-4 h-4 mr-2" /> Start Step
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Start Assembly Step</DialogTitle></DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="id_order"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter order ID" {...field} />
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
                          <SelectTrigger>
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
                <Button type="submit" className="w-full bg-gradient-to-r from-orange-600 to-amber-600" disabled={startMutation.isPending}>
                  {startMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null} Start Step
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </motion.div>

      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4" variants={cardVariants}>
        <Card className="bg-gradient-to-br from-slate-50 to-zinc-50"><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="p-2 bg-slate-100 rounded-lg"><Circle className="w-5 h-5 text-slate-600" /></div><div><p className="text-sm text-muted-foreground">Pending</p><p className="text-2xl font-bold text-slate-600">-</p></div></div></CardContent></Card>
        <Card className="bg-gradient-to-br from-orange-50 to-amber-50"><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="p-2 bg-orange-100 rounded-lg"><Play className="w-5 h-5 text-orange-600" /></div><div><p className="text-sm text-muted-foreground">In Progress</p><p className="text-2xl font-bold text-orange-600">-</p></div></div></CardContent></Card>
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50"><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="p-2 bg-green-100 rounded-lg"><Clock className="w-5 h-5 text-green-600" /></div><div><p className="text-sm text-muted-foreground">Completed</p><p className="text-2xl font-bold text-green-600">-</p></div></div></CardContent></Card>
      </motion.div>

      <motion.div variants={cardVariants}>
        <Card className="overflow-hidden border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-500 via-orange-400 to-amber-500">
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Production Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 bg-slate-50">
            {stepsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 overflow-x-auto">
                {stepNames.map((name, i) => (
                  <motion.div 
                    key={name}
                    className="flex items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                        <span className="text-white font-bold text-2xl">{i + 1}</span>
                      </div>
                      <p className="mt-3 text-sm font-semibold text-center text-slate-700">{name}</p>
                      <p className="text-xs text-muted-foreground">Step {i + 1}</p>
                    </div>
                    {i < stepNames.length - 1 && (
                      <ArrowRight className="w-6 h-6 text-orange-400 mx-2 flex-shrink-0" />
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={cardVariants}>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Package className="w-5 h-5" />Active Orders</CardTitle></CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">Select an order and step to begin tracking</p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AssemblyPage;
