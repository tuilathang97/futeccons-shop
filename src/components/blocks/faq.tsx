"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FaqSectionProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  description?: string;
}

const FaqSection = React.forwardRef<HTMLElement, FaqSectionProps>(
  ({ className, title, description, children, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          "animate-in fade-in-0 py-16 w-full bg-gradient-to-b from-transparent via-muted/50 to-transparent",
          className
        )}
        {...props}
      >
        <div className="container">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-semibold mb-3 bg-gradient-to-r from-foreground via-foreground/80 to-foreground bg-clip-text text-transparent">
              {title}
            </h2>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          { children }
        </div>
      </section>
    );
  }
);
FaqSection.displayName = "FaqSection";

const FaqItem = React.forwardRef<
  HTMLDivElement,
  {
    question: string;
    index: number;
    children: React.ReactNode | undefined;
    className?: string;
    isFinish?: boolean;
  }
>((props, ref) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { question, children, className, isFinish } = props;

  return (
    <div
      ref={ref}
      className={cn(
        "group rounded-lg",
        "transition-all duration-200 ease-in-out",
        "border border-border/50",
        "bg-muted/50",
        "animate-in fade-in-0",
        className
      )}
    >
      <Button
        type="button"
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full px-6 py-4 h-auto justify-between hover:bg-transparent",
          isFinish && "bg-green-400 hover:bg-green-500",
          isOpen && "rounded-bl-none rounded-br-none"
        )}
      >
        <h3
          className={cn(
            "text-base font-medium transition-colors duration-200 text-left",
            "text-foreground/70",
            isOpen && "text-foreground"
          )}
        >
          {question}
        </h3>
        <div
          className={cn(
            "p-0.5 rounded-full flex-shrink-0",
            "duration-200 transition-all",
            isOpen ? "" : "rotate-180",
          )}
        >
          <ChevronDown className="h-4 w-4" />
        </div>
      </Button>
        {isOpen && (
          <div className={cn(
            "animate-in zoom-in-50 slide-in-from-top-5 fade-in-0 duration-100",
            isOpen && "rounded-bl-md rounded-br-md"
          )}>
            <div className="px-6 pb-4 pt-2">
              <div className="text-sm text-muted-foreground leading-relaxed">
                {children}
              </div>
            </div>
          </div>
        )}
    </div>
  );
});
FaqItem.displayName = "FaqItem";

export { FaqSection, FaqItem };