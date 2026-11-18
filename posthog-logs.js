require('dotenv').config();

function createPostHogLogger() {
    const projectToken = process.env.POSTHOG_PROJECT_TOKEN;
    const host = process.env.POSTHOG_HOST;
    const noopLogger = { emit() {} };

    if (!projectToken || !host) {
        if (process.env.NODE_ENV !== 'production') {
            console.warn('POSTHOG_PROJECT_TOKEN or POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once POSTHOG_PROJECT_TOKEN and POSTHOG_HOST are configured');
        }
        return noopLogger;
    }

    try {
        const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
        const { resourceFromAttributes } = require('@opentelemetry/resources');
        const { BatchLogRecordProcessor, LoggerProvider } = require('@opentelemetry/sdk-logs');
        const exporter = new OTLPLogExporter({
            url: new URL('/i/v1/logs', host).toString(),
            headers: { Authorization: `Bearer ${projectToken}` }
        });
        const loggerProvider = new LoggerProvider({
            resource: resourceFromAttributes({
                'service.name': 'mohitkarekar-editor',
                'deployment.environment': process.env.NODE_ENV || 'development'
            }),
            processors: [new BatchLogRecordProcessor(exporter)]
        });

        process.once('beforeExit', () => {
            loggerProvider.shutdown().catch(() => {
                console.warn('PostHog log exporter shutdown failed');
            });
        });

        return loggerProvider.getLogger('posthog-editor');
    } catch (error) {
        console.warn('PostHog log exporter is unavailable; install the OpenTelemetry log packages to enable it');
        return noopLogger;
    }
}

module.exports = { posthogLogger: createPostHogLogger() };
