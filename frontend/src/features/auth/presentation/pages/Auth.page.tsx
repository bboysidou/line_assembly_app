import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Rainbow, GraduationCap, Heart, Sparkles } from "lucide-react";
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

const AuthPage = () => {
  const navigate = useNavigate();
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
      toast("Event has been created", {
        description: message,
      });
    },
    onSuccess: () => {
      toast.success("Logged in successfully");
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
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-secondary/20 via-background to-background">
      <div className="p-2 h-[7dvh] absolute right-4 top-4 flex items-center gap-4">
        <DarkModeToggle />
        <LangSwitcherComponent />
      </div>
      <div className="mb-8 flex flex-col items-center text-center space-y-2">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg animate-bounce">
          <GraduationCap className="h-10 w-10" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          {t("KINDERGARTEN_NAME")}
        </h1>
        <p className="text-muted-foreground font-medium">{t("DESCRIPTION")}</p>
      </div>

      <Card className="w-full max-w-md border-2 shadow-xl overflow-hidden">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
            {t("TITLE")}
            <Sparkles className="h-5 w-5 text-secondary" />
          </CardTitle>
          <CardDescription className="text-center font-medium">
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
                      <FormLabel>{t("EMAIL")}</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          type="text"
                          placeholder={t("EMAIL")}
                          className="w-full"
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
                      <FormLabel>{t("PASSWORD")}</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="off"
                          type="password"
                          placeholder={t("PASSWORD")}
                          className="w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 mt-8">
              <ActionButtonLayout
                type="submit"
                className="w-full h-12 text-lg font-bold bg-primary hover:bg-primary/90 shadow-md transition-transform active:scale-95"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending
                  ? `${t("LOGIN_LOADING")}`
                  : `${t("LOGIN")}`}
              </ActionButtonLayout>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <div className="mt-8 flex gap-4 text-primary/40">
        <Heart className="h-6 w-6" />
        <Rainbow className="h-6 w-6" />
        <Sparkles className="h-6 w-6" />
      </div>

      <footer className="mt-8 text-sm text-muted-foreground">
        © {new Date().getFullYear()} {tCommon("FOOTER")}
      </footer>
    </div>
  );
};

export default AuthPage;
