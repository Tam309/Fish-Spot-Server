// swagger.js
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Documentation for User, Post and Comment",
    },
    servers: [
      {
        url: "http://localhost:3001", // Use your actual server URL here
      },
    ],
  },
  apis: ["./routes/*.js", "./cloudinary/*.js"], // Adjust paths based on your file structure
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`Swagger docs available at http://localhost:3001/api-docs`);
}

export default swaggerDocs;
