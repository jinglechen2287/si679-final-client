import { Dialog as ArkDialog } from "@ark-ui/react/dialog";
import { Portal } from "@ark-ui/react/portal";
import { XIcon } from "lucide-react";
import type { ReactNode } from "react";

export function Dialog({
  children,
  open,
  onOpenChange,
}: {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (details: { open: boolean }) => void;
}) {
  return (
    <ArkDialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </ArkDialog.Root>
  );
}

export function DialogTrigger({ children }: { children: ReactNode }) {
  return <ArkDialog.Trigger asChild>{children}</ArkDialog.Trigger>;
}

export function DialogContent({
  children,
  title,
  description,
}: {
  children: ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <Portal>
      <ArkDialog.Backdrop className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <ArkDialog.Positioner className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <ArkDialog.Content className="relative z-50 w-full max-w-lg rounded-xl border border-neutral-200 bg-white p-6 shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-4">
            <ArkDialog.Title className="text-lg font-semibold leading-none tracking-tight text-neutral-950 dark:text-neutral-50">
              {title}
            </ArkDialog.Title>
            {description && (
              <ArkDialog.Description className="text-sm text-neutral-500 dark:text-neutral-400">
                {description}
              </ArkDialog.Description>
            )}
          </div>
          
          {children}

          <ArkDialog.CloseTrigger className="absolute top-4 right-4 cursor-pointer rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-neutral-100 data-[state=open]:text-neutral-500 dark:ring-offset-neutral-950 dark:focus:ring-neutral-300 dark:data-[state=open]:bg-neutral-800 dark:data-[state=open]:text-neutral-400">
            <XIcon className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
            <span className="sr-only">Close</span>
          </ArkDialog.CloseTrigger>
        </ArkDialog.Content>
      </ArkDialog.Positioner>
    </Portal>
  );
}

