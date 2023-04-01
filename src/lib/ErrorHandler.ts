/**
  type used as a mask for better interpretation of the ResultHandler class type
  @param T Is defined using Ok()
  @param E Is defined using Err()
 */
export type Result<T, E> = ResultHandler<T, null> | ResultHandler<null, E>;

/**
    Creates a Result object representing a successful outcome.
    @param success The successful outcome value.
    @returns A Result object with the successful value and no error.
*/
export function Ok<T>(success: T) {
  return new ResultHandler({ success, error: null });
}

/**
    Creates a Result object representing a failed outcome.
    @param error The error value.
    @returns A Result object with no successful value and the error.
*/
export function Err<E>(error: E) {
  return new ResultHandler({ success: null, error });
}

/**
Represents the outcome of an operation that can either succeed with a value of type T or fail with an error of type E.
*/
class ResultHandler<T, E> {
  success: T | null;
  error: E | null;

  constructor({
    success,
    error,
  }: { success: T; error: E | null } | { success: T | null; error: E }) {
    this.error = error;
    this.success = success;
  }

  /**
Resolves the result of a computation, calling the onSuccess callback if the result is successful,
or the onError callback if there is an error.
@param onSuccess A callback that takes the success as a parameter.
@param onError A callback that takes the error as a parameter.
@returns Returns the result of either the onSuccess or onError callback, depending on whether the computation was successful or not. 
*/
  resolve<R, X>(
    onSuccess: (success: NonNullable<T>) => R,
    onError: (error: NonNullable<E>) => X
  ) {
    if (this.success === null) return onError(this.error!);
    return onSuccess(this.success!);
  }

  /**
  Returns the successful outcome value.
  @throws If the Result object represents a failed outcome.
  @returns The successful outcome value.
  */
  get success_or_throw(): NonNullable<T> {
    if (!this.success) throw new Error("No success value");
    return this.success!;
  }

  /**
Returns the successful outcome value, or a default value if the Result object represents a failed outcome.
@param value The default value to return if the Result object represents a failed outcome.
@returns The successful outcome value if the Result object represents a successful outcome, or the default value otherwise.
*/
  get_success_or<R>(value: R): NonNullable<T> | R {
    if (this.success) return this.success!;
    else return value;
  }

  /**
Returns the successful outcome value, or a default value if the Result object represents a failed outcome.
@param error  A callback that takes the error as a parameter.
@returns returns success or callback execution with parameter error.
*/
  get_success_or_run<R>(
    callback: (error: NonNullable<E>) => R
  ): NonNullable<T> | R {
    if (this.success) return this.success!;
    else return callback(this.error!);
  }

  /**
Returns the error value.
@throws If the Result object represents a successful outcome.
@returns The error value.
*/
  get failure_or_throw(): NonNullable<E> {
    if (!this.error) throw new Error("No error value");
    return this.error!;
  }

  /**

Returns the error value, or a default value if the Result object represents a successful outcome.
@param value The default value to return if the Result object represents a successful outcome.
@returns The error value if the Result object represents a failed outcome, or the default value otherwise.
*/
  get_failure_or<R>(value: R): NonNullable<E> | R {
    if (this.error) return this.error!;
    else return value;
  }

  /**
Returns the successful outcome value, or a default value if the Result object represents a failed outcome.
@param success  A callback that takes the success as a parameter.
@returns returns error or callback execution with parameter success.
*/
  get_failure_or_run<R>(
    callback: (success: NonNullable<T>) => R
  ): NonNullable<E> | R {
    if (this.error) return this.error!;
    else return callback(this.success!);
  }
}
