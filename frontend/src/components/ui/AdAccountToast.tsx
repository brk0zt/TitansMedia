import { motion, AnimatePresence } from "framer-motion";
import { CircleX, Pencil, Plus, X } from "lucide-react";

export interface AdAccountNotification {
  id: string;
  action: "created" | "updated";
  name: string;
  accountId: string;
  status: "success" | "error";
  message?: string;
}

interface Props {
  notifications: AdAccountNotification[];
  onDismiss: (id: string) => void;
}

export function AdAccountToast({ notifications, onDismiss }: Props) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            layout
            initial={{ opacity: 0, x: 80, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="pointer-events-auto bg-card border-border rounded-xl border shadow-xl overflow-hidden"
          >
            <div className="flex items-start gap-3 p-4">
              <div className="flex-shrink-0 mt-0.5">
                {n.status === "error" ? (
                  <CircleX className="h-5 w-5 text-red-500" />
                ) : n.action === "created" ? (
                  <Plus className="h-5 w-5 text-green-500" />
                ) : (
                  <Pencil className="h-5 w-5 text-blue-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground truncate">
                    {n.name}
                  </span>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                    n.action === "created"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {n.action}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                  {n.accountId}
                </p>
                {n.message && (
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    {n.message}
                  </p>
                )}
              </div>
              <button
                onClick={() => onDismiss(n.id)}
                className="flex-shrink-0 p-1 rounded-md hover:bg-muted transition-colors"
              >
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
            <div className="h-0.5 bg-muted/50">
              <motion.div
                className={`h-full ${
                  n.status === "error" ? "bg-red-500" : n.action === "created" ? "bg-green-500" : "bg-blue-500"
                }`}
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 4, ease: "linear" }}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
