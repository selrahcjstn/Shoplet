import { ArgumentsHost, Catch, HttpStatus, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import type { Response } from 'express';

interface PgLikeError {
  sqlState?: string;
  constraint?: string;
  cause?: { code?: string; constraint?: string };
}

interface Mapped {
  status: HttpStatus;
  error: string;
  message: string;
}

/** Postgres error codes that mean "the client sent something the database refuses". */
const PG_ERRORS: Record<string, Omit<Mapped, 'message'> & { message: string }> =
  {
    '23505': {
      status: HttpStatus.CONFLICT,
      error: 'Conflict',
      message: 'A record with the same unique value already exists',
    },
    '23503': {
      status: HttpStatus.BAD_REQUEST,
      error: 'Bad Request',
      message:
        'A referenced record does not exist, or is still in use by other records',
    },
    '23502': {
      status: HttpStatus.BAD_REQUEST,
      error: 'Bad Request',
      message: 'A required value is missing',
    },
    '23514': {
      status: HttpStatus.BAD_REQUEST,
      error: 'Bad Request',
      message: 'A value is not allowed',
    },
    '22P02': {
      status: HttpStatus.BAD_REQUEST,
      error: 'Bad Request',
      message: 'A value has an invalid format',
    },
    '22001': {
      status: HttpStatus.BAD_REQUEST,
      error: 'Bad Request',
      message: 'A value is too long',
    },
  };

/**
 * Turns known database errors into proper 4xx responses.
 * Everything else (including HttpException) falls through to Nest's default
 * handling, so unknown failures stay a generic 500 with no internals leaked.
 */
@Catch()
export class DatabaseExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(DatabaseExceptionFilter.name);

  override catch(exception: unknown, host: ArgumentsHost): void {
    const mapped = this.map(exception);
    if (!mapped) return super.catch(exception, host);

    const err = exception as PgLikeError;
    this.logger.warn(
      `${mapped.status} from database error ${err.sqlState ?? err.cause?.code}` +
        ((err.constraint ?? err.cause?.constraint)
          ? ` (${err.constraint ?? err.cause?.constraint})`
          : ''),
    );

    host.switchToHttp().getResponse<Response>().status(mapped.status).json({
      statusCode: mapped.status,
      error: mapped.error,
      message: mapped.message,
    });
  }

  private map(exception: unknown): Mapped | undefined {
    if (typeof exception !== 'object' || exception === null) return undefined;
    const err = exception as PgLikeError;
    const code = err.sqlState ?? err.cause?.code;
    return code ? PG_ERRORS[code] : undefined;
  }
}
