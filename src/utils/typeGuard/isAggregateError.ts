export function isAggregateError(error: unknown): error is AggregateError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'errors' in error &&
    Array.isArray((error as AggregateError).errors)
  );
}
