import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Factory, Settings, Wrench, Lock, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { onLoginAction } from "../actions/auth.action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginType } from "../schemas/auth.schema";
import { useCallback } from "react";
import ActionButtonLayout from "@/components/ActionButton/Action_button.component";
import DarkModeToggle from "@/components/theme/mode-toggle";
import LangSwitcherComponent from "@/components/lang_switcher/Lang_switcher.layout";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useNavigate } from "react-router-dom";
import { GET_USER_INFO } from "@/core/http/type";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";

const AuthPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [t] = useTranslation("auth");
  const [tCommon] = useTranslation("common");

  const form = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
  });
  const loginMutation = useMutation({
    mutationFn: onLoginAction,
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast("Login failed", {
        description: message,
      });
    },
    onSuccess: () => {
      toast.success("Logged in successfully");
      queryClient.invalidateQueries({ queryKey: [GET_USER_INFO] });
      navigate("/");
    },
  });

  const onSubmit = useCallback(
    async (data: LoginType) => {
      await loginMutation.mutateAsync(data);
    },
    [loginMutation],
  );

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-background via-muted to-background overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} 
        />
      </div>

      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />

      {/* Header controls */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-2 h-[7dvh] absolute right-4 top-4 flex items-center gap-4 z-10"
      >
        <DarkModeToggle />
        <LangSwitcherComponent />
      </motion.div>

      {/* Logo and Title */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8 flex flex-col items-center text-center space-y-4 z-10"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-xl shadow-primary/25">
            <Factory className="h-12 w-12 text-primary-foreground" />
          </div>
          <div className="flex flex-col items-start">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              {t("APP_NAME")}
            </h1>
            <p className="text-primary font-medium">{t("DESCRIPTION")}</p>
          </div>
        </div>
      </motion.div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-md z-10"
      >
        <Card className="border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Gradient accent bar */}
          <div className="h-1.5 bg-gradient-to-r from-primary via-primary/80 to-primary" />
          
          <CardHeader className="space-y-1 pb-4 pt-8">
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <Wrench className="h-5 w-5 text-primary" />
              {t("TITLE")}
            </CardTitle>
            <CardDescription className="text-center font-medium">
              {t("SUB_TITLE")}
            </CardDescription>
          </CardHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("EMAIL")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            autoComplete="off"
                            type="text"
                            placeholder={t("EMAIL")}
                            className="pl-10 input-focus"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("PASSWORD")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            autoComplete="off"
                            type="password"
                            placeholder={t("PASSWORD")}
                            className="pl-10 input-focus"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 mt-6 pb-8">
                <ActionButtonLayout
                  type="submit"
                  className="w-full h-12 text-lg font-bold btn-primary glow-primary transition-all active:scale-[0.98]"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <Settings className="h-5 w-5 animate-spin" />
                      {t("LOGIN_LOADING")}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Wrench className="h-5 w-5" />
                      {t("LOGIN")}
                    </span>
                  )}
                </ActionButtonLayout>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </motion.div>

      {/* Decorative elements */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 flex gap-6 text-primary/40"
      >
        <Wrench className="h-6 w-6" />
        <Factory className="h-6 w-6" />
        <Settings className="h-6 w-6" />
      </motion.div>

      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-8 text-sm text-muted-foreground"
      >
        © {new Date().getFullYear()} {tCommon("FOOTER")}
      </motion.footer>
    </div>
  );
};

export default AuthPage;
