"use client";

import { useCallback } from "react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import type { FlightOrderResponse } from "@/lib/flight-order-normalizer";

type JsonCopyButtonProps = {
  data: FlightOrderResponse;
};

export default function JsonCopyButton({ data }: JsonCopyButtonProps) {
  const { toast } = useToast();

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      toast({
        title: "Flight order copied",
        description: "The JSON payload is ready to share.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Unable to copy",
        description:
          error instanceof Error
            ? error.message
            : "Your browser blocked the clipboard action.",
      });
    }
  }, [data, toast]);

  return (
    <Button variant="outline" onClick={handleCopy}>
      Copy JSON
    </Button>
  );
}
