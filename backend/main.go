package main

import (
	"cvwo/database"
	"cvwo/routes"
	"os"

	jwtware "github.com/gofiber/jwt/v3"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	database.Connect()

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowCredentials: true, // expose response to frontend
	}))

	app.Use(jwtware.New(jwtware.Config{
		SigningKey: []byte(os.Getenv("SECRET")),
	}))

	routes.Setup(app)

	app.Listen("localhost:3000")
}
