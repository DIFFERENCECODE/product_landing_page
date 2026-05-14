import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminGetUserCommand,
  UserNotFoundException,
  UsernameExistsException,
} from '@aws-sdk/client-cognito-identity-provider';

const POOL_ID = process.env.COGNITO_USER_POOL_ID ?? 'eu-north-1_U3EhtyiU9';
const REGION = process.env.COGNITO_REGION ?? POOL_ID.split('_')[0];

let _client: CognitoIdentityProviderClient | null = null;
function getClient(): CognitoIdentityProviderClient {
  if (!_client) _client = new CognitoIdentityProviderClient({ region: REGION });
  return _client;
}

export type ProvisionResult =
  | { ok: true; created: true; email: string }
  | { ok: true; created: false; email: string; reason: 'exists' }
  | { ok: false; error: string };

/**
 * Create a new Cognito user with email-as-username. Cognito sends its
 * built-in invitation email with a temporary password. Returns gracefully
 * if the user already exists — we don't want a duplicate-purchase to
 * blow up the webhook.
 */
export async function provisionTrialUser(
  email: string,
  name: string | null,
): Promise<ProvisionResult> {
  const clean = email.toLowerCase().trim();
  if (!clean) return { ok: false, error: 'empty email' };

  const cli = getClient();

  // Idempotency: if the user already exists, skip create.
  try {
    await cli.send(new AdminGetUserCommand({ UserPoolId: POOL_ID, Username: clean }));
    return { ok: true, created: false, email: clean, reason: 'exists' };
  } catch (err) {
    if (!(err instanceof UserNotFoundException)) {
      return { ok: false, error: err instanceof Error ? err.message : String(err) };
    }
    // Fall through to create.
  }

  const attrs: Array<{ Name: string; Value: string }> = [
    { Name: 'email', Value: clean },
    { Name: 'email_verified', Value: 'true' },
  ];
  if (name && name.trim()) attrs.push({ Name: 'name', Value: name.trim() });

  try {
    await cli.send(
      new AdminCreateUserCommand({
        UserPoolId: POOL_ID,
        Username: clean,
        UserAttributes: attrs,
        DesiredDeliveryMediums: ['EMAIL'],
        // Cognito generates a temp password and sends the default invite email.
      }),
    );
    return { ok: true, created: true, email: clean };
  } catch (err) {
    if (err instanceof UsernameExistsException) {
      return { ok: true, created: false, email: clean, reason: 'exists' };
    }
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
