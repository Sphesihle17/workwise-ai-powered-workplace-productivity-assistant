import type { LucideIcon } from "lucide-react";

interface FeatureShellProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children: React.ReactNode;
}

export function FeatureShell({ icon: Icon, title, description, children }: FeatureShellProps) {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
