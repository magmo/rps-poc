import { State } from "fmg-core";

export const VALIDATE_REQUEST = 'VALIDATE.REQUEST';
export const VALIDATE_SUCCESS = 'VALIDATE.SUCCESS';
export const VALIDATE_FAILURE = 'VALIDATE.FAILURE';

export const validateRequest = (fromState: State, toState: State) => ({
    type: VALIDATE_REQUEST as typeof VALIDATE_REQUEST,
    fromState,
    toState,
});
export const validateSuccess = () => ({
    type: VALIDATE_SUCCESS,
});
export const validateFailure = message => ({
    type: VALIDATE_FAILURE,
    message,
});

export type ValidateRequest = ReturnType<typeof validateRequest>;
export type ValidateSuccess = ReturnType<typeof validateSuccess>;
export type ValidateFailure = ReturnType<typeof validateFailure>;
