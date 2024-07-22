import { useLocation, useNavigate } from 'react-router-dom';

/**
 * A hook that leverages React Router v6 to sync URL params with the React component lifecycle.
 * You can use this hook to conditionally render tabs, forms, or other screens based on the current URL parameters.
 *
 * For instance, `/my-profile?tab=Stats`:
 * - Calling this hook returns `queryString`, which is an object containing the key `tab` with the value `Stats`.
 * - You can then conditionally render the `Stats` tab screen by checking if `queryString.tab === 'Stats'`.
 *
 * This avoids the need for prop drilling to pass boolean screen setters into child components for switching between different screens/tabs.
 *
 * @example
 * // Call the hook and render the tab based on `?tab=...`
 * const { queryString } = useQueryString();
 *
 * if (queryString.tab === 'Stats') {
 *     // Show Stats component
 * }
 *
 * @returns {object} An object containing:
 * - `deleteQueryString`: A function to remove a specific query parameter from the URL.
 * - `queryString`: An object representing the current URL query parameters.
 * - `setQueryString`: A function to add or update query parameters in the URL.
 *
 * @example
 * // Deleting a query parameter
 * const { deleteQueryString } = useQueryString();
 * deleteQueryString('tab'); // Removes the 'tab' query parameter from the URL
 *
 * @example
 * // Setting a query parameter
 * const { setQueryString } = useQueryString();
 * setQueryString({ tab: 'Payment methods', modal: 'NicknameModal' });
 * // Updates the URL to include `tab=Payment+methods&modal=NicknameModal`
 */

interface QueryParams {
    advertId: string;
    formAction: string;
    modal: string;
    paymentMethodId: string;
    tab: string;
}

function useQueryString() {
    const location = useLocation();
    const navigate = useNavigate();

    // Parse the query string into an object
    function getQueryParams(): Partial<QueryParams> {
        const searchParams = new URLSearchParams(location.search);
        const params: Partial<QueryParams> = {};
        searchParams.forEach((value, key) => {
            params[key as keyof QueryParams] = value;
        });
        return params;
    }

    // Update the query string in the URL
    function setQueryParams(newParams: Partial<QueryParams>) {
        const searchParams = new URLSearchParams(location.search);

        Object.entries(newParams).forEach(([key, value]) => {
            if (value === undefined) {
                searchParams.delete(key);
            } else {
                searchParams.set(key, value);
            }
        });

        navigate(
            {
                search: searchParams.toString(),
            },
            { replace: true }
        );
    }

    // Function to delete a specific query parameter
    function deleteQueryString(key: keyof QueryParams) {
        const searchParams = new URLSearchParams(location.search);
        searchParams.delete(key);
        navigate(
            {
                search: searchParams.toString(),
            },
            { replace: true }
        );
    }

    // Function to set multiple query parameters at once
    function setQueryString(queryStrings: Partial<QueryParams>) {
        setQueryParams(queryStrings);
    }

    return {
        deleteQueryString,
        queryString: getQueryParams(),
        setQueryString,
    };
}

export default useQueryString;
