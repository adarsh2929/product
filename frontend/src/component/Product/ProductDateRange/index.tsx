import React from 'react';
import { DatePicker, Space } from 'antd';
import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';
import { DateRangeFilterProps } from './types';

const { RangePicker } = DatePicker;



const DateRangeFilter= (props:DateRangeFilterProps) => {
  const { onDateRangeChange } = props;
  const handleChange = (
    value: RangePickerProps['value'],
    dateString: [string, string] | string
  ) => {
    if (Array.isArray(dateString)) {
      onDateRangeChange(
        dateString[0] ? dateString[0] : undefined,
        dateString[1] ? dateString[1] : undefined
      );
    }
  };

  return (
    
      <RangePicker 
        onChange={handleChange}
        format="YYYY-MM-DD"
        placeholder={['Start Date', 'End Date']}
      />
    

  );
};

export default DateRangeFilter;