import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { Resource } from "@opentelemetry/resources";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

export const trace = () => {
    if (!process.env.TRACE_ENABLED) {
        return;
    }

    const otelSdk = new NodeSDK({
        traceExporter: new OTLPTraceExporter(),
        instrumentations: [
            getNodeAutoInstrumentations()
        ],
        resource: new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: "nestjs-tracing",
        }),
    });

    process.on("SIGTERM", async () => {
        try{
            await otelSdk.shutdown();
        } catch (e) {
            console.error("Error shutting down OpenTelemetry SDK");
            console.error(e);
        } finally {
            process.exit(0);
        }
    }
    );

    otelSdk.start();
}