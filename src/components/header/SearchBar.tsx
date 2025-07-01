"use client";

import { Input } from "@/components/ui/input";
import { LoaderCircle, Search } from "lucide-react";
import { useEffect, useId, useState } from "react";

function SearchBar() {
    const id = useId();
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (inputValue) {
            setIsLoading(true);
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 500);
            return () => clearTimeout(timer);
        }
        setIsLoading(false);
    }, [inputValue]);

    return (
        <div className="fixed container px-4 md:px-0 top-14 h-12 w-full left-0 flex items-center md:static md:min-w-[300px] space-y-2">
            <div className="relative min-w-full">
                <Input
                    id={id}
                    className="peer pe-9 ps-9 rounded-none md:rounded-md"
                    placeholder="Search..."
                    type="search"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                    {isLoading ? (
                        <LoaderCircle
                            className="animate-spin"
                            size={24}
                            strokeWidth={2}
                            role="status"
                            aria-label="Loading..."
                        />
                    ) : (
                        <Search size={24} strokeWidth={2} aria-hidden="true" />
                    )}
                </div>
            </div>
        </div>
    );
}

export default SearchBar;
