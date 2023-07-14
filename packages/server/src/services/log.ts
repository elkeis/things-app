import { pino } from "pino"

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    }
  }
});

export const log = <D extends (any)>(
  data: D, 
  msg?: string,
  lvl: 'info' | 'error' | 'debug' = 'info',
) => {
  switch(lvl) {
    case "info":return logger.info(data, msg);
    case "error":return logger.error(data, msg);
    case "debug":return logger.debug(data, msg);
    default: return logger.info(data, msg);
  }
}
