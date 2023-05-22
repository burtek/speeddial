const sentryHost = 'sentry.io';

export default async function handler(req: Request) {
    const envelope = await req.text();
    const pieces = envelope.split('\n');

    const header = JSON.parse(pieces[0]) as { dsn: string };
    let hostname: string;
    let pathname: string;
    try {
        ({ hostname, pathname } = new URL(header.dsn));
    } catch {
        return new Response(`invalid dsn: ${header.dsn}`, { status: 400 });
    }

    const projectId = pathname.substring(1);

    if (hostname !== sentryHost && !hostname.endsWith(`.${sentryHost}`)) {
        return new Response(`invalid host: ${hostname}`, { status: 400 });
    }

    if (projectId !== process.env.SENTRY_PROJECT_ID) {
        return new Response(`invalid project id: ${projectId}`, { status: 400 });
    }

    const sentryIngestURL = `https://${sentryHost}/api/${projectId}/envelope/`;

    try {
        const {
            body: sentryResponse,
            status,
            headers
        } = await fetch(sentryIngestURL, { method: 'POST', body: envelope });

        return new Response(sentryResponse, { status, headers });
    } catch (error: unknown) {
        return new Response(error instanceof Error ? error.message : null, { status: 500 });
    }
}

export const config = { runtime: 'edge' };
