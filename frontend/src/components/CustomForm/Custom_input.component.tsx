import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type {
  Control,
  ControllerRenderProps,
  FieldValues,
  Path,
} from "react-hook-form";
import type { ReactNode } from "react";

interface Props<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: string;
  renderInput?: (field: ControllerRenderProps<T, Path<T>>) => ReactNode;
}

export const CustomInput = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "",
  type = "text",
  renderInput,
}: Props<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {renderInput ? (
              renderInput(field)
            ) : (
              <Input
                autoComplete="off"
                type={type}
                placeholder={placeholder}
                className="w-full"
                {...field}
                value={field.value ?? ""}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
