import winston from "winston";

// @ts-expect-error ignore
const dateFormat = Intl.DateTimeFormat("en", { dateStyle: "short", timeStyle: "medium", hour12: false });

function formatDateForLogFile(date?: number | Date): string {
    const data = dateFormat.formatToParts(date);
    return `<year>-<month>-<day>-<hour>-<minute>-<second>`
        .replace(/<year>/g, data.find(({ type }) => type === "year")!.value)
        .replace(/<month>/g, data.find(({ type }) => type === "month")!.value)
        .replace(/<day>/g, data.find(({ type }) => type === "day")!.value)
        .replace(/<hour>/g, data.find(({ type }) => type === "hour")!.value)
        .replace(/<minute>/g, data.find(({ type }) => type === "minute")!.value)
        .replace(/<second>/g, data.find(({ type }) => type === "second")!.value);
}

export function createLogger(prod = false): winston.Logger {
    const logger = winston.createLogger({
        level: prod ? "info" : "debug",
        levels: {
            alert: 1,
            debug: 5,
            error: 0,
            info: 4,
            notice: 3,
            warn: 2
        },
        transports: [
            new winston.transports.File({ filename: `logs/error-${formatDateForLogFile(Date.now())}.log`, level: "error" }),
            new winston.transports.File({ filename: `logs/logs-${formatDateForLogFile(Date.now())}.log` })
        ],
        format: winston.format.combine(
            winston.format.printf(info => {
                const { level, message, stack } = info;
                const prefix = `[${formatDateForLogFile(Date.now())}] [${level}]`;
                if (["error", "crit"].includes(level)) return `${prefix}: ${stack}`;
                return `${prefix}: ${message}`;
            })
        )
    });
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.printf(info => {
                const { level, message, stack } = info;
                const prefix = `[${formatDateForLogFile(Date.now())}] [${level}]`;
                if (["error", "alert"].includes(level) && !prod) return `${prefix}: ${stack}`;
                return `${prefix}: ${message}`;
            }),
            winston.format.align(),
            prod ? winston.format.colorize({ all: false }) : winston.format.colorize({ all: true })
        )
    }));
    return logger;
}
