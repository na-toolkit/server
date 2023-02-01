import dayjs from 'dayjs';
import AdvancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(AdvancedFormat);

const formatTime = (
  timeInput: Date | string | number | undefined,
  format = 'YYYY-MM-DD HH:mm:ss',
) => {
  return dayjs(timeInput).format(format);
};

export { dayjs, formatTime };
