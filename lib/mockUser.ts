import AsyncStorage from "@react-native-async-storage/async-storage";

const MOCK_USER_ID_KEY = "gig:mockUserId";

/**
 * There is no authentication system yet, so both onboarding endpoints
 * (setu-aa-ingestion and mock-gig-payout) are called with a stable
 * "mock_user_id" instead of a real session user id.
 *
 * The API contract's example payload used this exact id:
 *   "97fc9b68-f8b6-497f-8dc4-a6829af235f7"
 * That looks like a seeded row in the backend rather than a placeholder,
 * so it's kept as the default here instead of inventing a new one. Once
 * real auth exists, replace getMockUserId() with the authenticated user's id.
 */
const DEFAULT_MOCK_USER_ID = "97fc9b68-f8b6-497f-8dc4-a6829af235f7";

export async function getMockUserId(): Promise<string> {
  const stored = await AsyncStorage.getItem(MOCK_USER_ID_KEY);
  if (stored) return stored;

  await AsyncStorage.setItem(MOCK_USER_ID_KEY, DEFAULT_MOCK_USER_ID);
  return DEFAULT_MOCK_USER_ID;
}
