const FASTAPI_URL = process.env.EXPO_PUBLIC_FASTAPI_URL || "https://army-mantis-enable.ngrok-free.dev";

export async function fetchFromFastAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${FASTAPI_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            // Required to bypass ngrok's browser warning landing page
            "ngrok-skip-browser-warning": "true",
            ...(options.headers || {}),
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`FastAPI Error [${response.status}]: ${errorText}`);
    }

    return response.json() as Promise<T>;
}