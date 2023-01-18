const sentryHost = 'sentry.io';

// TODO: use env
const knownProjectIds = ['4504416981483520'];

export default async function handler(req: Request) {
    try {
        const envelope = await req.text();
        const pieces = envelope.split('\n');

        const header = JSON.parse(pieces[0]) as { dsn: string };
        const { host, pathname } = new URL(header.dsn);
        const projectId = pathname.substring(1);

        // todo: tool
        if (host !== sentryHost && !host.endsWith(`.${sentryHost}`)) {
            throw new Error(`invalid host: ${host}`);
        }

        if (!knownProjectIds.includes(projectId)) {
            throw new Error(`invalid project id: ${projectId}`);
        }

        const sentryIngestURL = `https://${sentryHost}/api/${projectId}/envelope/`;
        const sentryResponse = await fetch(sentryIngestURL, { method: 'POST', body: envelope });

        return new Response(
            sentryResponse.body,
            {
                headers: sentryResponse.headers,
                status: sentryResponse.status
            }
        );
    } catch (error: unknown) {
        return new Response(error instanceof Error ? error.message : null, { status: 500 });
    }
}

export const config = { runtime: 'edge' };
