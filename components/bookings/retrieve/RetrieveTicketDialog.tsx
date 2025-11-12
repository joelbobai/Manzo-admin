"use client";

import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/use-toast";
import { getRetrieveState, useRetrieveStore } from "@/stores/useRetrieveStore";

type RetrieveTicketDialogProps = {
  className?: string;
};

export default function RetrieveTicketDialog({
  className,
}: RetrieveTicketDialogProps) {
  const [open, setOpen] = useState(false);
  const [localValue, setLocalValue] = useState("");
  const [touched, setTouched] = useState(false);
  const loading = useRetrieveStore((state) => state.loading);
  const orderIdOrPnr = useRetrieveStore((state) => state.orderIdOrPnr);
  const retrieve = useRetrieveStore((state) => state.retrieve);
  const setOrderIdOrPnr = useRetrieveStore((state) => state.setOrderIdOrPnr);
  const error = useRetrieveStore((state) => state.error);
  const { toast } = useToast();

  useEffect(() => {
    if (error && !loading) {
      toast({
        variant: "destructive",
        title: "Unable to retrieve ticket",
        description: error,
      });
    }
  }, [error, loading, toast]);

  const handleOpen = useCallback(() => {
    setLocalValue(orderIdOrPnr);
    setTouched(false);
    setOpen(true);
  }, [orderIdOrPnr]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setTouched(false);
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setTouched(true);

      const trimmed = localValue.trim();

      if (!trimmed) {
        return;
      }

      try {
        await retrieve(trimmed);
        const latest = getRetrieveState().result;
        toast({
          title: "Flight order retrieved",
          description: latest?.summary.pnr
            ? `PNR ${latest.summary.pnr} is ready to review.`
            : "The flight order has been loaded.",
        });
        setOrderIdOrPnr(trimmed);
        handleClose();
      } catch {
        // handled by error effect
      }
    },
    [handleClose, localValue, retrieve, toast, setOrderIdOrPnr],
  );

  const validationMessage = touched && !localValue.trim()
    ? "Enter an Order ID or PNR"
    : undefined;

  return (
    <>
      <Button className={className} size="lg" onClick={handleOpen}>
        Retrieve Ticket
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        title="Retrieve ticket"
        description="Enter a Flight Order ID or booking reference to load the reservation."
        footer={
          <>
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" form="retrieve-ticket-form" disabled={loading}>
              {loading ? "Retrieving…" : "Retrieve"}
            </Button>
          </>
        }
      >
        <form
          id="retrieve-ticket-form"
          onSubmit={handleSubmit}
          className="space-y-3"
        >
          <label htmlFor="orderIdOrPnr" className="block text-sm font-medium text-slate-700">
            Flight Order ID or PNR / Reference
          </label>
          <Input
            id="orderIdOrPnr"
            name="orderIdOrPnr"
            value={localValue}
            onChange={(event) => setLocalValue(event.target.value)}
            placeholder="e.g. 98BU8T"
            autoComplete="off"
            required
            aria-invalid={validationMessage ? "true" : "false"}
            aria-describedby={validationMessage ? "orderIdOrPnr-error" : undefined}
          />
          {validationMessage ? (
            <p id="orderIdOrPnr-error" className="text-sm text-red-600">
              {validationMessage}
            </p>
          ) : null}
        </form>
      </Modal>
    </>
  );
}
