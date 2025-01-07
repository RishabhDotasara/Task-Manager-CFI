import React from "react";
import { Button } from "./ui/button";
import { RefreshCw } from "lucide-react";
import { TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import ToolTip from "./tooltip";

interface Props {
  onRefetch: Function;
  isRefetching: boolean;
  tooltipText?:string
}

export default function ReloadButton({ onRefetch, isRefetching, tooltipText }: Props) {
  return (
 
      <Button
        size={"sm"}
        variant={"outline"}
        onClick={() => {
          onRefetch();
        }}
        disabled={isRefetching}
      >
        <RefreshCw />
      </Button>
   
  );
}
