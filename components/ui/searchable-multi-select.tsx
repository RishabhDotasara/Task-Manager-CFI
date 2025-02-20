import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

interface SearchableMultiSelectProps {
  options: Option[];
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
  disabled?: boolean;
  onSearch?: (search: string) => Promise<void | undefined>;
  shouldFilter?: boolean;
}

export function SearchableMultiSelect({
  options,
  value,
  onValueChange,
  placeholder,
  searchPlaceholder = "Search...",
  emptyText = "No items found.",
  className,
  disabled = false,
  onSearch,
  shouldFilter = true,
}: SearchableMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchDebounce, setSearchDebounce] = useState<NodeJS.Timeout>();

  // Handle search with debouncing
  const handleSearch = (search: string) => {
    if (searchDebounce) {
      clearTimeout(searchDebounce);
    }

    // Debounce search to avoid too many database queries
    const timeout = setTimeout(() => {
      if (onSearch) {
        if (search.trim().length > 4)
        {
          onSearch(search);
        }
      }
    }, 300);

    setSearchDebounce(timeout);
  };

  // Cleanup debounce timeout
  useEffect(() => {
    return () => {
      if (searchDebounce) {
        clearTimeout(searchDebounce);
      }
    };
  }, [searchDebounce]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          disabled={disabled}
          className={cn(
            "w-full justify-between",
            !value.length && "text-muted-foreground",
            className
          )}
        >
          {value.length > 0 ? `${value.length} items selected` : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command shouldFilter={shouldFilter}>
          {" "}
          {/* Disable built-in filtering */}
          <CommandInput
            placeholder={searchPlaceholder}
            onValueChange={handleSearch}
          />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    const updatedValue = value.includes(option.value)
                      ? value.filter((id) => id !== option.value)
                      : [...value, option.value];
                    onValueChange(updatedValue);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.includes(option.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
