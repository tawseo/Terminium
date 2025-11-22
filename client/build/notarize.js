/**
 * Notarization script for macOS builds
 *
 * Requires Apple Developer account and credentials:
 * - APPLE_ID: Your Apple ID email
 * - APPLE_ID_PASSWORD: App-specific password
 * - APPLE_TEAM_ID: Your team ID from developer account
 *
 * Set as environment variables before building:
 * export APPLE_ID="your@email.com"
 * export APPLE_ID_PASSWORD="xxxx-xxxx-xxxx-xxxx"
 * export APPLE_TEAM_ID="XXXXXXXXXX"
 */

const { notarize } = require('@electron/notarize');

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;

  // Only notarize on macOS
  if (electronPlatformName !== 'darwin') {
    return;
  }

  // Check if we have credentials
  if (!process.env.APPLE_ID || !process.env.APPLE_ID_PASSWORD) {
    console.log('Skipping notarization: APPLE_ID or APPLE_ID_PASSWORD not set');
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  console.log(`Notarizing ${appName}...`);
  console.log('This may take several minutes...');

  try {
    await notarize({
      appBundleId: 'com.terminium.app',
      appPath: `${appOutDir}/${appName}.app`,
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_ID_PASSWORD,
      teamId: process.env.APPLE_TEAM_ID,
    });

    console.log('✓ Notarization successful!');
  } catch (error) {
    console.error('✗ Notarization failed:', error);
    throw error;
  }
};
