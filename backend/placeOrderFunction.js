const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: "ap-south-1" });
const dynamo = DynamoDBDocumentClient.from(client);

const ORDER_TABLE = "OrdersTable";
const MENU_TABLE = "MenuTable";

exports.handler = async (event) => {
  console.log("EVENT:", JSON.stringify(event));

  try {
    const method =
      event.requestContext?.http?.method ||
      event.httpMethod;

    const path = event.rawPath || event.path || "";

    // ============================
    // ✅ FIX: HANDLE OPTIONS (CORS)
    // ============================
    if (method === "OPTIONS") {
      return {
        statusCode: 200,
        headers: cors(),
        body: ""
      };
    }

    // =====================================================
    // ================= MENU APIs ==========================
    // =====================================================

    // ✅ ADD MENU
    if (path.includes("menu") && method === "POST") {
      const body = JSON.parse(event.body || "{}");

      const item = {
        id: Date.now(),
        name: body.name,
        price: Number(body.price)
      };

      await dynamo.send(new PutCommand({
        TableName: MENU_TABLE,
        Item: item
      }));

      return success(item);
    }

    // ✅ GET MENU
    if (path.includes("menu") && method === "GET") {
      const data = await dynamo.send(new ScanCommand({
        TableName: MENU_TABLE
      }));

      return success(data.Items || []);
    }

    // ✅ DELETE MENU
    if (path.includes("menu") && method === "DELETE") {

      let id = null;

      try {
        const body = JSON.parse(event.body || "{}");
        if (body.id) id = body.id;
      } catch (e) {}

      if (!id && event.queryStringParameters) {
        id = event.queryStringParameters.id;
      }

      if (!id && event.rawQueryString) {
        const params = new URLSearchParams(event.rawQueryString);
        id = params.get("id");
      }

      if (!id) {
        throw new Error("ID required for deletion");
      }

      console.log("Deleting menu item:", id);

      await dynamo.send(new DeleteCommand({
        TableName: MENU_TABLE,
        Key: { id: Number(id) }
      }));

      return success({ message: "Deleted successfully" });
    }

    // =====================================================
    // ================= ORDER APIs =========================
    // =====================================================

    // ✅ POST ORDER
    if (method === "POST") {
      const body = JSON.parse(event.body || "{}");

      const order = {
        id: Date.now(),
        items: body.items || [],
        type: body.type || "Offline",
        address: body.address || "",
        pincode: body.pincode || "",
        tableNumber: body.tableNumber || null,
        status: "Pending",
        createdAt: new Date().toISOString()
      };

      await dynamo.send(new PutCommand({
        TableName: ORDER_TABLE,
        Item: order
      }));

      return success(order);
    }

    // ✅ GET ORDERS
    if (method === "GET") {
      const data = await dynamo.send(new ScanCommand({
        TableName: ORDER_TABLE
      }));

      return success(data.Items || []);
    }

    // ✅ UPDATE STATUS
    if (method === "PUT") {
      const body = JSON.parse(event.body || "{}");

      const id = Number(body.id);

      if (!id) {
        throw new Error("Invalid ID");
      }

      console.log("Updating order:", id, "→", body.status);

      await dynamo.send(new UpdateCommand({
        TableName: ORDER_TABLE,
        Key: { id: id },
        UpdateExpression: "set #s = :s",
        ExpressionAttributeNames: {
          "#s": "status"
        },
        ExpressionAttributeValues: {
          ":s": body.status
        }
      }));

      return success({ message: "Updated successfully" });
    }

    return error("Invalid request");

  } catch (err) {
    console.log("ERROR:", err);
    return error(err.message);
  }
};

// =======================
// RESPONSE HELPERS
// =======================

function success(data) {
  return {
    statusCode: 200,
    headers: cors(),
    body: JSON.stringify(data)
  };
}

function error(msg) {
  return {
    statusCode: 500,
    headers: cors(),
    body: JSON.stringify({ error: msg })
  };
}

function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "*"
  };
}