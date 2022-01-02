package routes

import (
	"cvwo/controllers"

	"github.com/gofiber/fiber/v2"
)

func SetupTaskRoutes(app fiber.Router) {
	app.Get("/task", controllers.GetTasks)
	app.Post("/task/create", controllers.AddTask)
}
