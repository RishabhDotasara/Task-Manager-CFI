
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface CustomTooltipProps {
  children: React.ReactNode;  
  text: string;         
}

const ToolTip = ({ children, text }: CustomTooltipProps) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        {children}  {/* The hoverable element passed as a prop */}
      </TooltipTrigger>
      <TooltipContent className="bg-background text-foreground p-2 rounded-lg">
        <p>{text}</p>  {/* Tooltip text passed as a prop */}
      </TooltipContent>
    </Tooltip>
  );
};

export default ToolTip;
