package routes

import (
	"cvwo/middleware"

	"github.com/gofiber/fiber/v2"
)

func Setup(app *fiber.App) {
	SetupUserRoutes(app.Group("/user"))
	SetupListRoutes(app.Group("/list", middleware.Protected))
	SetupTaskRoutes(app.Group("/task", middleware.Protected))
}
