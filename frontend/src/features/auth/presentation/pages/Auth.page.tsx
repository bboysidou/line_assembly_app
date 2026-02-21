import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Factory, Settings, Wrench, Lock } from "lucide-react";
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
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Industrial background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="p-2 h-[7dvh] absolute right-4 top-4 flex items-center gap-4 z-10">
        <DarkModeToggle />
        <LangSwitcherComponent />
      </div>

      {/* Logo and Title */}
      <div className="mb-8 flex flex-col items-center text-center space-y-4 z-10">
        <div className="flex items-center gap-3">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-xl shadow-amber-500/20">
            <Factory className="h-12 w-12 text-white" />
          </div>
          <div className="flex flex-col items-start">
            <h1 className="text-4xl font-bold tracking-tight text-white">
              {t("APP_NAME")}
            </h1>
            <p className="text-amber-400 font-medium">{t("DESCRIPTION")}</p>
          </div>
        </div>
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md border-2 border-slate-700/50 bg-slate-800/80 backdrop-blur-sm shadow-2xl overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500" />
        
        <CardHeader className="space-y-1 pb-4 pt-8">
          <CardTitle className="text-2xl text-center flex items-center justify-center gap-2 text-white">
            <Wrench className="h-5 w-5 text-amber-500" />
            {t("TITLE")}
          </CardTitle>
          <CardDescription className="text-center font-medium text-slate-400">
            {t("SUB_TITLE")}
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">{t("EMAIL")}</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          type="text"
                          placeholder={t("EMAIL")}
                          className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-amber-500 focus:ring-amber-500/20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300">{t("PASSWORD")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            autoComplete="off"
                            type="password"
                            placeholder={t("PASSWORD")}
                            className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-amber-500 focus:ring-amber-500/20 pl-10"
                            {...field}
                          />
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 mt-6 pb-8">
              <ActionButtonLayout
                type="submit"
                className="w-full h-12 text-lg font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
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

      {/* Decorative elements */}
      <div className="mt-8 flex gap-6 text-amber-500/40">
        <Wrench className="h-6 w-6" />
        <Factory className="h-6 w-6" />
        <Settings className="h-6 w-6" />
      </div>

      <footer className="mt-8 text-sm text-slate-500">
        © {new Date().getFullYear()} {tCommon("FOOTER")}
      </footer>
    </div>
  );
};

export default AuthPage;
