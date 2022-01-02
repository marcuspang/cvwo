package routes

import (
	"cvwo/controllers"

	"github.com/gofiber/fiber/v2"
)

func SetupTaskRoutes(app fiber.Router) {
	app.Get("/", controllers.GetTasksFromListId) // current user's tasks
	app.Post("/", controllers.AddTask)
	app.Patch("/:id", controllers.UpdateTask)
	app.Delete("/:id", controllers.DeleteTask)
}
