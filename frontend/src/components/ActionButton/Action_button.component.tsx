import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { type ComponentProps, useTransition } from "react";
import { cn } from "@/lib/utils";
import LoadingButtonState from "./components/Loading_button_state.layout";

interface BaseProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  withConfirmation?: boolean;
  confirmationMessage?: string;
}

interface WithSubmitType extends BaseProps {
  type: "submit";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

interface WithConfirmation extends BaseProps {
  withConfirmation: true;
  confirmationMessage: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

interface WithoutConfirmation extends BaseProps {
  withConfirmation?: false;
  confirmationMessage?: never;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

type Props = WithSubmitType | WithConfirmation | WithoutConfirmation;

const ActionButtonLayout = ({
  onClick,
  withConfirmation = false,
  confirmationMessage,
  ...props
}: ComponentProps<typeof Button> & Props) => {
  const [isLoading] = useTransition();

  function handleAction(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();

    if (props.type === "submit") {
      const form = (e.currentTarget as HTMLElement).closest("form");
      if (form) {
        form.requestSubmit();
      }
    } else {
      onClick?.(e);
    }
  }

  if (withConfirmation) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            {...props}
            disabled={props.disabled ?? isLoading}
            onClick={(e) => e.stopPropagation()}
          />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmationMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={props.disabled ?? isLoading}
              onClick={(e) => e.stopPropagation()}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              disabled={props.disabled ?? isLoading}
            >
              <LoadingButtonState isLoading={props.disabled ?? isLoading}>
                Yes
              </LoadingButtonState>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Button
      {...props}
      disabled={props.disabled ?? isLoading}
      className={cn(props.className, props.disabled && "cursor-not-allowed")}
      onClick={handleAction}
    >
      <LoadingButtonState
        isLoading={props.disabled ?? isLoading}
        className="inline-flex items-center gap-2"
      >
        {props.children}
      </LoadingButtonState>
    </Button>
  );
};

export default ActionButtonLayout;
