"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";

export default function IssueTicketDialog() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <>
      <Button
        size="lg"
        variant="outline"
        onClick={() => setOpen(true)}
        className="border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
      >
        Issue Ticket
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Issue ticket"
        description="Ticket issuing will be available soon. Enter a booking reference to preview the flow."
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button disabled>Coming soon</Button>
          </>
        }
      >
        <div className="space-y-3">
          <label
            htmlFor="issue-ticket-reference"
            className="block text-sm font-medium text-slate-700"
          >
            Booking ID / PNR
          </label>
          <Input
            id="issue-ticket-reference"
            placeholder="Enter reference"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            aria-describedby="issue-ticket-helper"
          />
          <p id="issue-ticket-helper" className="text-sm text-slate-500">
            This is a stub for demo purposes.
          </p>
        </div>
      </Modal>
    </>
  );
}
