import pinoPretty, { type PinoPretty, type PrettyOptions } from 'pino-pretty';
import { yellow } from 'colorette';

export default (opts: PrettyOptions): PinoPretty.PrettyStream =>
  pinoPretty({
    ...opts,
    messageFormat: (log, messageKey) => {
      const responseTime = log['responseTime'] || 0;
      return `${(log?.req as any)?.id || ''} [${log.context}] ${
        log[messageKey]
      } ${responseTime ? yellow(`+${responseTime}ms`) : ''}`;
    },
  });
