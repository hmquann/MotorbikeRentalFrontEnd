import React from 'react';

const MotorbikeSchedule = () => {
    () => {
        const [startDate, setStartDate] = useState(new Date());
        const [endDate, setEndDate] = useState(null);
        const onChange = (dates) => {
          const [start, end] = dates;
          setStartDate(start);
          setEndDate(end);
        };
        return (
          <DatePicker
            selected={startDate}
            onChange={onChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            inline
          />
        );

};
}

export default MotorbikeSchedule;