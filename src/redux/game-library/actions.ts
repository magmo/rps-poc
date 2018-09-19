export const GAMELIBRARY_FETCH_REQUEST = 'GAMELIBRARY.FETCH_REQUEST';
export const GAMELIBRARY_FETCH_SUCCESS = 'GAMELIBRARY.FETCH_SUCCESS';
export const GAMELIBRARY_FETCH_FAILURE = 'GAMELIBRARY.FETCH_FAILURE';
export const fetchGameLibraryRequest = () => ({
    type: GAMELIBRARY_FETCH_REQUEST,
});
export const fetchGameLibrarySuccess = address => ({
    type: GAMELIBRARY_FETCH_SUCCESS,
    address,
});
export const fetchGameLibraryFailure = message => ({
    type: GAMELIBRARY_FETCH_SUCCESS,
    message,
});

export type FetchGameLibrarySuccess = ReturnType<typeof fetchGameLibrarySuccess>;
export type FetchGameLibraryFailure = ReturnType<typeof fetchGameLibraryFailure>;
export type FetchGameLibraryResponse = FetchGameLibraryFailure | FetchGameLibrarySuccess;