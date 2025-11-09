// src/types/react-date-range.d.ts
import React from "react";

declare module "react-date-range" {
  export interface Range {
    startDate: Date;
    endDate: Date;
    key: string;
  }

  export interface DateRangePickerProps {
    ranges: Range[];
    onChange: (ranges: { [key: string]: Range }) => void;
    minDate?: Date;
    maxDate?: Date;
    direction?: "vertical" | "horizontal";
    showSelectionPreview?: boolean;
    moveRangeOnFirstSelection?: boolean;
    months?: number;
    className?: string;
  }

  export const DateRangePicker: React.FC<DateRangePickerProps>;
}
