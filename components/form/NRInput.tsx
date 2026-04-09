/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

type PHInputProps = {
  type?: string;
  name: string;
  label?: string;
  disabled?: boolean;
  icon?: React.ComponentType<any>;
  placeholder?: string;
  control: any;
};

const PHInput = ({
  type = "text",
  name,
  label,
  disabled,
  icon: Icon,
  placeholder,
  control,
}: PHInputProps) => {
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);

  // Adjust padding if there's an icon or password toggle
  const inputPaddingClass = isPassword || Icon ? "px-10 py-6" : "py-6";

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-2">
          {label && <FormLabel htmlFor={name}>{label}</FormLabel>}

          <FormControl>
            <div className="relative">
              <Input
                {...field}
                id={name}
                disabled={disabled}
                placeholder={placeholder}
                type={isPassword ? (showPassword ? "text" : "password") : type}
                className={inputPaddingClass}
              />

              {/* Left Icon */}
              {Icon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Icon className="h-4 w-4" />
                </div>
              )}

              {/* Password Toggle */}
              {isPassword && (
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PHInput;
