import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Fish Spot API Documentation",
      version: "1.0.0",
      description: "API documentation for Fish Spot Server",
    },
    servers: [
      {
        url: "http://localhost:3001", 
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      { name: "User", description: "User-related routes" },
      { name: "Post", description: "Post-related routes" },
      { name: "Comment", description: "Comment-related routes" },
      { name: "Cloudinary", description: "Cloudinary-related routes" },
    ],
  },
  apis: ["./src/routes/*.ts"], 
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwaggerDocs = (app: any) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("Swagger docs available at http://localhost:3001/api-docs");
  console.log(JSON.stringify(swaggerSpec, null, 2));
};