import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";

const eventBridge = new EventBridgeClient();

export const handler = async (event) => {
  try {

    

    // Define the event to send to EventBridge
    const params = {
      Entries: [
        {
          EventBusName: "Quokka-PDF-Bus",
          source: "aws.s3",
          detailtype: "Object Created",
          detail: {"bucket": {"name": "quokka-pdf"}},
        },
      ],
    };

    console.log(params);

    // Publish the event to EventBridge
    await eventBridge.send(new PutEventsCommand(params));

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ message: "Event published successfully!" }),
    };
  } catch (error) {
    console.error("Error publishing event:", error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Failed to publish event" }),
    };
  }
};
